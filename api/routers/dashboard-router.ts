import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { invoices, products, transactions } from "@db/schema";
import { eq, sql, desc, and } from "drizzle-orm";

export const dashboardRouter = createRouter({
  getSummary: authedQuery.query(async () => {
    const db = getDb();
    const today = new Date().toISOString().split("T")[0];
    const currentMonth = new Date().toISOString().slice(0, 7);

    // Today's sales
    const todaySalesResult = await db
      .select({ total: sql<number>`COALESCE(sum(${invoices.total}), 0)` })
      .from(invoices)
      .where(sql`DATE(${invoices.issueDate}) = ${today}`);

    // Monthly invoices count
    const monthlyInvoicesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(invoices)
      .where(sql`DATE_FORMAT(${invoices.issueDate}, '%Y-%m') = ${currentMonth}`);

    // Low stock count
    const lowStockResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(sql`${products.quantity} <= ${products.reorderPoint}`);

    // Monthly profit
    const incomeResult = await db
      .select({ total: sql<number>`COALESCE(sum(${transactions.amount}), 0)` })
      .from(transactions)
      .where(
        and(
          eq(transactions.type, "income"),
          sql`DATE_FORMAT(${transactions.date}, '%Y-%m') = ${currentMonth}`
        )
      );

    const expenseResult = await db
      .select({ total: sql<number>`COALESCE(sum(${transactions.amount}), 0)` })
      .from(transactions)
      .where(
        and(
          eq(transactions.type, "expense"),
          sql`DATE_FORMAT(${transactions.date}, '%Y-%m') = ${currentMonth}`
        )
      );

    const income = Number(incomeResult[0].total);
    const expense = Number(expenseResult[0].total);

    return {
      todaySales: Number(todaySalesResult[0].total),
      monthlyInvoices: Number(monthlyInvoicesResult[0].count),
      lowStockCount: Number(lowStockResult[0].count),
      monthlyProfit: income - expense,
    };
  }),

  getRecentActivities: authedQuery.query(async () => {
    const db = getDb();

    const recentInvoices = await db
      .select({
        id: invoices.id,
        type: sql<string>`'invoice'`,
        description: invoices.invoiceNumber,
        date: invoices.issueDate,
        amount: invoices.total,
        status: invoices.status,
      })
      .from(invoices)
      .orderBy(desc(invoices.createdAt))
      .limit(5);

    const recentTransactions = await db
      .select({
        id: transactions.id,
        type: sql<string>`'transaction'`,
        description: transactions.description,
        date: transactions.date,
        amount: transactions.amount,
        status: transactions.type,
      })
      .from(transactions)
      .orderBy(desc(transactions.createdAt))
      .limit(5);

    return [...recentInvoices, ...recentTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 10);
  }),

  getSalesChart: authedQuery.query(async () => {
    const db = getDb();
    const year = new Date().getFullYear();

    const result = await db
      .select({
        month: sql<number>`MONTH(${invoices.issueDate})`,
        total: sql<number>`COALESCE(sum(${invoices.total}), 0)`,
      })
      .from(invoices)
      .where(sql`YEAR(${invoices.issueDate}) = ${year}`)
      .groupBy(sql`MONTH(${invoices.issueDate})`);

    const months = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
    ];

    const data = months.map((label, i) => {
      const found = result.find((r) => r.month === i + 1);
      return {
        label,
        value: Number(found?.total || 0),
      };
    });

    return data;
  }),
});
