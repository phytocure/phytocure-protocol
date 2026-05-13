import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGetDashboardStats, useListResearch, useListDistributors } from "@workspace/api-client-react";
import { ArrowRight, Shield, Microscope, BrainCircuit, Pill, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import crystalLeaf from "/crystal-leaf.png";

function useCountUp(target: number, duration = 1600, start = false) {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);
  const startTs = useRef<number | null>(null);

  const run = useCallback(() => {
    startTs.current = null;
    const step = (ts: number) => {
      if (!startTs.current) startTs.current = ts;
      const elapsed = ts - startTs.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        raf.current = requestAnimationFrame(step);
      }
    };
    raf.current = requestAnimationFrame(step);
  }, [target, duration]);

  useEffect(() => {
    if (!start || target === 0) return;
    run();
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [start, target, run]);

  return value;
}

function CountUpStat({
  target,
  prefix = "",
  suffix = "",
  label,
  testId,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  label: string;
  testId?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [triggered, setTriggered] = useState(false);
  const displayed = useCountUp(target, 1800, triggered);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const formatted =
    target >= 1000
      ? displayed.toLocaleString()
      : String(displayed);

  return (
    <div
      ref={ref}
      className="bg-black py-14 px-6 flex flex-col items-center justify-center gap-3 group hover:bg-white/[0.02] transition-colors"
      data-testid={testId}
    >
      <div className="text-[clamp(3rem,5vw,5rem)] font-bold text-white tracking-tight font-mono leading-none group-hover:text-primary transition-colors duration-500 tabular-nums">
        {prefix}{formatted}{suffix}
      </div>
      <div className="section-label text-[10px] text-center">{label}</div>
    </div>
  );
}

type Segment = { text: string; className?: string };

function SequentialTypewriter({ segments, speed = 32, pauseBetween = 400 }: {
  segments: Segment[];
  speed?: number;
  pauseBetween?: number;
}) {
  const [revealed, setRevealed] = useState<string[]>(segments.map(() => ""));
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const activeIdxRef = useRef(-1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          activeIdxRef.current = 0;
          setActiveIdx(0);
        }
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (activeIdx < 0 || activeIdx >= segments.length) return;
    const seg = segments[activeIdx];
    let charIdx = 0;
    const interval = setInterval(() => {
      charIdx += 1;
      setRevealed(prev => {
        const next = [...prev];
        next[activeIdx] = seg.text.slice(0, charIdx);
        return next;
      });
      if (charIdx >= seg.text.length) {
        clearInterval(interval);
        const nextIdx = activeIdx + 1;
        if (nextIdx < segments.length) {
          setTimeout(() => {
            activeIdxRef.current = nextIdx;
            setActiveIdx(nextIdx);
          }, pauseBetween);
        } else {
          setActiveIdx(segments.length);
        }
      }
    }, speed);
    return () => clearInterval(interval);
  }, [activeIdx]);

  return (
    <span ref={containerRef}>
      {segments.map((seg, i) => (
        <span key={i} className={seg.className}>
          {revealed[i]}
          {activeIdx === i && <span className="typewriter-cursor" />}
        </span>
      ))}
    </span>
  );
}

export default function Home() {
  const { data: stats } = useGetDashboardStats();
  const { data: research } = useListResearch();
  const { data: distributors } = useListDistributors();

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center px-6 pt-20 dot-grid overflow-hidden" data-testid="section-hero">

        {/* Ambient orbs */}
        <div className="animate-orb absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(168,230,61,0.06) 0%, transparent 70%)" }} />
        <div className="animate-orb-reverse absolute bottom-1/4 right-1/3 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(168,230,61,0.04) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto w-full relative z-10 py-20">

          {/* Two-column: text left, leaf right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left - Text */}
            <div>
              <div className="animate-fade-up section-label mb-8">
                PHYTOCURE · DECENTRALIZED SCIENCE
              </div>

              <h1 className="animate-fade-up anim-delay-100 text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.03em] text-white mb-10">
                Phytomedicine,{" "}
                <span className="text-white/25">powered by</span>
                <br />
                decentralized{" "}
                <span className="text-primary text-glow-green">science.</span>
              </h1>

              <p className="animate-fade-up anim-delay-300 text-white/40 text-lg max-w-md leading-relaxed mb-12 font-light">
                A decentralized platform for clinical cannabis prescriptions, open scientific research, and AI-assisted formulation powered by Solana.
              </p>

              <div className="animate-fade-up anim-delay-500 flex flex-wrap items-center gap-4">
                <Link href="/app" data-testid="button-launch-app">
                  <span className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-black text-sm font-semibold rounded cursor-pointer hover:bg-primary/90 transition-all">
                    Launch Platform <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
                <Link href="/research" data-testid="button-explore-research">
                  <span className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded cursor-pointer hover:border-white/25 hover:text-white transition-all">
                    Explore Research
                  </span>
                </Link>
              </div>
            </div>

            {/* Right - Crystal Leaf Visual */}
            <div className="relative flex items-center justify-center" aria-hidden="true">

              {/* Outer shimmer rings - hidden on small screens to prevent overflow */}
              <div className="hidden sm:block animate-shimmer-ring absolute w-[320px] h-[320px] md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px] rounded-full border border-primary/20" />
              <div className="hidden sm:block animate-shimmer-ring anim-delay-2s absolute w-[320px] h-[320px] md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px] rounded-full border border-primary/10" />
              <div className="hidden sm:block animate-shimmer-ring anim-delay-3s absolute w-[320px] h-[320px] md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px] rounded-full border border-primary/[0.06]" />

              {/* Radial glow plate behind leaf */}
              <div className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px] rounded-full"
                style={{ background: "radial-gradient(circle, rgba(168,230,61,0.1) 0%, rgba(168,230,61,0.03) 50%, transparent 70%)" }} />

              {/* The leaf */}
              <img
                src={crystalLeaf}
                alt="Phytocure Crystal Leaf"
                className="animate-float animate-glow-pulse relative z-10 w-[240px] h-[240px] sm:w-[340px] sm:h-[340px] md:w-[420px] md:h-[420px] lg:w-[500px] lg:h-[500px] object-contain select-none"
                draggable={false}
              />

              {/* Scan line effect */}
              <div className="animate-scan-line absolute inset-0 w-full overflow-hidden pointer-events-none rounded-full">
                <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              </div>

              {/* Corner data readouts */}
              <div className="animate-fade-up anim-delay-900 absolute top-4 right-4 text-right">
                <div className="text-[9px] font-mono text-primary/40 leading-relaxed">
                  <div>THC PROFILE ████░</div>
                  <div>CBD PROFILE ██████</div>
                  <div>TERPENES ███░░░</div>
                </div>
              </div>
              <div className="animate-fade-up anim-delay-1200 absolute bottom-4 left-4">
                <div className="text-[9px] font-mono text-white/20 leading-relaxed">
                  <div>SOLANA NETWORK</div>
                  <div className="text-primary/40">● CONNECTED</div>
                </div>
              </div>
            </div>

          </div>{/* end grid */}

          {/* Full-width centered stats */}
          <div className="animate-fade-up anim-delay-700 flex flex-wrap items-center justify-center gap-8 sm:gap-16 mt-16 pt-8 border-t border-white/[0.16]">
            {[
              { label: "Products", value: stats?.totalProducts ?? "" },
              { label: "Research Papers", value: stats?.totalResearch ?? "" },
              { label: "Network Volume", value: stats ? `$${stats.totalTransactionVolume.toLocaleString()}` : "" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold font-mono text-white">{s.value}</div>
                <div className="section-label text-[9px] mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CA ticker */}
          <div className="animate-fade-up anim-delay-700 mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 px-4 py-4 border border-primary/20 rounded bg-primary/[0.04]">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono text-primary/40 tracking-widest flex-shrink-0">$PYCURE CA</span>
              <span className="text-xs font-mono text-primary/80 break-all text-center">9jBbyCpEoWa9frvtAbq4xNQ8xoHPedeWYkVBDVU9pump</span>
            </div>
            <a
              href="https://solscan.io/token/9jBbyCpEoWa9frvtAbq4xNQ8xoHPedeWYkVBDVU9pump"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-[9px] font-mono border border-primary/20 text-primary/50 px-3 py-1.5 rounded hover:text-primary hover:border-primary/40 transition-all"
            >
              SOLSCAN ↗
            </a>
          </div>

          {/* Submission ticker */}
          <div className="animate-fade-up anim-delay-700 mt-6 overflow-hidden border border-white/[0.08] rounded bg-white/[0.02]">
            <div className="flex items-center gap-0 whitespace-nowrap py-2.5" style={{ animation: "ticker 40s linear infinite" }}>
              {[
                { label: "PREPRINTS.ORG", value: "ID 213326", dot: "✓" },
                { label: "ZENODO", value: "DOI 10.5281/zenodo.20143620", dot: "✓" },
                { label: "DESCI.WORLD", value: "SUBMITTED", dot: "✓" },
                { label: "OSF · METAARXIV", value: "SUBMITTED", dot: "✓" },
                { label: "CANNABIS & CANNABINOID RESEARCH", value: "SAGE · UNDER REVIEW", dot: "●" },
                { label: "WHO ECDD", value: "REFERENCED", dot: "✓" },
                { label: "PREPRINTS.ORG", value: "ID 213326", dot: "✓" },
                { label: "ZENODO", value: "DOI 10.5281/zenodo.20143620", dot: "✓" },
                { label: "DESCI.WORLD", value: "SUBMITTED", dot: "✓" },
                { label: "OSF · METAARXIV", value: "SUBMITTED", dot: "✓" },
                { label: "CANNABIS & CANNABINOID RESEARCH", value: "SAGE · UNDER REVIEW", dot: "●" },
                { label: "WHO ECDD", value: "REFERENCED", dot: "✓" },
              ].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-3 px-8 text-[10px] font-mono">
                  <span className={item.dot === "●" ? "text-amber-400/80" : "text-primary/70"}>{item.dot}</span>
                  <span className="text-white/40 tracking-widest uppercase">{item.label}</span>
                  <span className="text-primary/50">{item.value}</span>
                  <span className="text-white/10 ml-3">·</span>
                </span>
              ))}
            </div>
            <style>{`@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
          </div>

        </div>{/* end outer wrapper */}

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-25">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/60" />
          <span className="section-label text-[10px]">scroll</span>
        </div>
      </section>

      {/* ─── STATEMENT ─── */}
      <section className="py-32 px-6 border-y border-white/[0.16] relative overflow-hidden" data-testid="section-statement">
        {/* Subtle glow behind text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[300px] rounded-full opacity-[0.03]"
            style={{ background: "radial-gradient(ellipse, #A8E63D 0%, transparent 70%)" }} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="section-label mb-10 justify-center flex">PROTOCOL · MANIFESTO</div>

          <p className="text-[clamp(1.8rem,4vw,3.5rem)] font-semibold leading-[1.15] tracking-[-0.02em]">
            <SequentialTypewriter
              speed={30}
              pauseBetween={500}
              segments={[
                {
                  text: "The most powerful medicines on earth grow from the ground.",
                  className: "text-white",
                },
                {
                  text: "\n\n",
                  className: "whitespace-pre",
                },
                {
                  text: "Phytocure exists to ensure the science behind them is open, verifiable, and owned by no one, ",
                  className: "text-white/50",
                },
                {
                  text: "permanently on-chain.",
                  className: "text-primary",
                },
                {
                  text: "\n\n",
                  className: "whitespace-pre",
                },
                {
                  text: "Every prescription traceable. Every study immutable. Every formulation peer-reviewed.",
                  className: "text-white/40",
                },
              ]}
            />
          </p>
        </div>
      </section>

      {/* ─── PILLARS ─── */}
      <section className="py-32 px-6" data-testid="section-pillars">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 border-b border-white/[0.10] pb-12">
            <div>
              <div className="section-label mb-5">CORE MODULES</div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-none">
                Platform<br />
                <span className="text-white/20">Architecture</span>
              </h2>
            </div>
            <div className="max-w-xs">
              <p className="text-sm text-white/35 leading-relaxed mb-5">
                Three integrated systems working in concert: clinical, scientific, and computational. All on-chain.
              </p>
              <Link href="/app">
                <span className="inline-flex items-center gap-2 text-xs font-mono text-primary/70 hover:text-primary transition-colors cursor-pointer border border-primary/20 hover:border-primary/40 px-4 py-2">
                  Open Platform <ArrowUpRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.08]">
            {[
              {
                num: "01",
                index: "[ 01 ]",
                title: "Clinical\nPrescriptions",
                subtitle: "On-Chain Protocol",
                icon: Pill,
                href: "/prescriptions",
                desc: "Digital prescriptions issued by verified physicians, recorded immutably on Solana. Patients control their data. Dosage protocols are transparent and traceable.",
                tag: "PRESCRIPTIONS",
                features: ["Physician-verified issuance", "Immutable Solana record", "Patient-controlled access", "Dosage traceability"],
              },
              {
                num: "02",
                index: "[ 02 ]",
                title: "DeSci\nResearch Hub",
                subtitle: "Open Science",
                icon: Microscope,
                href: "/research",
                desc: "Independent research published on decentralized infrastructure. Peer review without gatekeepers. Findings verified and permanently archived.",
                tag: "RESEARCH",
                features: ["Decentralized publishing", "Permissionless peer review", "On-chain archival", "Citation verification"],
              },
              {
                num: "03",
                index: "[ 03 ]",
                title: "AI Analysis\nEngine",
                subtitle: "Neural Evaluation",
                icon: BrainCircuit,
                href: "/ai",
                desc: "Cannabinoid profiling, terpene synergy modeling, and clinical recommendation generation powered by pharmacological knowledge graphs.",
                tag: "AI ANALYSIS",
                features: ["Cannabinoid profiling", "Terpene synergy modeling", "Clinical recommendations", "Risk assessment"],
              },
            ].map((pillar) => (
              <Link key={pillar.num} href={pillar.href} data-testid={`card-pillar-${pillar.index}`}>
                <div className="group bg-black hover:bg-white/[0.02] transition-all duration-500 p-8 md:p-12 flex flex-col cursor-pointer min-h-[640px] md:min-h-[720px] relative overflow-hidden">

                  {/* Giant watermark number */}
                  <div className="absolute top-0 right-0 text-[clamp(8rem,14vw,160px)] font-bold font-mono text-white/[0.03] group-hover:text-white/[0.05] transition-colors duration-500 leading-none select-none pointer-events-none pr-4 -mt-4">
                    {pillar.num}
                  </div>

                  {/* Top row */}
                  <div className="flex items-center justify-between mb-10 relative z-10">
                    <span className="index-num text-base">{pillar.index}</span>
                    <ArrowUpRight className="w-5 h-5 text-white/10 group-hover:text-primary/70 transition-colors duration-300" />
                  </div>

                  {/* Visual: leaf + icon */}
                  <div className="relative h-52 border border-white/[0.12] group-hover:border-white/[0.22] transition-colors duration-500 overflow-hidden bg-white/[0.01] flex items-center justify-center mb-10">
                    <img
                      src={crystalLeaf}
                      alt=""
                      className="absolute w-40 h-40 object-contain opacity-[0.06] group-hover:opacity-[0.16] transition-all duration-700 group-hover:scale-110 transform"
                      style={{ filter: "drop-shadow(0 0 20px rgba(168,230,61,0.4))" }}
                    />
                    <pillar.icon className="relative z-10 w-12 h-12 text-white/12 group-hover:text-primary/50 transition-colors duration-300" />
                    <div className="absolute top-3 left-4 section-label text-[9px] opacity-40">{pillar.tag}</div>
                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/30 transition-all duration-700" />
                    {/* Scan line */}
                    <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary/25 to-transparent animate-scan-line" />
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="relative z-10 flex flex-col flex-1">
                    <p className="text-white/30 text-[11px] mb-3 font-mono tracking-widest uppercase">{pillar.subtitle}</p>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-5 group-hover:text-primary transition-colors duration-300 leading-tight whitespace-pre-line">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-white/35 leading-relaxed mb-8">{pillar.desc}</p>

                    {/* Feature list */}
                    <ul className="space-y-2.5 mt-auto">
                      {pillar.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-xs font-mono text-white/30 group-hover:text-white/45 transition-colors duration-300">
                          <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary/70 flex-shrink-0 transition-colors duration-300" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* Explore link */}
                    <div className="mt-8 pt-6 border-t border-white/[0.08] group-hover:border-white/[0.16] transition-colors duration-300">
                      <span className="flex items-center gap-2 text-xs font-mono text-white/20 group-hover:text-primary/70 transition-colors duration-300">
                        Explore Module <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LIVE STATS ─── */}
      <section className="py-24 px-6 border-y border-white/[0.16]" data-testid="section-stats">
        <div className="max-w-7xl mx-auto">
          {/* Centered header */}
          <div className="flex flex-col items-center text-center mb-16 gap-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="section-label">NETWORK · LIVE METRICS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </div>
            <p className="text-white/20 text-xs font-mono">Real-time data from on-chain records</p>
          </div>

          {/* Stat grid - centered numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06]">
            {stats ? (
              <>
                <CountUpStat
                  target={stats.totalProducts}
                  label="Clinical Products"
                  testId="stat-clinical-products"
                />
                <CountUpStat
                  target={stats.verifiedDistributors}
                  label="Verified Distributors"
                  testId="stat-verified-distributors"
                />
                <CountUpStat
                  target={stats.totalResearch}
                  label="Active Research"
                  testId="stat-active-research"
                />
                <CountUpStat
                  target={stats.totalTransactionVolume}
                  prefix="$"
                  label="Total Volume"
                  testId="stat-total-volume"
                />
              </>
            ) : (
              /* Loading skeleton */
              [0,1,2,3].map(i => (
                <div key={i} className="bg-black py-14 px-6 flex flex-col items-center justify-center gap-3">
                  <div className="h-16 w-24 bg-white/[0.06] animate-pulse rounded" />
                  <div className="h-2.5 w-20 bg-white/[0.04] animate-pulse rounded" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ─── DISTRIBUTORS ─── */}
      {distributors && distributors.length > 0 && (
        <section className="py-28 px-6" data-testid="section-distributors">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-16">
              <div>
                <div className="section-label mb-4">DISTRIBUTION NETWORK</div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                  Trusted<br />Distributors
                </h2>
              </div>
              <Link href="/distributors">
                <span className="text-xs text-white/30 hover:text-white/60 transition-colors cursor-pointer flex items-center gap-1.5">
                  View All <ArrowUpRight className="w-3 h-3" />
                </span>
              </Link>
            </div>

            <div className="space-y-px bg-white/[0.08]">
              {distributors.slice(0, 3).map((dist, i) => (
                <Link key={dist.id} href={`/distributors/${dist.id}`} data-testid={`row-distributor-${dist.id}`}>
                  <div className="group bg-black hover:bg-white/[0.02] transition-colors px-6 sm:px-10 py-8 sm:py-10 flex flex-col md:flex-row md:items-start gap-6 md:gap-10 cursor-pointer">

                    {/* Index */}
                    <span className="index-num text-3xl sm:text-4xl w-12 flex-shrink-0 leading-none pt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Main content */}
                    <div className="flex-1 min-w-0 space-y-3">
                      {/* Name row */}
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-white text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
                          {dist.name}
                        </h3>
                        {dist.verified && (
                          <span className="flex items-center gap-1 text-[10px] font-mono text-primary/70 border border-primary/25 px-2 py-0.5">
                            <Shield className="w-2.5 h-2.5" /> VERIFIED
                          </span>
                        )}
                      </div>

                      {/* Location + license */}
                      <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-white/30">
                        <span>@ {dist.location}</span>
                        <span className="text-white/15">·</span>
                        <span>LIC {dist.licenseNumber}</span>
                      </div>

                      {/* Description */}
                      {dist.description && (
                        <p className="text-sm text-white/40 leading-relaxed line-clamp-2 max-w-2xl">
                          {dist.description}
                        </p>
                      )}

                      {/* Wallet */}
                      <div className="text-[10px] font-mono text-white/20">
                        {dist.walletAddress.slice(0, 8)}...{dist.walletAddress.slice(-6)} · SOLANA
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex md:flex-col items-center md:items-end gap-6 md:gap-5 flex-shrink-0">
                      <div className="text-center md:text-right">
                        <div className="text-2xl font-mono font-bold text-white">{dist.rating.toFixed(1)}</div>
                        <div className="text-[9px] font-mono text-white/25 uppercase tracking-widest mt-0.5">Rating</div>
                      </div>
                      <div className="text-center md:text-right">
                        <div className="text-2xl font-mono font-bold text-white">{dist.totalProducts}</div>
                        <div className="text-[9px] font-mono text-white/25 uppercase tracking-widest mt-0.5">Products</div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-primary/60 transition-colors md:mt-2" />
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── RECENT RESEARCH ─── */}
      {research && research.length > 0 && (
        <section className="py-28 px-6 border-t border-white/[0.16]" data-testid="section-research">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-16">
              <div>
                <div className="section-label mb-4">DESCI · OPEN SCIENCE</div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                  Latest<br />Research
                </h2>
              </div>
              <Link href="/research">
                <span className="text-xs text-white/30 hover:text-white/60 transition-colors cursor-pointer flex items-center gap-1.5">
                  View All <ArrowUpRight className="w-3 h-3" />
                </span>
              </Link>
            </div>

            <div className="space-y-px bg-white/[0.08]">
              {research.slice(0, 3).map((r, i) => (
                <Link key={r.id} href={`/research/${r.id}`} data-testid={`row-research-${r.id}`}>
                  <div className="group bg-black hover:bg-white/[0.02] transition-colors px-6 sm:px-10 py-8 sm:py-10 flex flex-col md:flex-row md:items-start gap-6 md:gap-10 cursor-pointer">

                    {/* Index */}
                    <span className="index-num text-3xl sm:text-4xl w-12 flex-shrink-0 leading-none pt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Main content */}
                    <div className="flex-1 min-w-0 space-y-3">
                      {/* Status + category badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 border ${
                          r.status === 'published' ? 'border-emerald-500/30 text-emerald-500/70' :
                          r.status === 'peer-review' ? 'border-blue-500/30 text-blue-500/70' :
                          r.status === 'in-progress' ? 'border-amber-500/30 text-amber-500/70' :
                          'border-white/20 text-white/30'
                        }`}>
                          {r.status.toUpperCase().replace('-', ' ')}
                        </span>
                        <span className="text-[10px] font-mono text-white/25 border border-white/[0.18] px-2 py-0.5">
                          {r.category.toUpperCase()}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-white text-xl font-semibold leading-snug group-hover:text-primary transition-colors">
                        {r.title}
                      </h3>

                      {/* Abstract preview */}
                      {r.abstract && (
                        <p className="text-sm text-white/40 leading-relaxed line-clamp-2 max-w-2xl">
                          {r.abstract}
                        </p>
                      )}

                      {/* Collaborators + date */}
                      <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-white/25">
                        {r.collaborators && (
                          <span>
                            {r.collaborators.split(",")[0]?.trim()}
                            {r.collaborators.split(",").length > 1
                              ? ` +${r.collaborators.split(",").length - 1} authors`
                              : ""}
                          </span>
                        )}
                        {r.publishedAt && (
                          <>
                            <span className="text-white/15">·</span>
                            <span>{new Date(r.publishedAt).getFullYear()}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex md:flex-col items-center md:items-end gap-6 md:gap-5 flex-shrink-0">
                      <div className="text-center md:text-right">
                        <div className="text-2xl font-mono font-bold text-white">{r.upvotes || 0}</div>
                        <div className="text-[9px] font-mono text-white/25 uppercase tracking-widest mt-0.5">Upvotes</div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-primary/60 transition-colors md:mt-2" />
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA ─── */}
      <section className="py-40 px-6 text-center relative overflow-hidden" data-testid="section-cta">
        {/* Crystal leaf watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src={crystalLeaf}
            alt=""
            className="w-[600px] h-[600px] object-contain opacity-[0.03] animate-float"
            style={{ filter: "drop-shadow(0 0 60px rgba(168,230,61,0.2))", animationDuration: "9s" }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[400px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(ellipse, #A8E63D 0%, transparent 70%)" }} />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex justify-center mb-8">
            <img
              src="/phytocure-icon.png"
              alt="Phytocure"
              className="w-20 h-20 object-contain drop-shadow-[0_0_24px_rgba(168,230,61,0.5)]"
            />
          </div>
          <div className="section-label mb-6">JOIN THE NETWORK</div>
          <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-bold leading-tight tracking-tight mb-8 text-white">
            The future of cannabis<br />medicine is open.
          </h2>
          <p className="text-white/35 text-lg mb-12 leading-relaxed">
            Submit research. Issue prescriptions. Acquire clinical-grade medicine.<br />All decentralized, all verifiable.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/app" data-testid="button-cta-launch">
              <span className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-black text-sm font-bold rounded cursor-pointer hover:bg-primary/90 transition-all">
                Open Platform <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link href="/research/new" data-testid="button-cta-research">
              <span className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white/60 text-sm rounded cursor-pointer hover:border-white/20 hover:text-white/80 transition-all">
                Submit Research
              </span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
