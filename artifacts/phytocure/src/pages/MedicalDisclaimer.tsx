import { AppLayout } from "@/components/layout/AppLayout";

const sections = [
  {
    index: "01",
    title: "Not a Medical Provider",
    body: `Phytocure is a decentralized technology platform. We are not a licensed medical provider, healthcare facility, pharmacy, or regulated pharmaceutical company. Nothing on the Phytocure platform, including product listings, clinical prescription records, AI analysis outputs, research publications, or any other content, constitutes the practice of medicine.

The Phytocure platform facilitates access to information and connects users with verified physicians and distributors. The platform does not provide medical diagnosis, treatment, or therapeutic advice directly.`,
  },
  {
    index: "02",
    title: "AI Analysis Engine: Important Limitations",
    body: `The Phytocure AI Analysis Engine uses pharmacological knowledge graphs, published cannabinoid research, and computational modeling to generate strain analyses, cannabinoid profiles, terpene synergy models, dosage correlations, and clinical recommendation outputs.

These outputs are for educational and research reference purposes only. They do not constitute:

- Medical diagnosis of any condition.
- A prescription or treatment recommendation.
- Clinical guidance from a licensed physician.
- Approval or endorsement of any specific cannabis product for therapeutic use.

AI-generated outputs may contain errors, be incomplete, or fail to account for individual health factors including drug interactions, pre-existing conditions, allergies, pregnancy, or age-related considerations. Always consult a qualified physician before making any health or treatment decisions.`,
  },
  {
    index: "03",
    title: "Clinical Prescription System",
    body: `The prescription issuance system on Phytocure is designed to facilitate communication between verified physicians and their patients. Prescriptions issued through the platform are issued by independent licensed physicians who have independently assessed their patients.

Phytocure does not:

- Employ or control the prescribing physicians using the platform.
- Verify the accuracy or appropriateness of any individual prescription.
- Take responsibility for adverse effects resulting from prescribed treatments.
- Guarantee that prescriptions issued through the platform are legally valid in your jurisdiction.

The legal status of medical cannabis prescriptions varies significantly by country, state, and territory. It is your responsibility to verify that receiving, possessing, and using cannabis-based medicines is legal in your location.`,
  },
  {
    index: "04",
    title: "Product Information",
    body: `Product information displayed on the Phytocure platform, including cannabinoid profiles (THC/CBD percentages), terpene content, indica/sativa classifications, dosage guidance, and therapeutic indications, is provided by third-party distributors and manufacturers.

Phytocure does not independently test or verify product claims. We do not guarantee:

- The accuracy of cannabinoid percentage data.
- That products meet pharmaceutical-grade standards in your jurisdiction.
- That products are free from contaminants, pesticides, or adulterants.
- That products will produce specific therapeutic or recreational effects.

Always purchase cannabis medicines from licensed, locally regulated sources. Verify product certificates of analysis (COA) from accredited laboratories before use.`,
  },
  {
    index: "05",
    title: "Research Hub: Scientific Content",
    body: `Research papers, abstracts, and studies published on the Phytocure DeSci Research Hub are submitted by independent researchers. Phytocure does not conduct peer review of submitted research, does not vouch for its scientific validity, and does not endorse any conclusions or claims made therein.

Published research should be evaluated critically and in the context of the full body of scientific literature. Preliminary findings or unpublished research should not be used as the basis for individual treatment decisions.

References to clinical studies on the platform do not imply that the platform's products or services are approved by any regulatory body, including the FDA, EMA, TGA, or national health ministries.`,
  },
  {
    index: "06",
    title: "Cannabis: Legal Status Warning",
    body: `Cannabis and cannabinoid-based substances are controlled substances in many jurisdictions worldwide. The legal status of medical cannabis, recreational cannabis, specific cannabinoids (including CBD, THC, CBG), and related products varies dramatically by country, state, and local government.

IT IS YOUR SOLE RESPONSIBILITY to determine whether accessing, purchasing, possessing, using, or transacting in cannabis-related products is legal in your jurisdiction. Phytocure makes no representations regarding the legality of any product or activity in any specific location.

Phytocure cannot be held liable for any legal consequences, including arrest, prosecution, civil penalties, or asset forfeiture, arising from a user's non-compliance with applicable cannabis laws.`,
  },
  {
    index: "07",
    title: "No Doctor-Patient Relationship",
    body: `Use of the Phytocure platform does not create a doctor-patient relationship between you and Phytocure, or between you and any physician who has listed services on the platform, unless you have independently entered into a formal clinical relationship with that physician in accordance with applicable medical licensing law.

Information provided through the platform, including AI outputs, product descriptions, prescription records, and research, should not be substituted for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition.

In the event of a medical emergency, call your local emergency services immediately. Do not rely on the Phytocure platform for emergency medical guidance.`,
  },
  {
    index: "08",
    title: "Indemnification",
    body: `By using the Phytocure platform for any health-related decision, you agree to indemnify and hold harmless Phytocure, its officers, directors, employees, agents, and partners from any claim, damage, loss, liability, or expense, including legal fees, arising from:

- Your reliance on AI Analysis Engine outputs for medical decisions.
- Your use of products purchased through the platform.
- Adverse health effects from cannabis-based treatments.
- Non-compliance with applicable medical cannabis regulations in your jurisdiction.
- Actions taken or not taken based on research published on the platform.

This indemnification survives termination of your account and use of the platform.`,
  },
];

export default function MedicalDisclaimer() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-white/[0.16] pb-10">
          <div className="section-label mb-4">LEGAL: HEALTH & SAFETY</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Medical Disclaimer
          </h1>
          <p className="text-white/35 text-sm leading-relaxed max-w-2xl">
            Last updated: 9 May 2026 · Read carefully before using any clinical features, AI outputs, or product information on the Phytocure platform.
          </p>
          <p className="text-white/25 text-xs font-mono mt-3">
            PHYTOCURE · NOT A LICENSED MEDICAL PROVIDER · FOR RESEARCH USE
          </p>
        </div>

        {/* Critical warning box */}
        <div className="border border-amber-400/30 p-8 bg-amber-400/[0.03]">
          <div className="section-label text-[9px] text-amber-400/70 mb-3">CRITICAL NOTICE</div>
          <p className="text-amber-400/80 text-sm leading-relaxed font-medium">
            Phytocure is not a medical provider. No content on this platform constitutes medical advice, diagnosis, or treatment. Always consult a licensed physician before making any health-related decision. In an emergency, call your local emergency services immediately.
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
            Medical concerns: contact a licensed physician. Platform queries: legal@phytocure.io
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
