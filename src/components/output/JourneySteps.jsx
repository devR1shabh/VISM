function JourneySteps({ journey }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold mb-3">
        Immigration Journey
      </h2>

      <ol className="list-decimal ml-5">
        {journey.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

    </div>
  );
}

export default JourneySteps;