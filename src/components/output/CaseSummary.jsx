import { useCase } from "../../context/CaseContext";

function CaseSummary({ documents = [] }) {
  // ── Logic completely unchanged ──────────────────────────────────
  const { caseData, uploadedDocuments } = useCase();

  const verifiedDocuments = uploadedDocuments.filter((doc) => doc.valid);

  const allDocumentsUploaded = documents.every((requiredDoc) =>
    verifiedDocuments.some(
      (uploadedDoc) => uploadedDoc.requiredDocument === requiredDoc
    )
  );

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-[var(--c-text)]">Case Summary</h2>
          <p className="text-xs text-[var(--c-text-muted)] mt-0.5">
            Document verification and application readiness status.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 mb-5">
        <div className="rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--c-text-muted)] mb-1">
            Visa Type
          </p>
          <p className="text-sm font-semibold text-[var(--c-text)]">{caseData?.visaType}</p>
        </div>
        <div className="rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--c-text-muted)] mb-1">
            Destination
          </p>
          <p className="text-sm font-semibold text-[var(--c-text)]">{caseData?.country}</p>
        </div>
      </div>

      <div className="space-y-2 mb-5">
        {documents.map((document) => {
          const exists = verifiedDocuments.some(
            (uploadedDoc) => uploadedDoc.requiredDocument === document
          );
          return (
            <div
              key={document}
              className="flex items-center justify-between rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] px-4 py-3"
            >
              <p className="text-sm text-[var(--c-text-mid)]">{document}</p>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] border ${
                  exists
                    ? "bg-[var(--c-success-bg)] text-[var(--c-success)] border-[var(--c-success-border)]"
                    : "bg-[var(--c-warning-bg)] text-[var(--c-warning)] border-[var(--c-warning-border)]"
                }`}
              >
                {exists ? "Verified" : "Missing"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] px-4 py-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--c-text-muted)] mb-3">
          Application Status
        </p>
        {allDocumentsUploaded ? (
          <div className="rounded-[var(--r-md)] border border-[var(--c-success-border)] bg-[var(--c-success-bg)] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--c-success)]">
              Ready for Submission
            </p>
            <p className="mt-1 text-xs text-[var(--c-text-muted)]">
              All required documents have been verified.
            </p>
          </div>
        ) : (
          <div className="rounded-[var(--r-md)] border border-[var(--c-warning-border)] bg-[var(--c-warning-bg)] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--c-warning)]">
              Action Required
            </p>
            <p className="mt-1 text-xs text-[var(--c-text-muted)]">
              Some required documents are still missing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CaseSummary;