import { AppLayout } from "@/components/layout/AppLayout";
import { useState, useMemo, useEffect, useRef } from "react";
import { FlaskConical, Zap, ShieldAlert, Activity, ChevronRight, RotateCcw, Download, Beaker, Microscope, Atom } from "lucide-react";

// ─── Compound data ────────────────────────────────────────────────────────────

const CANNABINOIDS = [
  { id: "thc",  label: "THC",  full: "Δ9-Tetrahydrocannabinol", color: "#f59e0b", max: 35 },
  { id: "cbd",  label: "CBD",  full: "Cannabidiol",              color: "#A8E63D", max: 40 },
  { id: "cbg",  label: "CBG",  full: "Cannabigerol",             color: "#34d399", max: 20 },
  { id: "cbn",  label: "CBN",  full: "Cannabinol",               color: "#a78bfa", max: 10 },
  { id: "cbc",  label: "CBC",  full: "Cannabichromene",          color: "#60a5fa", max: 10 },
  { id: "thcv", label: "THCV", full: "Tetrahydrocannabivarin",   color: "#f97316", max: 8  },
  { id: "cbdv", label: "CBDV", full: "Cannabidivarin",           color: "#e879f9", max: 8  },
];

const TERPENES = [
  { id: "myrcene",      label: "Myrcene",       note: "Sedation · Analgesia",      color: "#A8E63D" },
  { id: "limonene",     label: "Limonene",      note: "Mood · Anti-anxiety",       color: "#facc15" },
  { id: "linalool",     label: "Linalool",      note: "Sedation · Anti-anxiety",   color: "#c084fc" },
  { id: "pinene",       label: "α-Pinene",      note: "Alertness · Bronchodilator",color: "#34d399" },
  { id: "caryophyllene",label: "Caryophyllene", note: "Anti-inflammatory · CB2",   color: "#fb923c" },
  { id: "humulene",     label: "Humulene",      note: "Anti-inflammatory · Appetite suppression", color: "#f87171" },
  { id: "terpinolene",  label: "Terpinolene",   note: "Sedation · Antioxidant",    color: "#38bdf8" },
  { id: "ocimene",      label: "Ocimene",       note: "Antiviral · Decongestant",  color: "#a3e635" },
];

// ─── Simulation engine ────────────────────────────────────────────────────────

type Cannabinoids = Record<string, number>;
type Terpenes = Set<string>;

function clamp(v: number, lo = 0, hi = 100) { return Math.min(hi, Math.max(lo, v)); }

function computeSimulation(c: Cannabinoids, t: Terpenes) {
  const thc  = c.thc  ?? 0;
  const cbd  = c.cbd  ?? 0;
  const cbg  = c.cbg  ?? 0;
  const cbn  = c.cbn  ?? 0;
  const cbc  = c.cbc  ?? 0;
  const thcv = c.thcv ?? 0;
  const cbdv = c.cbdv ?? 0;

  const has = (id: string) => t.has(id);

  // Condition therapeutic scores (0–100)
  const conditions = [
    {
      name: "Chronic Neuropathic Pain",
      icon: "🧠",
      score: clamp(
        thc * 2.1 + cbd * 1.6 + cbg * 1.2 + cbc * 1.8 +
        (has("myrcene") ? 14 : 0) + (has("caryophyllene") ? 12 : 0) + (has("humulene") ? 8 : 0)
      ),
      citation: "Moulin et al., CMAJ 2014; Whiting et al., JAMA 2015",
    },
    {
      name: "Anxiety & PTSD",
      icon: "💊",
      score: clamp(
        cbd * 2.4 + cbg * 1.1 - thc * 0.9 + cbn * 0.8 +
        (has("linalool") ? 16 : 0) + (has("limonene") ? 13 : 0) + (has("pinene") ? 6 : 0)
      ),
      citation: "Blessing et al., Neurotherapeutics 2015",
    },
    {
      name: "Insomnia & Sleep Disorders",
      icon: "🌙",
      score: clamp(
        thc * 1.8 + cbd * 1.1 + cbn * 3.0 + cbg * 0.7 +
        (has("myrcene") ? 18 : 0) + (has("linalool") ? 14 : 0) + (has("terpinolene") ? 10 : 0)
      ),
      citation: "Kaul et al., J Clin Sleep Med 2021",
    },
    {
      name: "MS Spasticity",
      icon: "⚡",
      score: clamp(
        (Math.abs(thc - cbd) < 8 ? 30 : 0) + thc * 1.5 + cbd * 1.5 + cbc * 1.2 +
        (has("myrcene") ? 12 : 0) + (has("caryophyllene") ? 10 : 0)
      ),
      citation: "Collin et al., CNS Drugs 2019 (Sativex trials)",
    },
    {
      name: "Epilepsy & Seizure Control",
      icon: "🔬",
      score: clamp(
        cbd * 2.8 + cbdv * 4.0 + cbg * 1.0 - thc * 0.5 +
        (has("linalool") ? 10 : 0) + (has("pinene") ? 8 : 0)
      ),
      citation: "Devinsky et al., NEJM 2017 (Epidiolex RCT)",
    },
    {
      name: "Inflammation & Arthritis",
      icon: "🔥",
      score: clamp(
        cbd * 2.0 + cbc * 2.5 + cbg * 1.8 + thc * 0.8 +
        (has("caryophyllene") ? 18 : 0) + (has("humulene") ? 16 : 0) + (has("myrcene") ? 10 : 0)
      ),
      citation: "Nagarkatti et al., Future Med Chem 2009",
    },
    {
      name: "Chemotherapy-Induced Nausea",
      icon: "💉",
      score: clamp(
        thc * 2.2 + cbd * 1.4 + cbc * 0.9 +
        (has("limonene") ? 12 : 0) + (has("myrcene") ? 8 : 0)
      ),
      citation: "Smith et al., Cochrane Review 2015",
    },
    {
      name: "Depression & Mood Disorders",
      icon: "☀️",
      score: clamp(
        thcv * 3.5 + cbd * 1.6 + cbg * 1.9 - cbn * 0.7 +
        (has("limonene") ? 18 : 0) + (has("pinene") ? 12 : 0) + (has("ocimene") ? 6 : 0)
      ),
      citation: "Turna et al., J Affect Disord 2019",
    },
  ].sort((a, b) => b.score - a.score);

  // Psychoactivity risk (0–100)
  const psycho = clamp(thc * 3.2 + thcv * 1.5 - cbd * 1.1 - cbg * 0.4);

  // Entourage index (how many compounds are synergistic)
  const totalCannabinoids = Object.values(c).filter((v) => v > 0).length;
  const entourage = clamp(totalCannabinoids * 9 + t.size * 8);

  // Therapeutic index
  const topScore = conditions[0]?.score ?? 0;
  const therapeuticIndex = clamp(topScore - psycho * 0.4 + entourage * 0.25);

  // Synthesis tier
  let tier: "RESEARCH" | "CLINICAL" | "PHARMACEUTICAL" | "EXPERIMENTAL";
  if (therapeuticIndex >= 80) tier = "PHARMACEUTICAL";
  else if (therapeuticIndex >= 55) tier = "CLINICAL";
  else if (therapeuticIndex >= 30) tier = "RESEARCH";
  else tier = "EXPERIMENTAL";

  // Molecular formula approximation
  const totalMass = Object.values(c).reduce((a, v) => a + v, 0);

  return { conditions, psycho, entourage, therapeuticIndex, tier, totalMass };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AnimatedBar({ value, color, delay = 0 }: { value: number; color: string; delay?: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 80 + delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <div className="h-1 bg-white/[0.07] rounded-full overflow-hidden w-full">
      <div
        style={{ width: `${width}%`, backgroundColor: color, transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)" }}
        className="h-full rounded-full"
      />
    </div>
  );
}

function CannabinoidSlider({
  cb, value, onChange
}: { cb: typeof CANNABINOIDS[0]; value: number; onChange: (v: number) => void }) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cb.color }} />
          <span className="text-[11px] font-mono text-white/60 group-hover:text-white/80 transition-colors">{cb.label}</span>
          <span className="text-[9px] text-white/20 hidden lg:inline">{cb.full}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-mono tabular-nums" style={{ color: value > 0 ? cb.color : "rgba(255,255,255,0.2)" }}>
            {value.toFixed(1)}
          </span>
          <span className="text-[9px] text-white/20 font-mono">%</span>
        </div>
      </div>
      <div className="relative">
        <input
          type="range"
          min={0}
          max={cb.max}
          step={0.1}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="lab-slider w-full"
          style={{ "--thumb-color": cb.color, "--track-color": cb.color } as React.CSSProperties}
        />
        <div className="flex justify-between text-[8px] font-mono text-white/15 mt-0.5 px-0.5">
          <span>0</span><span>{cb.max}%</span>
        </div>
      </div>
    </div>
  );
}

function FlaskVisualization({ cannabinoids, terpenes }: { cannabinoids: Cannabinoids; terpenes: Terpenes }) {
  const totalCb = Object.values(cannabinoids).reduce((a, v) => a + v, 0);
  const segments = CANNABINOIDS.map((cb) => ({
    ...cb,
    pct: totalCb > 0 ? ((cannabinoids[cb.id] ?? 0) / Math.max(totalCb, 1)) * 100 : 0,
  })).filter((s) => s.pct > 0);

  const fillPct = Math.min(90, totalCb * 1.8);
  const activeTerpenes = TERPENES.filter((t) => terpenes.has(t.id));

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="section-label text-[9px] text-center">SYNTHESIS VESSEL</div>

      {/* Flask shape */}
      <div className="relative">
        <svg viewBox="0 0 120 180" className="w-28 h-40 drop-shadow-lg">
          {/* Flask outline */}
          <path
            d="M48 10 L48 70 L10 155 Q8 165 20 168 L100 168 Q112 165 110 155 L72 70 L72 10 Z"
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1.5"
          />
          {/* Flask neck fill */}
          <clipPath id="flask-clip">
            <path d="M48 10 L48 70 L10 155 Q8 165 20 168 L100 168 Q112 165 110 155 L72 70 L72 10 Z" />
          </clipPath>

          {/* Liquid fill */}
          <g clipPath="url(#flask-clip)">
            {/* Base fill */}
            <rect
              x="0" y={168 - (fillPct / 100) * 130}
              width="120" height={200}
              fill="rgba(168,230,61,0.06)"
            />
            {/* Compound layers */}
            {segments.reduce<{ prev: number; el: React.ReactNode[] }>((acc, seg, i) => {
              const layerH = (seg.pct / 100) * (fillPct / 100) * 130;
              const y = 168 - acc.prev - layerH;
              acc.el.push(
                <rect
                  key={seg.id}
                  x="0" y={y}
                  width="120" height={layerH}
                  fill={seg.color}
                  opacity={0.25 + i * 0.04}
                />
              );
              acc.prev += layerH;
              return acc;
            }, { prev: 0, el: [] }).el}

            {/* Bubble animation */}
            {fillPct > 10 && [1, 2, 3].map((n) => (
              <circle
                key={n}
                cx={30 + n * 20}
                cy={150 - n * 8}
                r={2}
                fill="rgba(168,230,61,0.4)"
                className={`bubble-${n}`}
                style={{ animation: `bubble ${1.5 + n * 0.4}s ease-in-out infinite`, animationDelay: `${n * 0.3}s` }}
              />
            ))}
          </g>

          {/* Flask neck border */}
          <rect x="45" y="8" width="30" height="3" fill="rgba(255,255,255,0.12)" rx="1" />

          {/* Level marks */}
          {[25, 50, 75].map((pct) => (
            <line
              key={pct}
              x1="105" y1={168 - (pct / 100) * 100}
              x2="112" y2={168 - (pct / 100) * 100}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.8"
            />
          ))}
        </svg>

        {/* Fill % label */}
        <div className="absolute bottom-0 right-0 text-[9px] font-mono text-white/20">
          {fillPct.toFixed(0)}%
        </div>
      </div>

      {/* Compound legend */}
      {segments.length > 0 ? (
        <div className="w-full space-y-1">
          {segments.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color, opacity: 0.7 }} />
              <span className="text-[10px] font-mono text-white/35">{s.label}</span>
              <div className="flex-1 h-px" style={{ backgroundColor: s.color, opacity: 0.15 }} />
              <span className="text-[10px] font-mono" style={{ color: s.color, opacity: 0.7 }}>
                {s.pct.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[10px] font-mono text-white/20 text-center">Add compounds to begin</p>
      )}

      {/* Active terpenes */}
      {activeTerpenes.length > 0 && (
        <div className="w-full pt-3 border-t border-white/[0.10]">
          <div className="section-label text-[8px] mb-2">ACTIVE TERPENES</div>
          <div className="flex flex-wrap gap-1">
            {activeTerpenes.map((t) => (
              <span
                key={t.id}
                className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm border"
                style={{ color: t.color, borderColor: t.color + "30", backgroundColor: t.color + "10" }}
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const defaultCannabinoids: Cannabinoids = {
  thc: 0, cbd: 0, cbg: 0, cbn: 0, cbc: 0, thcv: 0, cbdv: 0,
};

const PRESETS = [
  {
    label: "Epidiolex-Type",
    desc: "CBD isolate for epilepsy",
    c: { thc: 0, cbd: 20, cbg: 0, cbn: 0, cbc: 0, thcv: 0, cbdv: 0.5 },
    t: new Set(["linalool", "pinene"]),
  },
  {
    label: "Sativex-Type",
    desc: "1:1 THC:CBD for MS spasticity",
    c: { thc: 13.5, cbd: 12.5, cbg: 0, cbn: 0, cbc: 0, thcv: 0, cbdv: 0 },
    t: new Set(["myrcene", "linalool", "pinene"]),
  },
  {
    label: "Pain Protocol",
    desc: "High CBD + CBG + terpenes",
    c: { thc: 5, cbd: 18, cbg: 4, cbn: 1, cbc: 2, thcv: 0, cbdv: 0 },
    t: new Set(["myrcene", "caryophyllene", "humulene"]),
  },
  {
    label: "Sleep Formula",
    desc: "THC + CBN + sedating terpenes",
    c: { thc: 10, cbd: 8, cbg: 0, cbn: 4, cbc: 0, thcv: 0, cbdv: 0 },
    t: new Set(["myrcene", "linalool", "terpinolene"]),
  },
  {
    label: "Anti-Anxiety",
    desc: "CBD-dominant, no THC",
    c: { thc: 0, cbd: 15, cbg: 3, cbn: 0, cbc: 0, thcv: 2, cbdv: 0 },
    t: new Set(["linalool", "limonene", "pinene"]),
  },
];

export default function Laboratory() {
  const [cannabinoids, setCannabinoids] = useState<Cannabinoids>({ ...defaultCannabinoids });
  const [terpenes, setTerpenes] = useState<Terpenes>(new Set());
  const [scanActive, setScanActive] = useState(false);
  const scanTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sim = useMemo(() => computeSimulation(cannabinoids, terpenes), [cannabinoids, terpenes]);

  const hasAny = Object.values(cannabinoids).some((v) => v > 0);

  function triggerScan() {
    setScanActive(true);
    if (scanTimeout.current) clearTimeout(scanTimeout.current);
    scanTimeout.current = setTimeout(() => setScanActive(false), 1200);
  }

  function setCb(id: string, val: number) {
    setCannabinoids((prev) => ({ ...prev, [id]: val }));
    triggerScan();
  }

  function toggleTerpene(id: string) {
    setTerpenes((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
    triggerScan();
  }

  function applyPreset(p: typeof PRESETS[0]) {
    setCannabinoids({ ...p.c });
    setTerpenes(new Set(p.t));
    triggerScan();
  }

  function reset() {
    setCannabinoids({ ...defaultCannabinoids });
    setTerpenes(new Set());
  }

  const tierColors: Record<string, string> = {
    PHARMACEUTICAL: "#A8E63D",
    CLINICAL: "#60a5fa",
    RESEARCH: "#f59e0b",
    EXPERIMENTAL: "#f87171",
  };
  const tierColor = tierColors[sim.tier];

  return (
    <AppLayout>
      {/* Lab grid CSS */}
      <style>{`
        .lab-grid {
          background-image:
            linear-gradient(rgba(168,230,61,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,230,61,0.04) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        .lab-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 3px;
          border-radius: 99px;
          outline: none;
          cursor: pointer;
          background: rgba(255,255,255,0.08);
        }
        .lab-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: var(--thumb-color);
          cursor: pointer;
          box-shadow: 0 0 8px var(--thumb-color);
          border: 2px solid rgba(0,0,0,0.5);
          transition: transform 0.15s;
        }
        .lab-slider::-webkit-slider-thumb:hover { transform: scale(1.3); }
        .lab-slider::-moz-range-thumb {
          width: 13px; height: 13px; border-radius: 50%;
          background: var(--thumb-color); cursor: pointer;
          box-shadow: 0 0 8px var(--thumb-color); border: 2px solid rgba(0,0,0,0.5);
        }
        @keyframes scanline {
          0%   { top: 0%;    opacity: 0.9; }
          100% { top: 100%;  opacity: 0; }
        }
        @keyframes bubble {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
          50%       { transform: translateY(-12px) scale(1.3); opacity: 0.8; }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .scan-line {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(transparent, rgba(168,230,61,0.5), transparent);
          animation: scanline 1.2s linear forwards;
          pointer-events: none; z-index: 10;
        }
      `}</style>

      <div className="space-y-10">
        {/* ── Header ── */}
        <div className="border-b border-white/[0.16] pb-8">
          <div className="section-label mb-4 flex items-center gap-2">
            <Beaker className="w-3 h-3" /> LAB: COMPOUND SYNTHESIS ENGINE
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-end">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                Laboratory
              </h1>
              <p className="text-white/35 text-sm mt-2 max-w-xl leading-relaxed">
                Blend cannabinoids and terpenes to simulate a custom medicinal formula. The engine computes therapeutic indices, condition affinity, and safety tier in real time, based on peer-reviewed pharmacological models.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-xs font-mono text-white/40 hover:text-white/70 border border-white/[0.14] hover:border-white/[0.25] px-3 py-2 rounded-sm transition-all"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* ── Presets ── */}
        <div>
          <div className="section-label mb-3">QUICK PRESETS: KNOWN CLINICAL FORMULAS</div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className="group flex flex-col items-start gap-0.5 text-left px-4 py-2.5 border border-white/[0.14] hover:border-primary/40 hover:bg-primary/[0.04] rounded-sm transition-all"
              >
                <span className="text-xs font-mono text-white/70 group-hover:text-primary transition-colors">{p.label}</span>
                <span className="text-[10px] text-white/25 group-hover:text-white/40">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid xl:grid-cols-[1fr_220px_1fr] gap-px bg-white/[0.10]">

          {/* Left: Cannabinoid sliders */}
          <div className="bg-black p-8 lab-grid">
            <div className="section-label mb-6 flex items-center gap-2">
              <Atom className="w-3 h-3" /> CANNABINOID PROFILE
            </div>
            <div className="space-y-5">
              {CANNABINOIDS.map((cb) => (
                <CannabinoidSlider
                  key={cb.id}
                  cb={cb}
                  value={cannabinoids[cb.id] ?? 0}
                  onChange={(v) => setCb(cb.id, v)}
                />
              ))}
            </div>

            {/* Total mass */}
            <div className="mt-6 pt-5 border-t border-white/[0.12] flex items-center justify-between">
              <span className="text-[10px] font-mono text-white/25">TOTAL ACTIVE MASS</span>
              <span className="text-sm font-mono text-white/60 tabular-nums">
                {Object.values(cannabinoids).reduce((a, v) => a + v, 0).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Center: Flask visualization */}
          <div className="bg-black p-6 flex flex-col items-center justify-start gap-6 border-x border-white/[0.10]">
            <FlaskVisualization cannabinoids={cannabinoids} terpenes={terpenes} />

            {/* Tier badge */}
            {hasAny && (
              <div
                className="w-full border rounded-sm px-3 py-2.5 text-center"
                style={{ borderColor: tierColor + "40", backgroundColor: tierColor + "08" }}
              >
                <div className="text-[8px] font-mono text-white/25 mb-1">SYNTHESIS TIER</div>
                <div className="text-sm font-mono font-bold" style={{ color: tierColor }}>
                  {sim.tier}
                </div>
              </div>
            )}
          </div>

          {/* Right: Terpene panel */}
          <div className="bg-black p-8 lab-grid">
            <div className="section-label mb-6 flex items-center gap-2">
              <Microscope className="w-3 h-3" /> TERPENE MATRIX
            </div>
            <div className="grid grid-cols-1 gap-2">
              {TERPENES.map((tp) => {
                const active = terpenes.has(tp.id);
                return (
                  <button
                    key={tp.id}
                    onClick={() => toggleTerpene(tp.id)}
                    className="flex items-center gap-3 text-left px-3 py-3 border rounded-sm transition-all"
                    style={{
                      borderColor: active ? tp.color + "40" : "rgba(255,255,255,0.08)",
                      backgroundColor: active ? tp.color + "08" : "transparent",
                    }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all"
                      style={{
                        backgroundColor: active ? tp.color : "rgba(255,255,255,0.12)",
                        boxShadow: active ? `0 0 6px ${tp.color}` : "none",
                      }}
                    />
                    <div className="flex-1">
                      <div
                        className="text-xs font-mono transition-colors"
                        style={{ color: active ? tp.color : "rgba(255,255,255,0.45)" }}
                      >
                        {tp.label}
                      </div>
                      <div className="text-[9px] text-white/20 mt-0.5">{tp.note}</div>
                    </div>
                    {active && (
                      <span className="text-[8px] font-mono text-white/30 flex-shrink-0">ACTIVE</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Simulation Output ── */}
        <div className="relative overflow-hidden border border-white/[0.16] rounded-sm">
          {scanActive && <div className="scan-line" />}

          <div className="px-8 py-5 border-b border-white/[0.14] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-3.5 h-3.5 text-primary" />
              <span className="section-label text-[11px]">LAB: THERAPEUTIC SIMULATION OUTPUT</span>
              {scanActive && (
                <span className="text-[9px] font-mono text-primary/60 flex items-center gap-1">
                  <span style={{ animation: "blink 0.5s step-end infinite" }}>▮</span> ANALYSING
                </span>
              )}
            </div>
            {hasAny && (
              <span className="text-[10px] font-mono text-white/25">
                {sim.conditions.filter((c) => c.score >= 40).length} indication{sim.conditions.filter((c) => c.score >= 40).length !== 1 ? "s" : ""} detected
              </span>
            )}
          </div>

          {!hasAny ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FlaskConical className="w-10 h-10 text-white/[0.06] mb-5" />
              <p className="text-white/20 text-sm font-mono">Add compounds above to run the therapeutic simulation.</p>
            </div>
          ) : (
            <div className="p-8 grid md:grid-cols-2 gap-8">
              {/* Condition scores */}
              <div>
                <div className="section-label text-[9px] mb-5">CONDITION AFFINITY: RANKED</div>
                <div className="space-y-4">
                  {sim.conditions.map((cond, i) => (
                    <div key={cond.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="index-num text-[10px] w-5">{String(i + 1).padStart(2, "0")}</span>
                          <span className="text-xs text-white/60 font-mono">{cond.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs font-mono font-bold tabular-nums"
                            style={{ color: cond.score >= 70 ? "#A8E63D" : cond.score >= 45 ? "#f59e0b" : "rgba(255,255,255,0.3)" }}
                          >
                            {cond.score.toFixed(0)}
                          </span>
                          {cond.score >= 70 && (
                            <span className="text-[8px] font-mono text-primary/50 border border-primary/20 px-1 rounded-sm">HIGH</span>
                          )}
                        </div>
                      </div>
                      <AnimatedBar
                        value={cond.score}
                        color={cond.score >= 70 ? "#A8E63D" : cond.score >= 45 ? "#f59e0b" : "rgba(255,255,255,0.18)"}
                        delay={i * 40}
                      />
                      {cond.score >= 40 && (
                        <div className="flex items-start gap-1 mt-1.5">
                          <ChevronRight className="w-2.5 h-2.5 text-white/15 flex-shrink-0 mt-0.5" />
                          <p className="text-[9px] font-mono text-white/20 leading-relaxed">{cond.citation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics panel */}
              <div className="space-y-6">
                {/* Key metrics */}
                <div>
                  <div className="section-label text-[9px] mb-4">PHARMACOLOGICAL INDICES</div>
                  <div className="grid grid-cols-2 gap-px bg-white/[0.08]">
                    {[
                      {
                        label: "Therapeutic Index",
                        value: sim.therapeuticIndex.toFixed(0),
                        unit: "/100",
                        color: sim.therapeuticIndex >= 60 ? "#A8E63D" : "#f59e0b",
                        icon: <Zap className="w-3 h-3" />,
                      },
                      {
                        label: "Psychoactivity Risk",
                        value: sim.psycho.toFixed(0),
                        unit: "/100",
                        color: sim.psycho <= 30 ? "#A8E63D" : sim.psycho <= 60 ? "#f59e0b" : "#f87171",
                        icon: <ShieldAlert className="w-3 h-3" />,
                      },
                      {
                        label: "Entourage Effect",
                        value: sim.entourage.toFixed(0),
                        unit: "/100",
                        color: "#60a5fa",
                        icon: <Atom className="w-3 h-3" />,
                      },
                      {
                        label: "Synthesis Tier",
                        value: sim.tier,
                        unit: "",
                        color: tierColor,
                        icon: <FlaskConical className="w-3 h-3" />,
                      },
                    ].map((m) => (
                      <div key={m.label} className="bg-black px-4 py-4">
                        <div className="flex items-center gap-1.5 mb-2" style={{ color: m.color, opacity: 0.6 }}>
                          {m.icon}
                          <span className="text-[9px] font-mono">{m.label.toUpperCase()}</span>
                        </div>
                        <div className="font-mono font-bold tabular-nums" style={{ color: m.color }}>
                          {m.value}
                          <span className="text-xs opacity-40 font-normal ml-0.5">{m.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Index bars */}
                <div className="space-y-3">
                  {[
                    { label: "Therapeutic Index", value: sim.therapeuticIndex, color: sim.therapeuticIndex >= 60 ? "#A8E63D" : "#f59e0b" },
                    { label: "Psychoactivity Risk", value: sim.psycho, color: sim.psycho <= 30 ? "#A8E63D" : sim.psycho <= 60 ? "#f59e0b" : "#f87171" },
                    { label: "Entourage Effect", value: sim.entourage, color: "#60a5fa" },
                  ].map((bar, i) => (
                    <div key={bar.label}>
                      <div className="flex justify-between text-[9px] font-mono mb-1">
                        <span className="text-white/30">{bar.label}</span>
                        <span style={{ color: bar.color }}>{bar.value.toFixed(0)}%</span>
                      </div>
                      <AnimatedBar value={bar.value} color={bar.color} delay={i * 60} />
                    </div>
                  ))}
                </div>

                {/* Top indication callout */}
                {sim.conditions[0] && sim.conditions[0].score >= 30 && (
                  <div className="border border-primary/[0.18] bg-primary/[0.03] rounded-sm px-5 py-4">
                    <div className="section-label text-[8px] text-primary/40 mb-2">PRIMARY THERAPEUTIC TARGET</div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{sim.conditions[0].icon}</span>
                      <span className="text-white font-semibold text-sm">{sim.conditions[0].name}</span>
                    </div>
                    <p className="text-[10px] font-mono text-white/30 leading-relaxed">
                      Affinity score: {sim.conditions[0].score.toFixed(0)}/100, {sim.conditions[0].citation}
                    </p>
                  </div>
                )}

                {/* Disclaimer */}
                <p className="text-[10px] font-mono text-white/15 leading-relaxed border-t border-white/[0.08] pt-4">
                  ⚠ Simulation results are computational estimates based on pharmacological receptor models. Not a substitute for clinical validation or regulatory approval. Always consult licensed medical professionals before any therapeutic use.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
