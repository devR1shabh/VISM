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
    baseClass:    "border-[var(--c-success-border)] bg-[var(--c-success-bg)] text-[var(--c-success)] hover:bg-[var(--c-success-bg)]",
    confirmClass: "bg-[var(--c-success)] text-white hover:bg-[var(--c-success)]",
  },
  {
    key:          "reject",
    label:        "Reject",
    icon:         "❌",
    description:  "Mark this case as rejected.",
    confirmLabel: "Confirm Rejection",
    resultStatus: "Rejected",
    baseClass:    "border-[var(--c-error-border)] bg-[var(--c-error-bg)] text-[var(--c-error)] hover:bg-[var(--c-error-bg)]",
    confirmClass: "bg-[var(--c-error)] text-white hover:bg-[var(--c-error)]",
  },
  {
    key:          "request_documents",
    label:        "Request Documents",
    icon:         "📎",
    description:  "Request additional documents from the applicant.",
    confirmLabel: "Confirm Request",
    resultStatus: "Need Documents",
    baseClass:    "border-[var(--c-info-border)] bg-[var(--c-info-bg)] text-[var(--c-info)] hover:bg-[var(--c-info-bg)]",
    confirmClass: "bg-[var(--c-info)] text-white hover:bg-[var(--c-info)]",
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
      <div className={`rounded-[var(--r-lg)] border p-4 space-y-3 ${action.baseClass}`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{action.icon}</span>
          <p className="text-sm font-semibold text-[var(--c-text)]">{action.confirmLabel}</p>
        </div>

        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          rows={2}
          placeholder={`Optional: add a note for this ${action.label.toLowerCase()} action...`}
          className="w-full bg-[var(--c-card)] border border-[var(--c-border)] text-[var(--c-text)] text-sm px-4 py-2.5 rounded-[var(--r-md)] focus:outline-none focus:ring-2 focus:ring-[var(--c-green)] placeholder-[var(--c-text-muted)] transition resize-none"
        />

        {error && <p className="text-xs text-[var(--c-error)]">{error}</p>}

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-[var(--r-lg)] px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${action.confirmClass}`}
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
            className="px-4 py-2.5 rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-card)] text-[var(--c-text-mid)] text-sm font-semibold hover:bg-[var(--c-bg)] transition disabled:opacity-50"
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
      className={`w-full inline-flex items-center justify-center gap-2.5 rounded-[var(--r-lg)] border px-5 py-3 text-sm font-semibold transition ${action.baseClass} disabled:opacity-40 disabled:cursor-not-allowed`}
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
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-[var(--r-lg)] bg-[var(--c-green-bg)] flex items-center justify-center text-lg">
          ⚡
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--c-text-muted)] font-semibold">
            Case Management
          </p>
          <h3 className="text-base font-bold text-[var(--c-text)]">Processor Actions</h3>
        </div>
      </div>

      <div className="rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] px-4 py-3 mb-4">
        <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--c-text-muted)] mb-1">
          Current Status
        </p>
        <p className="text-sm font-semibold text-[var(--c-text)]">{currentStatus || "Pending"}</p>
      </div>

      <div className="space-y-2.5">
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

      <p className="mt-4 text-xs text-[var(--c-text-muted)] text-center">
        Actions are logged in the audit timeline and cannot be undone.
      </p>
    </div>
  );
}

export default ProcessorActions;