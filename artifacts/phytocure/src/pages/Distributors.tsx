import { AppLayout } from "@/components/layout/AppLayout";
import { useListDistributors } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Shield, MapPin, ArrowUpRight, Truck } from "lucide-react";

export default function Distributors() {
  const { data: distributors, isLoading } = useListDistributors();

  return (
    <AppLayout>
      <div className="space-y-12">
        <div className="border-b border-white/[0.16] pb-8">
          <div className="section-label mb-4">NETWORK: DISTRIBUTION</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white" data-testid="text-distributors-title">
            Trusted Distributors
          </h1>
        </div>

        {isLoading ? (
          <div className="space-y-px bg-white/[0.07]">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-black p-8">
                <Skeleton className="h-6 w-1/4 bg-white/[0.08] mb-3" />
                <Skeleton className="h-4 w-1/2 bg-white/[0.03]" />
              </div>
            ))}
          </div>
        ) : distributors?.length ? (
          <div className="space-y-px bg-white/[0.08]">
            {distributors.map((distributor, i) => (
              <Link key={distributor.id} href={`/distributors/${distributor.id}`} data-testid={`row-distributor-${distributor.id}`}>
                <div className="group bg-black hover:bg-white/[0.02] transition-colors p-8 flex flex-col md:flex-row gap-6 md:items-center cursor-pointer">
                  <span className="index-num w-10 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      {distributor.verified ? (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-primary/70">
                          <Shield className="w-2.5 h-2.5" /> VERIFIED
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-white/25 border border-white/[0.16] px-2 py-0.5 rounded-sm">
                          UNVERIFIED
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-white/25 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" /> {distributor.location}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold text-lg group-hover:text-primary transition-colors mb-1">
                      {distributor.name}
                    </h3>
                    <p className="text-sm text-white/30 line-clamp-1">{distributor.description}</p>
                  </div>

                  <div className="flex items-center gap-10 flex-shrink-0">
                    <div className="hidden md:block text-right">
                      <div className="text-white/60 font-mono text-sm">{distributor.rating.toFixed(1)}</div>
                      <div className="section-label text-[9px]">Rating</div>
                    </div>
                    <div className="hidden md:block text-right">
                      <div className="text-white/60 font-mono text-sm">{distributor.totalProducts}</div>
                      <div className="section-label text-[9px]">Products</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/40 font-mono text-xs truncate max-w-[100px]">
                        {distributor.walletAddress.slice(0, 4)}...{distributor.walletAddress.slice(-4)}
                      </div>
                      <div className="section-label text-[9px]">Wallet</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-primary/60 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-white/[0.16] p-20 text-center">
            <Truck className="w-8 h-8 text-white/10 mx-auto mb-4" />
            <p className="text-white/25">No distributors found.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
