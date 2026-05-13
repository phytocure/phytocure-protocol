import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white dot-grid flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="section-label mb-8">ERROR: 404</div>
        <div className="text-[10rem] font-bold leading-none tracking-tighter text-white/[0.04] font-mono select-none mb-8">
          404
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-white/30 text-lg mb-12 max-w-sm leading-relaxed">
          The route you're looking for doesn't exist on this network.
        </p>
        <Link href="/">
          <span className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors cursor-pointer border border-white/[0.20] px-6 py-3 rounded hover:border-white/20">
            <ArrowLeft className="w-4 h-4" /> Return Home
          </span>
        </Link>
      </div>
    </div>
  );
}
