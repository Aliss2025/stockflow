import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { customers } from "@db/schema";
import { eq, like, sql } from "drizzle-orm";

export const customerRouter = createRouter({
  list: authedQuery
    .input(
      z.object({
        search: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { search, page, limit } = input;
      const offset = (page - 1) * limit;

      let where = undefined;
      if (search) {
        where = like(customers.name, `%${search}%`);
      }

      const items = await db
        .select()
        .from(customers)
        .where(where)
        .limit(limit)
        .offset(offset);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(customers)
        .where(where);

      return {
        customers: items,
        total: Number(countResult[0].count),
        page,
      };
    }),

  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(customers)
        .where(eq(customers.id, input.id));
      return result[0] || null;
    }),

  create: authedQuery
    .input(
      z.object({
        code: z.string(),
        name: z.string(),
        contactPerson: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        address: z.string().optional(),
        taxId: z.string().optional(),
        creditLimit: z.number().optional(),
        paymentTerm: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(customers).values({
        companyId: 1,
        ...input,
        creditLimit: input.creditLimit?.toString(),
      } as typeof customers.$inferInsert);
      return { id: Number((result as unknown as { insertId: bigint }).insertId), ...input };
    }),

  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        code: z.string().optional(),
        name: z.string().optional(),
        contactPerson: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        address: z.string().optional(),
        taxId: z.string().optional(),
        creditLimit: z.number().optional(),
        paymentTerm: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const updateData: Record<string, unknown> = { ...data };
      if (data.creditLimit !== undefined) updateData.creditLimit = data.creditLimit.toString();
      await db.update(customers).set(updateData).where(eq(customers.id, id));
      return { id, ...data };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(customers).where(eq(customers.id, input.id));
      return { success: true };
    }),
});
