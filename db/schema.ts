import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  decimal,
  int,
  date,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export const companies = mysqlTable("companies", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  taxId: varchar("taxId", { length: 20 }),
  address: text("address"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  logo: varchar("logo", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const categories = mysqlTable("categories", {
  id: serial("id").primaryKey(),
  companyId: bigint("companyId", { mode: "number", unsigned: true }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  type: mysqlEnum("type", ["income", "expense", "product"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  companyId: bigint("companyId", { mode: "number", unsigned: true }).notNull(),
  sku: varchar("sku", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  description: text("description"),
  costPrice: decimal("costPrice", { precision: 12, scale: 2 }).default("0"),
  sellingPrice: decimal("sellingPrice", { precision: 12, scale: 2 }).default("0"),
  quantity: int("quantity").default(0),
  unit: varchar("unit", { length: 50 }).default("\u0e0a\u0e34\u0e49\u0e19"),
  reorderPoint: int("reorderPoint").default(10),
  status: mysqlEnum("status", ["active", "inactive"]).default("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const customers = mysqlTable("customers", {
  id: serial("id").primaryKey(),
  companyId: bigint("companyId", { mode: "number", unsigned: true }).notNull(),
  code: varchar("code", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  contactPerson: varchar("contactPerson", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  taxId: varchar("taxId", { length: 20 }),
  creditLimit: decimal("creditLimit", { precision: 12, scale: 2 }).default("0"),
  paymentTerm: int("paymentTerm").default(30),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const invoices = mysqlTable("invoices", {
  id: serial("id").primaryKey(),
  companyId: bigint("companyId", { mode: "number", unsigned: true }).notNull(),
  customerId: bigint("customerId", { mode: "number", unsigned: true }).notNull(),
  invoiceNumber: varchar("invoiceNumber", { length: 50 }).notNull(),
  type: mysqlEnum("type", ["quotation", "invoice", "receipt", "tax_invoice"]).notNull(),
  issueDate: date("issueDate").notNull(),
  dueDate: date("dueDate"),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 12, scale: 2 }).default("0"),
  taxRate: decimal("taxRate", { precision: 5, scale: 2 }).default("7"),
  taxAmount: decimal("taxAmount", { precision: 12, scale: 2 }).default("0"),
  total: decimal("total", { precision: 12, scale: 2 }).default("0"),
  status: mysqlEnum("status", ["draft", "sent", "paid", "overdue", "cancelled"]).default("draft"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const invoiceItems = mysqlTable("invoice_items", {
  id: serial("id").primaryKey(),
  invoiceId: bigint("invoiceId", { mode: "number", unsigned: true }).notNull(),
  productId: bigint("productId", { mode: "number", unsigned: true }),
  description: varchar("description", { length: 255 }).notNull(),
  quantity: int("quantity").default(1),
  unitPrice: decimal("unitPrice", { precision: 12, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 12, scale: 2 }).default("0"),
  total: decimal("total", { precision: 12, scale: 2 }).default("0"),
});

export const transactions = mysqlTable("transactions", {
  id: serial("id").primaryKey(),
  companyId: bigint("companyId", { mode: "number", unsigned: true }).notNull(),
  date: date("date").notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  type: mysqlEnum("type", ["income", "expense"]).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).default("0"),
  reference: varchar("reference", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Company = typeof companies.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Category = typeof categories.$inferSelect;
