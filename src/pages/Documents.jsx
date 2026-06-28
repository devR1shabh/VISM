// src/pages/Documents.jsx
//
// FEATURE 2 CHANGE:
//   Document list is now split into two labeled sections:
//     - Mandatory Documents (9 docs) — shown with red urgency badge
//     - Supporting Documents (6 docs) — shown with softer blue badge
//   Uses useConfig() to determine which category each doc belongs to.

import { useState, useEffect }      from "react";
import { Globe, Plane, ShieldCheck } from "lucide-react";
import { useNavigate }              from "react-router-dom";

import { useCase }              from "../context/CaseContext";
import { useConfig }            from "../context/ConfigContext.jsx";
import DocumentGuidelines       from "../components/upload/DocumentGuidelines";
import PassportUploadSection    from "../components/upload/PassportUploadSection";
import SecondaryDocSection      from "../components/upload/SecondaryDocSection";
import DocumentProgress         from "../components/upload/DocumentProgress";
import { PageHeader }           from "../components/ui";
import PIIDisclaimerModal       from "../components/upload/PIIDisclaimerModal";

// ── Section header — labels the mandatory / supporting groups ─────────────────
function SectionLabel({ category, count }) {
  const isMandatory = category === "mandatory";
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] border ${
        isMandatory
          ? "bg-[var(--c-error-bg)] text-[var(--c-error)] border-[var(--c-error-border)]"
          : "bg-[var(--c-info-bg)] text-[var(--c-info)] border-[var(--c-info-border)]"
      }`}>
        {isMandatory ? "⚠ Mandatory" : "✦ Supporting"}
      </span>
      <span className="text-xs text-[var(--c-text-muted)] font-medium">
        {count} {count === 1 ? "document" : "documents"}
      </span>
      <div className="flex-1 h-px bg-[var(--c-border)]" />
    </div>
  );
}

function Documents() {
  const navigate  = useNavigate();
  const { caseData } = useCase();
  const { documents: configDocs } = useConfig();

  const status     = caseData?.status || "In Progress";
  const caseId     = caseData?.id;
  const storageKey = caseId ? `vism_disclaimer_accepted_${caseId}` : null;

  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    if (!storageKey) return;
    const accepted = localStorage.getItem(storageKey) === "true";
    setShowDisclaimer(!accepted);
  }, [storageKey]);

  function handleDisclaimerAccept() {
    if (storageKey) localStorage.setItem(storageKey, "true");
    setShowDisclaimer(false);
  }

  // ── Empty state ───────────────────────────────────────────────────────────
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

  // ── Analysis pending ──────────────────────────────────────────────────────
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

  // ── Split docs into mandatory / supporting using ConfigContext ────────────
  const hasPassport = allRequiredDocs.includes("Passport");

  // Mandatory: passport handled separately, rest in this section
  const mandatoryNonPassport = allRequiredDocs.filter(
    (doc) => doc !== "Passport" && configDocs.categoryMap[doc] === "mandatory"
  );

  // Supporting: all docs the analysis returned that are in the supporting category
  const supportingDocs = allRequiredDocs.filter(
    (doc) => configDocs.categoryMap[doc] === "supporting"
  );

  // Docs with no category mapping (edge case for unknown doc types)
  const uncategorizedDocs = allRequiredDocs.filter(
    (doc) => doc !== "Passport" &&
             !configDocs.categoryMap[doc]
  );

  const summaryCards = [
    { label: "Visa Type",   value: caseData?.visaType || "—", Icon: Plane       },
    { label: "Destination", value: caseData?.country  || "—", Icon: Globe       },
    { label: "Case Status", value: status,                     Icon: ShieldCheck },
  ];

  return (
    <main className="min-h-screen bg-[var(--c-bg)]">

      {showDisclaimer && (
        <PIIDisclaimerModal onAccept={handleDisclaimerAccept} />
      )}

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

        <div className="space-y-10">

          {/* ── Mandatory Documents ─────────────────────────────────────── */}
          {(hasPassport || mandatoryNonPassport.length > 0) && (
            <div>
              <SectionLabel
                category="mandatory"
                count={(hasPassport ? 1 : 0) + mandatoryNonPassport.length}
              />

              <div className="space-y-6">
                {hasPassport && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--c-green-mid)] mb-3">
                      Passport
                    </p>
                    <PassportUploadSection />
                  </div>
                )}

                {mandatoryNonPassport.map((docName) => (
                  <div key={docName}>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--c-green-mid)] mb-3">
                      {docName}
                    </p>
                    <SecondaryDocSection documentName={docName} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Supporting Documents ────────────────────────────────────── */}
          {supportingDocs.length > 0 && (
            <div>
              <SectionLabel category="supporting" count={supportingDocs.length} />

              <div className="space-y-6">
                {supportingDocs.map((docName) => (
                  <div key={docName}>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--c-text-muted)] mb-3">
                      {docName}
                    </p>
                    <SecondaryDocSection documentName={docName} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Uncategorized (edge case) ───────────────────────────────── */}
          {uncategorizedDocs.length > 0 && (
            <div className="space-y-6">
              {uncategorizedDocs.map((docName) => (
                <div key={docName}>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--c-green-mid)] mb-3">
                    {docName}
                  </p>
                  <SecondaryDocSection documentName={docName} />
                </div>
              ))}
            </div>
          )}

          <DocumentProgress />

        </div>
      </div>
    </main>
  );
}

export default Documents;