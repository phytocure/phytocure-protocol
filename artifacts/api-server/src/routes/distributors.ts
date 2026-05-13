import { Router, type IRouter } from "express";
import { eq, count, asc } from "drizzle-orm";
import { db, distributorsTable, productsTable } from "@workspace/db";
import {
  CreateDistributorBody,
  GetDistributorParams,
  GetDistributorResponse,
  ListDistributorsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/distributors", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      id: distributorsTable.id,
      name: distributorsTable.name,
      walletAddress: distributorsTable.walletAddress,
      location: distributorsTable.location,
      verified: distributorsTable.verified,
      rating: distributorsTable.rating,
      licenseNumber: distributorsTable.licenseNumber,
      description: distributorsTable.description,
      logoUrl: distributorsTable.logoUrl,
      createdAt: distributorsTable.createdAt,
      totalProducts: count(productsTable.id),
    })
    .from(distributorsTable)
    .leftJoin(productsTable, eq(distributorsTable.id, productsTable.distributorId))
    .groupBy(distributorsTable.id)
    .orderBy(asc(distributorsTable.id));

  const mapped = rows.map((d) => ({ ...d, createdAt: d.createdAt.toISOString() }));
  res.json(ListDistributorsResponse.parse(mapped));
});

router.post("/distributors", async (req, res): Promise<void> => {
  const parsed = CreateDistributorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [dist] = await db.insert(distributorsTable).values(parsed.data).returning();

  res.status(201).json(GetDistributorResponse.parse({ ...dist, totalProducts: 0, createdAt: dist.createdAt.toISOString() }));
});

router.get("/distributors/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetDistributorParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .select({
      id: distributorsTable.id,
      name: distributorsTable.name,
      walletAddress: distributorsTable.walletAddress,
      location: distributorsTable.location,
      verified: distributorsTable.verified,
      rating: distributorsTable.rating,
      licenseNumber: distributorsTable.licenseNumber,
      description: distributorsTable.description,
      logoUrl: distributorsTable.logoUrl,
      createdAt: distributorsTable.createdAt,
      totalProducts: count(productsTable.id),
    })
    .from(distributorsTable)
    .leftJoin(productsTable, eq(distributorsTable.id, productsTable.distributorId))
    .where(eq(distributorsTable.id, params.data.id))
    .groupBy(distributorsTable.id);

  if (!row) {
    res.status(404).json({ error: "Distributor not found" });
    return;
  }

  res.json(GetDistributorResponse.parse({ ...row, createdAt: row.createdAt.toISOString() }));
});

export default router;
