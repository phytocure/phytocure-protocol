import { pgTable, text, serial, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const analysesTable = pgTable("analyses", {
  id: serial("id").primaryKey(),
  strainName: text("strain_name").notNull(),
  thcContent: real("thc_content").notNull(),
  cbdContent: real("cbd_content").notNull(),
  terpenoids: text("terpenoids"),
  therapeuticProfile: text("therapeutic_profile").notNull(),
  riskAssessment: text("risk_assessment").notNull(),
  recommendedDosage: text("recommended_dosage").notNull(),
  contraindications: text("contraindications").notNull(),
  confidence: real("confidence").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAnalysisSchema = createInsertSchema(analysesTable).omit({ id: true, createdAt: true });
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analysesTable.$inferSelect;
