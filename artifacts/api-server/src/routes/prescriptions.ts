import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, prescriptionsTable, productsTable } from "@workspace/db";
import {
  ListPrescriptionsQueryParams,
  CreatePrescriptionBody,
  GetPrescriptionParams,
  GetPrescriptionResponse,
  UpdatePrescriptionParams,
  UpdatePrescriptionBody,
  UpdatePrescriptionResponse,
  ListPrescriptionsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/prescriptions", async (req, res): Promise<void> => {
  const query = ListPrescriptionsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const conditions = [];
  if (query.data.patientId) {
    conditions.push(eq(prescriptionsTable.patientId, query.data.patientId));
  }
  if (query.data.status) {
    conditions.push(eq(prescriptionsTable.status, query.data.status));
  }

  const rows = await db
    .select({
      id: prescriptionsTable.id,
      patientId: prescriptionsTable.patientId,
      doctorId: prescriptionsTable.doctorId,
      productId: prescriptionsTable.productId,
      productName: productsTable.name,
      dosage: prescriptionsTable.dosage,
      frequency: prescriptionsTable.frequency,
      duration: prescriptionsTable.duration,
      condition: prescriptionsTable.condition,
      notes: prescriptionsTable.notes,
      status: prescriptionsTable.status,
      txHash: prescriptionsTable.txHash,
      createdAt: prescriptionsTable.createdAt,
    })
    .from(prescriptionsTable)
    .leftJoin(productsTable, eq(prescriptionsTable.productId, productsTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const mapped = rows.map((p) => ({ ...p, createdAt: p.createdAt.toISOString() }));
  res.json(ListPrescriptionsResponse.parse(mapped));
});

router.post("/prescriptions", async (req, res): Promise<void> => {
  const parsed = CreatePrescriptionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [prescription] = await db.insert(prescriptionsTable).values(parsed.data).returning();
  const [product] = await db.select({ name: productsTable.name }).from(productsTable).where(eq(productsTable.id, prescription.productId));

  res.status(201).json(GetPrescriptionResponse.parse({ ...prescription, productName: product?.name ?? null, createdAt: prescription.createdAt.toISOString() }));
});

router.get("/prescriptions/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetPrescriptionParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .select({
      id: prescriptionsTable.id,
      patientId: prescriptionsTable.patientId,
      doctorId: prescriptionsTable.doctorId,
      productId: prescriptionsTable.productId,
      productName: productsTable.name,
      dosage: prescriptionsTable.dosage,
      frequency: prescriptionsTable.frequency,
      duration: prescriptionsTable.duration,
      condition: prescriptionsTable.condition,
      notes: prescriptionsTable.notes,
      status: prescriptionsTable.status,
      txHash: prescriptionsTable.txHash,
      createdAt: prescriptionsTable.createdAt,
    })
    .from(prescriptionsTable)
    .leftJoin(productsTable, eq(prescriptionsTable.productId, productsTable.id))
    .where(eq(prescriptionsTable.id, params.data.id));

  if (!row) {
    res.status(404).json({ error: "Prescription not found" });
    return;
  }

  res.json(GetPrescriptionResponse.parse({ ...row, createdAt: row.createdAt.toISOString() }));
});

router.patch("/prescriptions/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdatePrescriptionParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdatePrescriptionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.status != null) updateData.status = parsed.data.status;
  if (parsed.data.txHash != null) updateData.txHash = parsed.data.txHash;

  const [updated] = await db
    .update(prescriptionsTable)
    .set(updateData)
    .where(eq(prescriptionsTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Prescription not found" });
    return;
  }

  const [product] = await db.select({ name: productsTable.name }).from(productsTable).where(eq(productsTable.id, updated.productId));

  res.json(UpdatePrescriptionResponse.parse({ ...updated, productName: product?.name ?? null, createdAt: updated.createdAt.toISOString() }));
});

export default router;
