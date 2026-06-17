// src/components/processor/CasePassportPanel.jsx

function PassportField({ label, value, note }) {
  return (
    <div className="rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] px-4 py-3">
      <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--c-text-muted)] block mb-1">
        {label}
      </span>
      <span className={`text-sm font-semibold ${value ? "text-[var(--c-text)]" : "text-[var(--c-text-muted)]"}`}>
        {value || "—"}
      </span>
      {note && value && (
        <span className="text-xs text-[var(--c-text-muted)] block mt-0.5">{note}</span>
      )}
    </div>
  );
}

function CasePassportPanel({ caseRecord }) {
  if (!caseRecord) return null;

  const pd = caseRecord.passportData;

  const displayName   = pd?.fullName    || pd?.name        || "";
  const displayNation = pd?.nationality || "";
  const displayDOB    = pd?.dateOfBirth || "";
  const displayExpiry = pd?.expiryDate  || "";

  let displayPassport = "";
  if (pd?.passportNumber) {
    displayPassport = pd.passportNumber;
  } else if (pd?.passportLast4) {
    displayPassport = `••••••••${pd.passportLast4}`;
  }

  const hasAnyData = Boolean(displayName || displayNation || displayPassport || displayExpiry);

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-[var(--r-lg)] bg-[var(--c-green-bg)] flex items-center justify-center text-lg">
          🛂
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--c-text-muted)] font-semibold">
            Document Extraction
          </p>
          <h3 className="text-base font-bold text-[var(--c-text)]">Passport Information</h3>
        </div>
        {hasAnyData && (
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-[var(--c-success-border)] bg-[var(--c-success-bg)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-[var(--c-success)]">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Extracted
          </span>
        )}
      </div>

      {hasAnyData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <PassportField label="Full Name"       value={displayName} />
          <PassportField label="Nationality"     value={displayNation} />
          <PassportField
            label="Passport Number"
            value={displayPassport}
            note={!pd?.passportNumber && pd?.passportLast4 ? "Partial — last 4 digits shown" : undefined}
          />
          <PassportField label="Date of Birth"   value={displayDOB} />
          <PassportField label="Expiry Date"     value={displayExpiry} />
        </div>
      ) : (
        <div className="rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] px-5 py-8 text-center">
          <p className="text-3xl mb-3">📄</p>
          <p className="text-sm font-medium text-[var(--c-text-mid)]">No Passport Data Available</p>
          <p className="text-xs text-[var(--c-text-muted)] mt-1">
            Passport has not been uploaded or extraction did not succeed for this case.
          </p>
        </div>
      )}

      <p className="mt-4 text-xs text-[var(--c-text-muted)]">
        VISM extracts data for processing purposes only. Document authenticity is not verified.
      </p>
    </div>
  );
}

export default CasePassportPanel;