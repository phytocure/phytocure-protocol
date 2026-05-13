import { pgTable, text, serial, timestamp, boolean, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  thcContent: real("thc_content").notNull().default(0),
  cbdContent: real("cbd_content").notNull().default(0),
  distributorId: integer("distributor_id").notNull(),
  priceUsd: real("price_usd").notNull().default(0),
  priceSol: real("price_sol").notNull().default(0),
  stock: integer("stock").notNull().default(0),
  imageUrl: text("image_url"),
  description: text("description").notNull().default(""),
  effects: text("effects").notNull().default(""),
  terpenoids: text("terpenoids"),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
