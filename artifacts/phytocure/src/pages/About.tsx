import { AppLayout } from "@/components/layout/AppLayout";
import { Leaf, FlaskConical, Globe, ShieldCheck, Cpu, Users, ArrowUpRight, Github } from "lucide-react";
import { Link } from "wouter";

const pillars = [
  {
    index: "01",
    icon: <FlaskConical className="w-5 h-5 text-primary" />,
    label: "CLINICAL SCIENCE",
    title: "Evidence-Based Medicine",
    body: "Every formulation on Phytocure is derived from peer-reviewed phytopharmacological research. Cannabinoid profiles, terpene ratios, and therapeutic indices are clinically validated, not anecdotal.",
  },
  {
    index: "02",
    icon: <Globe className="w-5 h-5 text-primary" />,
    label: "DESCI",
    title: "Decentralized Science",
    body: "We apply DeSci principles to cannabis medicine: open-access research, transparent peer review, tokenized funding via PYCURE, and immutable provenance on the Solana blockchain. Science belongs to everyone.",
  },
  {
    index: "03",
    icon: <Cpu className="w-5 h-5 text-primary" />,
    label: "AI ENGINE",
    title: "Neural Strain Intelligence",
    body: "PhytoMind, our AI research assistant, synthesizes thousands of clinical data points to provide personalized strain analysis, dosage protocols, risk assessments, and therapeutic profiling in real time.",
  },
  {
    index: "04",
    icon: <ShieldCheck className="w-5 h-5 text-primary" />,
    label: "VERIFIED NETWORK",
    title: "Trusted Distributor Chain",
    body: "Only licensed, credentialed distributors may list on Phytocure. Each partner is verified against national medical cannabis registries. Patients receive pharmaceutical-grade products with traceable supply chains.",
  },
];

const roadmap = [
  { phase: "Phase I", label: "Platform Foundation", status: "LIVE", items: ["Clinical product catalog", "Research Hub with DeSci publishing", "AI strain analysis engine", "Distributor network"] },
  { phase: "Phase II", label: "Blockchain Integration", status: "IN DEV", items: ["Solana wallet payments (SOL + PYCURE)", "On-chain prescription records", "NFT research credentials", "DAO governance"] },
  { phase: "Phase III", label: "Global Expansion", status: "PLANNED", items: ["Multi-jurisdiction compliance layer", "Telemedicine integration", "Clinical trial coordination", "PYCURE token launch"] },
];

const stats = [
  { value: "47+", label: "Clinical Formulations" },
  { value: "12", label: "Verified Distributors" },
  { value: "320+", label: "Research Papers" },
  { value: "99.9%", label: "Uptime SLA" },
];

function PhaseStatus({ status }: { status: string }) {
  if (status === "LIVE")
    return <span className="text-[9px] font-mono border border-emerald-500/30 text-emerald-500/70 px-2 py-0.5 rounded-sm">{status}</span>;
  if (status === "IN DEV")
    return <span className="text-[9px] font-mono border border-amber-500/30 text-amber-500/70 px-2 py-0.5 rounded-sm">{status}</span>;
  return <span className="text-[9px] font-mono border border-white/[0.20] text-white/25 px-2 py-0.5 rounded-sm">{status}</span>;
}

export default function About() {
  return (
    <AppLayout>
      <div className="space-y-24">

        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-12 items-center border-b border-white/[0.16] pb-20">
          <div>
            <div className="section-label mb-6">ABOUT: PHYTOCURE</div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.05] mb-6">
              The Future of<br />
              <span className="text-primary">Cannabis Medicine</span><br />
              is Decentralized.
            </h1>
            <p className="text-white/40 text-lg leading-relaxed mb-8 max-w-md">
              Phytocure is a DeSci platform connecting patients, clinicians, and researchers through verifiable cannabis medicine, powered by open science, AI intelligence, and blockchain provenance.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/research">
                <span className="inline-flex items-center gap-2 text-sm bg-primary text-black font-semibold px-5 py-2.5 rounded cursor-pointer hover:bg-primary/90 transition-all">
                  Explore Research <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm border border-white/[0.20] text-white/60 px-5 py-2.5 rounded hover:border-white/20 hover:text-white/80 transition-all"
              >
                <Github className="w-3.5 h-3.5" /> GitHub
              </a>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-[80px]" />
            <img
              src="/phytomind-hero.png"
              alt="PhytoMind AI visualization"
              className="relative w-full max-w-sm mx-auto object-contain drop-shadow-2xl"
            />
          </div>
        </section>

        {/* Stats bar */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.07]">
          {stats.map((s) => (
            <div key={s.label} className="bg-black px-8 py-8 text-center">
              <div className="text-4xl font-bold font-mono text-primary mb-2">{s.value}</div>
              <div className="section-label text-[10px]">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Vision & Mission */}
        <section className="grid md:grid-cols-2 gap-px bg-white/[0.07]">
          <div className="bg-black p-12">
            <div className="section-label mb-4">VISION</div>
            <h2 className="text-3xl font-bold text-white mb-5 leading-snug">
              A world where plant medicine is accessible, verifiable, and scientifically sovereign.
            </h2>
            <p className="text-white/35 leading-relaxed">
              We envision a global healthcare ecosystem where cannabis therapeutics are no longer stigmatized or gatekept, but prescribed with the same clinical rigor as conventional medicine, backed by immutable research and transparent supply chains.
            </p>
          </div>
          <div className="bg-black p-12 border-l border-white/[0.12] md:border-l">
            <div className="section-label mb-4">MISSION</div>
            <h2 className="text-3xl font-bold text-white mb-5 leading-snug">
              Build the infrastructure layer for decentralized cannabis medicine.
            </h2>
            <p className="text-white/35 leading-relaxed">
              Phytocure provides the clinical tools, research infrastructure, AI intelligence, and blockchain rails for a new generation of phytomedicine, open, composable, and patient-first. We remove gatekeepers while preserving scientific integrity.
            </p>
          </div>
        </section>

        {/* Pillars */}
        <section>
          <div className="mb-10">
            <div className="section-label mb-3">CORE PILLARS</div>
            <h2 className="text-3xl font-bold text-white">What makes Phytocure different</h2>
          </div>
          <div className="space-y-px bg-white/[0.07]">
            {pillars.map((p) => (
              <div key={p.index} className="bg-black p-8 flex flex-col md:flex-row gap-6">
                <div className="flex items-start gap-5 flex-1">
                  <span className="index-num w-10 flex-shrink-0 mt-0.5">{p.index}</span>
                  <div className="w-10 h-10 flex-shrink-0 border border-white/[0.18] rounded-sm flex items-center justify-center mt-0.5">
                    {p.icon}
                  </div>
                  <div>
                    <div className="section-label text-[9px] mb-2">{p.label}</div>
                    <h3 className="text-white font-semibold text-lg mb-3">{p.title}</h3>
                    <p className="text-white/35 text-sm leading-relaxed max-w-xl">{p.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section>
          <div className="mb-10">
            <div className="section-label mb-3">ROADMAP</div>
            <h2 className="text-3xl font-bold text-white">Building in phases</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-white/[0.07]">
            {roadmap.map((r) => (
              <div key={r.phase} className="bg-black p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono text-white/20">{r.phase}</span>
                  <PhaseStatus status={r.status} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-5">{r.label}</h3>
                <ul className="space-y-2.5">
                  {r.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Leaf className="w-3 h-3 text-primary/50 flex-shrink-0 mt-1" />
                      <span className="text-white/35 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="border border-white/[0.16] p-12 md:p-16">
          <div className="section-label mb-6">OUR VALUES</div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "Open Science First", body: "All research published on Phytocure is open-access, citable, and forever immutable on-chain. No paywalls. No gatekeeping." },
              { title: "Patient Sovereignty", body: "Patients own their prescription data, their health records, and their therapeutic choices. We build tools, not dependencies." },
              { title: "Rigorous by Design", body: "Clinical standards guide every product listing. No unverified claims, no pseudoscience. Evidence leads, narrative follows." },
            ].map((v, i) => (
              <div key={v.title}>
                <span className="index-num text-sm">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-white font-semibold text-lg mt-4 mb-3">{v.title}</h3>
                <p className="text-white/30 text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team / CTA */}
        <section className="text-center py-8">
          <Users className="w-8 h-8 text-white/10 mx-auto mb-5" />
          <div className="section-label mb-4">OPEN COLLECTIVE</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
            Built by researchers, engineers,<br />and patients.
          </h2>
          <p className="text-white/30 max-w-md mx-auto mb-8 text-sm leading-relaxed">
            Phytocure is an open-source initiative. Contributions, peer review, and clinical collaboration are always welcome.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/research">
              <span className="inline-flex items-center gap-2 text-sm bg-primary text-black font-semibold px-6 py-3 rounded cursor-pointer hover:bg-primary/90 transition-all">
                View Research Hub <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>
            <Link href="/products">
              <span className="inline-flex items-center gap-2 text-sm border border-white/[0.20] text-white/60 px-6 py-3 rounded hover:border-white/20 hover:text-white/80 transition-all cursor-pointer">
                Browse Products
              </span>
            </Link>
          </div>
        </section>

      </div>
    </AppLayout>
  );
}
