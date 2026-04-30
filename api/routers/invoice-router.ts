import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { invoices, invoiceItems, customers } from "@db/schema";
import { eq, like, and, sql, desc } from "drizzle-orm";

export const invoiceRouter = createRouter({
  list: authedQuery
    .input(
      z.object({
        type: z.enum(["quotation", "invoice", "receipt", "tax_invoice"]).optional(),
        search: z.string().optional(),
        status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]).optional(),
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { type, search, status, page, limit } = input;
      const offset = (page - 1) * limit;

      let conditions = [];
      if (type) conditions.push(eq(invoices.type, type));
      if (status) conditions.push(eq(invoices.status, status));
      if (search) conditions.push(like(invoices.invoiceNumber, `%${search}%`));

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db
        .select({
          id: invoices.id,
          invoiceNumber: invoices.invoiceNumber,
          type: invoices.type,
          issueDate: invoices.issueDate,
          dueDate: invoices.dueDate,
          total: invoices.total,
          status: invoices.status,
          customerName: customers.name,
        })
        .from(invoices)
        .leftJoin(customers, eq(invoices.customerId, customers.id))
        .where(where)
        .orderBy(desc(invoices.createdAt))
        .limit(limit)
        .offset(offset);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(invoices)
        .where(where);

      return {
        invoices: items,
        total: Number(countResult[0].count),
        page,
      };
    }),

  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const invoice = await db
        .select()
        .from(invoices)
        .where(eq(invoices.id, input.id));

      if (!invoice[0]) return null;

      const items = await db
        .select()
        .from(invoiceItems)
        .where(eq(invoiceItems.invoiceId, input.id));

      const customer = await db
        .select()
        .from(customers)
        .where(eq(customers.id, invoice[0].customerId));

      return {
        ...invoice[0],
        items,
        customer: customer[0] || null,
      };
    }),

  create: authedQuery
    .input(
      z.object({
        type: z.enum(["quotation", "invoice", "receipt", "tax_invoice"]),
        customerId: z.number(),
        issueDate: z.string(),
        dueDate: z.string().optional(),
        items: z.array(
          z.object({
            productId: z.number().optional(),
            description: z.string(),
            quantity: z.number(),
            unitPrice: z.number(),
            discount: z.number().default(0),
          })
        ),
        discount: z.number().default(0),
        taxRate: z.number().default(7),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Calculate totals
      let subtotal = 0;
      for (const item of input.items) {
        const itemTotal = item.quantity * item.unitPrice - item.discount;
        subtotal += itemTotal;
      }
      const afterDiscount = subtotal - input.discount;
      const taxAmount = input.type === "receipt" ? 0 : afterDiscount * (input.taxRate / 100);
      const total = afterDiscount + taxAmount;

      // Create invoice number
      const prefix = input.type === "quotation" ? "QT" : input.type === "invoice" ? "IV" : input.type === "receipt" ? "RC" : "TI";
      const date = new Date();
      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(invoices)
        .where(eq(invoices.type, input.type));
      const seq = String(Number(countResult[0].count) + 1).padStart(4, "0");
      const invoiceNumber = `${prefix}-${date.getFullYear()}-${seq}`;

      const result = await db.insert(invoices).values({
        companyId: 1,
        customerId: input.customerId,
        invoiceNumber,
        type: input.type,
        issueDate: new Date(input.issueDate),
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        subtotal: subtotal.toString(),
        discount: input.discount.toString(),
        taxRate: input.taxRate.toString(),
        taxAmount: taxAmount.toString(),
        total: total.toString(),
        status: "draft" as const,
        notes: input.notes,
      } as typeof invoices.$inferInsert);

      const invoiceId = Number((result as unknown as { insertId: bigint }).insertId);

      // Insert items
      for (const item of input.items) {
        const itemTotal = item.quantity * item.unitPrice - item.discount;
        await db.insert(invoiceItems).values({
          invoiceId,
          productId: item.productId || null,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toString(),
          discount: item.discount.toString(),
          total: itemTotal.toString(),
        } as typeof invoiceItems.$inferInsert);
      }

      return { id: invoiceId, invoiceNumber, total };
    }),

  updateStatus: authedQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(invoices)
        .set({ status: input.status })
        .where(eq(invoices.id, input.id));
      return { id: input.id, status: input.status };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(invoiceItems).where(eq(invoiceItems.invoiceId, input.id));
      await db.delete(invoices).where(eq(invoices.id, input.id));
      return { success: true };
    }),

  getStats: authedQuery.query(async () => {
    const db = getDb();
    const byType = await db
      .select({
        type: invoices.type,
        count: sql<number>`count(*)`,
        total: sql<number>`COALESCE(sum(${invoices.total}), 0)`,
      })
      .from(invoices)
      .groupBy(invoices.type);

    const byStatus = await db
      .select({
        status: invoices.status,
        count: sql<number>`count(*)`,
      })
      .from(invoices)
      .groupBy(invoices.status);

    return { byType, byStatus };
  }),
});
