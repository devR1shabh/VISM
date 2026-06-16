// src/components/processor/KPICards.jsx

function KPICard({ label, count, color, icon }) {
  const colorMap = {
    amber: {
      border: "border-amber-400/30",
      bg:     "bg-amber-500/10",
      text:   "text-amber-300",
      dot:    "bg-amber-400",
    },
    emerald: {
      border: "border-emerald-400/30",
      bg:     "bg-emerald-500/10",
      text:   "text-emerald-300",
      dot:    "bg-emerald-400",
    },
    red: {
      border: "border-red-400/30",
      bg:     "bg-red-500/10",
      text:   "text-red-300",
      dot:    "bg-red-400",
    },
    blue: {
      border: "border-blue-400/30",
      bg:     "bg-blue-500/10",
      text:   "text-blue-300",
      dot:    "bg-blue-400",
    },
  };

  const c = colorMap[color] || colorMap.amber;

  return (
    <div className={`rounded-[24px] border ${c.border} ${c.bg} p-6 backdrop-blur`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
      </div>
      <p className="text-sm font-medium text-[#B8C5D1]">{label}</p>
      <p className={`mt-2 text-4xl font-bold ${c.text}`}>{count}</p>
    </div>
  );
}

function KPICards({ cases = [] }) {
  const pending  = cases.filter((c) => (c.processorStatus || "Pending") === "Pending").length;
  const approved = cases.filter((c) => c.processorStatus === "Approved").length;
  const rejected = cases.filter((c) => c.processorStatus === "Rejected").length;
  const needDocs = cases.filter((c) => c.processorStatus === "Need Documents").length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      <KPICard label="Pending Cases"   count={pending}  color="amber"   icon="🕐" />
      <KPICard label="Approved Cases"  count={approved} color="emerald" icon="✅" />
      <KPICard label="Rejected Cases"  count={rejected} color="red"     icon="❌" />
      <KPICard label="Need Documents"  count={needDocs} color="blue"    icon="📎" />
    </div>
  );
}

export default KPICards;