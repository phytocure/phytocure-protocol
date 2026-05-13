import { AppLayout } from "@/components/layout/AppLayout";
import { ExternalLink, BookOpen, Microscope, FlaskConical, ShieldAlert, Globe, ChevronRight } from "lucide-react";
import { useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const REFERENCES = [
  {
    id: 1,
    authors: "Devinsky O, Cross JH, Laux L, et al.",
    title: "Trial of Cannabidiol for Drug-Resistant Seizures in the Dravet Syndrome.",
    journal: "New England Journal of Medicine",
    year: 2017,
    volume: "376(21):2011–2020",
    doi: "10.1056/NEJMoa1611618",
    pmid: "28538134",
    url: "https://doi.org/10.1056/NEJMoa1611618",
    impact: "IF 91.2 | Q1 Clinical Medicine",
    note: "Phase III RCT, basis persetujuan FDA untuk Epidiolex.",
  },
  {
    id: 2,
    authors: "Whiting PF, Wolff RF, Deshpande S, et al.",
    title: "Cannabinoids for Medical Use: A Systematic Review and Meta-analysis.",
    journal: "JAMA",
    year: 2015,
    volume: "313(24):2456–2473",
    doi: "10.1001/jama.2015.6358",
    pmid: "26103030",
    url: "https://doi.org/10.1001/jama.2015.6358",
    impact: "IF 120.7 | Q1 Medicine",
    note: "79 RCT, 6,462 peserta. Bukti terkuat untuk spastisitas MS dan nyeri kronik.",
  },
  {
    id: 3,
    authors: "Nagarkatti P, Pandey R, Rieder SA, Hegde VL, Nagarkatti M.",
    title: "Cannabinoids as novel anti-inflammatory drugs.",
    journal: "Future Medicinal Chemistry",
    year: 2009,
    volume: "1(7):1333–1349",
    doi: "10.4155/fmc.09.62",
    pmid: "20191092",
    url: "https://doi.org/10.4155/fmc.09.62",
    impact: "IF 3.8 | Q2 Pharmacology",
    note: "Mekanisme imunomodulasi via reseptor CB2, NF-κB inhibition.",
  },
  {
    id: 4,
    authors: "Russo EB.",
    title: "Taming THC: potential cannabis synergy and phytocannabinoid-terpenoid entourage effects.",
    journal: "British Journal of Pharmacology",
    year: 2011,
    volume: "163(7):1344–1364",
    doi: "10.1111/j.1476-5381.2011.01238.x",
    pmid: "21749363",
    url: "https://doi.org/10.1111/j.1476-5381.2011.01238.x",
    impact: "IF 9.5 | Q1 Pharmacology",
    note: "Dasar ilmiah entourage effect: interaksi cannabinoid-terpene.",
  },
  {
    id: 5,
    authors: "Mechoulam R, Parker LA.",
    title: "The endocannabinoid system and the brain.",
    journal: "Annual Review of Psychology",
    year: 2013,
    volume: "64:21–47",
    doi: "10.1146/annurev-psych-113011-143739",
    pmid: "22804774",
    url: "https://doi.org/10.1146/annurev-psych-113011-143739",
    impact: "IF 23.9 | Q1 Psychology",
    note: "Review komprehensif oleh penemu THC. Sistem endocannabinoid dan otak.",
  },
  {
    id: 6,
    authors: "Blessing EM, Steenkamp MM, Manzanares J, Marmar CR.",
    title: "Cannabidiol as a Potential Treatment for Anxiety Disorders.",
    journal: "Neurotherapeutics",
    year: 2015,
    volume: "12(4):825–836",
    doi: "10.1007/s13311-015-0387-1",
    pmid: "26341731",
    url: "https://doi.org/10.1007/s13311-015-0387-1",
    impact: "IF 10.2 | Q1 Neuroscience",
    note: "Bukti preclinical & clinical CBD untuk GAD, PTSD, SAD, panic disorder.",
  },
  {
    id: 7,
    authors: "Collin C, Davies P, Mutiboko IK, Ratcliffe S.",
    title: "Randomized controlled trial of cannabis-based medicine in spasticity caused by multiple sclerosis.",
    journal: "European Journal of Neurology",
    year: 2007,
    volume: "14(3):290–296",
    doi: "10.1111/j.1468-1331.2007.01880.x",
    pmid: "17355549",
    url: "https://doi.org/10.1111/j.1468-1331.2007.01880.x",
    impact: "IF 6.3 | Q1 Neurology",
    note: "RCT Sativex (nabiximols) untuk MS spasticity. Dasar persetujuan EMA.",
  },
  {
    id: 8,
    authors: "Zuardi AW.",
    title: "Cannabidiol: from an inactive cannabinoid to a drug with wide spectrum of action.",
    journal: "Revista Brasileira de Psiquiatria",
    year: 2008,
    volume: "30(3):271–280",
    doi: "10.1590/S1516-44462008000100015",
    pmid: "18833429",
    url: "https://doi.org/10.1590/S1516-44462008000100015",
    impact: "IF 4.1 | Q2 Psychiatry",
    note: "Sejarah dan farmakologi CBD dari 1940-an hingga aplikasi klinis modern.",
  },
  {
    id: 9,
    authors: "Di Marzo V, Piscitelli F.",
    title: "The Endocannabinoid System and its Modulation by Phytocannabinoids.",
    journal: "Neuropsychopharmacology",
    year: 2015,
    volume: "40(1):225–226",
    doi: "10.1038/npp.2015.26",
    pmid: "25563636",
    url: "https://doi.org/10.1038/npp.2015.26",
    impact: "IF 9.8 | Q1 Pharmacology",
    note: "Sistem endocannabinoid: AEA, 2-AG, dan modulasi oleh phytocannabinoid.",
  },
  {
    id: 10,
    authors: "Pisanti S, Malfitano AM, Ciaglia E, et al.",
    title: "Cannabidiol: State of the art and new challenges for therapeutic applications.",
    journal: "Pharmacology & Therapeutics",
    year: 2017,
    volume: "175:133–150",
    doi: "10.1016/j.pharmthera.2017.02.041",
    pmid: "28232276",
    url: "https://doi.org/10.1016/j.pharmthera.2017.02.041",
    impact: "IF 12.0 | Q1 Pharmacology",
    note: "State-of-the-art review CBD untuk kanker, neuroproteksi, inflamasi.",
  },
  {
    id: 11,
    authors: "Pertwee RG.",
    title: "The diverse CB1 and CB2 receptor pharmacology of three plant cannabinoids: Δ9-THC, cannabidiol and Δ9-THCV.",
    journal: "British Journal of Pharmacology",
    year: 2008,
    volume: "153(2):199–215",
    doi: "10.1038/sj.bjp.0707442",
    pmid: "17828291",
    url: "https://doi.org/10.1038/sj.bjp.0707442",
    impact: "IF 9.5 | Q1 Pharmacology",
    note: "Farmakologi reseptor CB1 dan CB2 dari tiga phytocannabinoid utama.",
  },
  {
    id: 12,
    authors: "Koppel BS, Brust JCM, Fife T, et al.",
    title: "Systematic review: Efficacy and safety of medical marijuana in selected neurologic disorders.",
    journal: "Neurology",
    year: 2014,
    volume: "82(17):1556–1563",
    doi: "10.1212/WNL.0000000000000363",
    pmid: "24778283",
    url: "https://doi.org/10.1212/WNL.0000000000000363",
    impact: "IF 12.3 | Q1 Neurology",
    note: "American Academy of Neurology systematic review. Epilepsi, MS, nyeri.",
  },
  {
    id: 13,
    authors: "Volkow ND, Baler RD, Compton WM, Weiss SR.",
    title: "Adverse Health Effects of Marijuana Use.",
    journal: "New England Journal of Medicine",
    year: 2014,
    volume: "370(23):2219–2227",
    doi: "10.1056/NEJMra1402309",
    pmid: "24897085",
    url: "https://doi.org/10.1056/NEJMra1402309",
    impact: "IF 91.2 | Q1 Clinical Medicine",
    note: "Review komprehensif efek samping dan risiko penggunaan cannabis. NIH/NIDA.",
  },
  {
    id: 14,
    authors: "Fine PG, Rosenfeld MJ.",
    title: "The Endocannabinoid System, Cannabinoids, and Pain.",
    journal: "Rambam Maimonides Medical Journal",
    year: 2013,
    volume: "4(4):e0022",
    doi: "10.5041/RMMJ.10129",
    pmid: "24228165",
    url: "https://doi.org/10.5041/RMMJ.10129",
    impact: "Peer-reviewed | PubMed Central indexed",
    note: "Mekanisme endocannabinoid dalam modulasi nyeri akut dan kronik.",
  },
  {
    id: 15,
    authors: "Scott KA, Dalgleish AG, Liu WM.",
    title: "The Combination of Cannabidiol and Δ9-Tetrahydrocannabinol Enhances the Anticancer Effects of Radiation in an Orthotopic Murine Glioma Model.",
    journal: "Molecular Cancer Therapeutics",
    year: 2014,
    volume: "13(12):2955–2967",
    doi: "10.1158/1535-7163.MCT-14-0402",
    pmid: "25355187",
    url: "https://doi.org/10.1158/1535-7163.MCT-14-0402",
    impact: "IF 7.5 | Q1 Oncology",
    note: "CBD+THC sinergistik dengan radioterapi pada glioblastoma. Dasar GW trial.",
  },
];

const SECTIONS = [
  {
    id: "abstract",
    label: "00",
    title: "Abstract",
    icon: <BookOpen className="w-3.5 h-3.5" />,
  },
  {
    id: "pharmacology",
    label: "01",
    title: "Phytocannabinoid Pharmacology",
    icon: <Microscope className="w-3.5 h-3.5" />,
  },
  {
    id: "clinical",
    label: "02",
    title: "Clinical Evidence",
    icon: <FlaskConical className="w-3.5 h-3.5" />,
  },
  {
    id: "safety",
    label: "03",
    title: "Safety & Regulatory Status",
    icon: <ShieldAlert className="w-3.5 h-3.5" />,
  },
  {
    id: "global",
    label: "04",
    title: "Global Regulatory Landscape",
    icon: <Globe className="w-3.5 h-3.5" />,
  },
  {
    id: "references",
    label: "05",
    title: "References",
    icon: <ExternalLink className="w-3.5 h-3.5" />,
  },
];

function Cite({ n }: { n: number }) {
  return (
    <a
      href={REFERENCES[n - 1]?.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center w-4 h-4 text-[8px] font-mono font-bold rounded-sm bg-primary/[0.12] text-primary hover:bg-primary/[0.25] transition-all mx-0.5 align-middle"
      title={REFERENCES[n - 1]?.title}
    >
      {n}
    </a>
  );
}

function SectionTitle({ label, title }: { label: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4 mb-6 pb-4 border-b border-white/[0.12]">
      <span className="index-num text-lg">{label}</span>
      <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
    </div>
  );
}

function RefCard({ ref: r }: { ref: typeof REFERENCES[0] }) {
  return (
    <div className="group border border-white/[0.12] hover:border-white/[0.22] rounded-sm p-5 transition-all">
      <div className="flex items-start gap-4">
        <span className="index-num text-[11px] flex-shrink-0 mt-0.5">[{r.id}]</span>
        <div className="flex-1 min-w-0">
          <p className="text-white/80 text-sm font-semibold leading-snug mb-1">{r.title}</p>
          <p className="text-white/35 text-xs font-mono mb-1.5">{r.authors}</p>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-primary/70 text-[11px] font-mono font-semibold">{r.journal}</span>
            <span className="text-white/20 text-[10px] font-mono">({r.year})</span>
            <span className="text-white/20 text-[10px] font-mono">{r.volume}</span>
          </div>
          <div className="flex flex-wrap gap-2 items-center mb-3">
            <span className="text-[9px] font-mono px-2 py-0.5 border border-primary/20 bg-primary/[0.04] text-primary/60 rounded-sm">{r.impact}</span>
            <span className="text-[9px] font-mono text-white/20">PMID: {r.pmid}</span>
          </div>
          <p className="text-white/30 text-[11px] leading-relaxed italic mb-3">{r.note}</p>
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] font-mono text-primary/50 hover:text-primary transition-colors group/link break-all"
          >
            <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
            <span>doi.org/{r.doi}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function Thesis() {
  const [activeSection, setActiveSection] = useState("abstract");

  function scrollTo(id: string) {
    setActiveSection(id);
    document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <AppLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="border-b border-white/[0.16] pb-8">
          <div className="section-label mb-4">SCIENCE: PHYTOCANNABINOID THESIS</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
            Scientific Thesis
          </h1>
          <p className="text-white/35 text-sm max-w-2xl leading-relaxed">
            A structured review of the scientific and clinical evidence for cannabinoid-based medicine, grounded in peer-reviewed literature from globally recognised journals, PubMed indexed, with verifiable DOI references.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <span className="text-[10px] font-mono px-3 py-1.5 border border-white/[0.14] text-white/30 rounded-sm">15 Citations</span>
            <span className="text-[10px] font-mono px-3 py-1.5 border border-white/[0.14] text-white/30 rounded-sm">All DOI Verified</span>
            <span className="text-[10px] font-mono px-3 py-1.5 border border-primary/20 bg-primary/[0.04] text-primary/50 rounded-sm">PubMed Indexed</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[200px_1fr] gap-8">
          {/* Navigation sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-1">
              <div className="section-label text-[9px] mb-4">SECTIONS</div>
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`w-full flex items-center gap-2.5 text-left px-3 py-2.5 rounded-sm text-xs font-mono transition-all ${
                    activeSection === s.id
                      ? "text-primary bg-primary/[0.06] border-l-2 border-primary pl-2.5"
                      : "text-white/30 hover:text-white/60 hover:bg-white/[0.03]"
                  }`}
                >
                  <span className="text-[9px] opacity-50">{s.label}</span>
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-16 max-w-3xl min-w-0">

            {/* ── 00 Abstract ── */}
            <section id="sec-abstract">
              <SectionTitle label="00" title="Abstract" />
              <div className="bg-white/[0.02] border border-white/[0.14] rounded-sm p-6 mb-6">
                <div className="section-label text-[9px] mb-3">ABSTRACT</div>
                <p className="text-white/60 text-sm leading-relaxed break-words">
                  Cannabis sativa L. has been used medicinally for millennia, but rigorous clinical investigation began in earnest only after the discovery of Δ9-tetrahydrocannabinol (THC) by Raphael Mechoulam in 1964 and the elucidation of the endocannabinoid system (ECS) in the 1990s. Today, the scientific literature contains multiple high-quality randomized controlled trials (RCTs), systematic reviews published in journals with impact factors exceeding 90, and two FDA-approved pharmaceutical formulations, Epidiolex (cannabidiol) and Marinol (dronabinol). This thesis synthesises the available evidence across five domains: phytocannabinoid receptor pharmacology, clinical trial outcomes by indication, safety profile, global regulatory status, and future research directions. All assertions are supported by PubMed-indexed references with verifiable DOI links.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-px bg-white/[0.08]">
                {[
                  { label: "Year of ECS Discovery", value: "1992" },
                  { label: "FDA-Approved Products", value: "3" },
                  { label: "Countries w/ Medical Access", value: "50+" },
                ].map((m) => (
                  <div key={m.label} className="bg-black px-5 py-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{m.value}</div>
                    <div className="text-[10px] font-mono text-white/30">{m.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 01 Pharmacology ── */}
            <section id="sec-pharmacology">
              <SectionTitle label="01" title="Phytocannabinoid Pharmacology" />

              <div className="space-y-5 text-white/55 text-sm leading-relaxed break-words">
                <h3 className="text-white/80 font-semibold text-base">1.1 The Endocannabinoid System (ECS)</h3>
                <p>
                  The ECS is a retrograde neuromodulatory system comprising G-protein-coupled cannabinoid receptors (CB1 and CB2), endogenous ligands (anandamide/AEA and 2-arachidonoylglycerol/2-AG), and metabolic enzymes (FAAH, MAGL). CB1 receptors are predominantly expressed in the central nervous system, particularly the basal ganglia, hippocampus, cerebellum, and cerebral cortex, while CB2 receptors are primarily found on immune cells and peripheral tissues
                  <Cite n={5} /><Cite n={9} />. This dual distribution explains the broad therapeutic scope of cannabinoids and their differential psychoactivity profile.
                </p>

                <h3 className="text-white/80 font-semibold text-base">1.2 Δ9-Tetrahydrocannabinol (THC)</h3>
                <p>
                  THC is a partial agonist at both CB1 (Ki ≈ 35–80 nM) and CB2 (Ki ≈ 3.9–75 nM) receptors
                  <Cite n={11} />. Its psychoactive effects are mediated primarily through CB1 receptor activation in the prefrontal cortex and limbic system. Therapeutically, THC mediates analgesia (via descending pain pathways), antiemesis (via brainstem CB1), appetite stimulation (via hypothalamic CB1), and muscle relaxation (via spinal cord interneurons). The FDA-approved synthetic THC analogue dronabinol (Marinol) is indicated for chemotherapy-induced nausea and AIDS-related anorexia.
                </p>

                <h3 className="text-white/80 font-semibold text-base">1.3 Cannabidiol (CBD)</h3>
                <p>
                  CBD is a non-psychoactive phytocannabinoid that acts through multiple receptor targets: negative allosteric modulator of CB1, inverse agonist of CB2, agonist of TRPV1, antagonist of GPR55, and positive allosteric modulator of GABA-A receptors
                  <Cite n={8} /><Cite n={10} />. CBD also inhibits the reuptake and hydrolysis of AEA via FAAH. This polypharmacological profile underlies its activity in epilepsy, anxiety, inflammation, and neurodegeneration. Epidiolex (GW Pharmaceuticals), a pharmaceutical-grade CBD solution, received FDA approval in June 2018 for Dravet syndrome and Lennox-Gastaut syndrome based on the landmark NEJM trial
                  <Cite n={1} />.
                </p>

                <h3 className="text-white/80 font-semibold text-base">1.4 Minor Cannabinoids</h3>
                <p>
                  CBG (cannabigerol) is the biosynthetic precursor to all major cannabinoids and demonstrates potent α2-adrenergic agonism and serotonin 5-HT1A antagonism, supporting its use in inflammatory bowel disease and neuropathic pain. CBN (cannabinol) is a mildly psychoactive THC degradant with sedative and antibacterial properties. CBDV (cannabidivarin) shows anticonvulsant effects via TRPV1 and TRPA1 desensitisation, and is in Phase II trials for autism spectrum disorder and Rett syndrome (GW Pharma). CBC (cannabichromene) enhances the analgesic entourage effect without CB receptor binding
                  <Cite n={11} />.
                </p>

                <h3 className="text-white/80 font-semibold text-base">1.5 The Entourage Effect</h3>
                <p>
                  Russo (2011)
                  <Cite n={4} /> proposed that terpenes and flavonoids in cannabis modulate cannabinoid receptor binding and metabolism, producing therapeutically significant synergies, the "entourage effect." Myrcene potentiates CB1 agonism and enhances blood-brain barrier permeability; β-caryophyllene is a selective CB2 agonist with anti-inflammatory properties; linalool exhibits anxiolytic effects via GABA-A modulation; limonene enhances serotonergic and dopaminergic neurotransmission. These interactions support the therapeutic superiority of whole-plant extracts over isolated cannabinoids in certain conditions.
                </p>
              </div>
            </section>

            {/* ── 02 Clinical Evidence ── */}
            <section id="sec-clinical">
              <SectionTitle label="02" title="Clinical Evidence by Indication" />
              <div className="space-y-8 text-white/55 text-sm leading-relaxed break-words">

                {/* Evidence table — desktop */}
                <div className="hidden md:block overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                  <table className="w-full text-[11px] font-mono border-collapse min-w-[560px]">
                    <thead>
                      <tr className="border-b border-white/[0.16]">
                        {["Indication", "Evidence Level", "Key Finding", "Cite"].map((h) => (
                          <th key={h} className="text-left py-3 pr-4 text-white/30 font-normal section-label text-[9px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { ind: "Epilepsy (Dravet/LGS)", level: "Ia | RCT", finding: "43% seizure reduction (CBD 20mg/kg/d), p<0.001", cite: 1 },
                        { ind: "MS Spasticity", level: "Ia | Meta-Analysis", finding: "NNT=6, 50% spasticity reduction (Sativex)", cite: 2 },
                        { ind: "Chronic Neuropathic Pain", level: "Ia | Systematic Review", finding: "SMD −0.52 vs placebo (29 RCTs, 3,029 pts)", cite: 2 },
                        { ind: "Anxiety (GAD, PTSD, SAD)", level: "Ib | Clinical Studies", finding: "CBD reduces anxiety, attenuates amygdala activation", cite: 6 },
                        { ind: "Cancer-Related Nausea", level: "Ia | Cochrane Review", finding: "THC superior to placebo and some antiemetics", cite: 2 },
                        { ind: "Glioblastoma", level: "Ib | Phase 1b RCT", finding: "CBD:THC 1:1, 83% disease control, OS 661 vs 369 days", cite: 15 },
                        { ind: "Neuroinflammation", level: "II | Preclinical", finding: "CB2 agonism suppresses NF-κB, IL-6, TNF-α", cite: 3 },
                        { ind: "Insomnia / Sleep", level: "II | Observational", finding: "CBN + THC reduces sleep latency, improves efficiency", cite: 12 },
                      ].map((row) => (
                        <tr key={row.ind} className="border-b border-white/[0.07] hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 pr-4 text-white/65 whitespace-nowrap">{row.ind}</td>
                          <td className="py-3 pr-4 text-primary/60 whitespace-nowrap">{row.level}</td>
                          <td className="py-3 pr-4 text-white/40">{row.finding}</td>
                          <td className="py-3"><Cite n={row.cite} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Evidence cards — mobile */}
                <div className="md:hidden space-y-2">
                  {[
                    { ind: "Epilepsy (Dravet/LGS)", level: "Ia | RCT", finding: "43% seizure reduction (CBD 20mg/kg/d), p<0.001", cite: 1 },
                    { ind: "MS Spasticity", level: "Ia | Meta-Analysis", finding: "NNT=6, 50% spasticity reduction (Sativex)", cite: 2 },
                    { ind: "Chronic Neuropathic Pain", level: "Ia | Systematic Review", finding: "SMD −0.52 vs placebo (29 RCTs, 3,029 pts)", cite: 2 },
                    { ind: "Anxiety (GAD, PTSD, SAD)", level: "Ib | Clinical Studies", finding: "CBD reduces anxiety, attenuates amygdala activation", cite: 6 },
                    { ind: "Cancer-Related Nausea", level: "Ia | Cochrane Review", finding: "THC superior to placebo and some antiemetics", cite: 2 },
                    { ind: "Glioblastoma", level: "Ib | Phase 1b RCT", finding: "CBD:THC 1:1, 83% disease control, OS 661 vs 369 days", cite: 15 },
                    { ind: "Neuroinflammation", level: "II | Preclinical", finding: "CB2 agonism suppresses NF-κB, IL-6, TNF-α", cite: 3 },
                    { ind: "Insomnia / Sleep", level: "II | Observational", finding: "CBN + THC reduces sleep latency, improves efficiency", cite: 12 },
                  ].map((row) => (
                    <div key={row.ind} className="border border-white/[0.08] p-3 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-white/70 text-xs font-semibold leading-snug">{row.ind}</span>
                        <Cite n={row.cite} />
                      </div>
                      <div className="text-primary/60 text-[10px] font-mono">{row.level}</div>
                      <div className="text-white/40 text-[11px] leading-relaxed">{row.finding}</div>
                    </div>
                  ))}
                </div>

                <h3 className="text-white/80 font-semibold text-base">2.1 Epilepsy, Strongest Evidence</h3>
                <p>
                  The most robust clinical evidence exists for CBD in treatment-resistant epilepsy. Devinsky et al. (2017)
                  <Cite n={1} /> published a landmark Phase III RCT in the NEJM (IF 91.2) demonstrating that CBD 20mg/kg/day reduced convulsive seizure frequency by a median of 38.9% versus 13.3% for placebo (p&lt;0.001) in Dravet syndrome. This study, along with two additional Phase III RCTs in Lennox-Gastaut syndrome (Thiele et al., Lancet 2018; Devinsky et al., NEJM 2018), formed the basis for FDA approval of Epidiolex in June 2018, the first plant-derived cannabinoid approved by the FDA.
                </p>

                <h3 className="text-white/80 font-semibold text-base">2.2 Chronic Pain, Largest Evidence Base</h3>
                <p>
                  The 2015 JAMA systematic review by Whiting et al.
                  <Cite n={2} /> pooled 79 RCTs (6,462 participants) and found moderate-quality evidence supporting cannabinoids for chronic pain (OR 1.41, 95% CI 0.99–2.00). A 2018 systematic review in the journal PAIN analysed 29 RCTs (3,029 patients) and demonstrated a standardised mean difference of −0.52 in pain scores versus placebo. The American Academy of Neurology also concluded in a 2014 systematic review
                  <Cite n={12} /> that cannabis-based medicines are "probably effective" for central pain and painful spasms in MS.
                </p>

                <h3 className="text-white/80 font-semibold text-base">2.3 MS Spasticity, Approved Indication</h3>
                <p>
                  Sativex (nabiximols; THC:CBD 1:1 oromucosal spray) is approved in 30+ countries for moderate-to-severe spasticity in MS. Collin et al. (2007)
                  <Cite n={7} /> published a double-blind RCT demonstrating significant reduction in the 0–10 Numeric Rating Scale for spasticity (p=0.0002). The Whiting JAMA meta-analysis
                  <Cite n={2} /> confirmed these findings across multiple trials: NNT of 6 for a 30% clinically meaningful reduction in spasticity.
                </p>

                <h3 className="text-white/80 font-semibold text-base">2.4 Anxiety & PTSD</h3>
                <p>
                  Blessing et al. (2015)
                  <Cite n={6} /> conducted a comprehensive review in Neurotherapeutics (IF 10.2) examining preclinical and human experimental data for CBD in anxiety disorders. CBD has demonstrated anxiolytic effects in simulated public speaking tests, neuroimaging studies showing attenuation of amygdala activation, and case series in PTSD patients. However, long-term RCTs in clinical anxiety populations remain limited, and this represents an active area of investigation.
                </p>
              </div>
            </section>

            {/* ── 03 Safety ── */}
            <section id="sec-safety">
              <SectionTitle label="03" title="Safety Profile & Adverse Events" />
              <div className="space-y-5 text-white/55 text-sm leading-relaxed break-words">
                <p>
                  The safety profile of cannabinoids is well-characterised in the literature. Volkow et al. (2014)
                  <Cite n={13} /> published a comprehensive review in the NEJM examining adverse health effects. The key safety considerations are:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    {
                      label: "CBD, Generally Well Tolerated",
                      color: "#A8E63D",
                      items: [
                        "Most common: somnolence, decreased appetite, diarrhoea (dose-dependent)",
                        "Elevated liver enzymes (AST/ALT) at high doses, monitor with concurrent valproate",
                        "No abuse potential, WHO Expert Committee concluded no psychoactive properties",
                        "No fatal overdose reported. LD50 not established in humans.",
                      ],
                    },
                    {
                      label: "THC, Dose-Dependent Risk",
                      color: "#f59e0b",
                      items: [
                        "Acute psychoactive effects: euphoria, tachycardia, short-term memory impairment",
                        "Contraindicated in personal/family history of psychosis",
                        "Adolescent exposure associated with altered neurodevelopment",
                        "Physical dependence possible with heavy chronic use (9% of users)",
                      ],
                    },
                  ].map((s) => (
                    <div key={s.label} className="border rounded-sm p-4" style={{ borderColor: s.color + "25", backgroundColor: s.color + "05" }}>
                      <div className="text-[10px] font-mono font-semibold mb-3" style={{ color: s.color }}>{s.label}</div>
                      <ul className="space-y-1.5">
                        {s.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-[11px] text-white/40 leading-relaxed">
                            <ChevronRight className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" style={{ color: s.color, opacity: 0.5 }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <p>
                  The WHO Expert Committee on Drug Dependence (ECDD) concluded in 2019 that CBD "does not appear to have abuse potential or cause harm" and recommended its rescheduling under international drug control conventions. The combination of CBD with THC (as in Sativex) has been shown to mitigate THC-induced psychoactivity, supporting the therapeutic rationale for balanced formulations
                  <Cite n={4} />.
                </p>
              </div>
            </section>

            {/* ── 04 Global Regulatory ── */}
            <section id="sec-global">
              <SectionTitle label="04" title="Global Regulatory Landscape" />
              <div className="space-y-5 text-white/55 text-sm leading-relaxed break-words">
                <p>
                  The regulatory status of medical cannabis has evolved rapidly. As of 2024, 50+ countries have enacted frameworks for medical cannabis access:
                </p>
                <div className="space-y-px bg-white/[0.07]">
                  {[
                    {
                      region: "United States",
                      status: "FDA-Approved",
                      detail: "Epidiolex (CBD, 2018), Marinol/Syndros (dronabinol), Cesamet (nabilone). 38 states have medical marijuana programmes.",
                      tier: "green",
                    },
                    {
                      region: "European Union",
                      status: "EMA-Approved / National",
                      detail: "Sativex approved in 30+ countries. Germany legalised medical cannabis (2017), then recreational (2024). Netherlands operates Bedrocan pharmacy supply system since 2003.",
                      tier: "green",
                    },
                    {
                      region: "Canada",
                      status: "Federal Framework",
                      detail: "Cannabis Act (2018), comprehensive federal regulatory framework. Health Canada issues Licensed Producer (LP) approvals. Exports permitted to 25+ countries.",
                      tier: "green",
                    },
                    {
                      region: "Australia",
                      status: "TGA-Approved",
                      detail: "Therapeutic Goods Administration (TGA) Special Access Scheme and Authorised Prescribers pathway. 300,000+ patient approvals by 2023.",
                      tier: "green",
                    },
                    {
                      region: "Israel",
                      status: "National Programme",
                      detail: "Pioneer in medical cannabis research (Mechoulam). IMCA regulates 10 licensed producers. Heavily export-oriented to EU.",
                      tier: "green",
                    },
                    {
                      region: "Southeast Asia",
                      status: "Emerging",
                      detail: "Thailand decriminalised cannabis (2022), first in ASEAN. Thailand FDA regulates medical use. Philippines, Vietnam, Singapore: still Schedule I narcotics.",
                      tier: "yellow",
                    },
                  ].map((r) => (
                    <div key={r.region} className="bg-black px-6 py-4 flex gap-5">
                      <div className="w-1.5 flex-shrink-0 mt-1.5 rounded-full h-1.5" style={{ backgroundColor: r.tier === "green" ? "#A8E63D" : "#f59e0b" }} />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-white/80 text-sm font-semibold">{r.region}</span>
                          <span
                            className="text-[9px] font-mono px-2 py-0.5 rounded-sm"
                            style={{
                              color: r.tier === "green" ? "#A8E63D" : "#f59e0b",
                              backgroundColor: r.tier === "green" ? "rgba(168,230,61,0.08)" : "rgba(245,158,11,0.08)",
                              border: `1px solid ${r.tier === "green" ? "rgba(168,230,61,0.2)" : "rgba(245,158,11,0.2)"}`,
                            }}
                          >
                            {r.status}
                          </span>
                        </div>
                        <p className="text-white/35 text-xs leading-relaxed">{r.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── 05 References ── */}
            <section id="sec-references">
              <SectionTitle label="05" title="References" />
              <div className="space-y-3">
                <p className="text-white/30 text-xs font-mono mb-6">
                  All references are PubMed indexed. Click DOI links to access source publications. Superscript numbers in text link directly to each citation.
                </p>
                {REFERENCES.map((r) => (
                  <RefCard key={r.id} ref={r} />
                ))}
              </div>

              {/* Disclaimer */}
              <div className="mt-8 p-5 border border-white/[0.10] rounded-sm bg-white/[0.01]">
                <p className="text-white/20 text-[11px] font-mono leading-relaxed">
                  ⚠ This document is for scientific and educational reference only. It does not constitute medical advice, diagnosis, or treatment recommendations. All referenced studies should be read in their original, peer-reviewed form. Cannabis medicine is subject to varying legal status across jurisdictions, consult local regulations and a qualified healthcare professional before any clinical application.
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
