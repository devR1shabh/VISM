import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import CaseForm from "../components/input/CaseForm";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const redirectMessage = location.state?.message;

  useEffect(() => {
    if (!redirectMessage) return;

    const timer = setTimeout(() => {
      navigate(location.pathname, { replace: true, state: {} });
    }, 8000);

    return () => clearTimeout(timer);
  }, [redirectMessage, navigate, location.pathname]);

  return (
    <main className="bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.26),transparent_34%),linear-gradient(135deg,#020617_0%,#0f172a_48%,#172554_100%)]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-blue-300/30 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100">
              AI-Powered Visa & Immigration Assistant
            </p>

            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              BlueprintAI
            </h1>

            <p className="mt-6 max-w-2xl text-xl font-semibold text-blue-100 sm:text-2xl">
              AI-Powered Visa & Immigration Assistant
            </p>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Assess visa applications, upload and verify documents, receive intelligent immigration guidance, and track your application journey.
            </p>

            <a
              href="#assessment"
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Start Assessment
            </a>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-blue-950/40 backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/10 p-4">
                <p className="text-sm text-blue-100">Assess</p>
                <p className="mt-2 text-2xl font-bold">Visa fit</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/10 p-4">
                <p className="text-sm text-blue-100">Verify</p>
                <p className="mt-2 text-2xl font-bold">Documents</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/10 p-4">
                <p className="text-sm text-blue-100">Guide</p>
                <p className="mt-2 text-2xl font-bold">Next steps</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="assessment" className="bg-slate-50 px-6 py-16 text-slate-900 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {redirectMessage && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
            >
              {redirectMessage}
            </div>
          )}

          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Start Assessment
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Tell BlueprintAI about your application
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Select your visa type and destination to generate an application analysis.
            </p>
          </div>

          <CaseForm />
        </div>
      </section>
    </main>
  );
}

export default Home;
