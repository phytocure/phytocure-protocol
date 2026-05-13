import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, researchTable } from "@workspace/db";
import {
  ListResearchQueryParams,
  CreateResearchBody,
  GetResearchParams,
  GetResearchResponse,
  UpdateResearchParams,
  UpdateResearchBody,
  UpdateResearchResponse,
  ListResearchResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/research", async (req, res): Promise<void> => {
  const query = ListResearchQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let rows = await db.select().from(researchTable).orderBy(researchTable.createdAt);
  if (query.data.status) {
    rows = rows.filter((r) => r.status === query.data.status);
  }

  const mapped = rows.map((r) => ({
    ...r,
    publishedAt: r.publishedAt?.toISOString() ?? null,
    createdAt: r.createdAt.toISOString(),
  }));
  res.json(ListResearchResponse.parse(mapped));
});

router.post("/research", async (req, res): Promise<void> => {
  const parsed = CreateResearchBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [research] = await db.insert(researchTable).values(parsed.data).returning();

  res.status(201).json(GetResearchResponse.parse({ ...research, publishedAt: research.publishedAt?.toISOString() ?? null, createdAt: research.createdAt.toISOString() }));
});

router.get("/research/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetResearchParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [research] = await db.select().from(researchTable).where(eq(researchTable.id, params.data.id));

  if (!research) {
    res.status(404).json({ error: "Research not found" });
    return;
  }

  res.json(GetResearchResponse.parse({ ...research, publishedAt: research.publishedAt?.toISOString() ?? null, createdAt: research.createdAt.toISOString() }));
});

router.patch("/research/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateResearchParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateResearchBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.title != null) updateData.title = parsed.data.title;
  if (parsed.data.abstract != null) updateData.abstract = parsed.data.abstract;
  if (parsed.data.status != null) {
    updateData.status = parsed.data.status;
    if (parsed.data.status === "published") updateData.publishedAt = new Date();
  }
  if (parsed.data.findings != null) updateData.findings = parsed.data.findings;
  if (parsed.data.collaborators != null) updateData.collaborators = parsed.data.collaborators;

  const [updated] = await db
    .update(researchTable)
    .set(updateData)
    .where(eq(researchTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Research not found" });
    return;
  }

  res.json(UpdateResearchResponse.parse({ ...updated, publishedAt: updated.publishedAt?.toISOString() ?? null, createdAt: updated.createdAt.toISOString() }));
});

export default router;
