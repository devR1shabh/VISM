// src/pages/Documents.jsx

import { Globe, Plane, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCase } from "../context/CaseContext";
import DocumentGuidelines    from "../components/upload/DocumentGuidelines";
import PassportUploadSection from "../components/upload/PassportUploadSection";
import SecondaryDocSection   from "../components/upload/SecondaryDocSection";
import DocumentProgress      from "../components/upload/DocumentProgress";
import { PageHeader }        from "../components/ui";

function Documents() {
  const navigate = useNavigate();
  const { caseData } = useCase();
  const status = caseData?.status || "In Progress";

  // ── Empty state — no case ────────────────────────────────────────────────
  if (!caseData) {
    return (
      <main className="min-h-screen bg-[var(--c-bg)]">
        <PageHeader
          eyebrow="Document Intelligence Center"
          title="Upload & Verify Documents"
          description="Secure passport extraction, AI-powered document validation, and verified readiness status."
        />
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 text-center">
          <div className="bg-white border border-[var(--c-border)] rounded-xl shadow-sm p-12 max-w-md mx-auto">
            <ShieldCheck size={40} className="text-[var(--c-text-muted)] mx-auto mb-4" />
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-2">No Case Yet</h2>
            <p className="text-sm text-[var(--c-text-muted)] mb-6">
              Create a case on the home page first to begin uploading documents.
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--c-green)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--c-green-mid)] transition"
            >
              Go to Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  const allRequiredDocs = caseData?.analysis?.documents || [];
  const nonPassportDocs = allRequiredDocs.filter((doc) => doc !== "Passport");
  const hasPassport     = allRequiredDocs.includes("Passport");

  const summaryCards = [
    { label: "Visa Type",   value: caseData?.visaType || "—", Icon: Plane       },
    { label: "Destination", value: caseData?.country  || "—", Icon: Globe       },
    { label: "Case Status", value: status,                     Icon: ShieldCheck },
  ];

  // ── Analysis pending state ────────────────────────────────────────────────
  if (allRequiredDocs.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--c-bg)]">
        <PageHeader
          eyebrow="Document Intelligence Center"
          title="Upload & Verify Documents"
          description="Secure passport extraction, AI-powered document validation, and verified readiness status."
        />
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 text-center">
          <div className="bg-white border border-[var(--c-border)] rounded-xl shadow-sm p-12 max-w-md mx-auto">
            <ShieldCheck size={40} className="text-[var(--c-text-muted)] mx-auto mb-4" />
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-2">Analysis Pending</h2>
            <p className="text-sm text-[var(--c-text-muted)] mb-6">
              Complete the AI analysis first to see the required document list.
            </p>
            <button
              onClick={() => navigate("/analysis")}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--c-green)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--c-green-mid)] transition"
            >
              Go to Analysis
            </button>
          </div>
        </div>
      </main>
    );
  }

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

          {hasPassport && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--c-green-mid)] mb-3">
                Passport
              </p>
              <PassportUploadSection />
            </div>
          )}

          {nonPassportDocs.map((docName) => (
            <div key={docName}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--c-green-mid)] mb-3">
                {docName}
              </p>
              <SecondaryDocSection documentName={docName} />
            </div>
          ))}

          <DocumentProgress />

        </div>

      </div>
    </main>
  );
}

export default Documents;