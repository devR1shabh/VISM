// src/components/processor/CaseAssessmentPanel.jsx

import AIApplicationOverview from "../output/AIApplicationOverview";
import AIRiskPanel           from "../output/AIRiskPanel";
import AIRecommendations     from "../output/AIRecommendations";

function InfoRow({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
      <p className="text-xs uppercase tracking-[0.28em] text-[#B8C5D1] mb-1">{label}</p>
      <p className="text-sm font-semibold text-white">{value || "—"}</p>
    </div>
  );
}

function CaseAssessmentPanel({ caseRecord }) {
  if (!caseRecord) return null;

  const { visaType, country, description } = caseRecord;
  const analysis = caseRecord.analysis || null;

  return (
    <div className="space-y-6">

      <div className="rounded-[24px] border border-white/10 bg-[#083D4A]/80 p-6 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.32em] text-[#22E7C5] mb-1">Case Information</p>
        <h3 className="text-lg font-semibold text-white mb-5">Assessment Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <InfoRow label="Visa Type"           value={visaType} />
          <InfoRow label="Destination Country" value={country} />
        </div>

        {description ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.28em] text-[#B8C5D1] mb-2">
              Case Description
            </p>
            <p className="text-sm text-[#B8C5D1] leading-relaxed">{description}</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/6 bg-white/3 px-5 py-4 text-sm text-[#B8C5D1]/60">
            No case description provided.
          </div>
        )}
      </div>

      {analysis ? (
        <>
          {analysis.aiOverview && (
            <AIApplicationOverview aiOverview={analysis.aiOverview} />
          )}
          {analysis.aiRisks?.length > 0 && (
            <AIRiskPanel aiRisks={analysis.aiRisks} />
          )}
          {analysis.aiRecommendations?.length > 0 && (
            <AIRecommendations aiRecommendations={analysis.aiRecommendations} />
          )}
        </>
      ) : (
        <div className="rounded-[24px] border border-white/6 bg-white/3 p-6 text-sm text-center">
          <p className="text-2xl mb-2">🤖</p>
          <p className="font-medium text-[#B8C5D1]">AI Analysis Not Available</p>
          <p className="text-xs mt-1 text-[#B8C5D1]/60">
            AI analysis is stored client-side and was not persisted to the server for this case.
          </p>
        </div>
      )}

    </div>
  );
}

export default CaseAssessmentPanel;