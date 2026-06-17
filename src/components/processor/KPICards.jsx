// src/components/processor/KPICards.jsx

function KPICard({ label, count, color, icon }) {
  const colorMap = {
    amber:   { border: "border-[var(--c-warning-border)]", bg: "bg-[var(--c-warning-bg)]",  text: "text-[var(--c-warning)]",  dot: "bg-[var(--c-warning)]"  },
    emerald: { border: "border-[var(--c-success-border)]", bg: "bg-[var(--c-success-bg)]",  text: "text-[var(--c-success)]",  dot: "bg-[var(--c-success)]"  },
    red:     { border: "border-[var(--c-error-border)]",   bg: "bg-[var(--c-error-bg)]",    text: "text-[var(--c-error)]",    dot: "bg-[var(--c-error)]"    },
    blue:    { border: "border-[var(--c-info-border)]",    bg: "bg-[var(--c-info-bg)]",     text: "text-[var(--c-info)]",     dot: "bg-[var(--c-info)]"     },
  };

  const c = colorMap[color] || colorMap.amber;

  return (
    <div className={`bg-[var(--c-card)] border-l-4 ${c.border} rounded-[var(--r-xl)] shadow-[var(--shadow-card)] p-5`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--c-text-muted)]">{label}</p>
      <p className={`mt-1.5 font-display text-4xl font-bold ${c.text}`}>{count}</p>
    </div>
  );
}

function KPICards({ cases = [] }) {
  const pending  = cases.filter((c) => (c.processorStatus || "Pending") === "Pending").length;
  const approved = cases.filter((c) => c.processorStatus === "Approved").length;
  const rejected = cases.filter((c) => c.processorStatus === "Rejected").length;
  const needDocs = cases.filter((c) => c.processorStatus === "Need Documents").length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard label="Pending Cases"  count={pending}  color="amber"   icon="🕐" />
      <KPICard label="Approved Cases" count={approved} color="emerald" icon="✅" />
      <KPICard label="Rejected Cases" count={rejected} color="red"     icon="❌" />
      <KPICard label="Need Documents" count={needDocs} color="blue"    icon="📎" />
    </div>
  );
}

export default KPICards;