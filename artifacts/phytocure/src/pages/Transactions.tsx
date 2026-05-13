import { AppLayout } from "@/components/layout/AppLayout";
import { useListTransactions } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRightLeft, CheckCircle2, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";

function statusDot(status: string) {
  switch (status) {
    case 'confirmed': return 'bg-emerald-500';
    case 'pending': return 'bg-amber-500';
    case 'failed': return 'bg-red-500';
    default: return 'bg-white/20';
  }
}

function statusTextClass(status: string) {
  switch (status) {
    case 'confirmed': return 'text-emerald-500/60';
    case 'pending': return 'text-amber-500/60';
    case 'failed': return 'text-red-400/60';
    default: return 'text-white/25';
  }
}

export default function Transactions() {
  const { data: transactions, isLoading } = useListTransactions();

  return (
    <AppLayout>
      <div className="space-y-12">
        <div className="border-b border-white/[0.16] pb-8">
          <div className="section-label mb-4">SOLANA: ON-CHAIN LEDGER</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white" data-testid="text-transactions-title">
            Transaction Ledger
          </h1>
        </div>

        {isLoading ? (
          <div className="space-y-px bg-white/[0.07]">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-black p-6">
                <Skeleton className="h-5 w-full bg-white/[0.07]" />
              </div>
            ))}
          </div>
        ) : transactions?.length ? (
          <>
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[2rem_1fr_1fr_1fr_1fr_1fr] gap-6 px-8 pb-3 border-b border-white/[0.12]">
              {["#", "Date", "Product", "Amount", "Wallet", "Tx Hash"].map((h) => (
                <div key={h} className="section-label text-[9px]">{h}</div>
              ))}
            </div>
            <div className="space-y-px bg-white/[0.08]">
              {transactions.map((tx, i) => (
                <div
                  key={tx.id}
                  className="group bg-black hover:bg-white/[0.02] transition-colors px-8 py-5 grid grid-cols-1 md:grid-cols-[2rem_1fr_1fr_1fr_1fr_1fr] gap-3 md:gap-6 items-center"
                  data-testid={`row-transaction-${tx.id}`}
                >
                  <span className="index-num">{String(i + 1).padStart(2, "0")}</span>

                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot(tx.status)}`} />
                    <span className={`text-xs font-mono ${statusTextClass(tx.status)}`}>
                      {tx.status.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs text-white/50 font-mono">
                      {format(new Date(tx.createdAt), 'MMM d, yyyy')}
                    </div>
                    <div className="text-[10px] text-white/20 font-mono">
                      {format(new Date(tx.createdAt), 'HH:mm')}
                    </div>
                  </div>

                  <div className="text-sm text-white/60 truncate">
                    {tx.productName || `Product #${tx.productId}`}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-mono font-semibold text-sm">{tx.amount}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm border ${
                      tx.currency === 'SOL' ? 'border-violet-500/20 text-violet-400/60' : 'border-primary/20 text-primary/60'
                    }`}>
                      {tx.currency}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-white/25">
                      {tx.buyerWallet.slice(0, 4)}...{tx.buyerWallet.slice(-4)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-white/20 bg-white/[0.03] border border-white/[0.16] px-2 py-1 rounded-sm">
                      {tx.txHash.slice(0, 10)}...
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="border border-white/[0.16] p-20 text-center">
            <ArrowRightLeft className="w-8 h-8 text-white/10 mx-auto mb-4" />
            <p className="text-white/25">No transactions recorded yet.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
