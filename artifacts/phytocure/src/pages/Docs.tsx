import { AppLayout } from "@/components/layout/AppLayout";
import { Link } from "wouter";
import {
  BookOpen, Wallet, LayoutDashboard, Package, Building2,
  FileText, FlaskConical, Cpu, ArrowUpRight, ChevronRight,
  ShieldCheck, Coins, Globe, Zap, Lock, TestTube, BarChart3,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "overview", label: "Overview", icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: "getting-started", label: "Getting Started", icon: <Wallet className="w-3.5 h-3.5" /> },
  { id: "dashboard", label: "Platform Dashboard", icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
  { id: "products", label: "Products", icon: <Package className="w-3.5 h-3.5" /> },
  { id: "distributors", label: "Distributors", icon: <Building2 className="w-3.5 h-3.5" /> },
  { id: "prescriptions", label: "Prescriptions", icon: <FileText className="w-3.5 h-3.5" /> },
  { id: "research", label: "Research Hub", icon: <FlaskConical className="w-3.5 h-3.5" /> },
  { id: "ai", label: "Neural Engine (AI)", icon: <Cpu className="w-3.5 h-3.5" /> },
  { id: "transactions", label: "Transactions", icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { id: "laboratory", label: "Laboratory", icon: <TestTube className="w-3.5 h-3.5" /> },
  { id: "token", label: "$PYCURE Token", icon: <Coins className="w-3.5 h-3.5" /> },
  { id: "security", label: "Security & Compliance", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  { id: "publications", label: "Publications", icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: "faq", label: "FAQ", icon: <Zap className="w-3.5 h-3.5" /> },
];

function Tag({ children, color = "default" }: { children: string; color?: "green" | "amber" | "blue" | "default" }) {
  const colors = {
    green: "border-emerald-500/30 text-emerald-400/80 bg-emerald-500/[0.06]",
    amber: "border-amber-500/30 text-amber-400/80 bg-amber-500/[0.06]",
    blue: "border-blue-500/30 text-blue-400/80 bg-blue-500/[0.06]",
    default: "border-white/[0.18] text-white/40 bg-white/[0.04]",
  };
  return (
    <span className={cn("text-[9px] font-mono border px-2 py-0.5 rounded-sm tracking-widest", colors[color])}>
      {children}
    </span>
  );
}

function Section({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 pb-16 border-b border-white/[0.08] last:border-0">
      <div className="section-label mb-3">{label}</div>
      {children}
    </section>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-white/[0.04] border border-white/[0.10] rounded text-xs font-mono text-primary/70 px-5 py-4 overflow-x-auto leading-relaxed">
      {children}
    </pre>
  );
}

function StepRow({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="flex gap-5 py-5 border-b border-white/[0.07] last:border-0">
      <span className="index-num w-8 flex-shrink-0 mt-0.5">{num}</span>
      <div>
        <div className="text-white font-medium text-sm mb-1">{title}</div>
        <div className="text-white/35 text-sm leading-relaxed">{body}</div>
      </div>
    </div>
  );
}

function FeatureRow({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex gap-4 py-5 border-b border-white/[0.07] last:border-0 items-start">
      <div className="w-8 h-8 flex-shrink-0 border border-white/[0.15] rounded-sm flex items-center justify-center text-primary mt-0.5">
        {icon}
      </div>
      <div>
        <div className="text-white font-medium text-sm mb-1">{title}</div>
        <div className="text-white/35 text-sm leading-relaxed">{body}</div>
      </div>
    </div>
  );
}

export default function Docs() {
  const [activeSection, setActiveSection] = useState("overview");

  function scrollTo(id: string) {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <AppLayout>
      <div className="section-label mb-4">DOCS: PHYTOCURE PLATFORM</div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
        Documentation
      </h1>
      <p className="text-white/35 text-base mb-12 max-w-xl leading-relaxed">
        Complete reference for the Phytocure DeSci cannabis medicine platform — features, workflows, token mechanics, and compliance.
      </p>

      <div className="flex flex-col lg:flex-row gap-10">

        {/* Sidebar TOC */}
        <aside className="lg:w-52 flex-shrink-0">
          <div className="lg:sticky lg:top-24 space-y-0.5">
            <div className="text-[9px] font-mono text-white/20 tracking-widest mb-3 px-2">CONTENTS</div>
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-2 py-2 rounded text-left text-xs transition-colors",
                  activeSection === s.id
                    ? "text-primary bg-primary/[0.08]"
                    : "text-white/35 hover:text-white/70 hover:bg-white/[0.04]"
                )}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 space-y-0">

          {/* OVERVIEW */}
          <Section id="overview" label="OVERVIEW">
            <h2 className="text-3xl font-bold text-white mb-5 leading-snug">
              What is Phytocure?
            </h2>
            <p className="text-white/40 leading-relaxed mb-6 text-sm max-w-2xl">
              Phytocure is a Decentralized Science (DeSci) cannabis medicine platform built on the Solana blockchain. It connects patients, licensed medical practitioners, verified distributors, and clinical researchers through a unified protocol — combining on-chain prescription records, open peer-reviewed research, AI-assisted strain analysis, and $PYCURE token-powered payments.
            </p>
            <div className="grid sm:grid-cols-2 gap-px bg-white/[0.07] mb-8">
              {[
                { label: "Network", value: "Solana Mainnet" },
                { label: "Token", value: "$PYCURE (SPL)" },
                { label: "Payment Currencies", value: "SOL + $PYCURE" },
                { label: "Data Storage", value: "On-chain + PostgreSQL" },
                { label: "AI Engine", value: "PhytoMind Neural" },
                { label: "Open Source", value: "github.com/phytocure" },
              ].map((item) => (
                <div key={item.label} className="bg-black px-5 py-4">
                  <div className="text-[9px] font-mono text-white/20 tracking-widest mb-1">{item.label}</div>
                  <div className="text-sm font-mono text-white/60">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="border border-white/[0.12] rounded p-5 flex gap-4 items-start">
              <ShieldCheck className="w-4 h-4 text-amber-400/70 flex-shrink-0 mt-0.5" />
              <p className="text-white/30 text-xs leading-relaxed">
                <span className="text-amber-400/70 font-medium">Medical Disclaimer:</span> Phytocure is an information and infrastructure platform. It does not provide medical advice. All prescriptions must be issued by a licensed practitioner. Always consult a qualified healthcare professional before beginning any cannabis-based therapy.
              </p>
            </div>
          </Section>

          {/* GETTING STARTED */}
          <Section id="getting-started" label="GETTING STARTED">
            <h2 className="text-2xl font-bold text-white mb-2">Connecting to the Platform</h2>
            <p className="text-white/35 text-sm leading-relaxed mb-8 max-w-xl">
              Phytocure uses Solana wallet authentication. No email, no password — your wallet is your identity. Some pages are publicly accessible; protected features require a connected wallet.
            </p>

            <div className="mb-8">
              <StepRow num="01" title="Install a Solana Wallet" body="Download Phantom, Solflare, or any SPL-compatible Solana wallet browser extension or mobile app. Fund your wallet with SOL for transaction fees." />
              <StepRow num="02" title="Click 'Connect Wallet'" body="Navigate to phytocure.xyz and click the 'Connect Wallet' button in the top-right corner of the navbar. Select your wallet provider from the modal." />
              <StepRow num="03" title="Approve the Connection" body="Your wallet will prompt you to approve the connection. No transaction is signed — this is a read-only authorization of your public address." />
              <StepRow num="04" title="Access the Full Platform" body="Once connected, all protected features unlock: Platform Dashboard, Prescriptions, AI Analysis, Transaction Ledger, and Research publishing." />
            </div>

            <div className="mb-4 text-[9px] font-mono text-white/20 tracking-widest">SUPPORTED WALLETS</div>
            <div className="flex flex-wrap gap-2">
              {["Phantom", "Solflare", "Backpack", "Brave Wallet", "Ledger (via Phantom)", "Torus"].map((w) => (
                <span key={w} className="text-xs font-mono border border-white/[0.14] text-white/40 px-3 py-1.5 rounded-sm">
                  {w}
                </span>
              ))}
            </div>
          </Section>

          {/* DASHBOARD */}
          <Section id="dashboard" label="PLATFORM DASHBOARD">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-2xl font-bold text-white">Dashboard</h2>
              <Tag color="green">LIVE</Tag>
              <Tag>PROTECTED</Tag>
            </div>
            <p className="text-white/35 text-sm leading-relaxed mb-6 max-w-xl">
              The central command interface for the Phytocure network. Displays real-time protocol metrics, activity streams, and system health — all pulled live from the on-chain data layer.
            </p>
            <FeatureRow icon={<BarChart3 className="w-3.5 h-3.5" />} title="Live Network Metrics" body="Total transactions processed, active distributors, research publications, and prescription volume — updated in real time." />
            <FeatureRow icon={<Zap className="w-3.5 h-3.5" />} title="Activity Feed" body="Chronological stream of all recent on-chain activity across the protocol: new prescriptions, research submissions, product transactions, and distributor verifications." />
            <FeatureRow icon={<Globe className="w-3.5 h-3.5" />} title="System Health Bars" body="Visual indicators for API latency, blockchain finality times, and distributor network uptime. Protocol transparency at a glance." />
            <div className="mt-6 pt-4">
              <Link href="/app">
                <span className="inline-flex items-center gap-2 text-sm border border-white/[0.18] text-white/50 px-4 py-2 rounded hover:border-primary/40 hover:text-primary transition-all cursor-pointer">
                  Open Dashboard <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </Section>

          {/* PRODUCTS */}
          <Section id="products" label="PRODUCTS">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-2xl font-bold text-white">Clinical Products</h2>
              <Tag color="green">PUBLIC</Tag>
            </div>
            <p className="text-white/35 text-sm leading-relaxed mb-6 max-w-xl">
              A curated catalog of clinical-grade cannabis formulations from verified global distributors. Every product listing includes full cannabinoid transparency, lab-verified potency, and therapeutic classification.
            </p>

            <div className="space-y-0 mb-6">
              <FeatureRow icon={<Package className="w-3.5 h-3.5" />} title="Cannabinoid Profile" body="Full breakdown of THC%, CBD%, CBN, CBG, and dominant terpenes. Lab-certified values, not manufacturer estimates." />
              <FeatureRow icon={<Coins className="w-3.5 h-3.5" />} title="Dual Pricing" body="Every product is priced in both USD and SOL. Payment at checkout settles in SOL or $PYCURE directly to the distributor's on-chain wallet." />
              <FeatureRow icon={<ShieldCheck className="w-3.5 h-3.5" />} title="Therapeutic Classification" body="Each product is tagged with intended therapeutic use: analgesic, anxiolytic, sedative, anti-inflammatory, neuroprotective, and more." />
            </div>

            <CodeBlock>{`Product Schema:
  id              — Unique product identifier
  name            — Clinical formulation name
  distributorId   — Linked verified distributor
  thcContent      — THC% (lab certified)
  cbdContent      — CBD%
  priceUsd        — Retail price in USD
  priceSol        — Equivalent in SOL
  category        — flower / oil / capsule / topical / edible
  effects         — Array of therapeutic effects
  terpenes        — Dominant terpene profile`}
            </CodeBlock>
            <div className="mt-5">
              <Link href="/products">
                <span className="inline-flex items-center gap-2 text-sm border border-white/[0.18] text-white/50 px-4 py-2 rounded hover:border-primary/40 hover:text-primary transition-all cursor-pointer">
                  Browse Products <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </Section>

          {/* DISTRIBUTORS */}
          <Section id="distributors" label="DISTRIBUTORS">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-2xl font-bold text-white">Verified Distributor Network</h2>
              <Tag color="green">PUBLIC</Tag>
            </div>
            <p className="text-white/35 text-sm leading-relaxed mb-6 max-w-xl">
              Phytocure operates a curated network of licensed, internationally verified cannabis distributors. Each partner is cross-referenced against national medical cannabis registries before listing. All 8 current distributors are active and verified.
            </p>

            <div className="bg-white/[0.03] border border-white/[0.10] rounded overflow-hidden mb-6">
              <div className="grid grid-cols-3 text-[9px] font-mono text-white/20 tracking-widest px-5 py-3 border-b border-white/[0.08]">
                <span>DISTRIBUTOR</span>
                <span>JURISDICTION</span>
                <span>STATUS</span>
              </div>
              {[
                ["GW Pharmaceuticals (Jazz Pharma)", "United Kingdom", "VERIFIED"],
                ["Bedrocan International", "Netherlands", "VERIFIED"],
                ["Aurora Cannabis (Medical)", "Canada", "VERIFIED"],
                ["Tilray Brands (Medical)", "Canada / Portugal", "VERIFIED"],
                ["Canopy Growth Corporation", "Canada", "VERIFIED"],
                ["Cann Group", "Australia", "VERIFIED"],
                ["ThaiCannaMed", "Thailand", "VERIFIED"],
                ["Malaya Hemp (CBD Oils Malaya)", "United Kingdom", "VERIFIED"],
              ].map(([name, loc, status]) => (
                <div key={name} className="grid grid-cols-3 px-5 py-3.5 border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <span className="text-sm text-white/60 font-medium">{name}</span>
                  <span className="text-sm text-white/30 font-mono">{loc}</span>
                  <Tag color="green">{status}</Tag>
                </div>
              ))}
            </div>

            <div className="border border-white/[0.10] rounded p-5 flex gap-4 items-start mb-5">
              <Lock className="w-4 h-4 text-primary/60 flex-shrink-0 mt-0.5" />
              <p className="text-white/30 text-xs leading-relaxed">
                <span className="text-primary/60 font-medium">Verification Standard:</span> All distributors must hold a valid national medical cannabis producer or distributor license. Licenses are verified against the issuing regulatory authority (MHRA UK, Health Canada, TGA Australia, DTAM Thailand, etc.) before onboarding.
              </p>
            </div>
            <Link href="/distributors">
              <span className="inline-flex items-center gap-2 text-sm border border-white/[0.18] text-white/50 px-4 py-2 rounded hover:border-primary/40 hover:text-primary transition-all cursor-pointer">
                View Distributor Network <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </Section>

          {/* PRESCRIPTIONS */}
          <Section id="prescriptions" label="PRESCRIPTIONS">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-2xl font-bold text-white">On-Chain Clinical Prescriptions</h2>
              <Tag>PROTECTED</Tag>
            </div>
            <p className="text-white/35 text-sm leading-relaxed mb-6 max-w-xl">
              Clinical protocols issued by licensed practitioners and recorded immutably on the Solana blockchain. Each prescription is a verifiable, tamper-proof record linking patient, product, dosage, and practitioner identity.
            </p>

            <div className="mb-6">
              <StepRow num="01" title="Connect Wallet" body="Prescriptions require an authenticated session. Connect your Solana wallet to access the prescriptions module." />
              <StepRow num="02" title="Create New Prescription" body="Click 'New Prescription' and complete the clinical protocol form: patient name, prescribing doctor, product selection, dosage, frequency, duration, and medical condition." />
              <StepRow num="03" title="Submit On-Chain" body="The prescription is submitted to the Phytocure protocol, assigned a unique TX hash, and recorded with a verifiable timestamp on Solana." />
              <StepRow num="04" title="Track & Fulfill" body="Monitor prescription status (active / fulfilled / expired). Fulfilled prescriptions link directly to the corresponding transaction record." />
            </div>

            <CodeBlock>{`Prescription Fields:
  doctorName      — Licensed practitioner name
  patientName     — Patient full name
  productId       — Linked clinical product
  dosage          — Dosage per administration (e.g. 10mg CBD)
  frequency       — Frequency (e.g. Twice daily with food)
  duration        — Protocol duration (e.g. 30 days)
  condition       — Diagnosed condition
  notes           — Clinical notes and monitoring instructions
  status          — active | fulfilled | expired
  txHash          — Solana transaction hash (immutable record)`}
            </CodeBlock>
          </Section>

          {/* RESEARCH HUB */}
          <Section id="research" label="RESEARCH HUB">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-2xl font-bold text-white">DeSci Research Hub</h2>
              <Tag color="green">PUBLIC</Tag>
            </div>
            <p className="text-white/35 text-sm leading-relaxed mb-6 max-w-xl">
              An open-access, peer-reviewed research repository for cannabis medicine science. Research papers are published on-chain, permanently citable, and free from institutional paywalls. Community peer review is on-chain and transparent.
            </p>

            <FeatureRow icon={<BookOpen className="w-3.5 h-3.5" />} title="Browse Research" body="Public access to all published studies — filter by category: pharmacology, clinical trials, neurology, oncology, pain management, and more." />
            <FeatureRow icon={<FileText className="w-3.5 h-3.5" />} title="Publish Research" body="Submit original research papers with full methodology, findings, and citations. Requires wallet connection. All submissions are timestamped on-chain." />
            <FeatureRow icon={<ShieldCheck className="w-3.5 h-3.5" />} title="Peer Review" body="Community members with verified credentials can submit peer reviews. Review records are on-chain and permanently linked to the parent paper." />
            <FeatureRow icon={<Globe className="w-3.5 h-3.5" />} title="Open Access" body="No paywalls, no institutional access requirements. All research on Phytocure is freely accessible to patients, clinicians, and the global community." />

            <div className="mt-5">
              <Link href="/research">
                <span className="inline-flex items-center gap-2 text-sm border border-white/[0.18] text-white/50 px-4 py-2 rounded hover:border-primary/40 hover:text-primary transition-all cursor-pointer">
                  Open Research Hub <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </Section>

          {/* AI / NEURAL */}
          <Section id="ai" label="NEURAL ENGINE (AI)">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-2xl font-bold text-white">PhytoMind Neural Engine</h2>
              <Tag color="blue">AI POWERED</Tag>
              <Tag>PROTECTED</Tag>
            </div>
            <p className="text-white/35 text-sm leading-relaxed mb-6 max-w-xl">
              PhytoMind is Phytocure's proprietary AI engine — trained on thousands of peer-reviewed phytopharmacological studies, clinical trials, and cannabinoid interaction datasets. It provides real-time strain analysis and personalized therapeutic profiling.
            </p>

            <div className="mb-6">
              <StepRow num="01" title="Enter a Strain or Cannabinoid Profile" body="Input a strain name (e.g. 'Charlotte's Web'), a cannabinoid ratio (e.g. 20% CBD / 0.3% THC), or a specific condition you are targeting." />
              <StepRow num="02" title="PhytoMind Analysis" body="The engine cross-references your input against its clinical dataset — analyzing receptor binding profiles, terpene synergy, and reported therapeutic outcomes." />
              <StepRow num="03" title="Receive Therapeutic Report" body="Get a full report: therapeutic profile, recommended dosage range, onset/duration estimates, potential contraindications, and risk assessment score." />
            </div>

            <div className="grid sm:grid-cols-3 gap-px bg-white/[0.07] mb-5">
              {[
                { label: "THERAPEUTIC PROFILE", body: "Mapped benefits by body system and condition — analgesia, anxiolysis, anti-inflammatory, neuroprotection, anti-emesis, and more." },
                { label: "DOSAGE RECOMMENDATION", body: "Evidence-based dosage ranges by administration route: sublingual, inhaled, oral, topical. Titration schedule included." },
                { label: "RISK ASSESSMENT", body: "Drug interaction flags, contraindication warnings, psychoactive risk score, and dependency potential rating." },
              ].map((item) => (
                <div key={item.label} className="bg-black p-5">
                  <div className="text-[9px] font-mono text-primary/50 tracking-widest mb-3">{item.label}</div>
                  <p className="text-white/30 text-xs leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
            <Link href="/ai">
              <span className="inline-flex items-center gap-2 text-sm border border-white/[0.18] text-white/50 px-4 py-2 rounded hover:border-primary/40 hover:text-primary transition-all cursor-pointer">
                Launch Neural Engine <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </Section>

          {/* TRANSACTIONS */}
          <Section id="transactions" label="TRANSACTIONS">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-2xl font-bold text-white">On-Chain Transaction Ledger</h2>
              <Tag>PROTECTED</Tag>
            </div>
            <p className="text-white/35 text-sm leading-relaxed mb-6 max-w-xl">
              A complete, verifiable record of all financial activity on the Phytocure network. Every transaction is settled on Solana and recorded with a unique TX hash, fully auditable by any party.
            </p>

            <FeatureRow icon={<Coins className="w-3.5 h-3.5" />} title="Multi-Currency Ledger" body="Supports SOL and $PYCURE. Each transaction record displays the currency, amount, sender/receiver wallet (truncated), and Solana Explorer link." />
            <FeatureRow icon={<ShieldCheck className="w-3.5 h-3.5" />} title="Immutable Records" body="Once confirmed on Solana, transaction records cannot be altered or deleted. Full finality within ~400ms average block time." />
            <FeatureRow icon={<BarChart3 className="w-3.5 h-3.5" />} title="Full History" body="Access your complete transaction history from wallet connection date. Filter by currency, product, or distributor." />

            <CodeBlock>{`Transaction Fields:
  id              — Internal record ID
  walletAddress   — Connected wallet (sender)
  productId       — Purchased product
  distributorId   — Receiving distributor
  amount          — Settlement amount
  currency        — SOL | PYCURE
  txHash          — Solana blockchain TX hash
  status          — pending | confirmed | failed
  createdAt       — ISO timestamp`}
            </CodeBlock>
          </Section>

          {/* LABORATORY */}
          <Section id="laboratory" label="LABORATORY">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-2xl font-bold text-white">Laboratory Data</h2>
              <Tag color="green">PUBLIC</Tag>
            </div>
            <p className="text-white/35 text-sm leading-relaxed mb-6 max-w-xl">
              Third-party lab verification data for all products listed on the Phytocure platform. Every formulation undergoes independent analysis before it can be listed — no self-reported cannabinoid values are accepted.
            </p>
            <FeatureRow icon={<TestTube className="w-3.5 h-3.5" />} title="HPLC Cannabinoid Testing" body="High-Performance Liquid Chromatography (HPLC) analysis for precise THC, CBD, CBN, CBG, and CBC quantification. Values are reported to two decimal places." />
            <FeatureRow icon={<ShieldCheck className="w-3.5 h-3.5" />} title="Third-Party Independence" body="All lab reports are issued by accredited independent laboratories — not in-house testing. Lab certificates are publicly viewable for each product." />
            <FeatureRow icon={<FlaskConical className="w-3.5 h-3.5" />} title="Terpene Profiling" body="GC-MS terpene analysis detailing dominant and secondary terpenes. Terpene data informs the entourage effect predictions in PhytoMind AI." />
            <div className="mt-5">
              <Link href="/laboratory">
                <span className="inline-flex items-center gap-2 text-sm border border-white/[0.18] text-white/50 px-4 py-2 rounded hover:border-primary/40 hover:text-primary transition-all cursor-pointer">
                  View Laboratory Data <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </Section>

          {/* TOKEN */}
          <Section id="token" label="$PYCURE TOKEN">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-2xl font-bold text-white">$PYCURE — The Protocol Token</h2>
              <Tag color="amber">SPL TOKEN</Tag>
            </div>
            <p className="text-white/35 text-sm leading-relaxed mb-6 max-w-xl">
              $PYCURE is the native Solana SPL token powering the Phytocure protocol economy. It is used for payments, governance, research funding, and distributor verification staking.
            </p>

            {/* CA Box */}
            <div className="border border-primary/30 bg-primary/[0.06] rounded p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div>
                <div className="text-[9px] font-mono text-primary/50 tracking-widest mb-1.5">CONTRACT ADDRESS (SOLANA)</div>
                <div className="text-sm font-mono text-primary break-all">9jBbyCpEoWa9frvtAbq4xNQ8xoHPedeWYkVBDVU9pump</div>
              </div>
              <a
                href="https://solscan.io/token/9jBbyCpEoWa9frvtAbq4xNQ8xoHPedeWYkVBDVU9pump"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-2 text-xs border border-primary/30 text-primary/70 px-3 py-1.5 rounded hover:bg-primary/10 transition-all"
              >
                View on Solscan <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>

            <div className="grid sm:grid-cols-2 gap-px bg-white/[0.07] mb-6">
              {[
                { label: "NETWORK", value: "Solana Mainnet" },
                { label: "STANDARD", value: "SPL Token" },
                { label: "TICKER", value: "$PYCURE" },
                { label: "PAYMENT SETTLEMENT", value: "Products & Services" },
                { label: "GOVERNANCE", value: "Protocol DAO (Phase III)" },
                { label: "RESEARCH GRANTS", value: "DeSci Funding Pool" },
                { label: "LOCK MECHANISM", value: "Streamflow Finance" },
                { label: "LOCK AMOUNT", value: "3% of Total Supply" },
              ].map((item) => (
                <div key={item.label} className="bg-black px-5 py-4">
                  <div className="text-[9px] font-mono text-white/20 tracking-widest mb-1">{item.label}</div>
                  <div className="text-sm font-mono text-white/60">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="border border-primary/20 bg-primary/[0.04] rounded p-5 mb-5">
              <div className="text-[9px] font-mono text-primary/50 tracking-widest mb-3">TOKENOMICS HIGHLIGHT</div>
              <p className="text-white/40 text-xs leading-relaxed">
                3% of total $PYCURE supply is locked via <span className="text-primary/70">Streamflow Finance</span> — fully on-chain, publicly verifiable, and immutable. This demonstrates the team's long-term commitment to the protocol. Streamflow lock records are publicly auditable at any time.
              </p>
            </div>

            <p className="text-white/25 text-xs leading-relaxed">
              $PYCURE is a utility token. It does not represent equity, profit-sharing, or any security instrument. Holding or using $PYCURE does not constitute an investment. Always conduct your own research. Not financial advice.
            </p>
          </Section>

          {/* SECURITY */}
          <Section id="security" label="SECURITY & COMPLIANCE">
            <h2 className="text-2xl font-bold text-white mb-5">Security & Regulatory Compliance</h2>

            <div className="space-y-0 mb-6">
              <FeatureRow icon={<Lock className="w-3.5 h-3.5" />} title="Non-Custodial Architecture" body="Phytocure never holds user funds. All payments settle peer-to-peer between the buyer's wallet and the distributor's verified on-chain wallet. We have zero custody of any assets." />
              <FeatureRow icon={<ShieldCheck className="w-3.5 h-3.5" />} title="Distributor Verification" body="All distributors are verified against national regulatory databases before listing. Licenses are reviewed periodically and revoked listings are immediately delisted from the protocol." />
              <FeatureRow icon={<Globe className="w-3.5 h-3.5" />} title="Jurisdictional Compliance" body="Phytocure only lists distributors operating in jurisdictions where medical cannabis is legally regulated. All transactions occur between legally authorized parties in their respective countries." />
              <FeatureRow icon={<FileText className="w-3.5 h-3.5" />} title="On-Chain Auditability" body="Every prescription, transaction, and research submission is recorded with a Solana TX hash. Full audit trails are permanently available and cannot be altered by any party, including Phytocure." />
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/disclaimer">
                <span className="text-xs border border-white/[0.14] text-white/30 px-3 py-1.5 rounded hover:text-white/60 transition-colors cursor-pointer inline-block">Medical Disclaimer</span>
              </Link>
              <Link href="/privacy">
                <span className="text-xs border border-white/[0.14] text-white/30 px-3 py-1.5 rounded hover:text-white/60 transition-colors cursor-pointer inline-block">Privacy Policy</span>
              </Link>
              <Link href="/terms">
                <span className="text-xs border border-white/[0.14] text-white/30 px-3 py-1.5 rounded hover:text-white/60 transition-colors cursor-pointer inline-block">Terms of Service</span>
              </Link>
              <Link href="/cookies">
                <span className="text-xs border border-white/[0.14] text-white/30 px-3 py-1.5 rounded hover:text-white/60 transition-colors cursor-pointer inline-block">Cookie Policy</span>
              </Link>
            </div>
          </Section>

          {/* PUBLICATIONS */}
          <Section id="publications" label="PUBLICATIONS">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-2xl font-bold text-white">Research Publications</h2>
              <Tag color="green">SUBMITTED</Tag>
            </div>
            <p className="text-white/35 text-sm leading-relaxed mb-8 max-w-xl">
              Phytocure is committed to open, peer-reviewed science. Below is a record of all academic submissions and publications made by the Phytocure Research Initiative.
            </p>

            {/* Paper 01 */}
            <div className="border border-primary/20 bg-primary/[0.03] rounded overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-primary/10 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                  <span className="index-num text-xs">01</span>
                  <Tag color="green">PENDING REVIEW</Tag>
                  <Tag color="amber">PREPRINT</Tag>
                  <Tag color="green">ZENODO PUBLISHED</Tag>
                </div>
                <span className="text-[9px] font-mono text-white/25">12 May 2026</span>
              </div>
              <div className="px-6 py-5">
                <h3 className="text-white font-semibold text-sm leading-snug mb-4 max-w-2xl">
                  Decentralized Science Infrastructure for Medical Cannabis: A Framework for Blockchain-Based Prescription Records, Verified Distribution Networks, and Open Peer-Reviewed Research
                </h3>
                <div className="grid sm:grid-cols-2 gap-px bg-white/[0.06] mb-5">
                  {[
                    { label: "PREPRINTS ID", value: "213326" },
                    { label: "ARTICLE TYPE", value: "Review" },
                    { label: "PLATFORM", value: "Preprints.org (MDPI)" },
                    { label: "SUBJECT AREA", value: "Medicine & Pharmacology — Pharmacology and Toxicology" },
                    { label: "SUBMITTED", value: "12 May 2026, 06:30:08 UTC" },
                    { label: "MDPI TOPIC", value: "Research on Natural Products of Medical Plants" },
                    { label: "AUTHOR", value: "Conor William" },
                    { label: "ORCID", value: "0009-0005-8307-2353" },
                    { label: "ZENODO RECORD", value: "zenodo.org/records/20143620" },
                    { label: "DOI", value: "10.5281/zenodo.20143620" },
                  ].map((item) => (
                    <div key={item.label} className="bg-black/60 px-4 py-3">
                      <div className="text-[9px] font-mono text-white/20 tracking-widest mb-1">{item.label}</div>
                      <div className="text-xs font-mono text-white/55">{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <div className="text-[9px] font-mono text-white/20 tracking-widest mb-2">KEYWORDS</div>
                  <div className="flex flex-wrap gap-1.5">
                    {["medical cannabis", "decentralized science", "DeSci", "blockchain", "Solana", "cannabinoid", "on-chain prescription", "phytomedicine", "open access research", "smart contract", "verified distribution", "pharmacology"].map((kw) => (
                      <span key={kw} className="text-[10px] font-mono border border-white/[0.10] text-white/30 px-2 py-0.5 rounded-sm">{kw}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href="https://www.preprints.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs border border-primary/25 text-primary/60 px-3 py-1.5 rounded hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    View on Preprints.org <ArrowUpRight className="w-3 h-3" />
                  </a>
                  <a
                    href="/manuscript.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs border border-white/[0.14] text-white/35 px-3 py-1.5 rounded hover:text-white/60 transition-all"
                  >
                    Read Manuscript <ArrowUpRight className="w-3 h-3" />
                  </a>
                  <a
                    href="https://orcid.org/0009-0005-8307-2353"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs border border-white/[0.14] text-white/35 px-3 py-1.5 rounded hover:text-white/60 transition-all"
                  >
                    <span className="text-[#A6CE39] font-bold text-xs">iD</span>
                    ORCID Profile <ArrowUpRight className="w-3 h-3" />
                  </a>
                  <a
                    href="https://zenodo.org/records/20143620"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs border border-primary/25 text-primary/60 px-3 py-1.5 rounded hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    View on Zenodo <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="border border-white/[0.08] rounded p-5 flex gap-4 items-start">
              <BookOpen className="w-4 h-4 text-white/20 flex-shrink-0 mt-0.5" />
              <p className="text-white/25 text-xs leading-relaxed">
                All Phytocure research submissions follow open-access principles. This paper is simultaneously archived on Zenodo (DOI: 10.5281/zenodo.20143620) — a CERN-operated open repository — and submitted to Preprints.org (MDPI) for peer review. Both records are freely available to the global scientific community. Upon acceptance by a peer-reviewed journal, this record will be updated with the final citation.
              </p>
            </div>

            {/* WHO Reference */}
            <div className="border border-white/[0.08] rounded overflow-hidden mt-6">
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                <span className="index-num text-xs">REF</span>
                <span className="text-[9px] font-mono text-white/25 tracking-widest uppercase">International Recognition</span>
              </div>
              <div className="px-6 py-5">
                <h3 className="text-white/80 font-semibold text-sm mb-3">WHO Recognition of Medical Cannabis</h3>
                <p className="text-white/30 text-xs leading-relaxed mb-4">
                  The World Health Organization (WHO) Expert Committee on Drug Dependence (ECDD) formally reviewed cannabis and cannabis-related substances in 2019 and issued recommendations for rescheduling under international conventions in 2020 — recognizing its established medical value. The Phytocure protocol references and aligns with this international regulatory framework.
                </p>
                <div className="grid sm:grid-cols-2 gap-px bg-white/[0.06] mb-4">
                  {[
                    { label: "BODY", value: "WHO Expert Committee on Drug Dependence (ECDD)" },
                    { label: "REPORT YEAR", value: "2019 — 41st ECDD Meeting" },
                    { label: "RECOMMENDATION", value: "Rescheduling of cannabis recognizing medical use" },
                    { label: "UN ACTION", value: "CND Decision 63/1 — December 2020" },
                  ].map((item) => (
                    <div key={item.label} className="bg-black/60 px-4 py-3">
                      <div className="text-[9px] font-mono text-white/20 tracking-widest mb-1">{item.label}</div>
                      <div className="text-xs font-mono text-white/45">{item.value}</div>
                    </div>
                  ))}
                </div>
                <a
                  href="https://www.who.int/medicines/access/controlled-substances/cannabis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs border border-white/[0.14] text-white/35 px-3 py-1.5 rounded hover:text-white/60 transition-all"
                >
                  WHO Cannabis Policy Page <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </Section>

          {/* FAQ */}
          <Section id="faq" label="FAQ">
            <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
            <div className="space-y-0">
              {[
                {
                  q: "Do I need a wallet to browse products and research?",
                  a: "No. Product listings, distributor profiles, and the research hub are fully public. A Solana wallet is only required to access the Dashboard, Prescriptions, AI Analysis, and Transactions modules.",
                },
                {
                  q: "Is Phytocure legal in my country?",
                  a: "Phytocure lists only distributors operating in regulated jurisdictions. It is your responsibility to verify the legality of cannabis medicine in your country before purchasing. We do not facilitate transactions in jurisdictions where medical cannabis is prohibited.",
                },
                {
                  q: "How are distributors verified?",
                  a: "Each distributor submits their national medical cannabis license for review. We cross-reference submissions against the issuing regulatory authority (MHRA, Health Canada, TGA, DTAM, etc.). Only approved distributors appear on the platform.",
                },
                {
                  q: "What wallets are supported?",
                  a: "Any SPL-compatible Solana wallet. We have tested with Phantom, Solflare, and Backpack. Hardware wallets (Ledger) are supported via Phantom's hardware integration.",
                },
                {
                  q: "Can I publish research without a medical degree?",
                  a: "Yes. Phytocure is an open-access DeSci platform. Anyone can submit research with a connected wallet. However, submissions go through community peer review, and clinical credentials are verified for prescription-related research.",
                },
                {
                  q: "What is the difference between SOL and $PYCURE payments?",
                  a: "Both currencies are accepted for product purchases. SOL is Solana's native gas and payment token. $PYCURE is Phytocure's protocol token and may offer reduced platform fees or governance rights in future phases.",
                },
                {
                  q: "How do I contact Phytocure?",
                  a: "For support and partnership inquiries, reach us via X (Twitter) at @phytocure or open an issue on GitHub at github.com/phytocure.",
                },
              ].map((item, i) => (
                <div key={i} className="py-6 border-b border-white/[0.08] last:border-0">
                  <div className="flex gap-4">
                    <span className="index-num text-xs w-8 flex-shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <div className="text-white font-medium text-sm mb-2">{item.q}</div>
                      <div className="text-white/35 text-sm leading-relaxed">{item.a}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* CTA */}
          <div className="py-14 text-center border-t border-white/[0.08] mt-4">
            <div className="section-label mb-4">READY TO START</div>
            <h2 className="text-2xl font-bold text-white mb-4">Explore the Platform</h2>
            <p className="text-white/30 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
              Connect your Solana wallet and access the full Phytocure DeSci medicine protocol.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/app">
                <span className="inline-flex items-center gap-2 text-sm bg-primary text-black font-semibold px-6 py-2.5 rounded cursor-pointer hover:bg-primary/90 transition-all">
                  Open Platform <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </Link>
              <a
                href="https://github.com/phytocure"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm border border-white/[0.20] text-white/50 px-6 py-2.5 rounded hover:border-white/30 hover:text-white/80 transition-all"
              >
                GitHub
              </a>
            </div>
          </div>

        </main>
      </div>
    </AppLayout>
  );
}
