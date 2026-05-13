import { AppLayout } from "@/components/layout/AppLayout";

const sections = [
  {
    index: "01",
    title: "Acceptance of Terms",
    body: `By accessing or using the Phytocure platform, including its website, decentralized applications, API services, clinical prescription tools, research hub, AI analysis engine, and token-based payment infrastructure, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms, you may not use the platform.

These Terms constitute a legally binding agreement between you ("User") and Phytocure ("Company", "we", "us"). We reserve the right to update these Terms at any time. Continued use of the platform following any changes constitutes acceptance of the revised Terms.`,
  },
  {
    index: "02",
    title: "Eligibility",
    body: `You must be at least 18 years of age to use Phytocure. By using the platform, you represent and warrant that:

- You are at least 18 years old and have the legal capacity to enter into contracts.
- You are located in a jurisdiction where cannabis-related research, clinical prescription services, and digital asset transactions are not prohibited by applicable law.
- You are not a citizen or resident of any jurisdiction subject to comprehensive sanctions by OFAC or equivalent regulatory authorities.
- Your use of the platform complies with all local, national, and international laws applicable to you.`,
  },
  {
    index: "03",
    title: "Platform Services",
    body: `Phytocure provides the following services:

Clinical Prescriptions, A digital prescription issuance system connecting verified physicians with patients. Prescriptions are recorded on the Solana blockchain for immutability and transparency. Phytocure acts as infrastructure; we are not a licensed medical provider.

DeSci Research Hub, A decentralized scientific publishing platform for cannabis-related research. Content is submitted by third-party researchers. Phytocure does not verify, endorse, or take responsibility for the accuracy of research submissions.

AI Analysis Engine, A computational tool that models cannabinoid profiles, terpene synergies, and potential clinical correlations based on publicly available pharmacological data. Outputs are for informational purposes only and do not constitute medical advice.

Product Marketplace, Clinical-grade cannabis formulations listed by verified third-party distributors. Phytocure is a marketplace; we are not the manufacturer, seller, or distributor of any product.`,
  },
  {
    index: "04",
    title: "Blockchain & Token Transactions",
    body: `The Phytocure platform facilitates transactions using Solana (SOL) and the native PYCURE token. By using these features, you acknowledge:

- All blockchain transactions are irreversible once confirmed on-chain. Phytocure cannot reverse, cancel, or refund on-chain transactions.
- You are solely responsible for the security of your private keys and wallet credentials. Phytocure has no access to your wallet and cannot recover lost funds.
- Transaction fees ("gas") on the Solana network are determined by network conditions and are outside Phytocure's control.
- The value of SOL and PYCURE tokens is volatile and subject to significant market risk. Phytocure makes no representations regarding future token values.
- PYCURE token is a utility token for platform access; it is not an investment, security, or financial instrument.`,
  },
  {
    index: "05",
    title: "User Conduct",
    body: `Users agree not to:

- Use the platform to facilitate illegal drug purchases, money laundering, or financing of criminal activity.
- Submit false, fraudulent, or misleading research, prescriptions, or product listings.
- Attempt to reverse-engineer, scrape, or exploit the platform's API beyond permitted use.
- Impersonate verified physicians, distributors, or Phytocure personnel.
- Use automated bots or scripts to manipulate research upvotes, prescription issuance, or marketplace listings.
- Upload malicious code, conduct DDoS attacks, or attempt to compromise platform security.

Violations may result in immediate account suspension, wallet blacklisting, and referral to relevant law enforcement authorities.`,
  },
  {
    index: "06",
    title: "Intellectual Property",
    body: `All platform content, including but not limited to the Phytocure name and logo, interface design, AI engine architecture, proprietary cannabinoid modeling algorithms, and original research indexes, is the exclusive property of Phytocure and its licensors.

Open-source components used in the platform are governed by their respective licenses. Research submitted by third-party users remains the intellectual property of the respective authors; by submitting, they grant Phytocure a non-exclusive, worldwide, royalty-free license to display, index, and archive their work on the platform.`,
  },
  {
    index: "07",
    title: "Disclaimers & Limitation of Liability",
    body: `THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. PHYTOCURE EXPRESSLY DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

TO THE MAXIMUM EXTENT PERMITTED BY LAW, PHYTOCURE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOST DATA, PERSONAL INJURY, OR PROPERTY DAMAGE ARISING FROM YOUR USE OF THE PLATFORM: EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

Our aggregate liability to you for any cause of action shall not exceed USD $100.`,
  },
  {
    index: "08",
    title: "Governing Law & Dispute Resolution",
    body: `These Terms are governed by the laws of the British Virgin Islands, without regard to conflict-of-law principles.

Any dispute arising from these Terms shall be resolved through binding arbitration under the UNCITRAL Arbitration Rules. Class action lawsuits and class-wide arbitration are expressly waived.

You may also contact us to resolve disputes informally before initiating formal arbitration: legal@phytocure.io`,
  },
];

export default function TermsOfService() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-white/[0.16] pb-10">
          <div className="section-label mb-4">LEGAL: PLATFORM AGREEMENT</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-white/35 text-sm leading-relaxed max-w-2xl">
            Last updated: 9 May 2026 · Effective immediately for all Phytocure platform users.
          </p>
          <p className="text-white/25 text-xs font-mono mt-3">
            PHYTOCURE · DECENTRALIZED SCIENCE PLATFORM · VERSION 2.0
          </p>
        </div>

        {/* Introduction */}
        <div className="border border-white/[0.10] p-8 bg-white/[0.01]">
          <p className="text-white/50 text-sm leading-relaxed">
            These Terms of Service govern your use of the Phytocure decentralized cannabis medicine platform, including all clinical prescription tools, DeSci research infrastructure, AI analysis services, distributor marketplace, and Solana/PYCURE token payment rails. Please read them carefully before proceeding.
          </p>
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
            For questions regarding these Terms, contact legal@phytocure.io
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
