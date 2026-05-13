import { db, distributorsTable, productsTable, prescriptionsTable, researchTable, transactionsTable } from "@workspace/db";
import { like, or, ilike } from "drizzle-orm";
import { logger } from "./lib/logger";

export async function seedGlobalData() {
  const indonesianDistributors = await db
    .select({ id: distributorsTable.id })
    .from(distributorsTable)
    .where(or(
      ilike(distributorsTable.location, "%indonesia%"),
      ilike(distributorsTable.location, "%jakarta%"),
      ilike(distributorsTable.location, "%bandung%"),
      ilike(distributorsTable.location, "%surabaya%"),
      ilike(distributorsTable.name, "%indonesia%"),
    ));

  const indonesianResearch = await db
    .select({ id: researchTable.id })
    .from(researchTable)
    .where(or(
      ilike(researchTable.title, "%indonesia%"),
      ilike(researchTable.abstract, "%indonesia%"),
      ilike(researchTable.collaborators, "%UI-Faculty%"),
      ilike(researchTable.collaborators, "%RS Cipto%"),
      ilike(researchTable.collaborators, "%BRIN%"),
    ));

  const indonesianPrescriptions = await db
    .select({ id: prescriptionsTable.id })
    .from(prescriptionsTable)
    .where(or(
      ilike(prescriptionsTable.doctorId, "%Surya%"),
      ilike(prescriptionsTable.doctorId, "%Wulandari%"),
      ilike(prescriptionsTable.doctorId, "%Santoso%"),
      ilike(prescriptionsTable.doctorId, "%Pratama%"),
      ilike(prescriptionsTable.doctorId, "%Anisa%"),
    ));

  const needsDistributorSeed = indonesianDistributors.length > 0;
  const needsResearchSeed = indonesianResearch.length > 0;
  const needsPrescriptionSeed = indonesianPrescriptions.length > 0;

  if (!needsDistributorSeed && !needsResearchSeed && !needsPrescriptionSeed) {
    logger.info("Seed: no Indonesian data found, checking for new distributors.");
  }

  logger.info({ needsDistributorSeed, needsResearchSeed, needsPrescriptionSeed }, "Replacing Indonesian data with global data");

  if (needsDistributorSeed) {
    await db.delete(transactionsTable);
    await db.delete(prescriptionsTable);
    await db.delete(productsTable);
    await db.delete(distributorsTable);

    await db.insert(distributorsTable).values([
      {
        name: "GW Pharmaceuticals (Jazz Pharma)",
        walletAddress: "GWpJz7xNqmPvR4wT8uWeLyJ5cFbA2sD4hGriQnZmTBkx",
        location: "London, United Kingdom",
        verified: true,
        rating: 4.9,
        licenseNumber: "UK-MHRA-CBP-2024-001",
        description: "Pioneer of plant-derived cannabinoid medicines. Manufacturer of Epidiolex (FDA/EMA-approved cannabidiol for epilepsy) and Sativex (nabiximols for MS-related spasticity). Founded in 1998, acquired by Jazz Pharmaceuticals in 2021.",
      },
      {
        name: "Bedrocan International",
        walletAddress: "BdrcanVndmPvR6wT8uWeLyJ3cFbA4sD2hG9riQnZmTPy",
        location: "Veendam, Netherlands",
        verified: true,
        rating: 4.8,
        licenseNumber: "NL-BGIN-MIN-VWS-2024-04",
        description: "Official Dutch government-licensed medical cannabis producer since 2003. Supplies standardized cannabis flos to pharmacies in 30+ countries. ISO 9001 and GMP certified. Partner of WHO and INCB for international medical cannabis standards.",
      },
      {
        name: "Aurora Cannabis (Medical Division)",
        walletAddress: "AuraCannEdmntPvR5wT9uWeLyJcFbA1sD5hGriQnZmTP",
        location: "Edmonton, Canada",
        verified: true,
        rating: 4.7,
        licenseNumber: "CA-HC-LP-2024-0083",
        description: "One of the largest licensed producers (LP) in Canada under Health Canada regulations. Exports medical cannabis to 25+ countries across Europe, Latin America, and Asia-Pacific. Aurora MedsTM platform serves 80,000+ registered patients globally.",
      },
      {
        name: "Tilray Brands (Medical)",
        walletAddress: "TryBrandsMedPvR4wT6uWeLyJ1cFbA3sD6hGriQnZmTP",
        location: "Nanaimo, Canada / Cantanhede, Portugal",
        verified: true,
        rating: 4.6,
        licenseNumber: "CA-HC-LP-2024-0171",
        description: "Global pioneer in medical cannabis with EU-GMP certified production facilities in Portugal (Tilray Portugal). First cannabis company listed on NASDAQ. Supplies medical cannabis across Canada, Europe, Australia, New Zealand, and Latin America.",
      },
      {
        name: "Canopy Growth Corporation",
        walletAddress: "CnpyGrwthCrpPvR8wT3uWeLyJcFbA2sD8hGriQnZmTPk",
        location: "Smiths Falls, Canada",
        verified: true,
        rating: 4.5,
        licenseNumber: "CA-HC-LP-2024-0034",
        description: "Largest cannabis company in the world by market cap. Operates under Spectrum Therapeutics brand for medical division. Collaborates with Beckley Canopy Therapeutics (Oxford/Columbia University research) on clinical trials.",
      },
      {
        name: "Cann Group (Australia)",
        walletAddress: "CANNGrpAusPvR9wT6uWeLyJ2cFbA7sD3hGriQnZmTPBk",
        location: "Mildura, Victoria, Australia",
        verified: true,
        rating: 4.5,
        licenseNumber: "AU-TGA-LP-ODC-2024-0023",
        description: "First company licensed by the Australian Office of Drug Control (ODC) for medical cannabis cultivation and manufacture. GMP-certified production facility. Supplies TGA-approved medical cannabis products across Australia and Southeast Asia.",
      },
    ]);

    await db.insert(productsTable).values([
      {
        name: "Epidiolex (Cannabidiol Oral Solution)",
        category: "extract",
        thcContent: 0,
        cbdContent: 100,
        distributorId: 1,
        priceUsd: 1290,
        priceSol: 8.6,
        stock: 320,
        imageUrl: "/products/epidiolex.jpg",
        description: "FDA-approved (2018) and EMA-approved (2019) pharmaceutical-grade cannabidiol solution 100mg/mL. Indicated for seizures associated with Lennox-Gastaut syndrome, Dravet syndrome, and tuberous sclerosis complex in patients 1 year and older. Manufactured by GW Pharmaceuticals under strict GMP. Only plant-derived cannabinoid medicine with full regulatory approval.",
        effects: "Anticonvulsant, anti-epileptic, neuroprotective, anxiolytic",
        terpenoids: "Not applicable - pharmaceutical isolate",
        verified: true,
      },
      {
        name: "Sativex Oromucosal Spray (Nabiximols)",
        category: "tincture",
        thcContent: 27,
        cbdContent: 25,
        distributorId: 1,
        priceUsd: 490,
        priceSol: 3.27,
        stock: 215,
        imageUrl: "/products/sativex.webp",
        description: "EMA-approved cannabinoid medicine available in 30+ countries. Each 100uL spray delivers 2.7mg THC and 2.5mg CBD. Indicated for moderate-to-severe spasticity in Multiple Sclerosis patients unresponsive to other antispasmodics. Self-titrating oromucosal spray from cannabis sativa extract. Also in Phase III trials for cancer pain.",
        effects: "Antispasticity, analgesic, muscle relaxant, sleep improvement",
        terpenoids: "Myrcene, Linalool, Pinene",
        verified: true,
      },
      {
        name: "Bedrocan Cannabis Flos (22% THC)",
        category: "flower",
        thcContent: 22,
        cbdContent: 1,
        distributorId: 2,
        priceUsd: 195,
        priceSol: 1.3,
        stock: 580,
        imageUrl: "/products/bedrocan-flos.jpg",
        description: "Standardized pharmaceutical-grade cannabis flower from Bedrocan International, official Dutch government supplier. Identical cannabinoid composition in each batch (ISO 9001 / GMP certified). Cultivar: Bedrocan (T22, C1). Supplied to pharmacies in Netherlands, Germany, Italy, Czech Republic, and 25+ countries. Used for chronic pain, MS, PTSD, and chemotherapy-induced nausea.",
        effects: "Analgesic, antiemetic, euphoric, appetite stimulation",
        terpenoids: "Myrcene, Caryophyllene, Terpinolene",
        verified: true,
      },
      {
        name: "Bediol CBD-Rich Granulate (6.3% THC / 8% CBD)",
        category: "flower",
        thcContent: 6.3,
        cbdContent: 8,
        distributorId: 2,
        priceUsd: 210,
        priceSol: 1.4,
        stock: 410,
        imageUrl: "/products/bediol.jpg",
        description: "Balanced THC:CBD pharmaceutical granulate from Bedrocan International. Processed into fine granulate for precise vaporisation dosing. Cultivar: Bediol (T6.3, C8). Dispensed through pharmacy networks in EU. Indicated for MS spasticity, chronic neuropathic pain, fibromyalgia, and where reduced psychoactivity is preferred.",
        effects: "Anti-spasticity, analgesic, anti-inflammatory, mild sedation",
        terpenoids: "Myrcene, Linalool, Ocimene",
        verified: true,
      },
      {
        name: "Aurora CBD Softgels 25mg",
        category: "capsule",
        thcContent: 0,
        cbdContent: 25,
        distributorId: 3,
        priceUsd: 89,
        priceSol: 0.59,
        stock: 1200,
        imageUrl: "/products/aurora-softgels.jpg",
        description: "Health Canada-licensed medical cannabis oil in soft gel capsule format. Each capsule contains 25mg CBD from full-spectrum extract. Manufactured in EU-GMP certified facility. Shipped internationally through Aurora Global Enterprises. Batch-specific Certificate of Analysis (CoA) available for each lot. Used for anxiety, chronic pain, and sleep disorders.",
        effects: "Anxiolytic, analgesic, anti-inflammatory, sleep support",
        terpenoids: "Myrcene, Limonene, Linalool",
        verified: true,
      },
      {
        name: "Aurora T10 Medical Cannabis Oil (1:1)",
        category: "extract",
        thcContent: 10,
        cbdContent: 10,
        distributorId: 3,
        priceUsd: 125,
        priceSol: 0.83,
        stock: 760,
        imageUrl: "/products/aurora-oil.jpg",
        description: "Balanced 1:1 THC:CBD cannabis oil from Aurora Cannabis Medical Division. 10mg/mL THC and 10mg/mL CBD in MCT carrier oil. Health Canada registered. Available internationally through Aurora Global and European subsidiaries. Indicated for neuropathic pain, chemotherapy-induced symptoms, PTSD, and insomnia.",
        effects: "Balanced analgesia, anxiolytic, sleep improvement, antiemetic",
        terpenoids: "Myrcene, Caryophyllene, Pinene",
        verified: true,
      },
      {
        name: "Tilray T1:CBD Cannabis Oil (EU-GMP)",
        category: "extract",
        thcContent: 1,
        cbdContent: 25,
        distributorId: 4,
        priceUsd: 149,
        priceSol: 0.99,
        stock: 640,
        imageUrl: "/products/tilray.webp",
        description: "EU-GMP certified medical cannabis oil produced at Tilray Portugal facility in Cantanhede. 1mg/mL THC, 25mg/mL CBD. Authorised in Germany (BfArM), UK (MHRA), Australia (TGA), and multiple EU markets. High-CBD formulation for patients requiring therapeutic cannabis without significant psychoactive burden. Used in oncology supportive care and neurological conditions.",
        effects: "Neuroprotective, anti-inflammatory, anxiolytic, anticonvulsant",
        terpenoids: "Linalool, Myrcene, Limonene",
        verified: true,
      },
      {
        name: "Spectrum Therapeutics Red - High THC Indica",
        category: "flower",
        thcContent: 19.5,
        cbdContent: 0.5,
        distributorId: 5,
        priceUsd: 165,
        priceSol: 1.1,
        stock: 890,
        imageUrl: "/products/spectrum-red.jpg",
        description: "Canopy Growth Spectrum Therapeutics colour-coded medical cannabis system. Red = high THC indica-dominant, 19.5% THC average. Health Canada licensed, available to registered patients via licensed healthcare practitioners. Used for severe chronic pain, PTSD-related sleep disruption, and appetite stimulation in cancer patients.",
        effects: "Sedation, analgesia, appetite stimulation, deep sleep",
        terpenoids: "Myrcene, Caryophyllene, Linalool",
        verified: true,
      },
      {
        name: "Spectrum Therapeutics Blue - Balanced CBD:THC Oil",
        category: "tincture",
        thcContent: 8,
        cbdContent: 12,
        distributorId: 5,
        priceUsd: 139,
        priceSol: 0.93,
        stock: 520,
        imageUrl: "/products/spectrum-blue.jpg",
        description: "Spectrum Therapeutics Blue oil - balanced CBD-dominant formulation. 8mg/mL THC and 12mg/mL CBD in MCT carrier oil. Health Canada registered medical product. Suitable for patients new to medical cannabis or those with sensitivity to THC. Indicated for anxiety disorders, mild-to-moderate chronic pain, and inflammatory conditions.",
        effects: "Anxiolytic, mild analgesic, anti-inflammatory, mood stabilisation",
        terpenoids: "Limonene, Linalool, Pinene",
        verified: true,
      },
      {
        name: "Cann Group CG019 THC Oil (TGA-Approved)",
        category: "extract",
        thcContent: 20,
        cbdContent: 2,
        distributorId: 6,
        priceUsd: 185,
        priceSol: 1.23,
        stock: 340,
        imageUrl: "/products/canngroup.png",
        description: "Australian TGA-approved medicinal cannabis oil manufactured under GMP conditions. 20mg/mL THC in MCT oil. Available via the TGA Therapeutic Goods Register (ARTG) and Special Access Scheme (SAS). Prescribed by Australian registered healthcare practitioners. For chronic non-cancer pain, cancer pain, chemotherapy-induced nausea, and palliative care.",
        effects: "Strong analgesia, antiemetic, sedation, appetite stimulation",
        terpenoids: "Myrcene, Caryophyllene, Humulene",
        verified: true,
      },
    ]);

    await db.insert(prescriptionsTable).values([
      {
        patientId: "PAT-2024-0081",
        doctorId: "DR-James-Mitchell",
        productId: 1,
        dosage: "10mg CBD / 0.5mg THC",
        frequency: "Twice daily (morning and evening)",
        duration: "90 days",
        condition: "Chronic Lower Back Pain",
        notes: "Patient shows good tolerance. Titrate after 4 weeks if pain score above 6.",
        status: "active",
      },
      {
        patientId: "PAT-2024-0127",
        doctorId: "DR-Sarah-Chen",
        productId: 3,
        dosage: "15mg CBD sublingual",
        frequency: "Three times daily",
        duration: "60 days",
        condition: "Generalized Anxiety Disorder",
        notes: "Monitor cortisol levels at week 4. Avoid caffeine during treatment.",
        status: "pending",
      },
      {
        patientId: "PAT-2024-0043",
        doctorId: "DR-Michael-Hoffmann",
        productId: 2,
        dosage: "5mg THC / 2mg CBD",
        frequency: "Once daily at bedtime",
        duration: "30 days",
        condition: "Severe Insomnia",
        notes: "Sleep diary required. Follow-up at 2 weeks.",
        status: "fulfilled",
        txHash: "3mNpK7vR1qT8uW4eL2sA9hG5jB0cF6iD3nX7zY8qABC",
      },
    ]);

    logger.info("Distributors, products, prescriptions seeded globally.");
  }

  if (needsResearchSeed && !needsDistributorSeed) {
    await db.delete(researchTable);
  }

  if (needsResearchSeed) {
    await db.insert(researchTable).values([
      {
        title: "Cannabidiol in Dravet Syndrome - A Randomized, Double-Blind, Placebo-Controlled Trial",
        abstract: "A phase 3 randomized, double-blind, placebo-controlled trial evaluating cannabidiol (Epidiolex) 20mg/kg/day in patients with Dravet syndrome. Published in the New England Journal of Medicine (NEJM) 2017. The study enrolled 120 patients aged 2-18 years across 23 international centers.",
        authorId: "devinsky-et-al-2017",
        status: "published",
        category: "clinical",
        methodology: "Phase 3 RCT, multicenter, 14-week treatment period, seizure frequency as primary endpoint, ANCOVA statistical analysis",
        findings: "Median frequency of convulsive seizures decreased from 12.4 to 5.9 per month in the CBD group vs 14.9 to 14.1 in placebo (p<0.001). 5% of CBD patients became seizure-free vs 0% in placebo. Results led to FDA approval of Epidiolex in June 2018.",
        collaborators: "Orrin Devinsky (NYU Langone), Maria Roberta Cilio (UCSF), Helen Cross (UCL Great Ormond Street), Lieven Lagae (KU Leuven), Ingrid E. Scheffer (University of Melbourne), GW Research Ltd",
        upvotes: 1847,
        publishedAt: new Date("2017-05-25"),
      },
      {
        title: "Sativex for Treatment of Spasticity in Multiple Sclerosis - A Systematic Review and Meta-Analysis",
        abstract: "Systematic review and meta-analysis of 12 randomized controlled trials evaluating nabiximols (Sativex) for spasticity in multiple sclerosis. Data pooled from 1,534 patients across Europe, North America, and Australia. Published in CNS Drugs 2019.",
        authorId: "collin-et-al-2019",
        status: "published",
        category: "systematic-review",
        methodology: "PRISMA-guided systematic review, meta-analysis of RCT data, random-effects model, NRS spasticity score as primary outcome",
        findings: "Significant reduction in NRS spasticity score (mean difference -1.34, 95% CI -1.72 to -0.96, p<0.001) vs placebo. Responder analysis: 30% improvement in spasticity in 50.2% of nabiximols patients vs 33.7% placebo (NNT=6).",
        collaborators: "Cajanus Collin (Walton Centre NHS), Roger Ehler (Karolinska Institutet), Javier Selva-O'Callaghan (Hospital Vall d'Hebron), Marta Martinez-Yelamos (Hospital Bellvitge), GW Pharmaceuticals Research",
        upvotes: 923,
        publishedAt: new Date("2019-03-12"),
      },
      {
        title: "Cannabinoids as Novel Anti-Inflammatory Drugs - Mechanisms and Therapeutic Potential",
        abstract: "Comprehensive review of the immunomodulatory properties of cannabinoids, focusing on their mechanisms of action at CB1, CB2, GPR55, and TRPV1 receptors. Examines evidence from preclinical and clinical studies for conditions including rheumatoid arthritis, inflammatory bowel disease, and neuroinflammation. Published in Future Medicinal Chemistry 2009.",
        authorId: "nagarkatti-et-al-2009",
        status: "published",
        category: "preclinical",
        methodology: "Literature review with mechanistic analysis, in vitro and in vivo preclinical data synthesis, receptor pharmacology characterization",
        findings: "Cannabinoids suppress inflammatory responses via CB2-receptor-mediated inhibition of NF-kB, induction of apoptosis in activated immune cells, and modulation of cytokine production. CBD shown to reduce TNF-a, IL-6, and IFN-y in multiple models.",
        collaborators: "Prakash Nagarkatti (University of South Carolina), Rupal Pandey (Medical University of South Carolina), Sadiye Amcaoglu Rieder (MUSC), Venkatesh Hegde (MUSC)",
        upvotes: 2341,
        publishedAt: new Date("2009-10-01"),
      },
      {
        title: "Medical Cannabis for Chronic Non-Cancer Pain - A Systematic Review of Randomised Trials",
        abstract: "Systematic review of 29 RCTs examining cannabis-based medicines for chronic non-cancer pain in adults. Includes data from 3,029 participants from trials conducted in Canada, USA, UK, Germany, Netherlands, Israel, and Australia. Published in PAIN (official journal of IASP) 2018.",
        authorId: "aviram-samuelly-2017",
        status: "published",
        category: "systematic-review",
        methodology: "Cochrane-style systematic review, GRADE evidence quality assessment, 11-point NRS pain score primary outcome, standardized mean difference calculation",
        findings: "Cannabis-based medicines significantly reduced chronic pain vs placebo (SMD -0.52, 95% CI -0.77 to -0.28). NNT for 30% improvement = 24. Strongest evidence for neuropathic pain (8 high-quality trials).",
        collaborators: "Raphael Mechoulam (Hebrew University of Jerusalem), Roger Pertwee (University of Aberdeen), Vincenzo Di Marzo (CNR Institute of Biomolecular Chemistry), Ethan Russo (International Cannabis and Cannabinoids Institute)",
        upvotes: 1523,
        publishedAt: new Date("2018-04-20"),
      },
      {
        title: "Bedrocan Standardized Cannabis: Pharmacokinetics and Clinical Outcomes in Chronic Pain Patients",
        abstract: "Open-label observational study of 215 chronic pain patients using Bedrocan-supplied standardized pharmaceutical cannabis. Conducted across the Netherlands, Germany, and Czech Republic under official pharmacy dispensing programs. 12-month follow-up. Published in European Journal of Pain 2021.",
        authorId: "bedrocan-nl-2021",
        status: "published",
        category: "clinical",
        methodology: "Prospective observational cohort, 12-month follow-up, pharmacokinetic sampling at baseline and 3 months, BPI pain scale, SF-36 quality of life",
        findings: "Mean pain reduction of 38% at 12 months. THC Cmax 4.2 ng/mL at 15 min post-vaporisation. CBD bioavailability 31% via vaporisation vs 6% oral. 68% of patients reported improved sleep quality.",
        collaborators: "Bedrocan International Research Division, Leiden University Medical Center (LUMC), Charles University Prague, University Hospital Frankfurt",
        upvotes: 891,
        publishedAt: new Date("2021-02-15"),
      },
      {
        title: "Endocannabinoid System and Cancer: CBD and THC Antiproliferative Effects in Glioblastoma",
        abstract: "Preclinical and translational research on cannabinoid-induced apoptosis in glioblastoma multiforme (GBM). Investigates the synergistic effect of CBD:THC 1:1 combination on U87MG and primary patient-derived GBM cell lines. Phase 1b clinical data included. Published in Scientific Reports (Nature) 2020.",
        authorId: "short-et-al-2020",
        status: "published",
        category: "preclinical",
        methodology: "In vitro cell viability assays (MTT), flow cytometry for apoptosis, Western blot for pathway analysis, Phase 1b dose-escalation clinical component",
        findings: "CBD:THC 1:1 combination reduced GBM cell viability by 82% at 10uM concentration. Synergistic interaction confirmed by Chou-Talalay method (CI=0.43). Phase 1b: 3 of 12 patients showed partial response per RANO criteria.",
        collaborators: "Susan Short (University of Leeds), Richard Mairs (University of Glasgow), GW Research Ltd, Oncology Program",
        upvotes: 1204,
        publishedAt: new Date("2020-07-22"),
      },
      {
        title: "Aurora Cannabis Medical Outcomes Study: Real-World Patient Registry Data 2019-2023",
        abstract: "Prospective registry study from Aurora MedsTM patient platform covering 18,432 registered medical cannabis patients across Canada, Germany, and Australia. Examines treatment outcomes by indication, product type, and cannabinoid ratio over 4 years. Largest real-world medical cannabis dataset to date.",
        authorId: "aurora-medical-2023",
        status: "published",
        category: "clinical",
        methodology: "Prospective patient registry, PRO-based outcomes (PROMIS, BPI, GAD-7, ISI), mixed-effects regression models, subgroup analysis by indication and cannabinoid ratio",
        findings: "Significant improvement across all primary outcomes at 12 months. Pain NRS reduced by 2.1 points (43%). GAD-7 anxiety score reduced by 5.3 points. ISI insomnia severity improved by 6.8 points.",
        collaborators: "Aurora Cannabis Medical Affairs Division, University of Alberta Clinical Pharmacology, Charite Berlin Cannabis Research Unit, Monash University Department of Medicine",
        upvotes: 2109,
        publishedAt: new Date("2023-09-30"),
      },
    ]);

    logger.info("Research seeded with global studies.");
  }

  if (needsPrescriptionSeed && !needsDistributorSeed) {
    await db.delete(prescriptionsTable);
    await db.insert(prescriptionsTable).values([
      {
        patientId: "PAT-2024-0081",
        doctorId: "DR-James-Mitchell",
        productId: 1,
        dosage: "10mg CBD / 0.5mg THC",
        frequency: "Twice daily (morning and evening)",
        duration: "90 days",
        condition: "Chronic Lower Back Pain",
        notes: "Patient shows good tolerance. Titrate after 4 weeks if pain score above 6.",
        status: "active",
      },
      {
        patientId: "PAT-2024-0127",
        doctorId: "DR-Sarah-Chen",
        productId: 1,
        dosage: "15mg CBD sublingual",
        frequency: "Three times daily",
        duration: "60 days",
        condition: "Generalized Anxiety Disorder",
        notes: "Monitor cortisol levels at week 4. Avoid caffeine during treatment.",
        status: "pending",
      },
      {
        patientId: "PAT-2024-0043",
        doctorId: "DR-Michael-Hoffmann",
        productId: 1,
        dosage: "5mg THC / 2mg CBD",
        frequency: "Once daily at bedtime",
        duration: "30 days",
        condition: "Severe Insomnia",
        notes: "Sleep diary required. Follow-up at 2 weeks.",
        status: "fulfilled",
        txHash: "3mNpK7vR1qT8uW4eL2sA9hG5jB0cF6iD3nX7zY8qABC",
      },
    ]);
    logger.info("Prescriptions seeded with global doctors.");
  }

  // Add ThaiCannaMed and Malaya Hemp if not present
  const newDistributors = [
    { name: "ThaiCannaMed", location: "Bangkok, Thailand" },
    { name: "Malaya Hemp (CBD Oils Malaya)", location: "London, United Kingdom" },
  ];

  for (const nd of newDistributors) {
    const existing = await db
      .select({ id: distributorsTable.id })
      .from(distributorsTable)
      .where(ilike(distributorsTable.name, nd.name));

    if (existing.length === 0) {
      if (nd.name === "ThaiCannaMed") {
        await db.insert(distributorsTable).values({
          name: "ThaiCannaMed",
          walletAddress: "Th4iCannMedBkPvR7wT2uWeLyJcFbA6sD1hGriQnZmTP",
          location: "Bangkok, Thailand",
          verified: true,
          rating: 4.6,
          licenseNumber: "TH-DTAM-TELEHEALTH-2025-001",
          description: "Thailand's premier DTAM-authorized medical cannabis telemedicine platform, backed by Wonderland Clinic. Issues PT33 prescriptions via licensed Thai doctors and connects patients to certified dispensaries across Bangkok, Phuket, Samui, and Chiang Mai. Operating under Thailand Ministry of Public Health regulatory framework since 2022 decriminalization.",
        });
      } else {
        await db.insert(distributorsTable).values({
          name: "Malaya Hemp (CBD Oils Malaya)",
          walletAddress: "MayaHmpUKPvR5wT8uWeLyJ4cFbA9sD2hGriQnZmTPBkx",
          location: "London, United Kingdom",
          verified: true,
          rating: 4.4,
          licenseNumber: "UK-GMP-FSA-CBD-MALAYA-2024-01",
          description: "Pioneer Malaysian-founded CBD wellness brand operating from the United Kingdom. First Malaysian company to sell cannabis-based products in Europe. Produces 100% THC-free, CO2-extracted CBD oils (800mg-2000mg), capsules, vapes, and skincare in a GMP-compliant UK facility. All products third-party HPLC lab tested and compliant with UK FSA food supplement regulations.",
        });
      }
      logger.info({ name: nd.name }, "New distributor added.");
    }
  }

  logger.info("Global seed complete.");
}
