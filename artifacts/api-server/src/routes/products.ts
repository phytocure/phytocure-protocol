import { Router, type IRouter } from "express";
import { eq, ilike, and } from "drizzle-orm";
import { db, productsTable, distributorsTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  CreateProductBody,
  GetProductParams,
  GetProductResponse,
  ListProductsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/products", async (req, res): Promise<void> => {
  const query = ListProductsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const conditions = [];
  if (query.data.distributorId) {
    conditions.push(eq(productsTable.distributorId, query.data.distributorId));
  }
  if (query.data.category) {
    conditions.push(eq(productsTable.category, query.data.category));
  }
  if (query.data.search) {
    conditions.push(ilike(productsTable.name, `%${query.data.search}%`));
  }

  const products = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      category: productsTable.category,
      thcContent: productsTable.thcContent,
      cbdContent: productsTable.cbdContent,
      distributorId: productsTable.distributorId,
      distributorName: distributorsTable.name,
      priceUsd: productsTable.priceUsd,
      priceSol: productsTable.priceSol,
      stock: productsTable.stock,
      imageUrl: productsTable.imageUrl,
      description: productsTable.description,
      effects: productsTable.effects,
      terpenoids: productsTable.terpenoids,
      verified: productsTable.verified,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(distributorsTable, eq(productsTable.distributorId, distributorsTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const mapped = products.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }));
  res.json(ListProductsResponse.parse(mapped));
});

router.post("/products", async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [product] = await db.insert(productsTable).values(parsed.data).returning();
  const [dist] = await db.select({ name: distributorsTable.name }).from(distributorsTable).where(eq(distributorsTable.id, product.distributorId));

  res.status(201).json(GetProductResponse.parse({ ...product, distributorName: dist?.name ?? null, createdAt: product.createdAt.toISOString() }));
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetProductParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      category: productsTable.category,
      thcContent: productsTable.thcContent,
      cbdContent: productsTable.cbdContent,
      distributorId: productsTable.distributorId,
      distributorName: distributorsTable.name,
      priceUsd: productsTable.priceUsd,
      priceSol: productsTable.priceSol,
      stock: productsTable.stock,
      imageUrl: productsTable.imageUrl,
      description: productsTable.description,
      effects: productsTable.effects,
      terpenoids: productsTable.terpenoids,
      verified: productsTable.verified,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(distributorsTable, eq(productsTable.distributorId, distributorsTable.id))
    .where(eq(productsTable.id, params.data.id));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(GetProductResponse.parse({ ...product, createdAt: product.createdAt.toISOString() }));
});

export default router;
