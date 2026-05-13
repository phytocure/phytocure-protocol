import { AppLayout } from "@/components/layout/AppLayout";

const sections = [
  {
    index: "01",
    title: "Introduction & Scope",
    body: `Phytocure ("we", "us", "our") is committed to protecting the privacy of users who interact with our decentralized cannabis medicine platform. This Privacy Policy describes what information we collect, why we collect it, how we use and protect it, and what rights you have.

This policy applies to all services operated under the Phytocure brand, including the web platform, API services, AI analysis engine, and Solana-based transaction infrastructure. It does not apply to third-party services linked from our platform, including external distributor websites or the Solana blockchain itself (which is a public ledger).`,
  },
  {
    index: "02",
    title: "Information We Collect",
    body: `We collect the following categories of information:

WALLET DATA, When you connect a Solana-compatible wallet to Phytocure, we record your public wallet address. We never access, store, or transmit your private keys or seed phrases.

PLATFORM ACTIVITY, We log your interactions with the platform: pages visited, products viewed, research submitted, prescriptions issued, AI analysis queries submitted, and transactions initiated. This data is pseudonymous and tied to your wallet address.

PRESCRIPTION DATA, Clinical prescriptions issued through the platform contain patient and physician information as provided at the time of issuance. This data is written to the Solana blockchain and is permanently public. Do not submit sensitive personal health identifiers without understanding this permanence.

RESEARCH SUBMISSIONS, Research papers, citations, abstracts, and author information submitted to the DeSci Research Hub are stored in our database and displayed publicly on the platform.

TECHNICAL DATA: IP addresses, browser user-agent, device type, and referring URLs are collected automatically through server logs and analytics tools for platform security and performance monitoring.

CONTACT INFORMATION, If you contact us via email, we collect your email address and message content for the purpose of responding to your inquiry.`,
  },
  {
    index: "03",
    title: "How We Use Your Information",
    body: `We use collected information for the following purposes:

- To operate, maintain, and improve the Phytocure platform and its features.
- To process blockchain-based transactions and verify distributor-patient-physician interactions.
- To power the AI Analysis Engine with anonymized aggregate cannabinoid profile data.
- To detect, investigate, and prevent fraudulent or illegal activity on the platform.
- To send important platform updates, security alerts, or legal notices to users who have provided contact information.
- To comply with applicable laws and regulatory requirements.
- To generate anonymized aggregate analytics about platform usage (no individual-level data is sold or shared).

We do not sell, rent, or trade your personal information to third parties for marketing purposes.`,
  },
  {
    index: "04",
    title: "Blockchain Data & Immutability",
    body: `Phytocure operates on the Solana blockchain. Any data written to the blockchain, including prescription records, transaction history, and research publication hashes, is permanently public and immutable. Once written, this data cannot be deleted, modified, or restricted, regardless of any deletion request you make to us.

This is a fundamental property of decentralized ledger technology. Before submitting any personally identifying information through platform features that write to the blockchain, please consider this permanence carefully. Phytocure is not responsible for blockchain-level data exposure.`,
  },
  {
    index: "05",
    title: "Data Sharing & Third Parties",
    body: `We share your information only in the following limited circumstances:

VERIFIED DISTRIBUTORS, When you initiate a product purchase, your wallet address and order information are shared with the relevant verified distributor to fulfill your order.

SERVICE PROVIDERS, We engage trusted third-party service providers for infrastructure (hosting, CDN), analytics, and security monitoring under strict data processing agreements that prohibit them from using your data for their own purposes.

LAW ENFORCEMENT, We may disclose information to government authorities if required by law, court order, or to protect the rights, safety, or property of Phytocure or third parties.

BUSINESS TRANSFERS, In the event of a merger, acquisition, or asset sale, user data may be transferred as part of the business assets, subject to the same privacy protections.

We do not share data with AI training companies, advertising networks, or data brokers.`,
  },
  {
    index: "06",
    title: "Data Retention",
    body: `We retain your platform activity data for up to 3 years from your last active session, after which it is anonymized or deleted. Research submissions and prescription records stored in our database are retained indefinitely as they form part of the scientific and clinical record.

Blockchain data is retained permanently, as described in Section 04. Technical logs (server logs, IP records) are retained for 90 days for security purposes.

You may request deletion of off-chain data we hold about you by submitting a written request to privacy@phytocure.io. We will respond within 30 days.`,
  },
  {
    index: "07",
    title: "Security",
    body: `We implement industry-standard security measures to protect your information:

- All data in transit is encrypted using TLS 1.3.
- Wallet connections use cryptographic signature verification, we never receive or store private keys.
- Platform access controls and least-privilege architecture limit internal data access.
- Regular penetration testing and third-party security audits are conducted.
- Smart contract code is publicly verifiable on-chain for transparency.

Despite these measures, no system is completely secure. We cannot guarantee the absolute security of your information and are not responsible for breaches caused by user error, compromised devices, or force majeure events.`,
  },
  {
    index: "08",
    title: "Your Rights",
    body: `Depending on your jurisdiction, you may have the following rights regarding your personal data:

RIGHT OF ACCESS, Request a copy of the personal data we hold about you.
RIGHT TO RECTIFICATION, Request correction of inaccurate off-chain data.
RIGHT TO ERASURE, Request deletion of off-chain personal data (subject to legal retention obligations).
RIGHT TO PORTABILITY, Request your data in a machine-readable format.
RIGHT TO OBJECT, Object to processing of your data for analytics or profiling.

Note: These rights do not extend to data recorded on the Solana blockchain, which is immutable by design.

To exercise your rights, contact: privacy@phytocure.io`,
  },
];

export default function PrivacyPolicy() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-white/[0.16] pb-10">
          <div className="section-label mb-4">LEGAL: DATA PROTECTION</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/35 text-sm leading-relaxed max-w-2xl">
            Last updated: 9 May 2026 · Applies to all Phytocure platform services and data processing activities.
          </p>
          <p className="text-white/25 text-xs font-mono mt-3">
            PHYTOCURE · GDPR & CCPA COMPLIANT FRAMEWORK
          </p>
        </div>

        {/* Introduction box */}
        <div className="border border-white/[0.10] p-8 bg-white/[0.01]">
          <p className="text-white/50 text-sm leading-relaxed">
            Your privacy matters to us. Phytocure is a pseudonymous, wallet-gated platform. We minimize data collection by design. Most platform interactions are identified only by your public wallet address, no email, name, or government ID is required to access the platform.
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
            Data Protection Officer: privacy@phytocure.io · Response time: 30 days
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
