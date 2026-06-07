import CaseForm from "../components/input/CaseForm";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-4xl mx-auto p-8">

        <h1 className="text-5xl font-bold mb-4">
          VISM
        </h1>

        <p className="text-gray-600 mb-8">
          Visa Intelligence & Immigration
          Management Platform
        </p>

        <CaseForm />

      </div>

    </div>
  );
}

export default Home;