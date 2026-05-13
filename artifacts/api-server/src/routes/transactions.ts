import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, transactionsTable, productsTable } from "@workspace/db";
import {
  CreateTransactionBody,
  GetTransactionParams,
  GetTransactionResponse,
  ListTransactionsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function generateTxHash(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz123456789";
  let hash = "";
  for (let i = 0; i < 87; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

router.get("/transactions", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      id: transactionsTable.id,
      buyerWallet: transactionsTable.buyerWallet,
      productId: transactionsTable.productId,
      productName: productsTable.name,
      prescriptionId: transactionsTable.prescriptionId,
      amount: transactionsTable.amount,
      currency: transactionsTable.currency,
      status: transactionsTable.status,
      txHash: transactionsTable.txHash,
      createdAt: transactionsTable.createdAt,
    })
    .from(transactionsTable)
    .leftJoin(productsTable, eq(transactionsTable.productId, productsTable.id))
    .orderBy(transactionsTable.createdAt);

  const mapped = rows.map((t) => ({ ...t, createdAt: t.createdAt.toISOString() }));
  res.json(ListTransactionsResponse.parse(mapped));
});

router.post("/transactions", async (req, res): Promise<void> => {
  const parsed = CreateTransactionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const txHash = parsed.data.txHash ?? generateTxHash();
  const { txHash: _inputTxHash, ...insertData } = parsed.data;
  const [tx] = await db.insert(transactionsTable).values({
    ...insertData,
    txHash,
    status: "confirmed",
  }).returning();

  const [product] = await db.select({ name: productsTable.name }).from(productsTable).where(eq(productsTable.id, tx.productId));

  res.status(201).json(GetTransactionResponse.parse({ ...tx, productName: product?.name ?? null, createdAt: tx.createdAt.toISOString() }));
});

router.get("/transactions/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetTransactionParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .select({
      id: transactionsTable.id,
      buyerWallet: transactionsTable.buyerWallet,
      productId: transactionsTable.productId,
      productName: productsTable.name,
      prescriptionId: transactionsTable.prescriptionId,
      amount: transactionsTable.amount,
      currency: transactionsTable.currency,
      status: transactionsTable.status,
      txHash: transactionsTable.txHash,
      createdAt: transactionsTable.createdAt,
    })
    .from(transactionsTable)
    .leftJoin(productsTable, eq(transactionsTable.productId, productsTable.id))
    .where(eq(transactionsTable.id, params.data.id));

  if (!row) {
    res.status(404).json({ error: "Transaction not found" });
    return;
  }

  res.json(GetTransactionResponse.parse({ ...row, createdAt: row.createdAt.toISOString() }));
});

export default router;
