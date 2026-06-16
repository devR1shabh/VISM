// src/pages/Documents.jsx

import { Globe, Plane, ShieldCheck } from "lucide-react";
import { useCase } from "../context/CaseContext";
import DocumentGuidelines   from "../components/upload/DocumentGuidelines";
import PassportUploadSection from "../components/upload/PassportUploadSection";
import SecondaryDocSection   from "../components/upload/SecondaryDocSection";
import DocumentProgress      from "../components/upload/DocumentProgress";
import { PageHeader }        from "../components/ui";

const SECONDARY_DOCS = {
  "Student Visa": "Academic Transcript",
  "Work Visa":    "Resume",
  "Tourist Visa": "Bank Statement",
};

function Documents() {
  // ── Logic completely unchanged ────────────────────────────────────────────
  const { caseData } = useCase();
  const secondaryDoc = SECONDARY_DOCS[caseData?.visaType] || null;
  const status       = caseData?.status || "In Progress";

  const summaryCards = [
    { label: "Visa Type",   value: caseData?.visaType || "—", Icon: Plane       },
    { label: "Destination", value: caseData?.country  || "—", Icon: Globe       },
    { label: "Case Status", value: status,                     Icon: ShieldCheck },
  ];

  return (
    <main className="min-h-screen bg-[var(--c-bg)]">

      <PageHeader
        eyebrow="Document Intelligence Center"
        title="Upload & Verify Documents"
        description="Secure passport extraction, AI-powered document validation, and verified readiness status."
      >
        <div className="flex flex-wrap gap-3 mt-4">
          {summaryCards.map(({ label, value, Icon }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-lg bg-white/10 border border-white/15 px-4 py-2"
            >
              <Icon size={14} className="text-white/70" />
              <span className="text-xs text-white/60 uppercase tracking-wide font-semibold">
                {label}:
              </span>
              <span className="text-sm font-semibold text-white">{value}</span>
            </div>
          ))}
        </div>
      </PageHeader>

      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 space-y-8">

        <DocumentGuidelines />

        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--c-green-mid)] mb-3">
              Passport Upload
            </p>
            <PassportUploadSection />
          </div>

          {secondaryDoc && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--c-green-mid)] mb-3">
                {secondaryDoc}
              </p>
              <SecondaryDocSection documentName={secondaryDoc} />
            </div>
          )}

          <DocumentProgress />
        </div>

      </div>
    </main>
  );
}

export default Documents;