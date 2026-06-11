import { useCase } from "../../context/CaseContext";

function CaseSummary({
  documents = [],
}) {
  const {
    caseData,
    uploadedDocuments,
  } = useCase();

  const verifiedDocuments =
    uploadedDocuments.filter(
      (doc) => doc.valid
    );

  const allDocumentsUploaded =
    documents.every(
      (requiredDoc) =>
        verifiedDocuments.some(
          (uploadedDoc) =>
            uploadedDoc.requiredDocument ===
            requiredDoc
        )
    );

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#083D4A]/80 p-6 shadow-[0_25px_80px_-40px_rgba(34,231,197,0.35)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Case Summary</h2>
          <p className="text-sm text-[#B8C5D1] mt-1">Document verification and application readiness status.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[#B8C5D1]">Visa Type</p>
          <p className="mt-2 font-semibold text-white">{caseData?.visaType}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[#B8C5D1]">Destination</p>
          <p className="mt-2 font-semibold text-white">{caseData?.country}</p>
        </div>
      </div>

      <div className="grid gap-3">
        {documents.map((document) => {
          const exists =
            verifiedDocuments.some(
              (uploadedDoc) =>
                uploadedDoc.requiredDocument ===
                document
            );

          return (
            <div
              key={document}
              className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <p className="text-sm text-[#B8C5D1]">{document}</p>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${exists ? "bg-emerald-500/15 text-emerald-200 border border-emerald-400/20" : "bg-amber-500/15 text-amber-200 border border-amber-400/20"}`}>
                {exists ? "Verified" : "Missing"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-5">
        <p className="text-sm uppercase tracking-[0.32em] text-[#B8C5D1]">Application Status</p>
        {allDocumentsUploaded ? (
          <div className="mt-4 rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-4">
            <p className="text-sm font-semibold uppercase text-emerald-200">READY FOR SUBMISSION</p>
            <p className="mt-2 text-sm text-[#B8C5D1]">All required documents have been verified.</p>
          </div>
        ) : (
          <div className="mt-4 rounded-3xl border border-amber-400/30 bg-amber-500/10 p-4">
            <p className="text-sm font-semibold uppercase text-amber-200">ACTION REQUIRED</p>
            <p className="mt-2 text-sm text-[#B8C5D1]">Some required documents are still missing.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CaseSummary;
