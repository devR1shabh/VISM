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
      className={`flex items-center justify-between rounded-2xl border px-5 py-4 ${
        verified
          ? "border-emerald-400/30 bg-emerald-500/8"
          : submitted
          ? "border-amber-400/30 bg-amber-500/8"
          : "border-white/8 bg-white/3"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            verified ? "bg-emerald-500/20" : submitted ? "bg-amber-500/20" : "bg-white/8"
          }`}
        >
          {verified ? (
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : submitted ? (
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-[#B8C5D1]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <div>
          <p className={`text-sm font-semibold ${
            verified || submitted ? "text-white" : "text-[#B8C5D1]/60"
          }`}>
            {name}
          </p>
          {uploadedAt && formatDate(uploadedAt) && (
            <p className="text-xs text-[#B8C5D1]/60 mt-0.5">
              Uploaded {formatDate(uploadedAt)}
            </p>
          )}
          {!submitted && (
            <p className="text-xs text-[#B8C5D1]/60 mt-0.5">Not submitted</p>
          )}
        </div>
      </div>

      <span
        className={`text-xs font-semibold px-3 py-1 rounded-full border ${
          verified
            ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
            : submitted
            ? "border-amber-400/40 bg-amber-500/10 text-amber-300"
            : "border-white/10 bg-white/5 text-[#B8C5D1]/50"
        }`}
      >
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
    <div className="rounded-[24px] border border-white/10 bg-[#083D4A]/80 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-[#22E7C5] mb-1">Document Review</p>
          <h3 className="text-lg font-semibold text-white">Submitted Documents</h3>
        </div>
        <span className="text-sm text-[#B8C5D1]">
          {verifiedCount} / {required.length} verified
        </span>
      </div>

      {required.length === 0 ? (
        <div className="text-sm text-[#B8C5D1]/60 text-center py-6">
          No document requirements found for this visa type.
        </div>
      ) : (
        <div className="space-y-3">
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