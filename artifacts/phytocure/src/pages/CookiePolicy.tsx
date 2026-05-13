import { AppLayout } from "@/components/layout/AppLayout";

const sections = [
  {
    index: "01",
    title: "What Are Cookies",
    body: `Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites function correctly, remember your preferences, and provide platform operators with analytics about how their sites are used.

Phytocure uses cookies and similar tracking technologies including localStorage, sessionStorage, and IndexedDB to maintain your session state, store wallet connection preferences, and improve the platform experience.`,
  },
  {
    index: "02",
    title: "Cookies We Use",
    body: `STRICTLY NECESSARY COOKIES
These cookies are essential for the platform to function. They cannot be disabled.

- session_id: Maintains your authenticated session state when your wallet is connected. Expires on browser close.
- csrf_token: Cross-site request forgery protection. Required for secure API calls. Expires on browser close.
- wallet_connected: Boolean flag indicating your wallet connection state. Stored in localStorage. Cleared on disconnect.

FUNCTIONAL COOKIES
These cookies enable enhanced functionality but are not strictly required.

- sol_price_cache: Caches the most recently fetched SOL/USD price to reduce API calls to Binance. Expires after 60 seconds. Stored in sessionStorage.
- view_preference: Remembers your preferred product catalog view (grid or list). Stored in localStorage. Persistent.
- ai_session: Preserves your current AI Analysis Engine conversation context. Stored in sessionStorage. Expires on browser close.

ANALYTICS COOKIES
Used to understand how users interact with the platform. Data is aggregated and anonymized.

- _ph_analytics: Platform usage analytics (pages visited, feature engagement). Aggregated only. Expires after 365 days.
- perf_timing: Page load performance metrics for technical monitoring. Expires after 30 days.

THIRD-PARTY COOKIES
Phytocure does not load third-party advertising or social tracking pixels. The Solana wallet adapters you connect may set their own cookies; please review those providers' cookie policies separately.`,
  },
  {
    index: "03",
    title: "Cookies & Blockchain Interactions",
    body: `When you connect a Solana wallet to Phytocure, your public wallet address is stored in browser localStorage to maintain your connection state across page refreshes. This is a functional requirement; without it, you would need to reconnect your wallet on every page load.

Your public wallet address is NOT a secret. It is visible on the Solana blockchain. However, we treat it as pseudonymous personal data under our Privacy Policy and handle it accordingly.

We never use cookies or localStorage to store your private key, seed phrase, mnemonic, or any sensitive wallet credential. All cryptographic signing is performed client-side by your wallet extension or application.`,
  },
  {
    index: "04",
    title: "Managing Your Cookie Preferences",
    body: `You can control how cookies are used on the Phytocure platform through several methods:

BROWSER SETTINGS
Most browsers allow you to view, delete, and block cookies. Consult your browser's help documentation:
- Chrome: Settings > Privacy and Security > Cookies
- Firefox: Settings > Privacy & Security > Cookies and Site Data
- Safari: Preferences > Privacy > Manage Website Data
- Edge: Settings > Cookies and site permissions

PLATFORM CONTROLS
You can disconnect your wallet at any time using the "Disconnect" option in the wallet modal. This clears wallet-related localStorage entries immediately.

NOTE ON STRICTLY NECESSARY COOKIES
Disabling strictly necessary cookies will prevent the platform from functioning correctly. Session management and CSRF protection require these cookies to operate.

OPTING OUT OF ANALYTICS
You can opt out of analytics tracking by enabling the "Do Not Track" (DNT) signal in your browser settings. Phytocure honors DNT signals for analytics cookies.`,
  },
  {
    index: "05",
    title: "Cookie Retention Periods",
    body: `Below is a summary of cookie retention periods by category:

SESSION COOKIES
Exist only for the duration of your browser session. Deleted automatically when you close your browser tab or window.

PERSISTENT FUNCTIONAL
Stored for up to 1 year. Used to remember view preferences and wallet connection hints. You can delete these at any time via browser settings.

ANALYTICS
Stored for up to 365 days from the last platform interaction. Anonymized after 90 days of inactivity.

PRICE CACHE
Stored in sessionStorage for 60 seconds. Auto-expires and is refreshed on next SOL price fetch from the Binance API.

All cookies older than their stated retention period are automatically purged by the browser.`,
  },
  {
    index: "06",
    title: "Updates to This Policy",
    body: `We may update this Cookie Policy as the platform evolves, as new features are introduced, or as applicable regulations change. When we make material changes, we will display a notice on the platform and update the "Last updated" date at the top of this page.

We encourage you to review this policy periodically. Continued use of the platform after policy updates constitutes acceptance of the revised Cookie Policy.

For questions about our use of cookies or to exercise your rights under applicable data protection law, contact: privacy@phytocure.io`,
  },
];

const cookieTable = [
  { name: "session_id", type: "Necessary", storage: "Cookie", duration: "Session", purpose: "Authenticated session state" },
  { name: "csrf_token", type: "Necessary", storage: "Cookie", duration: "Session", purpose: "Cross-site request forgery protection" },
  { name: "wallet_connected", type: "Necessary", storage: "localStorage", duration: "Until disconnect", purpose: "Wallet connection state" },
  { name: "sol_price_cache", type: "Functional", storage: "sessionStorage", duration: "60 seconds", purpose: "SOL/USD price cache (Binance)" },
  { name: "view_preference", type: "Functional", storage: "localStorage", duration: "1 year", purpose: "Grid/list catalog preference" },
  { name: "ai_session", type: "Functional", storage: "sessionStorage", duration: "Session", purpose: "AI analysis conversation context" },
  { name: "_ph_analytics", type: "Analytics", storage: "Cookie", duration: "365 days", purpose: "Anonymized usage analytics" },
  { name: "perf_timing", type: "Analytics", storage: "Cookie", duration: "30 days", purpose: "Page load performance metrics" },
];

const typeColor: Record<string, string> = {
  Necessary: "text-primary/70 border-primary/30",
  Functional: "text-blue-400/70 border-blue-400/30",
  Analytics: "text-amber-400/70 border-amber-400/30",
};

export default function CookiePolicy() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-white/[0.16] pb-10">
          <div className="section-label mb-4">LEGAL: TRACKING & STORAGE</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Cookie Policy
          </h1>
          <p className="text-white/35 text-sm leading-relaxed max-w-2xl">
            Last updated: 9 May 2026 · Describes how Phytocure uses cookies, localStorage, and sessionStorage across all platform services.
          </p>
          <p className="text-white/25 text-xs font-mono mt-3">
            PHYTOCURE · NO ADVERTISING COOKIES · NO THIRD-PARTY TRACKING
          </p>
        </div>

        {/* Notice */}
        <div className="border border-primary/20 p-8 bg-primary/[0.02]">
          <div className="section-label text-[9px] text-primary/60 mb-3">OUR COMMITMENT</div>
          <p className="text-white/50 text-sm leading-relaxed">
            Phytocure uses only the minimum cookies required to operate. We do not use advertising cookies, social tracking pixels, or third-party data brokers. Analytics data is anonymized and used solely to improve platform performance.
          </p>
        </div>

        {/* Cookie table */}
        <div>
          <div className="section-label mb-5">COOKIE INVENTORY</div>
          <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
            <div className="border border-white/[0.10] overflow-hidden min-w-[640px]">
              <div className="grid grid-cols-5 bg-white/[0.03] px-4 py-3 text-[9px] font-mono text-white/30 uppercase tracking-widest">
                <span>Name</span>
                <span>Type</span>
                <span>Storage</span>
                <span>Duration</span>
                <span>Purpose</span>
              </div>
              {cookieTable.map((row, i) => (
                <div
                  key={row.name}
                  className={`grid grid-cols-5 px-4 py-3 text-[11px] gap-2 ${i % 2 === 0 ? "bg-black" : "bg-white/[0.01]"} border-t border-white/[0.06]`}
                >
                  <span className="font-mono text-white/60 truncate">{row.name}</span>
                  <span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 border ${typeColor[row.type]}`}>
                      {row.type}
                    </span>
                  </span>
                  <span className="text-white/30 font-mono text-[10px]">{row.storage}</span>
                  <span className="text-white/30 text-[10px]">{row.duration}</span>
                  <span className="text-white/30 text-[10px]">{row.purpose}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-0 divide-y divide-white/[0.08]">
          {sections.map((s) => (
            <div key={s.index} className="py-10 flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="md:w-16 shrink-0">
                <span className="index-num text-sm">[{s.index}]</span>
              </div>
              <div className="flex-1 space-y-4">
                <h2 className="text-white font-semibold text-lg">{s.title}</h2>
                <div className="text-white/40 text-sm leading-relaxed whitespace-pre-line">{s.body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="border-t border-white/[0.12] pt-8 text-center">
          <p className="text-white/20 text-xs font-mono">
            Cookie concerns: privacy@phytocure.io · Response time: 30 days
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
