import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { products } from "@db/schema";
import { eq, like, and, sql } from "drizzle-orm";

export const productRouter = createRouter({
  list: authedQuery
    .input(
      z.object({
        search: z.string().optional(),
        category: z.string().optional(),
        status: z.enum(["active", "inactive"]).optional(),
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { search, category, status, page, limit } = input;
      const offset = (page - 1) * limit;

      let conditions = [];
      if (search) {
        conditions.push(like(products.name, `%${search}%`));
      }
      if (category) {
        conditions.push(eq(products.category, category));
      }
      if (status) {
        conditions.push(eq(products.status, status));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db
        .select()
        .from(products)
        .where(where)
        .limit(limit)
        .offset(offset);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(where);

      return {
        products: items,
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
        .from(products)
        .where(eq(products.id, input.id));
      return result[0] || null;
    }),

  create: authedQuery
    .input(
      z.object({
        sku: z.string(),
        name: z.string(),
        category: z.string().optional(),
        description: z.string().optional(),
        costPrice: z.number().optional(),
        sellingPrice: z.number().optional(),
        quantity: z.number().optional(),
        unit: z.string().optional(),
        reorderPoint: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(products).values({
        companyId: 1,
        ...input,
        costPrice: input.costPrice?.toString(),
        sellingPrice: input.sellingPrice?.toString(),
      } as typeof products.$inferInsert);
      return { id: Number((result as unknown as { insertId: bigint }).insertId), ...input };
    }),

  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        sku: z.string().optional(),
        name: z.string().optional(),
        category: z.string().optional(),
        description: z.string().optional(),
        costPrice: z.number().optional(),
        sellingPrice: z.number().optional(),
        quantity: z.number().optional(),
        unit: z.string().optional(),
        reorderPoint: z.number().optional(),
        status: z.enum(["active", "inactive"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const updateData: Record<string, unknown> = { ...data };
      if (data.costPrice !== undefined) updateData.costPrice = data.costPrice.toString();
      if (data.sellingPrice !== undefined) updateData.sellingPrice = data.sellingPrice.toString();
      await db.update(products).set(updateData).where(eq(products.id, id));
      return { id, ...data };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(products).where(eq(products.id, input.id));
      return { success: true };
    }),

  getLowStock: authedQuery.query(async () => {
    const db = getDb();
    const result = await db
      .select()
      .from(products)
      .where(sql`${products.quantity} <= ${products.reorderPoint}`);
    return result;
  }),

  getStats: authedQuery.query(async () => {
    const db = getDb();
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(products);
    const lowStockResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(sql`${products.quantity} <= ${products.reorderPoint}`);
    const outOfStockResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.quantity, 0));

    return {
      total: Number(totalResult[0].count),
      lowStock: Number(lowStockResult[0].count),
      outOfStock: Number(outOfStockResult[0].count),
    };
  }),
});
