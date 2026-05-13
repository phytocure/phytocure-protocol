import { AppLayout } from "@/components/layout/AppLayout";
import { useListProducts } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ShieldCheck, ArrowUpRight, Beaker, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import type { Product } from "@workspace/api-client-react";
import { useSolPrice } from "@/hooks/useSolPrice";

const CATEGORY_COLORS: Record<string, string> = {
  extract:  "border-primary/40 text-primary/80",
  tincture: "border-blue-400/40 text-blue-400/80",
  flower:   "border-emerald-400/40 text-emerald-400/80",
  capsule:  "border-violet-400/40 text-violet-400/80",
  indica:   "border-rose-400/40 text-rose-400/80",
  sativa:   "border-amber-400/40 text-amber-400/80",
  hybrid:   "border-cyan-400/40 text-cyan-400/80",
};

function ProductCard({ product, index, usdToSol, solPrice }: { product: Product; index: number; usdToSol: (usd: number) => number | null; solPrice: number | null }) {
  const catColor = CATEGORY_COLORS[product.category] ?? "border-white/20 text-white/40";
  const [imgError, setImgError] = useState(false);
  const liveSol = usdToSol(product.priceUsd);

  return (
    <Link href={`/products/${product.id}`} data-testid={`card-product-${product.id}`} className="h-full">
      <div className="group bg-black border border-white/[0.10] hover:border-white/[0.20] transition-all duration-300 flex flex-col cursor-pointer h-full">

        {/* ── Image ─────────────────────────────────── */}
        <div className="relative overflow-hidden bg-[#0a0a0a]" style={{ height: 200 }}>
          {/* Index */}
          <span className="absolute top-2.5 left-3 z-10 text-[9px] font-mono text-white/20">
            {String(index + 1).padStart(2, "0")}
          </span>
          {/* Verified */}
          {product.verified && (
            <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 text-[8px] font-mono text-primary/70 bg-black/80 backdrop-blur-sm px-1.5 py-0.5 border border-primary/20">
              <ShieldCheck className="w-2 h-2" /> VERIFIED
            </div>
          )}

          {product.imageUrl && !imgError ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain p-5 group-hover:scale-[1.04] transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/10">
              <Beaker className="w-8 h-8" />
              <span className="text-[9px] font-mono uppercase tracking-widest">{product.category}</span>
            </div>
          )}

          {/* Hover scan line */}
          <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-scan-line" />
          </div>
          {/* Bottom gradient fade into card */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>

        {/* ── Info ──────────────────────────────────── */}
        <div className="flex flex-col flex-1 p-4 gap-3 border-t border-white/[0.07]">

          {/* Row 1: category badge + distributor */}
          <div className="flex items-center justify-between gap-2">
            <span className={`shrink-0 text-[8px] font-mono px-1.5 py-0.5 border uppercase tracking-wider ${catColor}`}>
              {product.category}
            </span>
            <span className="text-[9px] font-mono text-white/20 truncate min-w-0 text-right leading-tight">
              {product.distributorName?.split(" (")[0]}
            </span>
          </div>

          {/* Row 2: name - always 2 lines tall */}
          <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2" style={{ minHeight: "2.6rem" }}>
            {product.name}
          </h3>

          {/* Row 3: THC / CBD bars */}
          <div className="flex flex-col gap-1.5">
            {[
              { label: "THC", val: product.thcContent, color: "bg-amber-400/60" },
              { label: "CBD", val: product.cbdContent, color: "bg-primary/60" },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-2">
                <span className="text-[8px] font-mono text-white/25 w-6 shrink-0">{b.label}</span>
                <div className="flex-1 h-[1px] bg-white/[0.06]">
                  <div className={`h-full ${b.color}`} style={{ width: `${Math.min(b.val * 4, 100)}%` }} />
                </div>
                <span className="text-[8px] font-mono text-white/25 w-7 text-right shrink-0">{b.val}%</span>
              </div>
            ))}
          </div>

          {/* Row 4: price, pinned to bottom */}
          <div className="mt-auto pt-3 border-t border-white/[0.07] flex items-center justify-between">
            <div>
              <div className="text-white font-mono font-semibold text-sm leading-none mb-0.5">
                ${product.priceUsd.toFixed(2)}
              </div>
              <div className="flex items-center gap-1 text-white/25 font-mono text-[9px]">
                {(liveSol ?? product.priceSol).toFixed(3)} SOL
                {solPrice && <span className="w-1 h-1 rounded-full bg-primary animate-pulse inline-block" />}
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-white/12 group-hover:text-primary/70 transition-colors shrink-0" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function ProductRow({ product, index, usdToSol, solPrice }: { product: Product; index: number; usdToSol: (usd: number) => number | null; solPrice: number | null }) {
  const [imgError, setImgError] = useState(false);
  const liveSol = usdToSol(product.priceUsd);
  return (
    <Link key={product.id} href={`/products/${product.id}`} data-testid={`row-product-${product.id}`}>
      <div className="group bg-black hover:bg-white/[0.02] transition-colors p-4 sm:p-6 flex items-center gap-4 sm:gap-6 cursor-pointer">
        {/* Thumbnail */}
        <div className="w-14 h-14 flex-shrink-0 border border-white/[0.10] bg-white/[0.02] flex items-center justify-center overflow-hidden">
          {product.imageUrl && !imgError ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-1.5"
              onError={() => setImgError(true)} />
          ) : (
            <Beaker className="w-5 h-5 text-white/15" />
          )}
        </div>

        <span className="index-num w-8 flex-shrink-0 hidden sm:block">{String(index + 1).padStart(2, "0")}</span>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[9px] font-mono border border-white/[0.18] px-1.5 py-0.5 text-white/35 uppercase">{product.category}</span>
            {product.verified && (
              <span className="flex items-center gap-1 text-[9px] font-mono text-primary/60">
                <ShieldCheck className="w-2.5 h-2.5" /> VERIFIED
              </span>
            )}
          </div>
          <h3 className="text-white font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
          <p className="text-xs text-white/25 line-clamp-1 mt-0.5">{product.distributorName?.split(" (")[0]}</p>
        </div>

        {/* THC/CBD bars hidden on mobile */}
        <div className="hidden lg:flex flex-col gap-1.5 w-32 flex-shrink-0">
          {[{ label: "THC", val: product.thcContent, color: "bg-amber-400/60" }, { label: "CBD", val: product.cbdContent, color: "bg-primary/60" }].map(b => (
            <div key={b.label} className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-white/25 w-7">{b.label}</span>
              <div className="flex-1 h-px bg-white/[0.07]">
                <div className={`h-full ${b.color}`} style={{ width: `${Math.min(b.val * 4, 100)}%` }} />
              </div>
              <span className="text-[9px] font-mono text-white/30 w-7 text-right">{b.val}%</span>
            </div>
          ))}
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-white font-mono font-semibold text-sm">${product.priceUsd.toFixed(2)}</div>
          <div className="flex items-center justify-end gap-1 text-white/30 font-mono text-[10px]">
            {liveSol != null ? liveSol.toFixed(3) : product.priceSol.toFixed(3)} SOL
            {solPrice && <span className="w-1 h-1 rounded-full bg-primary animate-pulse inline-block" />}
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-primary/60 transition-colors flex-shrink-0" />
      </div>
    </Link>
  );
}

export default function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const { price: solPrice, loading: solLoading, usdToSol } = useSolPrice();

  const { data: products, isLoading } = useListProducts({
    search: search || undefined,
    category: category && category !== "all" ? category : undefined,
  });

  return (
    <AppLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="border-b border-white/[0.16] pb-8">
          <div className="section-label mb-4">CLINICAL: PRODUCT CATALOG</div>
          <div className="flex flex-col md:flex-row justify-between gap-6 md:items-end">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white" data-testid="text-products-title">
              Catalog
            </h1>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
                <Input
                  data-testid="input-search"
                  placeholder="Search formulations..."
                  className="pl-9 bg-white/[0.03] border-white/[0.18] focus-visible:border-primary/40 focus-visible:ring-0 text-white placeholder:text-white/20 h-10 w-full sm:w-60"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={category || "all"} onValueChange={(v) => setCategory(v === "all" ? null : v)}>
                <SelectTrigger data-testid="select-category" className="w-full sm:w-40 bg-white/[0.03] border-white/[0.18] h-10 text-white/60">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/[0.20]">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="extract">Extract</SelectItem>
                  <SelectItem value="tincture">Tincture</SelectItem>
                  <SelectItem value="flower">Flower</SelectItem>
                  <SelectItem value="capsule">Capsule</SelectItem>
                  <SelectItem value="indica">Indica</SelectItem>
                  <SelectItem value="sativa">Sativa</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              {/* View toggle */}
              <div className="flex items-center border border-white/[0.16] h-10">
                <button
                  onClick={() => setView("grid")}
                  className={`px-3 h-full flex items-center transition-colors ${view === "grid" ? "bg-white/[0.08] text-white" : "text-white/30 hover:text-white/60"}`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-full bg-white/[0.16]" />
                <button
                  onClick={() => setView("list")}
                  className={`px-3 h-full flex items-center transition-colors ${view === "list" ? "bg-white/[0.08] text-white" : "text-white/30 hover:text-white/60"}`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product count + live SOL rate */}
        {!isLoading && products && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="section-label text-[10px]">
              {products.length} FORMULATION{products.length !== 1 ? "S" : ""} AVAILABLE
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-white/30">
              {solLoading ? (
                <span className="text-white/20">FETCHING SOL RATE…</span>
              ) : solPrice ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span>SOL/USD</span>
                  <span className="text-primary/70">${solPrice.toFixed(2)}</span>
                  <span className="hidden sm:inline text-white/15">· BINANCE LIVE</span>
                </>
              ) : (
                <span className="text-white/15">SOL PRICE UNAVAILABLE</span>
              )}
            </span>
          </div>
        )}

        {isLoading ? (
          view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="bg-[#0a0a0a] border border-white/[0.08]">
                  <Skeleton className="h-[200px] w-full bg-white/[0.05]" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-2.5 w-1/3 bg-white/[0.04]" />
                    <Skeleton className="h-4 w-4/5 bg-white/[0.06]" />
                    <Skeleton className="h-2.5 w-full bg-white/[0.03]" />
                    <Skeleton className="h-2.5 w-full bg-white/[0.03]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-px bg-white/[0.07]">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="bg-black p-4 sm:p-6 flex items-center gap-4">
                  <Skeleton className="w-14 h-14 bg-white/[0.06] flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-1/3 bg-white/[0.04]" />
                    <Skeleton className="h-4 w-2/3 bg-white/[0.06]" />
                  </div>
                  <Skeleton className="h-8 w-20 bg-white/[0.04]" />
                </div>
              ))}
            </div>
          )
        ) : products?.length ? (
          view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} usdToSol={usdToSol} solPrice={solPrice} />
              ))}
            </div>
          ) : (
            <div className="space-y-px bg-white/[0.08]">
              {products.map((product, i) => (
                <ProductRow key={product.id} product={product} index={i} usdToSol={usdToSol} solPrice={solPrice} />
              ))}
            </div>
          )
        ) : (
          <div className="border border-white/[0.16] p-20 text-center">
            <Beaker className="w-8 h-8 text-white/10 mx-auto mb-4" />
            <p className="text-white/25">No products match your filters.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
