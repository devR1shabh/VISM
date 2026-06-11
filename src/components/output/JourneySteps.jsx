function JourneySteps({
  journey = [],
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold mb-3">
        Immigration Journey
      </h2>

      {journey.length === 0 ? (
        <p className="text-gray-500">
          No journey information available.
        </p>
      ) : (
        <ol className="list-decimal ml-5 space-y-2">

          {journey.map(
            (step, index) => (
              <li key={index}>

                {typeof step ===
                "string" ? (
                  step
                ) : (
                  <>
                    <span className="font-medium">
                      {step.stage ||
                        step.name ||
                        "Journey Step"}
                    </span>

                    {(step.duration ||
                      step.status) && (
                      <span className="text-gray-500 ml-2">
                        (
                        {step.duration ||
                          step.status}
                        )
                      </span>
                    )}
                  </>
                )}

              </li>
            )
          )}

        </ol>
      )}

    </div>
  );
}

export default JourneySteps;