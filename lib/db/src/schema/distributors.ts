import { pgTable, text, serial, timestamp, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const distributorsTable = pgTable("distributors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  walletAddress: text("wallet_address").notNull(),
  location: text("location").notNull(),
  verified: boolean("verified").notNull().default(false),
  rating: real("rating").notNull().default(0),
  totalProducts: serial("total_products"),
  licenseNumber: text("license_number").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDistributorSchema = createInsertSchema(distributorsTable).omit({ id: true, createdAt: true });
export type InsertDistributor = z.infer<typeof insertDistributorSchema>;
export type Distributor = typeof distributorsTable.$inferSelect;
