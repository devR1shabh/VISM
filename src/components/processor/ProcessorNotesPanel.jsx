// src/components/processor/ProcessorNotesPanel.jsx

import { useState } from "react";

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day:    "2-digit",
      month:  "short",
      year:   "numeric",
      hour:   "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function NoteCard({ note }) {
  return (
    <div className="rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] px-4 py-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--c-green-mid)]">
          Processor Note
        </span>
        <span className="text-xs text-[var(--c-text-muted)]">{formatDate(note.addedAt)}</span>
      </div>
      <p className="text-sm text-[var(--c-text-mid)] leading-relaxed">{note.text}</p>
    </div>
  );
}

function ProcessorNotesPanel({ notes = [], onAddNote, isSaving }) {
  const [noteText, setNoteText] = useState("");

  const handleSubmit = async () => {
    const trimmed = noteText.trim();
    if (!trimmed || isSaving) return;
    await onAddNote(trimmed);
    setNoteText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.addedAt) - new Date(a.addedAt)
  );

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-[var(--r-lg)] bg-[var(--c-green-bg)] flex items-center justify-center text-lg">
          📝
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--c-text-muted)] font-semibold">
            Internal
          </p>
          <h3 className="text-base font-bold text-[var(--c-text)]">Processor Notes</h3>
        </div>
      </div>

      {sortedNotes.length > 0 ? (
        <div className="space-y-2.5 mb-5">
          {sortedNotes.map((note, i) => (
            <NoteCard key={note.noteId || i} note={note} />
          ))}
        </div>
      ) : (
        <div className="rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] px-4 py-5 text-center mb-5">
          <p className="text-sm text-[var(--c-text-muted)]">No notes added yet.</p>
        </div>
      )}

      <div className="space-y-3">
        <label className="block text-[10px] uppercase tracking-[0.18em] text-[var(--c-text-muted)] font-semibold">
          Add Note
        </label>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          placeholder="Add an internal processor note... (Ctrl+Enter to submit)"
          className="w-full bg-[var(--c-card)] border border-[var(--c-border)] text-[var(--c-text)] text-sm px-4 py-3 rounded-[var(--r-lg)] focus:outline-none focus:ring-2 focus:ring-[var(--c-green)] focus:border-[var(--c-green)] placeholder-[var(--c-text-muted)] transition resize-none"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!noteText.trim() || isSaving}
          className="inline-flex items-center gap-2 rounded-[var(--r-lg)] bg-[var(--c-green)] text-white text-sm font-semibold px-5 py-2.5 hover:bg-[var(--c-green-mid)] disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          {isSaving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Note
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProcessorNotesPanel;