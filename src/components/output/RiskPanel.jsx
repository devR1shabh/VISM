function RiskPanel({ risks }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold mb-3">
        Risk Factors
      </h2>

      <ul className="list-disc ml-5">
        {risks.map((risk) => (
          <li key={risk}>{risk}</li>
        ))}
      </ul>

    </div>
  );
}

export default RiskPanel;