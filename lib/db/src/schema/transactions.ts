import { pgTable, text, serial, timestamp, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  buyerWallet: text("buyer_wallet").notNull(),
  productId: integer("product_id").notNull(),
  prescriptionId: integer("prescription_id"),
  amount: real("amount").notNull(),
  currency: text("currency").notNull().default("SOL"),
  status: text("status").notNull().default("pending"),
  txHash: text("tx_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactionsTable).omit({ id: true, createdAt: true });
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactionsTable.$inferSelect;
