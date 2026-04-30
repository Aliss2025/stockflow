import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { companies } from "@db/schema";
import { eq } from "drizzle-orm";

export const companyRouter = createRouter({
  get: authedQuery.query(async () => {
    const db = getDb();
    const result = await db
      .select()
      .from(companies)
      .limit(1);
    return result[0] || null;
  }),

  create: authedQuery
    .input(
      z.object({
        name: z.string(),
        taxId: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(companies).values({
        userId: 1,
        ...input,
      } as typeof companies.$inferInsert);
      return { id: Number((result as unknown as { insertId: bigint }).insertId), ...input };
    }),

  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        taxId: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(companies).set(data).where(eq(companies.id, id));
      return { id, ...data };
    }),
});
