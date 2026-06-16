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
    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#22E7C5] uppercase tracking-wide">
          Processor Note
        </span>
        <span className="text-xs text-[#B8C5D1]">{formatDate(note.addedAt)}</span>
      </div>
      <p className="text-sm text-[#B8C5D1] leading-relaxed">{note.text}</p>
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
    <div className="rounded-[24px] border border-white/10 bg-[#083D4A]/80 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-[#22E7C5]/15 flex items-center justify-center text-lg">
          📝
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-[#22E7C5]">Internal</p>
          <h3 className="text-lg font-semibold text-white">Processor Notes</h3>
        </div>
      </div>

      {sortedNotes.length > 0 ? (
        <div className="space-y-3 mb-5">
          {sortedNotes.map((note, i) => (
            <NoteCard key={note.noteId || i} note={note} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/6 bg-white/3 px-5 py-6 text-center mb-5">
          <p className="text-sm text-[#B8C5D1]/60">No notes added yet.</p>
        </div>
      )}

      <div className="space-y-3">
        <label className="block text-xs uppercase tracking-[0.28em] text-[#B8C5D1] font-semibold">
          Add Note
        </label>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          placeholder="Add an internal processor note... (Ctrl+Enter to submit)"
          className="w-full bg-[#061A28] border border-white/10 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22E7C5] focus:border-[#22E7C5] placeholder-[#B8C5D1]/50 transition resize-none"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!noteText.trim() || isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-white/8 border border-white/10 text-white text-sm font-semibold px-5 py-2.5 hover:bg-white/12 disabled:opacity-40 disabled:cursor-not-allowed transition"
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