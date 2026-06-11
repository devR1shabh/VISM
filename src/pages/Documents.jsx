// src/pages/Documents.jsx

import { Globe, Plane, ShieldCheck } from "lucide-react";
import { useCase } from "../context/CaseContext";
import DocumentGuidelines from "../components/upload/DocumentGuidelines";
import PassportUploadSection from "../components/upload/PassportUploadSection";
import SecondaryDocSection from "../components/upload/SecondaryDocSection";
import DocumentProgress from "../components/upload/DocumentProgress";

const SECONDARY_DOCS = {
  "Student Visa": "Academic Transcript",
  "Work Visa": "Resume",
  "Tourist Visa": "Bank Statement",
};

function Documents() {
  const { caseData } = useCase();
  const secondaryDoc = SECONDARY_DOCS[caseData?.visaType] || null;
  const status = caseData?.status || "In Progress";

  const summaryCards = [
    {
      label: "Visa Type",
      value: caseData?.visaType || "—",
      icon: Plane,
    },
    {
      label: "Destination",
      value: caseData?.country || "—",
      icon: Globe,
    },
    {
      label: "Case Status",
      value: status,
      icon: ShieldCheck,
    },
  ];

  return (
    <main className="min-h-screen bg-[#061A28] text-white px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="rounded-[32px] border border-white/10 bg-[#083D4A]/80 p-8 shadow-[0_35px_120px_-40px_rgba(34,231,197,0.3)] backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-[#22E7C5] mb-3">
                Document Intelligence Center
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Upload, verify, and manage your immigration documents with AI-powered validation.
              </h1>
              <p className="mt-5 text-lg leading-8 text-[#B8C5D1] max-w-3xl">
                Keep your application on track with premium document insights, secure passport extraction, and verified readiness status.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {summaryCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_-50px_rgba(34,231,197,0.35)] backdrop-blur transition hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#22E7C5]/15 text-[#22E7C5] shadow-lg shadow-[#22E7C5]/10">
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.32em] text-[#B8C5D1]">
                          {card.label}
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">
                          {card.value}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-10">
          <DocumentGuidelines />

          <div className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-[#22E7C5] mb-3">
                Passport Upload
              </p>
              <PassportUploadSection />
            </div>

            {secondaryDoc && (
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-[#22E7C5] mb-3">
                  {secondaryDoc}
                </p>
                <SecondaryDocSection documentName={secondaryDoc} />
              </div>
            )}

            <DocumentProgress />
          </div>
        </section>
      </div>
    </main>
  );
}

export default Documents;
