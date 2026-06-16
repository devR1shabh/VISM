// src/components/processor/CasePassportPanel.jsx
// Updated to read both the full fields (fullName, passportNumber, dateOfBirth)
// written by the new savePassportData endpoint AND the legacy partial fields
// (name, passportLast4) for backwards compatibility with older case records.

function PassportField({ label, value, note }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
      <span className="text-xs uppercase tracking-[0.28em] text-[#B8C5D1]">{label}</span>
      <span className={`text-sm font-semibold ${value ? "text-white" : "text-[#B8C5D1]/40"}`}>
        {value || "—"}
      </span>
      {note && value && (
        <span className="text-xs text-[#B8C5D1]/50">{note}</span>
      )}
    </div>
  );
}

function CasePassportPanel({ caseRecord }) {
  if (!caseRecord) return null;

  const pd = caseRecord.passportData;

  // Resolve display values:
  // Prefer the full fields written by savePassportData (fullName, passportNumber, dateOfBirth).
  // Fall back to legacy partial fields (name, passportLast4) for older records.
  const displayName     = pd?.fullName       || pd?.name           || "";
  const displayNation   = pd?.nationality    || "";
  const displayDOB      = pd?.dateOfBirth    || "";
  const displayExpiry   = pd?.expiryDate     || "";

  // Passport number: show full if available, masked last-4 if only partial stored
  let displayPassport   = "";
  if (pd?.passportNumber) {
    displayPassport = pd.passportNumber;
  } else if (pd?.passportLast4) {
    displayPassport = `••••••••${pd.passportLast4}`;
  }

  const hasAnyData = Boolean(displayName || displayNation || displayPassport || displayExpiry);

  return (
    <div className="rounded-[24px] border border-white/10 bg-[#083D4A]/80 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-[#22E7C5]/15 flex items-center justify-center text-lg">
          🛂
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-[#22E7C5]">Document Extraction</p>
          <h3 className="text-lg font-semibold text-white">Passport Information</h3>
        </div>
        {hasAnyData && (
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Extracted
          </span>
        )}
      </div>

      {hasAnyData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PassportField
            label="Full Name"
            value={displayName}
          />
          <PassportField
            label="Nationality"
            value={displayNation}
          />
          <PassportField
            label="Passport Number"
            value={displayPassport}
            note={!pd?.passportNumber && pd?.passportLast4 ? "Partial — last 4 digits shown" : undefined}
          />
          <PassportField
            label="Date of Birth"
            value={displayDOB}
          />
          <PassportField
            label="Expiry Date"
            value={displayExpiry}
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-white/6 bg-white/3 px-5 py-8 text-center">
          <p className="text-3xl mb-3">📄</p>
          <p className="text-sm font-medium text-[#B8C5D1]">No Passport Data Available</p>
          <p className="text-xs text-[#B8C5D1]/60 mt-1">
            Passport has not been uploaded or extraction did not succeed for this case.
          </p>
        </div>
      )}

      <p className="mt-4 text-xs text-[#B8C5D1]/50">
        VISM extracts data for processing purposes only. Document authenticity is not verified.
      </p>
    </div>
  );
}

export default CasePassportPanel;