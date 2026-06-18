// src/components/processor/AuditTimeline.jsx

const EVENT_META = {
  "Case Created":          { icon: "📋", color: "text-[var(--c-green)]",      border: "border-[var(--c-green)]"      },
  "Documents Uploaded":    { icon: "📎", color: "text-[var(--c-info)]",        border: "border-[var(--c-info)]"        },
  "Passport Extracted":    { icon: "🛂", color: "text-[var(--c-success)]",     border: "border-[var(--c-success)]"     },
  "AI Analysis Generated": { icon: "🤖", color: "text-purple-500",             border: "border-purple-400"             },
  "Assessment Submitted":  { icon: "📝", color: "text-[var(--c-green)]",      border: "border-[var(--c-green)]"      },
  "Processor Viewed Case": { icon: "👁",  color: "text-[var(--c-text-muted)]", border: "border-[var(--c-border)]"     },
  "Note Added":            { icon: "📝", color: "text-[var(--c-warning)]",     border: "border-[var(--c-warning)]"    },
  "Case Approved":         { icon: "✅", color: "text-[var(--c-success)]",     border: "border-[var(--c-success)]"    },
  "Case Rejected":         { icon: "❌", color: "text-[var(--c-error)]",       border: "border-[var(--c-error)]"      },
  "Documents Requested":   { icon: "📎", color: "text-[var(--c-info)]",        border: "border-[var(--c-info)]"        },
};

function getEventMeta(event) {
  return EVENT_META[event] || { icon: "🔹", color: "text-[var(--c-text-muted)]", border: "border-[var(--c-border)]" };
}

function formatDateTime(iso) {
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

function TimelineEntry({ event, detail, timestamp, actor, isLast }) {
  const meta = getEventMeta(event);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full border-2 ${meta.border} bg-[var(--c-card)] flex items-center justify-center text-sm shrink-0`}>
          {meta.icon}
        </div>
        {!isLast && <div className="w-px flex-1 bg-[var(--c-border)] mt-1" />}
      </div>

      <div className="pb-5 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <p className={`text-sm font-semibold ${meta.color}`}>{event}</p>
          <span className="text-xs text-[var(--c-text-muted)] shrink-0">
            {formatDateTime(timestamp)}
          </span>
        </div>
        {detail && (
          <p className="mt-0.5 text-sm text-[var(--c-text-mid)] leading-relaxed">{detail}</p>
        )}
        {actor && actor !== "system" && (
          <span className="mt-0.5 inline-block text-xs text-[var(--c-text-muted)] capitalize">
            by {actor}
          </span>
        )}
      </div>
    </div>
  );
}

function AuditTimeline({ caseRecord }) {
  if (!caseRecord) return null;

  const auditLog     = caseRecord.auditLog     || [];
  const activityFeed = caseRecord.activityFeed || [];

  const entries = [];

  entries.push({
    event:     "Case Created",
    detail:    `${caseRecord.visaType} application for ${caseRecord.country}`,
    timestamp: caseRecord.createdAt,
    actor:     "applicant",
  });

  for (const a of activityFeed) {
    entries.push({
      event:     a.message || a.type || "Activity",
      detail:    "",
      timestamp: a.timestamp,
      actor:     "system",
    });
  }

  for (const e of auditLog) {
    entries.push({
      event:     e.event,
      detail:    e.detail,
      timestamp: e.timestamp,
      actor:     e.actor || "system",
    });
  }

  entries.sort((a, b) => {
    const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return ta - tb;
  });

  return (
    <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--c-text-muted)] font-semibold mb-1">
            History
          </p>
          <h3 className="text-base font-bold text-[var(--c-text)]">Audit Timeline</h3>
        </div>
        <span className="text-xs text-[var(--c-text-muted)] font-medium">{entries.length} Events</span>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-8 text-sm text-[var(--c-text-muted)]">
          No events recorded yet.
        </div>
      ) : (
        <div>
          {entries.map((entry, i) => (
            <TimelineEntry
              key={`${entry.event}-${i}`}
              event={entry.event}
              detail={entry.detail}
              timestamp={entry.timestamp}
              actor={entry.actor}
              isLast={i === entries.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AuditTimeline;