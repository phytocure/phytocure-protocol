import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const researchTable = pgTable("research", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  abstract: text("abstract").notNull(),
  authorId: text("author_id").notNull(),
  status: text("status").notNull().default("draft"),
  category: text("category").notNull(),
  methodology: text("methodology").notNull(),
  findings: text("findings").notNull().default(""),
  collaborators: text("collaborators").notNull().default(""),
  upvotes: integer("upvotes").notNull().default(0),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertResearchSchema = createInsertSchema(researchTable).omit({ id: true, createdAt: true });
export type InsertResearch = z.infer<typeof insertResearchSchema>;
export type Research = typeof researchTable.$inferSelect;
