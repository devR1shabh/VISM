// src/components/processor/CaseAssessmentPanel.jsx

import AIApplicationOverview from "../output/AIApplicationOverview";
import AIRiskPanel           from "../output/AIRiskPanel";
import AIRecommendations     from "../output/AIRecommendations";

function InfoRow({ label, value }) {
  return (
    <div className="rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--c-text-muted)] mb-1">{label}</p>
      <p className="text-sm font-semibold text-[var(--c-text)]">{value || "—"}</p>
    </div>
  );
}

function CaseAssessmentPanel({ caseRecord }) {
  if (!caseRecord) return null;

  const { visaType, country, description } = caseRecord;
  const analysis = caseRecord.analysis || null;

  return (
    <div className="space-y-5">

      <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--c-text-muted)] font-semibold mb-1">
          Case Information
        </p>
        <h3 className="text-base font-bold text-[var(--c-text)] mb-4">Assessment Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <InfoRow label="Visa Type"           value={visaType} />
          <InfoRow label="Destination Country" value={country} />
        </div>

        {description ? (
          <div className="rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--c-text-muted)] mb-1.5">
              Case Description
            </p>
            <p className="text-sm text-[var(--c-text-mid)] leading-relaxed">{description}</p>
          </div>
        ) : (
          <div className="rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] px-4 py-3 text-sm text-[var(--c-text-muted)]">
            No case description provided.
          </div>
        )}
      </div>

      {analysis ? (
        <>
          {analysis.aiOverview && (
            <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
              <AIApplicationOverview aiOverview={analysis.aiOverview} />
            </div>
          )}
          {analysis.aiRisks?.length > 0 && (
            <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
              <AIRiskPanel aiRisks={analysis.aiRisks} />
            </div>
          )}
          {analysis.aiRecommendations?.length > 0 && (
            <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
              <AIRecommendations aiRecommendations={analysis.aiRecommendations} />
            </div>
          )}
        </>
      ) : (
        <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6 text-center">
          <p className="text-2xl mb-2">🤖</p>
          <p className="text-sm font-medium text-[var(--c-text-mid)]">AI Analysis Not Available</p>
          <p className="text-xs mt-1 text-[var(--c-text-muted)]">
            AI analysis is stored client-side and was not persisted to the server for this case.
          </p>
        </div>
      )}

    </div>
  );
}

export default CaseAssessmentPanel;