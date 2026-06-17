// src/components/processor/CaseDocumentsPanel.jsx

const REQUIRED_DOCS_BY_VISA = {
  "Student Visa": ["Passport", "Academic Transcript"],
  "Work Visa":    ["Passport", "Resume"],
  "Tourist Visa": ["Passport", "Bank Statement"],
};

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day:    "2-digit",
      month:  "short",
      year:   "numeric",
      hour:   "2-digit",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
}

function DocRow({ name, submitted, verified, uploadedAt }) {
  return (
    <div
      className={`flex items-center justify-between rounded-[var(--r-lg)] border px-4 py-3 ${
        verified
          ? "border-[var(--c-success-border)] bg-[var(--c-success-bg)]"
          : submitted
          ? "border-[var(--c-warning-border)] bg-[var(--c-warning-bg)]"
          : "border-[var(--c-border)] bg-[var(--c-bg)]"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
          verified ? "bg-[var(--c-success)]" : submitted ? "bg-[var(--c-warning)]" : "bg-[var(--c-border)]"
        }`}>
          {verified ? (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : submitted ? (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-[var(--c-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <div>
          <p className={`text-sm font-semibold ${
            verified || submitted ? "text-[var(--c-text)]" : "text-[var(--c-text-muted)]"
          }`}>
            {name}
          </p>
          {uploadedAt && formatDate(uploadedAt) && (
            <p className="text-xs text-[var(--c-text-muted)] mt-0.5">
              Uploaded {formatDate(uploadedAt)}
            </p>
          )}
          {!submitted && (
            <p className="text-xs text-[var(--c-text-muted)] mt-0.5">Not submitted</p>
          )}
        </div>
      </div>

      <span className={`text-[10px] font-bold uppercase tracking-[0.06em] px-2.5 py-0.5 rounded-full border ${
        verified
          ? "border-[var(--c-success-border)] bg-[var(--c-success-bg)] text-[var(--c-success)]"
          : submitted
          ? "border-[var(--c-warning-border)] bg-[var(--c-warning-bg)] text-[var(--c-warning)]"
          : "border-[var(--c-border)] bg-[var(--c-bg)] text-[var(--c-text-muted)]"
      }`}>
        {verified ? "Verified" : submitted ? "Submitted" : "Missing"}
      </span>
    </div>
  );
}

function CaseDocumentsPanel({ caseRecord }) {
  if (!caseRecord) return null;

  const { visaType, uploadedDocuments = [] } = caseRecord;
  const required = REQUIRED_DOCS_BY_VISA[visaType] || [];
  const verifiedCount = uploadedDocuments.filter((d) => d.verified).length;

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--c-text-muted)] font-semibold mb-1">
            Document Review
          </p>
          <h3 className="text-base font-bold text-[var(--c-text)]">Submitted Documents</h3>
        </div>
        <span className="text-xs text-[var(--c-text-muted)] font-medium">
          {verifiedCount} / {required.length} verified
        </span>
      </div>

      {required.length === 0 ? (
        <div className="text-sm text-[var(--c-text-muted)] text-center py-6">
          No document requirements found for this visa type.
        </div>
      ) : (
        <div className="space-y-2.5">
          {required.map((docName) => {
            const record = uploadedDocuments.find(
              (d) => d.type === docName || d.requiredDocument === docName
            );
            return (
              <DocRow
                key={docName}
                name={docName}
                submitted={Boolean(record)}
                verified={record?.verified ?? false}
                uploadedAt={record?.uploadedAt}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CaseDocumentsPanel;