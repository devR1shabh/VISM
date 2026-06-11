function ApplicationOverview({ overview }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold mb-3">
        Application Overview
      </h2>

      <p>{overview}</p>

    </div>
  );
}

export default ApplicationOverview;