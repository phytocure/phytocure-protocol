import { Link, useLocation } from "wouter";
import { Menu, X, ExternalLink, Copy, LogOut, Wallet } from "lucide-react";
import logo from "/phytocure-logo.png";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { ConnectWalletModal } from "@/components/ConnectWalletModal";

const navLinks = [
  { label: "Platform", href: "/app" },
  { label: "Products", href: "/products" },
  { label: "Research", href: "/research" },
  { label: "Distributors", href: "/distributors" },
  { label: "Neural", href: "/ai" },
  { label: "Laboratory", href: "/laboratory" },
  { label: "Thesis", href: "/thesis" },
  { label: "About", href: "/about" },
  { label: "Docs", href: "/docs" },
];

function truncateAddress(addr: string) {
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

export function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [walletDropdown, setWalletDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const { connected, address, walletName, balance, openModal, disconnect, showModal } = useWallet();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setOpen(false);
    setWalletDropdown(false);
  }, [location]);

  useEffect(() => {
    if (!walletDropdown) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-wallet-dropdown]")) setWalletDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [walletDropdown]);

  const isLanding = location === "/";

  function handleCopy() {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      {showModal && <ConnectWalletModal />}

      <header
        data-testid="navbar"
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled || !isLanding
            ? "bg-black/90 backdrop-blur-xl border-b border-white/[0.14]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <img src={logo} alt="Phytocure" className="w-7 h-7 object-contain" />
              <span className="text-white font-semibold tracking-tight text-[15px]">
                Phyto<span className="text-primary">cure</span>
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
              return (
                <Link key={link.href} href={link.href} data-testid={`nav-${link.label.toLowerCase()}`}>
                  <span
                    className={cn(
                      "px-4 py-2 text-sm transition-colors cursor-pointer rounded",
                      isActive
                        ? "text-white"
                        : "text-white/40 hover:text-white/80"
                    )}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Wallet CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {connected && address ? (
              <div className="relative" data-wallet-dropdown>
                <button
                  onClick={() => setWalletDropdown((v) => !v)}
                  data-testid="wallet-connected-btn"
                  className="flex items-center gap-2 px-3 py-1.5 border border-primary/30 rounded bg-primary/[0.06] hover:bg-primary/[0.12] transition-all"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-mono text-primary">{truncateAddress(address)}</span>
                </button>

                {walletDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#0a0a0a] border border-white/[0.20] rounded-lg overflow-hidden shadow-2xl z-50">
                    <div className="px-4 py-3 border-b border-white/[0.16]">
                      <div className="text-[9px] font-mono text-white/30 tracking-widest mb-1">{walletName?.toUpperCase()} · SOLANA</div>
                      <div className="text-xs font-mono text-white/60">{truncateAddress(address)}</div>
                      {balance !== null && (
                        <div className="text-[11px] text-primary/70 font-mono mt-1">{balance.toFixed(2)} SOL</div>
                      )}
                    </div>
                    <div className="p-2 flex flex-col gap-1">
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-white/60 hover:text-white hover:bg-white/[0.07] transition-colors w-full text-left"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {copied ? "Copied!" : "Copy Address"}
                      </button>
                      <button
                        onClick={() => { disconnect(); setWalletDropdown(false); }}
                        data-testid="wallet-disconnect-btn"
                        className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors w-full text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openModal}
                data-testid="wallet-connect-btn"
                className="flex items-center gap-2 text-sm px-4 py-2 border border-white/20 rounded text-white/80 hover:border-primary/50 hover:text-primary hover:bg-primary/[0.06] transition-all cursor-pointer"
              >
                <Wallet className="w-3.5 h-3.5" />
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            data-testid="button-mobile-menu"
            className="lg:hidden text-white/60 hover:text-white transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col pt-20 px-6 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <div className={cn(
                    "py-4 text-lg border-b border-white/[0.16] transition-colors cursor-pointer",
                    isActive ? "text-primary" : "text-white/60 hover:text-white"
                  )}>
                    {link.label}
                  </div>
                </Link>
              );
            })}
            <div className="pt-6">
              {connected && address ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-mono text-primary">{truncateAddress(address)}</span>
                    {balance !== null && (
                      <span className="text-xs text-white/30 font-mono ml-auto">{balance.toFixed(2)} SOL</span>
                    )}
                  </div>
                  <button
                    onClick={disconnect}
                    className="flex items-center gap-2 text-sm text-red-400/70 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setOpen(false); openModal(); }}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-white/20 rounded text-white/80 hover:border-primary/50 hover:text-primary transition-all"
                >
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
