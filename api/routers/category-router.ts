import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { categories } from "@db/schema";
import { eq } from "drizzle-orm";

export const categoryRouter = createRouter({
  list: authedQuery
    .input(
      z.object({
        type: z.enum(["income", "expense", "product"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      let where = undefined;
      if (input?.type) {
        where = eq(categories.type, input.type);
      }

      const items = await db
        .select()
        .from(categories)
        .where(where);

      return items;
    }),

  create: authedQuery
    .input(
      z.object({
        name: z.string(),
        type: z.enum(["income", "expense", "product"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(categories).values({
        companyId: 1,
        ...input,
      } as typeof categories.$inferInsert);
      return { id: Number((result as unknown as { insertId: bigint }).insertId), ...input };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(categories).where(eq(categories.id, input.id));
      return { success: true };
    }),
});
