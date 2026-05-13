import { useState } from "react";
import { X, Loader2, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";
import { useWallet, type WalletName } from "@/contexts/WalletContext";

const WALLETS: { name: WalletName; icon: string; desc: string; installUrl: string }[] = [
  {
    name: "Phantom",
    icon: "/phantom-logo.png",
    desc: "Most popular Solana wallet",
    installUrl: "https://phantom.app/",
  },
  {
    name: "Solflare",
    icon: "/solflare-logo.png",
    desc: "Non-custodial Solana wallet",
    installUrl: "https://solflare.com/",
  },
];

export function ConnectWalletModal() {
  const { closeModal, connect, phantomInstalled, solflareInstalled } = useWallet();
  const [connecting, setConnecting] = useState<WalletName | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);

  const isInstalled = (name: WalletName) =>
    name === "Phantom" ? phantomInstalled : solflareInstalled;

  async function handleConnect(wallet: WalletName) {
    if (!isInstalled(wallet)) {
      window.open(
        wallet === "Phantom" ? "https://phantom.app/" : "https://solflare.com/",
        "_blank"
      );
      return;
    }
    setConnectError(null);
    setConnecting(wallet);
    try {
      await connect(wallet);
    } catch (err) {
      setConnectError(err instanceof Error ? err.message : "Connection failed. Please try again.");
    } finally {
      setConnecting(null);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={closeModal}
      />

      <div className="relative z-10 w-full max-w-sm bg-[#0a0a0a] border border-white/[0.20] rounded-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.16]">
          <div>
            <div className="text-[9px] font-mono text-white/30 tracking-[0.15em] uppercase mb-1">
              SOLANA · MAINNET
            </div>
            <h2 className="text-white font-semibold text-base">Connect Wallet</h2>
          </div>
          <button
            onClick={closeModal}
            className="text-white/30 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wallet list */}
        <div className="p-4 flex flex-col gap-2">
          {WALLETS.map((w) => {
            const installed = isInstalled(w.name);
            const isConnecting = connecting === w.name;

            return (
              <button
                key={w.name}
                onClick={() => handleConnect(w.name)}
                disabled={connecting !== null}
                className="group flex items-center gap-4 px-4 py-3.5 rounded border border-white/[0.16] hover:border-primary/30 hover:bg-white/[0.02] transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                  <img
                    src={w.icon}
                    alt={w.name}
                    className="w-7 h-7 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                    {w.name}
                  </div>
                  <div className="text-[11px] text-white/30 mt-0.5">
                    {installed ? w.desc : "Not installed — click to install"}
                  </div>
                </div>
                {isConnecting ? (
                  <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
                ) : installed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary/40 flex-shrink-0" />
                ) : (
                  <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {connectError && (
          <div className="mx-4 mb-3 flex items-start gap-2 border border-red-500/20 bg-red-500/[0.05] rounded px-3 py-2">
            <AlertCircle className="w-3.5 h-3.5 text-red-400/60 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-red-400/60">{connectError}</p>
          </div>
        )}

        {/* Footer note */}
        <div className="px-6 pb-5 pt-1">
          <p className="text-[10px] text-white/20 text-center leading-relaxed">
            By connecting you agree to the Phytocure protocol terms.
            <br />
            Real Solana Mainnet connection. No keys leave your device.
          </p>
        </div>
      </div>
    </div>
  );
}
