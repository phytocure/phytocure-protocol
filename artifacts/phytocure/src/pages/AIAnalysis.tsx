import { AppLayout } from "@/components/layout/AppLayout";
import { useAnalyzeStrain, useListAnalyses } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  BrainCircuit,
  CheckCircle,
  ArrowRight,
  BookOpen,
  X,
  FlaskConical,
  Leaf,
  Zap,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import type { StrainAnalysis } from "@workspace/api-client-react";

const analysisSchema = z.object({
  strainName: z.string().min(1, "Required"),
  thcContent: z.coerce.number().min(0).max(100),
  cbdContent: z.coerce.number().min(0).max(100),
  terpenoids: z.string().optional(),
  patientCondition: z.string().optional(),
});

const guideSteps = [
  {
    index: "01",
    icon: <FlaskConical className="w-4 h-4 text-primary" />,
    title: "Enter Strain or Formulation Name",
    body: "Input the exact name of the cannabis strain or clinical formulation you want to analyse, e.g. ACDC, Harlequin, CBD Isolate 20%, or a custom blend name. This becomes the identifier in your analysis report.",
    tip: 'Use precise names for better cross-referencing with the research database.',
  },
  {
    index: "02",
    icon: <Zap className="w-4 h-4 text-amber-400" />,
    title: "Set THC & CBD Percentages",
    body: "Enter the cannabinoid content as a percentage (0–100). These values drive the therapeutic profile, dosage protocol, and psychoactivity risk scoring. Use lab-certified CoA values when available for maximum accuracy.",
    tip: 'High THC (>20%) triggers elevated risk flags. High CBD (>10%) activates anti-inflammatory and neuroprotective scoring.',
  },
  {
    index: "03",
    icon: <Leaf className="w-4 h-4 text-primary" />,
    title: "Add Known Terpenoids (Optional)",
    body: "List the dominant terpenes separated by commas, e.g. Myrcene, Limonene, Pinene. Terpenes modulate the entourage effect and significantly alter the therapeutic and risk profile. Leave blank if unknown.",
    tip: 'Myrcene → sedation; Limonene → mood elevation; Pinene → alertness & memory counter-effect.',
  },
  {
    index: "04",
    icon: <ShieldAlert className="w-4 h-4 text-blue-400" />,
    title: "Describe Target Condition (Optional)",
    body: "Describe the clinical objective or patient symptoms, e.g. chronic neuropathic pain, treatment-resistant insomnia, PTSD with hypervigilance. This context tailors the dosage recommendation and contraindication flags.",
    tip: 'Be specific. "Severe chronic pain" returns a different protocol than "mild anxiety."',
  },
];

const outputGuide = [
  { label: "Therapeutic Profile", color: "text-white/70", desc: "Overall clinical assessment based on cannabinoid ratio and terpene synergy." },
  { label: "Recommended Dosage", color: "text-primary/80", desc: "Starting dose, titration schedule, and daily maximum in mg." },
  { label: "Risk Assessment", color: "text-amber-400/80", desc: "Psychoactivity risk, contraindication severity, and safety tier." },
  { label: "Contraindications", color: "text-red-400/80", desc: "Patient populations and co-medications that should avoid this formulation." },
];

function GuideModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 pb-8 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-black border border-white/[0.16] rounded-sm shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/[0.14]">
          <div className="flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="section-label text-[11px]">NEURAL: USAGE GUIDE</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-sm border border-white/[0.14] text-white/40 hover:text-white/80 hover:border-white/[0.25] transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="px-8 py-7 space-y-8">
          {/* Intro */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">How to Use the AI Analysis Terminal</h2>
            <p className="text-white/45 text-sm leading-relaxed">
              The Neural Analysis Engine generates a clinical pharmacological report for any cannabis strain or formulation. Provide the cannabinoid data below and the AI produces a therapeutic profile, dosage protocol, risk score, and contraindication list, based on peer-reviewed phytopharmacological models.
            </p>
          </div>

          {/* Input steps */}
          <div>
            <div className="section-label mb-5">INPUT PARAMETERS</div>
            <div className="space-y-px bg-white/[0.07]">
              {guideSteps.map((step) => (
                <div key={step.index} className="bg-black px-6 py-5 flex gap-5">
                  <span className="index-num w-8 flex-shrink-0 mt-0.5">{step.index}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {step.icon}
                      <span className="text-white font-semibold text-sm">{step.title}</span>
                    </div>
                    <p className="text-white/45 text-xs leading-relaxed mb-3">{step.body}</p>
                    <div className="flex items-start gap-2 bg-white/[0.03] border border-white/[0.12] rounded-sm px-3 py-2">
                      <ChevronRight className="w-3 h-3 text-primary/60 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] font-mono text-white/40 leading-relaxed">{step.tip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Output guide */}
          <div>
            <div className="section-label mb-5">UNDERSTANDING THE OUTPUT</div>
            <div className="grid grid-cols-2 gap-px bg-white/[0.07]">
              {outputGuide.map((o) => (
                <div key={o.label} className="bg-black px-5 py-4">
                  <div className={`text-[11px] font-mono font-semibold mb-1.5 ${o.color}`}>{o.label.toUpperCase()}</div>
                  <p className="text-white/35 text-xs leading-relaxed">{o.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Example */}
          <div className="border border-primary/[0.18] bg-primary/[0.03] rounded-sm px-6 py-5">
            <div className="section-label text-[9px] text-primary/50 mb-3">EXAMPLE INPUT</div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs font-mono">
              <div><span className="text-white/30">Strain:</span> <span className="text-white/70">ACDC</span></div>
              <div><span className="text-white/30">THC:</span> <span className="text-white/70">1.2%</span></div>
              <div><span className="text-white/30">CBD:</span> <span className="text-white/70">20.5%</span></div>
              <div><span className="text-white/30">Terpenoids:</span> <span className="text-white/70">Myrcene, Pinene</span></div>
              <div className="col-span-2"><span className="text-white/30">Condition:</span> <span className="text-white/70">Neuropathic pain, moderate severity, no psychoactivity preference</span></div>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-white/20 text-[11px] font-mono leading-relaxed border-t border-white/[0.10] pt-5">
            ⚠ This tool generates research-grade output based on pharmacological models. It is not a substitute for clinical diagnosis or prescription by a licensed physician. Always consult a qualified medical professional before initiating any cannabis therapy.
          </p>
        </div>

        {/* Footer CTA */}
        <div className="px-8 py-5 border-t border-white/[0.12] flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm bg-primary text-black font-bold px-6 py-2.5 rounded-sm hover:bg-primary/90 transition-all"
          >
            Start Analysis <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AIAnalysis() {
  const analyzeStrain = useAnalyzeStrain();
  const { data: pastAnalyses } = useListAnalyses();
  const [result, setResult] = useState<StrainAnalysis | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const form = useForm<z.infer<typeof analysisSchema>>({
    resolver: zodResolver(analysisSchema),
    defaultValues: { strainName: "", thcContent: 0, cbdContent: 0, terpenoids: "", patientCondition: "" },
  });

  const onSubmit = async (data: z.infer<typeof analysisSchema>) => {
    const res = await analyzeStrain.mutateAsync({ data });
    setResult(res);
  };

  return (
    <AppLayout>
      {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}

      <div className="space-y-12">
        {/* Header */}
        <div className="border-b border-white/[0.16] pb-8">
          <div className="section-label mb-4">NEURAL: ANALYSIS ENGINE</div>
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-end">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white" data-testid="text-ai-title">
              AI Analysis Terminal
            </h1>
            <button
              onClick={() => setShowGuide(true)}
              className="inline-flex items-center gap-2 text-sm border border-white/[0.18] px-5 py-2.5 rounded text-white/70 hover:border-primary/40 hover:text-primary transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              How to Use
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-px bg-white/[0.08]">
          {/* Input panel */}
          <div className="bg-black p-10" data-testid="panel-ai-input">
            <div className="section-label mb-8">INPUT PARAMETERS</div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="strainName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-mono text-white/40 uppercase tracking-wider">Strain / Formulation Name</FormLabel>
                      <FormControl>
                        <Input
                          data-testid="input-strain-name"
                          placeholder="e.g. ACDC, Harlequin, CBD Isolate..."
                          {...field}
                          className="bg-white/[0.03] border-white/[0.18] focus-visible:border-primary/40 focus-visible:ring-0 text-white placeholder:text-white/15 font-mono"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400/70 text-xs" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="thcContent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-mono text-white/40 uppercase tracking-wider">THC %</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-thc"
                            type="number"
                            step="0.1"
                            {...field}
                            className="bg-white/[0.03] border-white/[0.18] focus-visible:border-amber-500/40 focus-visible:ring-0 text-white font-mono"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400/70 text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cbdContent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-mono text-white/40 uppercase tracking-wider">CBD %</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-cbd"
                            type="number"
                            step="0.1"
                            {...field}
                            className="bg-white/[0.03] border-white/[0.18] focus-visible:border-primary/40 focus-visible:ring-0 text-white font-mono"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400/70 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="terpenoids"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-mono text-white/40 uppercase tracking-wider">Known Terpenoids (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          data-testid="input-terpenoids"
                          placeholder="Myrcene, Limonene, Pinene..."
                          {...field}
                          className="bg-white/[0.03] border-white/[0.18] focus-visible:border-primary/40 focus-visible:ring-0 text-white placeholder:text-white/15 font-mono"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patientCondition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-mono text-white/40 uppercase tracking-wider">Target Condition (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          data-testid="input-condition"
                          placeholder="Describe symptoms or clinical objective..."
                          className="bg-white/[0.03] border-white/[0.18] focus-visible:border-primary/40 focus-visible:ring-0 text-white placeholder:text-white/15 font-mono text-sm resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <button
                  data-testid="button-run-analysis"
                  type="submit"
                  disabled={analyzeStrain.isPending}
                  className="w-full h-12 bg-primary text-black text-sm font-bold rounded flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {analyzeStrain.isPending ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Run Analysis <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </Form>
          </div>

          {/* Output panel */}
          <div className="bg-black p-10" data-testid="panel-ai-output">
            <div className="section-label mb-8">ANALYSIS OUTPUT</div>
            {result ? (
              <div className="space-y-6" data-testid="div-analysis-result">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.16]">
                  <span className="text-white font-semibold">{result.strainName}</span>
                  <span className="text-[10px] font-mono flex items-center gap-1.5 text-primary/70">
                    <CheckCircle className="w-3 h-3" />
                    {(result.confidence * 100).toFixed(0)}% CONFIDENCE
                  </span>
                </div>

                {[
                  { label: "Therapeutic Profile", content: result.therapeuticProfile, color: "text-white/70", border: "border-white/[0.16]" },
                  { label: "Recommended Dosage", content: result.recommendedDosage, color: "text-primary/80", border: "border-primary/[0.12]" },
                  { label: "Risk Assessment", content: result.riskAssessment, color: "text-amber-500/70", border: "border-amber-500/[0.12]" },
                  { label: "Contraindications", content: result.contraindications, color: "text-red-400/70", border: "border-red-500/[0.12]" },
                ].map((section) => (
                  <div key={section.label} className={`border ${section.border} p-4 rounded-sm`} data-testid={`result-${section.label.toLowerCase().replace(/ /g, '-')}`}>
                    <div className="section-label text-[9px] mb-3">{section.label.toUpperCase()}</div>
                    <p className={`text-sm leading-relaxed font-mono ${section.color}`}>{section.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center" data-testid="div-awaiting-input">
                <BrainCircuit className="w-12 h-12 text-white/[0.06] mb-6" />
                <p className="text-white/20 text-sm max-w-xs font-light leading-relaxed mb-6">
                  Enter strain parameters to generate a clinical pharmacological analysis.
                </p>
                <button
                  onClick={() => setShowGuide(true)}
                  className="inline-flex items-center gap-2 text-xs font-mono text-white/35 hover:text-white/60 border border-white/[0.12] hover:border-white/[0.22] px-4 py-2 rounded-sm transition-all"
                >
                  <BookOpen className="w-3 h-3" /> View usage guide
                </button>

                {/* Past analyses */}
                {pastAnalyses && pastAnalyses.length > 0 && (
                  <div className="mt-10 w-full text-left">
                    <div className="section-label text-[9px] mb-4">RECENT ANALYSES</div>
                    <div className="space-y-2">
                      {pastAnalyses.slice(0, 3).map((a) => (
                        <div key={a.id} className="flex items-center justify-between py-2 border-b border-white/[0.12]">
                          <span className="text-white/30 text-xs font-mono">{a.strainName}</span>
                          <span className="text-[10px] font-mono text-primary/40">{(a.confidence * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
