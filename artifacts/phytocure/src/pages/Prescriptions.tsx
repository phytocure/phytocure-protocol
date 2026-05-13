import { AppLayout } from "@/components/layout/AppLayout";
import { useListPrescriptions } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { FileText, Plus, ArrowUpRight, CheckCircle2, Clock, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function statusDot(status: string) {
  switch (status) {
    case 'active': return 'bg-emerald-500';
    case 'pending': return 'bg-amber-500';
    case 'fulfilled': return 'bg-blue-400';
    case 'expired': return 'bg-white/20';
    default: return 'bg-white/20';
  }
}

function statusLabel(status: string) {
  switch (status) {
    case 'active': return 'text-emerald-500/70 border-emerald-500/25';
    case 'pending': return 'text-amber-500/70 border-amber-500/25';
    case 'fulfilled': return 'text-blue-400/70 border-blue-400/25';
    case 'expired': return 'text-white/25 border-white/[0.16]';
    default: return 'text-white/25 border-white/[0.16]';
  }
}

export default function Prescriptions() {
  const { data: prescriptions, isLoading } = useListPrescriptions();

  return (
    <AppLayout>
      <div className="space-y-12">
        <div className="border-b border-white/[0.16] pb-8">
          <div className="section-label mb-4">CLINICAL: ON-CHAIN PROTOCOLS</div>
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-end">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white" data-testid="text-prescriptions-title">
              Prescriptions
            </h1>
            <Link href="/prescriptions/new" data-testid="button-new-prescription">
              <span className="inline-flex items-center gap-2 text-sm border border-white/[0.20] px-5 py-2.5 rounded text-white/60 hover:border-primary/40 hover:text-primary transition-all cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> New Protocol
              </span>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-px bg-white/[0.07]">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-black p-8">
                <Skeleton className="h-5 w-1/3 bg-white/[0.08] mb-3" />
                <Skeleton className="h-4 w-1/2 bg-white/[0.03]" />
              </div>
            ))}
          </div>
        ) : prescriptions?.length ? (
          <div className="space-y-px bg-white/[0.08]">
            {prescriptions.map((prescription, i) => (
              <div
                key={prescription.id}
                className="group bg-black hover:bg-white/[0.02] transition-colors p-8 flex flex-col md:flex-row gap-6 md:items-center"
                data-testid={`row-prescription-${prescription.id}`}
              >
                <span className="index-num w-10 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className={`text-[10px] font-mono border px-2 py-0.5 rounded-sm flex items-center gap-1.5 ${statusLabel(prescription.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot(prescription.status)}`} />
                      {prescription.status.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-white/20">
                      ID #{prescription.id.toString().padStart(6, '0')}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {prescription.productName || `Product #${prescription.productId}`}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-white/25 font-mono">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider mb-0.5 text-white/15">Condition</div>
                      {prescription.condition}
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider mb-0.5 text-white/15">Dosage</div>
                      {prescription.dosage}
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider mb-0.5 text-white/15">Frequency</div>
                      {prescription.frequency}
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider mb-0.5 text-white/15">Duration</div>
                      {prescription.duration}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-mono text-white/25">
                      {formatDistanceToNow(new Date(prescription.createdAt), { addSuffix: true })}
                    </div>
                    {prescription.txHash && (
                      <div className="text-[10px] font-mono text-primary/40 mt-1">
                        {prescription.txHash.slice(0, 8)}...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-white/[0.16] p-20 text-center">
            <FileText className="w-8 h-8 text-white/10 mx-auto mb-4" />
            <p className="text-white/25 mb-4">No prescriptions on-chain yet.</p>
            <Link href="/prescriptions/new">
              <span className="text-xs text-primary/60 hover:text-primary transition-colors cursor-pointer">Create the first protocol</span>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
