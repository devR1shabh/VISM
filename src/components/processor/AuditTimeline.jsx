// src/components/processor/AuditTimeline.jsx

const EVENT_META = {
  "Case Created":          { icon: "📋", color: "text-[#22E7C5]",  border: "border-[#22E7C5]/50"  },
  "Documents Uploaded":    { icon: "📎", color: "text-blue-300",   border: "border-blue-400/50"   },
  "Passport Extracted":    { icon: "🛂", color: "text-emerald-300", border: "border-emerald-400/50" },
  "AI Analysis Generated": { icon: "🤖", color: "text-purple-300", border: "border-purple-400/50" },
  "Assessment Submitted":  { icon: "📝", color: "text-[#22E7C5]",  border: "border-[#22E7C5]/50"  },
  "Processor Viewed Case": { icon: "👁",  color: "text-slate-300",  border: "border-slate-400/50"  },
  "Note Added":            { icon: "📝", color: "text-amber-300",  border: "border-amber-400/50"  },
  "Case Approved":         { icon: "✅", color: "text-emerald-300", border: "border-emerald-400/50" },
  "Case Rejected":         { icon: "❌", color: "text-red-300",    border: "border-red-400/50"    },
  "Documents Requested":   { icon: "📎", color: "text-blue-300",   border: "border-blue-400/50"   },
};

function getEventMeta(event) {
  return EVENT_META[event] || { icon: "🔹", color: "text-[#B8C5D1]", border: "border-white/20" };
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
        <div
          className={`w-9 h-9 rounded-full border-2 ${meta.border} bg-[#061A28] flex items-center justify-center text-base shrink-0`}
        >
          {meta.icon}
        </div>
        {!isLast && <div className="w-px flex-1 bg-white/8 mt-1" />}
      </div>

      <div className={`pb-6 flex-1 min-w-0`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <p className={`text-sm font-semibold ${meta.color}`}>{event}</p>
          <span className="text-xs text-[#B8C5D1]/60 shrink-0">
            {formatDateTime(timestamp)}
          </span>
        </div>
        {detail && (
          <p className="mt-1 text-sm text-[#B8C5D1] leading-relaxed">{detail}</p>
        )}
        {actor && actor !== "system" && (
          <span className="mt-1 inline-block text-xs text-[#B8C5D1]/50 capitalize">
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
    <div className="rounded-[24px] border border-white/10 bg-[#083D4A]/80 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-[#22E7C5] mb-1">History</p>
          <h3 className="text-lg font-semibold text-white">Audit Timeline</h3>
        </div>
        <span className="text-sm text-[#B8C5D1]">{entries.length} Events</span>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-8 text-[#B8C5D1]/60 text-sm">
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