import { Router, type IRouter } from "express";
import { count, sum, eq } from "drizzle-orm";
import { db, productsTable, distributorsTable, prescriptionsTable, researchTable, transactionsTable, analysesTable } from "@workspace/db";
import { GetDashboardStatsResponse, GetRecentActivityResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/stats", async (_req, res): Promise<void> => {
  const [productCount] = await db.select({ count: count() }).from(productsTable);
  const [distCount] = await db.select({ count: count() }).from(distributorsTable);
  const [prescCount] = await db.select({ count: count() }).from(prescriptionsTable);
  const [researchCount] = await db.select({ count: count() }).from(researchTable);
  const [txVolume] = await db.select({ total: sum(transactionsTable.amount) }).from(transactionsTable).where(eq(transactionsTable.status, "confirmed"));
  const [verifiedDist] = await db.select({ count: count() }).from(distributorsTable).where(eq(distributorsTable.verified, true));
  const [pendingPresc] = await db.select({ count: count() }).from(prescriptionsTable).where(eq(prescriptionsTable.status, "pending"));
  const [activeResearch] = await db.select({ count: count() }).from(researchTable).where(eq(researchTable.status, "in-progress"));

  res.json(GetDashboardStatsResponse.parse({
    totalProducts: productCount?.count ?? 0,
    totalDistributors: distCount?.count ?? 0,
    totalPrescriptions: prescCount?.count ?? 0,
    totalResearch: researchCount?.count ?? 0,
    totalTransactionVolume: parseFloat(txVolume?.total ?? "0"),
    activeResearchers: activeResearch?.count ?? 0,
    verifiedDistributors: verifiedDist?.count ?? 0,
    pendingPrescriptions: pendingPresc?.count ?? 0,
  }));
});

router.get("/dashboard/recent-activity", async (_req, res): Promise<void> => {
  const activities: Array<{ id: number; type: string; title: string; description: string; timestamp: string; metadata: string | null }> = [];

  const recentPrescriptions = await db.select().from(prescriptionsTable).orderBy(prescriptionsTable.createdAt).limit(3);
  for (const p of recentPrescriptions) {
    activities.push({
      id: p.id,
      type: "prescription",
      title: "New Prescription Issued",
      description: `Prescription for ${p.condition}: ${p.dosage}, ${p.frequency}`,
      timestamp: p.createdAt.toISOString(),
      metadata: JSON.stringify({ status: p.status, patientId: p.patientId }),
    });
  }

  const recentResearch = await db.select().from(researchTable).orderBy(researchTable.createdAt).limit(3);
  for (const r of recentResearch) {
    activities.push({
      id: r.id + 1000,
      type: "research",
      title: "Research Project Updated",
      description: r.title,
      timestamp: r.createdAt.toISOString(),
      metadata: JSON.stringify({ status: r.status, category: r.category }),
    });
  }

  const recentTransactions = await db.select().from(transactionsTable).orderBy(transactionsTable.createdAt).limit(3);
  for (const t of recentTransactions) {
    activities.push({
      id: t.id + 2000,
      type: "transaction",
      title: "Transaction Confirmed",
      description: `${t.amount} ${t.currency} payment processed`,
      timestamp: t.createdAt.toISOString(),
      metadata: JSON.stringify({ status: t.status, currency: t.currency }),
    });
  }

  const recentAnalyses = await db.select().from(analysesTable).orderBy(analysesTable.createdAt).limit(2);
  for (const a of recentAnalyses) {
    activities.push({
      id: a.id + 3000,
      type: "product",
      title: "AI Strain Analysis Completed",
      description: `${a.strainName}: ${(a.confidence * 100).toFixed(0)}% confidence`,
      timestamp: a.createdAt.toISOString(),
      metadata: JSON.stringify({ thc: a.thcContent, cbd: a.cbdContent }),
    });
  }

  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  res.json(GetRecentActivityResponse.parse(activities.slice(0, 10)));
});

export default router;
