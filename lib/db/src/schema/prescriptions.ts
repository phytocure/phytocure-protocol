import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const prescriptionsTable = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  patientId: text("patient_id").notNull(),
  doctorId: text("doctor_id").notNull(),
  productId: integer("product_id").notNull(),
  dosage: text("dosage").notNull(),
  frequency: text("frequency").notNull(),
  duration: text("duration").notNull(),
  condition: text("condition").notNull(),
  notes: text("notes").notNull().default(""),
  status: text("status").notNull().default("pending"),
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPrescriptionSchema = createInsertSchema(prescriptionsTable).omit({ id: true, createdAt: true });
export type InsertPrescription = z.infer<typeof insertPrescriptionSchema>;
export type Prescription = typeof prescriptionsTable.$inferSelect;
