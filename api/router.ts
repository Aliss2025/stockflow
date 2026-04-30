import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { productRouter } from "./routers/product-router";
import { customerRouter } from "./routers/customer-router";
import { invoiceRouter } from "./routers/invoice-router";
import { transactionRouter } from "./routers/transaction-router";
import { dashboardRouter } from "./routers/dashboard-router";
import { categoryRouter } from "./routers/category-router";
import { companyRouter } from "./routers/company-router";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  product: productRouter,
  customer: customerRouter,
  invoice: invoiceRouter,
  transaction: transactionRouter,
  dashboard: dashboardRouter,
  category: categoryRouter,
  company: companyRouter,
});

export type AppRouter = typeof appRouter;
