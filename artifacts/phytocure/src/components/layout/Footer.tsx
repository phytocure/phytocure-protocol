import { Link } from "wouter";
import logo from "/phytocure-logo.png";

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const footerLinks = {
  Platform: [
    { label: "Dashboard", href: "/app" },
    { label: "Products", href: "/products" },
    { label: "Distributors", href: "/distributors" },
    { label: "Prescriptions", href: "/prescriptions" },
  ],
  Science: [
    { label: "Research Hub", href: "/research" },
    { label: "Neural AI", href: "/ai" },
    { label: "Laboratory", href: "/laboratory" },
    { label: "Thesis", href: "/thesis" },
    { label: "Submit Research", href: "/research/new" },
    { label: "About", href: "/about" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Medical Disclaimer", href: "/disclaimer" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.14] mt-24 bg-black">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Top: brand + links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/">
              <div className="flex items-center gap-2 mb-4 cursor-pointer group">
                <img src={logo} alt="Phytocure" className="w-6 h-6 object-contain" />
                <span className="text-white font-semibold text-[15px] tracking-tight">
                  Phyto<span className="text-primary">cure</span>
                </span>
              </div>
            </Link>
            <p className="text-white/25 text-xs leading-relaxed mb-6 max-w-[200px]">
              Decentralized cannabis medicine. Clinical, transparent, and open to all.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href="https://x.com/phytocure"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-8 h-8 flex items-center justify-center border border-white/[0.18] rounded-sm text-white/25 hover:text-white/70 hover:border-white/20 transition-all"
              >
                <XIcon />
              </a>
              <a
                href="https://github.com/phytocure"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 flex items-center justify-center border border-white/[0.18] rounded-sm text-white/25 hover:text-white/70 hover:border-white/20 transition-all"
              >
                <GithubIcon />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <div className="section-label text-[9px] mb-5">{section.toUpperCase()}</div>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>
                      <span className="text-white/30 text-xs hover:text-white/60 transition-colors cursor-pointer">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.14] pt-8 flex flex-col items-center gap-2 text-center">
          <p className="text-white/40 text-[11px] font-mono">
            © {year} Phytocure. All rights reserved.
          </p>
          <p className="text-white/25 text-[10px] font-mono leading-relaxed">
            Not a licensed medical provider. For research purposes only. Consult a qualified physician before use.
          </p>
        </div>

      </div>
    </footer>
  );
}
