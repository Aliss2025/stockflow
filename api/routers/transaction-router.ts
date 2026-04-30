import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { transactions } from "@db/schema";
import { eq, and, sql, desc } from "drizzle-orm";

export const transactionRouter = createRouter({
  list: authedQuery
    .input(
      z.object({
        type: z.enum(["income", "expense"]).optional(),
        category: z.string().optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { type, category, dateFrom, dateTo, page, limit } = input;
      const offset = (page - 1) * limit;

      let conditions = [];
      if (type) conditions.push(eq(transactions.type, type));
      if (category) conditions.push(eq(transactions.category, category));
      if (dateFrom) conditions.push(sql`${transactions.date} >= ${dateFrom}`);
      if (dateTo) conditions.push(sql`${transactions.date} <= ${dateTo}`);

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db
        .select()
        .from(transactions)
        .where(where)
        .orderBy(desc(transactions.date))
        .limit(limit)
        .offset(offset);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(transactions)
        .where(where);

      return {
        transactions: items,
        total: Number(countResult[0].count),
        page,
      };
    }),

  create: authedQuery
    .input(
      z.object({
        date: z.string(),
        description: z.string(),
        category: z.string().optional(),
        type: z.enum(["income", "expense"]),
        amount: z.number(),
        reference: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(transactions).values({
        companyId: 1,
        date: new Date(input.date),
        description: input.description,
        category: input.category,
        type: input.type,
        amount: input.amount.toString(),
        reference: input.reference,
        notes: input.notes,
      } as typeof transactions.$inferInsert);
      return { id: Number((result as unknown as { insertId: bigint }).insertId), ...input };
    }),

  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        date: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        type: z.enum(["income", "expense"]).optional(),
        amount: z.number().optional(),
        reference: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const updateData: Record<string, unknown> = { ...data };
      if (data.date !== undefined) updateData.date = new Date(data.date);
      if (data.amount !== undefined) updateData.amount = data.amount.toString();
      await db.update(transactions).set(updateData).where(eq(transactions.id, id));
      return { id, ...data };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(transactions).where(eq(transactions.id, input.id));
      return { success: true };
    }),

  getStats: authedQuery
    .input(z.object({ month: z.number(), year: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const { month, year } = input;
      const monthStr = String(month).padStart(2, "0");

      const incomeResult = await db
        .select({ total: sql<number>`COALESCE(sum(${transactions.amount}), 0)` })
        .from(transactions)
        .where(
          and(
            eq(transactions.type, "income"),
            sql`DATE_FORMAT(${transactions.date}, '%Y-%m') = ${`${year}-${monthStr}`}`
          )
        );

      const expenseResult = await db
        .select({ total: sql<number>`COALESCE(sum(${transactions.amount}), 0)` })
        .from(transactions)
        .where(
          and(
            eq(transactions.type, "expense"),
            sql`DATE_FORMAT(${transactions.date}, '%Y-%m') = ${`${year}-${monthStr}`}`
          )
        );

      const income = Number(incomeResult[0].total);
      const expense = Number(expenseResult[0].total);

      return { income, expense, balance: income - expense };
    }),

  getMonthly: authedQuery
    .input(z.object({ year: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const { year } = input;

      const result = await db
        .select({
          month: sql<number>`MONTH(${transactions.date})`,
          type: transactions.type,
          total: sql<number>`COALESCE(sum(${transactions.amount}), 0)`,
        })
        .from(transactions)
        .where(sql`YEAR(${transactions.date}) = ${year}`)
        .groupBy(sql`MONTH(${transactions.date})`, transactions.type);

      const monthly: Record<number, { income: number; expense: number }> = {};
      for (let i = 1; i <= 12; i++) {
        monthly[i] = { income: 0, expense: 0 };
      }

      for (const row of result) {
        if (row.type === "income") {
          monthly[row.month].income = Number(row.total);
        } else {
          monthly[row.month].expense = Number(row.total);
        }
      }

      return Object.entries(monthly).map(([month, data]) => ({
        month: Number(month),
        ...data,
      }));
    }),
});
