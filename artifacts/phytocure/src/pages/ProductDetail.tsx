import { AppLayout } from "@/components/layout/AppLayout";
import { useGetProduct, useCreateTransaction, getListTransactionsQueryKey, getGetProductQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ShieldCheck, ShoppingCart, BrainCircuit, ArrowUpRight, Loader2, ExternalLink, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useSolPrice } from "@/hooks/useSolPrice";
import { useWallet } from "@/contexts/WalletContext";
import { useSolanaPayment, type PaymentStatus } from "@/hooks/useSolanaPayment";

// Phytocure treasury wallet — all purchases are settled here on-chain.
// Replace with your actual treasury wallet address.
const TREASURY_WALLET = "5BNvMkDC4eeNzxrUJjgeUU5eSJcSfwPriMcrsuxaphet";

function statusLabel(status: PaymentStatus): string {
  switch (status) {
    case "building": return "Building transaction...";
    case "awaiting_approval": return "Approve in wallet...";
    case "sending": return "Broadcasting...";
    case "confirming": return "Confirming on-chain...";
    case "confirmed": return "Confirmed!";
    case "error": return "Transaction failed";
    default: return "";
  }
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "0", 10);
  const { data: product, isLoading } = useGetProduct(productId, { query: { enabled: !!productId, queryKey: getGetProductQueryKey(productId) } });
  const createTransaction = useCreateTransaction();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isPurchasing, setIsPurchasing] = useState<"SOL" | "PYCURE" | null>(null);
  const { price: solPrice, loading: solLoading, error: solError, lastUpdated, usdToSol } = useSolPrice();
  const { connected, address, openModal, refreshBalance } = useWallet();
  const { status: payStatus, error: payError, sendSol, reset: resetPay } = useSolanaPayment();

  const handlePurchase = async (currency: "SOL" | "PYCURE") => {
    if (!product) return;

    if (!connected || !address) {
      openModal();
      return;
    }

    if (currency === "PYCURE") {
      toast({ title: "$PYCURE Payments", description: "PYCURE token payments are coming soon. Use SOL for now.", variant: "destructive" });
      return;
    }

    setIsPurchasing("SOL");
    resetPay();

    try {
      const solAmount = usdToSol(product.priceUsd) ?? product.priceSol;

      const result = await sendSol({
        recipient: TREASURY_WALLET,
        amountSol: Number(solAmount.toFixed(6)),
        memo: `Phytocure: ${product.name}`,
      });

      if (!result) {
        setIsPurchasing(null);
        return;
      }

      await createTransaction.mutateAsync({
        data: {
          productId: product.id,
          amount: Number(solAmount.toFixed(6)),
          currency: "SOL",
          buyerWallet: address,
          txHash: result.txHash,
        },
      });

      await refreshBalance();
      queryClient.invalidateQueries({ queryKey: getListTransactionsQueryKey() });

      toast({
        title: "Transaction Confirmed",
        description: `Purchased ${product.name} · TX: ${result.txHash.slice(0, 8)}...${result.txHash.slice(-6)}`,
      });
    } catch {
      toast({ title: "Transaction Failed", description: payError ?? "Payment could not be processed.", variant: "destructive" });
    } finally {
      setIsPurchasing(null);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-8">
          <Skeleton className="h-5 w-28 bg-white/[0.07]" />
          <Skeleton className="h-14 w-2/3 bg-white/[0.07]" />
          <div className="grid md:grid-cols-3 gap-px bg-white/[0.08]">
            <div className="md:col-span-2 bg-black p-10"><Skeleton className="h-48 w-full bg-white/[0.07]" /></div>
            <div className="bg-black p-10"><Skeleton className="h-48 w-full bg-white/[0.07]" /></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!product) return <AppLayout><div className="text-white/30 pt-20 text-center">Product not found.</div></AppLayout>;

  const effects = product.effects.split(',').map(e => e.trim()).filter(Boolean);
  const solAmount = usdToSol ? usdToSol(product.priceUsd) : product.priceSol;
  const isBusy = isPurchasing !== null;

  return (
    <AppLayout>
      <div className="space-y-12">
        {/* Breadcrumb */}
        <Link href="/products">
          <span className="inline-flex items-center gap-2 text-xs font-mono text-white/25 hover:text-white/50 transition-colors cursor-pointer">
            <ArrowLeft className="w-3 h-3" /> Back to Directory
          </span>
        </Link>

        {/* Header */}
        <div className="border-b border-white/[0.16] pb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-[10px] font-mono border border-white/[0.20] px-2 py-0.5 rounded-sm text-white/35 uppercase">
              {product.category}
            </span>
            {product.verified && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-primary/60">
                <ShieldCheck className="w-2.5 h-2.5" /> VERIFIED CLINICAL
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4" data-testid="text-product-name">
            {product.name}
          </h1>
          <p className="text-white/40 text-lg max-w-2xl leading-relaxed">{product.description}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-white/[0.08]">
          {/* Main content */}
          <div className="md:col-span-2 bg-black p-10 space-y-10">
            {/* Cannabinoid profile */}
            <div>
              <div className="section-label mb-6">CANNABINOID PROFILE</div>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { label: "THC", value: product.thcContent, color: "bg-amber-500" },
                  { label: "CBD", value: product.cbdContent, color: "bg-primary" },
                ].map((bar) => (
                  <div key={bar.label} data-testid={`bar-${bar.label.toLowerCase()}`}>
                    <div className="flex justify-between font-mono text-sm mb-3">
                      <span className="text-white/40">{bar.label}</span>
                      <span className="text-white font-bold">{bar.value}%</span>
                    </div>
                    <div className="h-px bg-white/[0.07] w-full relative">
                      <div
                        className={`h-full ${bar.color} absolute top-0 left-0 transition-all duration-1000`}
                        style={{ width: `${Math.min(bar.value * 4, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-white/15 mt-2">
                      <span>0%</span><span>25%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Effects */}
            <div>
              <div className="section-label mb-6">THERAPEUTIC EFFECTS</div>
              <div className="flex flex-wrap gap-2">
                {effects.map((effect) => (
                  <span
                    key={effect}
                    className="text-xs font-mono px-3 py-1.5 border border-white/[0.18] rounded-sm text-white/40 hover:border-primary/30 hover:text-white/60 transition-colors"
                    data-testid={`tag-effect-${effect.toLowerCase().replace(/ /g, '-')}`}
                  >
                    {effect}
                  </span>
                ))}
              </div>
            </div>

            {/* Terpenoids */}
            {product.terpenoids && (
              <div>
                <div className="section-label mb-4">TERPENE PROFILE</div>
                <div className="border border-white/[0.16] p-5 rounded-sm">
                  <p className="text-sm font-mono text-white/35">{product.terpenoids}</p>
                </div>
              </div>
            )}

            {/* Distributor */}
            <div>
              <div className="section-label mb-4">DISTRIBUTOR</div>
              <Link href={`/distributors/${product.distributorId}`}>
                <div className="group flex items-center justify-between border border-white/[0.16] p-5 rounded-sm hover:border-primary/20 transition-colors cursor-pointer">
                  <div>
                    <p className="text-white font-medium group-hover:text-primary transition-colors">
                      {product.distributorName || `Distributor #${product.distributorId}`}
                    </p>
                    <p className="text-xs font-mono text-white/25 mt-1">Verified distributor on Phytocure network</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/15 group-hover:text-primary/50 transition-colors" />
                </div>
              </Link>
            </div>
          </div>

          {/* Sidebar: purchase */}
          <div className="bg-black p-10 flex flex-col gap-8">
            <div className="section-label">ACQUIRE</div>

            {/* Price */}
            <div className="border-b border-white/[0.16] pb-6">
              <div className="text-5xl font-bold font-mono text-white tracking-tight mb-1" data-testid="text-price-usd">
                ${product.priceUsd.toFixed(2)}
              </div>
              <div className="flex items-center gap-2 mt-1" data-testid="text-price-sol">
                <span className="text-primary font-mono text-lg">
                  {solLoading
                    ? "... SOL"
                    : solError
                    ? `${product.priceSol.toFixed(4)} SOL`
                    : `${solAmount?.toFixed(4)} SOL`}
                </span>
                {!solLoading && !solError && solPrice && (
                  <span className="flex items-center gap-1 text-[9px] font-mono text-white/30 border border-white/[0.12] px-1.5 py-0.5">
                    <span className="w-1 h-1 rounded-full bg-primary animate-pulse inline-block" />
                    LIVE · ${solPrice.toFixed(2)}/SOL
                    {lastUpdated && (
                      <span className="text-white/20">
                        · {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </span>
                    )}
                  </span>
                )}
                {solError && (
                  <span className="text-[9px] font-mono text-white/20 border border-white/[0.08] px-1.5 py-0.5">
                    STATIC PRICE
                  </span>
                )}
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-primary animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm font-mono text-white/40">{product.stock} units available</span>
            </div>

            {/* Wallet status */}
            {!connected && (
              <button
                onClick={openModal}
                className="w-full flex items-center justify-center gap-2 border border-white/[0.16] text-white/40 text-xs font-mono py-2.5 rounded hover:border-primary/30 hover:text-white/60 transition-all"
              >
                <Wallet className="w-3.5 h-3.5" />
                Connect wallet to purchase
              </button>
            )}

            {/* Buy buttons */}
            <div className="space-y-3">
              {/* SOL button */}
              <button
                data-testid="button-buy-sol"
                onClick={() => handlePurchase("SOL")}
                disabled={isBusy || product.stock <= 0}
                className={`w-full h-12 text-sm font-bold rounded flex items-center justify-center gap-2 transition-all ${
                  connected && product.stock > 0 && !isBusy
                    ? "bg-primary text-black hover:bg-primary/90 active:scale-[0.98]"
                    : connected
                    ? "bg-primary/20 text-primary/40 cursor-not-allowed"
                    : "bg-primary/10 text-primary/30 hover:bg-primary/15 hover:text-primary/50"
                }`}
              >
                {isBusy && isPurchasing === "SOL" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs">{statusLabel(payStatus)}</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    {connected ? "Buy with SOL" : "Connect & Buy with SOL"}
                  </>
                )}
              </button>

              {/* PYCURE button */}
              <div className="relative">
                <button
                  data-testid="button-buy-phyto"
                  onClick={() => handlePurchase("PYCURE")}
                  disabled={isBusy}
                  className="w-full h-12 border border-white/[0.14] text-white/25 text-sm font-medium rounded flex items-center justify-center gap-2 hover:border-white/20 hover:text-white/35 transition-all"
                >
                  Buy with $PYCURE
                </button>
                <span className="absolute top-0 right-0 -translate-y-1/2 translate-x-1 text-[9px] font-mono tracking-widest bg-black border border-white/[0.10] text-white/25 px-2 py-0.5 rounded-sm">
                  COMING SOON
                </span>
              </div>
            </div>

            {/* Payment error */}
            {payError && payStatus === "error" && (
              <div className="text-[10px] font-mono text-red-400/60 border border-red-500/20 px-3 py-2 rounded">
                {payError}
              </div>
            )}

            {/* Last confirmed TX */}
            {payStatus === "confirmed" && (
              <div className="text-[10px] font-mono text-primary/50 border border-primary/15 px-3 py-2 rounded flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Payment confirmed on Solana Mainnet
              </div>
            )}

            {/* On-chain settlement note */}
            {connected && (
              <div className="text-[9px] font-mono text-white/15 leading-relaxed">
                Payments settle on Solana Mainnet. TX hash recorded on-chain. View history in{" "}
                <Link href="/transactions">
                  <span className="text-primary/30 hover:text-primary/50 cursor-pointer">Transactions</span>
                </Link>
                {" "}or{" "}
                <a
                  href="https://solscan.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-primary/30 hover:text-primary/50"
                >
                  Solscan <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            )}

            {/* AI analysis link */}
            <div className="border border-white/[0.14] p-5 rounded-sm mt-auto">
              <div className="flex items-center gap-2 mb-3">
                <BrainCircuit className="w-4 h-4 text-white/20" />
                <span className="text-xs font-mono text-white/25">AI ANALYSIS</span>
              </div>
              <p className="text-xs text-white/25 mb-4 leading-relaxed">
                Run this strain through the AI engine for a clinical protocol match.
              </p>
              <Link href="/ai">
                <span className="text-xs text-primary/60 hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
                  Open Terminal <ArrowUpRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
