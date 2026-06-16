// src/components/processor/ProcessorActions.jsx

import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const ACTIONS = [
  {
    key:          "approve",
    label:        "Approve",
    icon:         "✅",
    description:  "Mark this case as approved.",
    confirmLabel: "Confirm Approval",
    resultStatus: "Approved",
    baseClass:    "border-emerald-400/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20",
    confirmClass: "bg-emerald-500 text-white hover:bg-emerald-600",
  },
  {
    key:          "reject",
    label:        "Reject",
    icon:         "❌",
    description:  "Mark this case as rejected.",
    confirmLabel: "Confirm Rejection",
    resultStatus: "Rejected",
    baseClass:    "border-red-400/40 bg-red-500/10 text-red-300 hover:bg-red-500/20",
    confirmClass: "bg-red-500 text-white hover:bg-red-600",
  },
  {
    key:          "request_documents",
    label:        "Request Documents",
    icon:         "📎",
    description:  "Request additional documents from the applicant.",
    confirmLabel: "Confirm Request",
    resultStatus: "Need Documents",
    baseClass:    "border-blue-400/40 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20",
    confirmClass: "bg-blue-500 text-white hover:bg-blue-600",
  },
];

async function sendAction(caseId, action, note) {
  const res = await fetch(`${API_URL}/cases/${caseId}/processor-action`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ action, note: note || "" }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Action failed");
  }
  return res.json();
}

function ActionButton({ action, currentStatus, caseId, onActionSuccess }) {
  const [confirming, setConfirming] = useState(false);
  const [noteText, setNoteText]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const isCurrentStatus = currentStatus === action.resultStatus;

  const handleOpen = () => {
    if (isCurrentStatus) return;
    setConfirming(true);
    setError("");
    setNoteText("");
  };

  const handleCancel = () => {
    setConfirming(false);
    setError("");
    setNoteText("");
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      const updated = await sendAction(caseId, action.key, noteText);
      onActionSuccess(updated);
      setConfirming(false);
      setNoteText("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (confirming) {
    return (
      <div className={`rounded-2xl border p-5 space-y-4 ${action.baseClass}`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{action.icon}</span>
          <p className="text-sm font-semibold text-white">{action.confirmLabel}</p>
        </div>

        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          rows={2}
          placeholder={`Optional: add a note for this ${action.label.toLowerCase()} action...`}
          className="w-full bg-[#061A28] border border-white/10 text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22E7C5] placeholder-[#B8C5D1]/50 transition resize-none"
        />

        {error && (
          <p className="text-xs text-red-300">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${action.confirmClass}`}
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              action.confirmLabel
            )}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-[#B8C5D1] text-sm font-semibold hover:bg-white/10 transition disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleOpen}
      disabled={isCurrentStatus}
      title={isCurrentStatus ? `Case is already ${currentStatus}` : action.description}
      className={`w-full inline-flex items-center justify-center gap-2.5 rounded-2xl border px-5 py-3.5 text-sm font-semibold transition ${action.baseClass} disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      <span>{action.icon}</span>
      {action.label}
      {isCurrentStatus && (
        <span className="ml-auto text-xs opacity-60">(Current)</span>
      )}
    </button>
  );
}

function ProcessorActions({ caseId, currentStatus, onActionSuccess }) {
  if (!caseId) return null;

  return (
    <div className="rounded-[24px] border border-white/10 bg-[#083D4A]/80 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-[#22E7C5]/15 flex items-center justify-center text-lg">
          ⚡
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-[#22E7C5]">Case Management</p>
          <h3 className="text-lg font-semibold text-white">Processor Actions</h3>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
        <p className="text-xs text-[#B8C5D1] uppercase tracking-wide mb-1">Current Status</p>
        <p className="text-sm font-semibold text-white">{currentStatus || "Pending"}</p>
      </div>

      <div className="space-y-3">
        {ACTIONS.map((action) => (
          <ActionButton
            key={action.key}
            action={action}
            currentStatus={currentStatus}
            caseId={caseId}
            onActionSuccess={onActionSuccess}
          />
        ))}
      </div>

      <p className="mt-4 text-xs text-[#B8C5D1]/50 text-center">
        Actions are logged in the audit timeline and cannot be undone.
      </p>
    </div>
  );
}

export default ProcessorActions;