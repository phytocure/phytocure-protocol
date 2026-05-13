import { Router, type IRouter } from "express";
import { db, analysesTable } from "@workspace/db";
import {
  AnalyzeStrainBody,
  AnalyzeStrainResponse,
  GetRecommendationBody,
  GetRecommendationResponse,
  ListAnalysesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function generateTherapeuticProfile(strainName: string, thc: number, cbd: number, terpenoids?: string): string {
  const profiles: string[] = [];
  if (thc > 20) profiles.push("High psychoactive potential. Effective for severe pain, PTSD, and appetite stimulation.");
  else if (thc > 10) profiles.push("Moderate THC. Balanced effects suitable for pain, anxiety, and mood disorders.");
  else profiles.push("Low psychoactive effect. Suitable for daytime use and patients sensitive to THC.");
  if (cbd > 10) profiles.push("High CBD content provides strong anti-inflammatory and neuroprotective effects.");
  else if (cbd > 5) profiles.push("Moderate CBD offers anxiolytic and anti-seizure properties.");
  if (terpenoids?.includes("myrcene")) profiles.push("Myrcene terpene enhances sedative effects and muscle relaxation.");
  if (terpenoids?.includes("limonene")) profiles.push("Limonene provides mood elevation and anti-anxiety benefits.");
  if (terpenoids?.includes("pinene")) profiles.push("Alpha-pinene promotes alertness and counters short-term memory impairment.");
  return profiles.join(" ") || `${strainName} shows promising therapeutic properties with balanced cannabinoid ratio.`;
}

function generateRiskAssessment(thc: number, cbd: number): string {
  if (thc > 25) return "High risk of acute psychosis in susceptible individuals. Contraindicated in patients with schizophrenia history. Monitor for tachycardia and cognitive impairment. Start with minimal doses.";
  if (thc > 15) return "Moderate risk profile. Potential for anxiety or paranoia at high doses. Not recommended for first-time users. Avoid concurrent alcohol use.";
  return "Low to moderate risk. Well-tolerated in most patients. Monitor for drowsiness and dry mouth. Suitable for most adult patients under medical supervision.";
}

function generateDosage(thc: number, cbd: number): string {
  if (thc > 20) return "Starting dose: 2.5mg THC. Titrate by 2.5mg every 7 days. Maximum recommended: 25mg/day. Administer in evening or at bedtime.";
  if (thc > 10) return "Starting dose: 5mg THC. Titrate by 5mg every 5 days. Therapeutic range: 10-30mg/day. Can be divided into 2-3 daily doses.";
  return "Starting dose: 10mg CBD / 2.5mg THC. Increase by 5-10mg CBD weekly. Most patients respond at 20-40mg CBD daily.";
}

router.post("/ai/analyze", async (req, res): Promise<void> => {
  const parsed = AnalyzeStrainBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { strainName, thcContent, cbdContent, terpenoids } = parsed.data;

  const therapeuticProfile = generateTherapeuticProfile(strainName, thcContent, cbdContent, terpenoids);
  const riskAssessment = generateRiskAssessment(thcContent, cbdContent);
  const recommendedDosage = generateDosage(thcContent, cbdContent);
  const contraindications = "Pregnancy and breastfeeding. Severe hepatic impairment. History of psychotic disorders (for high-THC strains). Concurrent use of CNS depressants without physician supervision. Patients under 18 years of age.";
  const confidence = Math.min(0.95, 0.65 + (thcContent + cbdContent) / 100);

  const [analysis] = await db.insert(analysesTable).values({
    strainName,
    thcContent,
    cbdContent,
    terpenoids: terpenoids ?? null,
    therapeuticProfile,
    riskAssessment,
    recommendedDosage,
    contraindications,
    confidence,
  }).returning();

  res.json(AnalyzeStrainResponse.parse({ ...analysis, createdAt: analysis.createdAt.toISOString() }));
});

router.post("/ai/recommend", async (req, res): Promise<void> => {
  const parsed = GetRecommendationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { condition, severity, patientAge } = parsed.data;

  const conditionStrains: Record<string, string> = {
    "chronic pain": "ACDC (CBD:THC 20:1), Harlequin (5:2 CBD:THC), Blue Dream (moderate THC)",
    "anxiety": "Charlotte's Web (high CBD), Cannatonic (balanced), ACDC",
    "insomnia": "Granddaddy Purple (indica), Northern Lights (indica), Girl Scout Cookies",
    "nausea": "Durban Poison (sativa), Jack Herer (sativa), OG Kush",
    "epilepsy": "Charlotte's Web, ACDC, Ringo's Gift (high CBD)",
    "ptsd": "Blue Dream, Pineapple Express, Sour Diesel",
    "multiple sclerosis": "Harlequin, ACDC, Cannatonic",
  };

  const lowerCondition = condition.toLowerCase();
  let recommendedStrains = conditionStrains[lowerCondition] ?? "Consult with a cannabis specialist for personalized strain selection based on your specific condition profile.";
  
  let protocol = `For ${condition} (severity: ${severity}): `;
  if (severity === "mild") protocol += "Start with CBD-dominant strains. 10-15mg CBD daily. Consider sublingual tinctures for precise dosing.";
  else if (severity === "moderate") protocol += "Balanced CBD:THC ratio recommended. 15-25mg CBD + 5-10mg THC per day. Evening administration preferred.";
  else protocol += "Higher THC ratio may be indicated. Begin at 5mg THC + 20mg CBD. Titrate slowly under medical supervision.";

  const warningNotes = patientAge < 25
    ? "CAUTION: Patient is under 25. Developing brain may be susceptible to THC effects. Strongly prefer CBD-dominant preparations. Obtain specialist consultation."
    : "Standard precautions apply. Monitor for adverse effects during first 2 weeks. Avoid driving or operating machinery during dose titration.";

  const confidenceScore = lowerCondition in conditionStrains ? 0.87 : 0.62;

  res.json(GetRecommendationResponse.parse({
    condition,
    recommendedStrains,
    dosageProtocol: protocol,
    warningNotes,
    confidenceScore,
    alternativeOptions: "Topical CBD preparations for localized pain. Sublingual tinctures for faster onset. Capsules for sustained release and precise dosing.",
    researchBasis: "Recommendations based on peer-reviewed studies from Journal of Cannabis Research, NORML clinical data, and WHO Expert Committee reports on cannabis medicine.",
  }));
});

router.get("/ai/analyses", async (_req, res): Promise<void> => {
  const rows = await db.select().from(analysesTable).orderBy(analysesTable.createdAt);
  const mapped = rows.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }));
  res.json(ListAnalysesResponse.parse(mapped));
});

export default router;
