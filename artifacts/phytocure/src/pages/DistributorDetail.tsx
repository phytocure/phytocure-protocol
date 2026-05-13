import { AppLayout } from "@/components/layout/AppLayout";
import { useGetDistributor, useListProducts, getGetDistributorQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Shield, MapPin, ArrowUpRight } from "lucide-react";

export default function DistributorDetail() {
  const { id } = useParams<{ id: string }>();
  const distributorId = parseInt(id || "0", 10);

  const { data: distributor, isLoading } = useGetDistributor(distributorId, { query: { enabled: !!distributorId, queryKey: getGetDistributorQueryKey(distributorId) } });
  const { data: products, isLoading: productsLoading } = useListProducts(
    { distributorId }
  );

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-8">
          <Skeleton className="h-5 w-28 bg-white/[0.07]" />
          <Skeleton className="h-14 w-1/2 bg-white/[0.07]" />
          <div className="grid grid-cols-3 gap-px bg-white/[0.07]">
            {[1, 2, 3].map(i => <div key={i} className="bg-black p-8"><Skeleton className="h-20 w-full bg-white/[0.03]" /></div>)}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!distributor) return <AppLayout><div className="text-white/30 pt-20 text-center">Distributor not found.</div></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-12">
        <Link href="/distributors">
          <span className="inline-flex items-center gap-2 text-xs font-mono text-white/25 hover:text-white/50 transition-colors cursor-pointer">
            <ArrowLeft className="w-3 h-3" /> Back to Directory
          </span>
        </Link>

        {/* Header */}
        <div className="border-b border-white/[0.16] pb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {distributor.verified ? (
              <span className="flex items-center gap-1 text-[10px] font-mono text-primary/70">
                <Shield className="w-2.5 h-2.5" /> VERIFIED DISTRIBUTOR
              </span>
            ) : (
              <span className="text-[10px] font-mono text-white/25 border border-white/[0.16] px-2 py-0.5 rounded-sm">UNVERIFIED</span>
            )}
            <span className="text-[10px] font-mono text-white/25 flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5" /> {distributor.location}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4" data-testid="text-distributor-name">
            {distributor.name}
          </h1>
          <p className="text-white/40 text-lg max-w-2xl leading-relaxed">{distributor.description}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-px bg-white/[0.08]">
          {[
            { label: "Rating", value: distributor.rating.toFixed(1) + " / 5.0" },
            { label: "Products Listed", value: distributor.totalProducts },
            { label: "License", value: distributor.licenseNumber },
          ].map((stat) => (
            <div key={stat.label} className="bg-black p-8" data-testid={`stat-dist-${stat.label.toLowerCase().replace(/ /g, '-')}`}>
              <div className="text-xl font-mono font-bold text-white mb-2">{stat.value}</div>
              <div className="section-label text-[9px]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Wallet */}
        <div>
          <div className="section-label mb-4">SOLANA WALLET</div>
          <div className="border border-white/[0.16] p-5 rounded-sm">
            <p className="text-sm font-mono text-white/35 break-all" data-testid="text-wallet">{distributor.walletAddress}</p>
          </div>
        </div>

        {/* Products */}
        <div>
          <div className="section-label mb-8">AVAILABLE PRODUCTS</div>
          {productsLoading ? (
            <div className="space-y-px bg-white/[0.07]">
              {[1, 2, 3].map(i => <div key={i} className="bg-black p-8"><Skeleton className="h-5 w-1/2 bg-white/[0.07]" /></div>)}
            </div>
          ) : products?.length ? (
            <div className="space-y-px bg-white/[0.08]">
              {products.map((product, i) => (
                <Link key={product.id} href={`/products/${product.id}`} data-testid={`row-product-${product.id}`}>
                  <div className="group bg-black hover:bg-white/[0.02] transition-colors p-8 flex items-center gap-6 cursor-pointer">
                    <span className="index-num w-10 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <span className="text-[10px] font-mono border border-white/[0.18] px-2 py-0.5 rounded-sm text-white/30 uppercase">
                          {product.category}
                        </span>
                      </div>
                      <h3 className="text-white font-medium group-hover:text-primary transition-colors">{product.name}</h3>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-right flex-shrink-0">
                      <div>
                        <div className="text-xs font-mono text-white/30">THC {product.thcContent}%</div>
                        <div className="text-xs font-mono text-white/30">CBD {product.cbdContent}%</div>
                      </div>
                      <div>
                        <div className="text-white font-mono text-sm">${product.priceUsd.toFixed(2)}</div>
                        <div className="text-primary/60 font-mono text-xs">{product.priceSol.toFixed(3)} SOL</div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-primary/60 transition-colors flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border border-white/[0.16] p-16 text-center">
              <p className="text-white/25 text-sm">No products listed yet.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
