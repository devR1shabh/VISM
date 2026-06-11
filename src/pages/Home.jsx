import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import heroVideo from "../assets/hero/hero-video.mp4";
import immigrationOfficer from "../assets/hero/immigration-officer.jpg";
import airportPassport from "../assets/hero/airport-passport.jpg";
import visaBlueprint from "../assets/illustrations/visa-blueprint.png";
import {
  Search,
  ShieldCheck,
  Route,
  GraduationCap,
  Briefcase,
  Plane,
  Bot,
  Sparkles
} from "lucide-react";

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
    <main className="bg-[#061A28] text-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,231,197,0.15),transparent_40%),linear-gradient(135deg,#061A28_0%,#0a2c38_50%,#083d4a_100%)]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-8">
          {/* LEFT COLUMN */}
          <div className="max-w-2xl">
            <p className="mb-6 inline-flex rounded-full border border-[#22E7C5]/30 bg-[#22E7C5]/10 px-4 py-2 text-sm font-semibold text-[#39F5D5] backdrop-blur">
              AI-Powered Immigration Platform
            </p>

            <h1 className="text-6xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl leading-tight">
              Visa Applications Made Intelligent
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#B8C5D1] sm:text-xl">
              BlueprintAI helps applicants assess eligibility, verify documents, generate AI-powered insights, and track their immigration journey from one unified platform.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#assessment"
                className="inline-flex items-center justify-center rounded-lg bg-[#22E7C5] px-8 py-3 text-sm font-semibold text-[#061A28] shadow-lg shadow-[#22E7C5]/20 transition hover:bg-[#39F5D5] focus:outline-none focus:ring-2 focus:ring-[#22E7C5] focus:ring-offset-2 focus:ring-offset-[#061A28]"
              >
                Start Assessment
              </a>
              <button
                onClick={() => document.getElementById("how-it-works").scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center justify-center rounded-lg border border-white/20 px-8 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#22E7C5]"
              >
                Learn More
              </button>
            </div>

            {/* METRIC CARDS */}
            <div className="mt-16 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm hover:bg-white/10 transition">
                <p className="text-sm font-semibold text-[#B8C5D1] uppercase tracking-wide">Visa Types</p>
                <p className="mt-3 text-3xl font-bold text-[#22E7C5]">3+</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm hover:bg-white/10 transition">
                <p className="text-sm font-semibold text-[#B8C5D1] uppercase tracking-wide">Verification</p>
                <p className="mt-3 text-xl font-bold text-[#39F5D5]">AI Powered</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm hover:bg-white/10 transition">
                <p className="text-sm font-semibold text-[#B8C5D1] uppercase tracking-wide">Tracking</p>
                <p className="mt-3 text-xl font-bold text-[#22E7C5]">End-to-End</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - VIDEO */}
          <div className="relative h-[500px] lg:h-full lg:min-h-[600px]">
            <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_30px_100px_rgba(34,231,197,0.15)] overflow-hidden">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              >
                <source src={heroVideo} type="video/mp4" />
              </video>

              <div className="absolute inset-0 bg-gradient-to-t from-[#061A28] via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-white">
                  AI-Powered Immigration Intelligence
                </h3>
                <p className="mt-2 text-[#B8C5D1]">
                  Analyze eligibility, verify documents and track your visa journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-b border-white/5 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#22E7C5] uppercase tracking-widest mb-4">How It Works</p>
            <h2 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
              Three Simple Steps to Success
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm hover:bg-white/10 hover:border-[#22E7C5]/30 transition duration-300">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-[#22E7C5]/20 text-[#22E7C5] mb-6 group-hover:bg-[#22E7C5]/30 transition shadow-lg shadow-[#22E7C5]/20">
                <Search size={32} />
              </div>
              <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-[#22E7C5]/20 text-[#22E7C5] font-bold text-xl mb-6 group-hover:bg-[#22E7C5]/30 transition">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Assess Eligibility</h3>
              <p className="text-[#B8C5D1] leading-relaxed">Input your visa details and let our AI analyze your application fit.</p>
            </div>
            <div className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm hover:bg-white/10 hover:border-[#22E7C5]/30 transition duration-300">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-[#22E7C5]/20 text-[#22E7C5] mb-6 group-hover:bg-[#22E7C5]/30 transition shadow-lg shadow-[#22E7C5]/20">
                <ShieldCheck size={32} />
              </div>
              <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-[#22E7C5]/20 text-[#22E7C5] font-bold text-xl mb-6 group-hover:bg-[#22E7C5]/30 transition">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Verify Documents</h3>
              <p className="text-[#B8C5D1] leading-relaxed">Upload documents and receive instant verification and extraction.</p>
            </div>
            <div className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm hover:bg-white/10 hover:border-[#22E7C5]/30 transition duration-300">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-[#22E7C5]/20 text-[#22E7C5] mb-6 group-hover:bg-[#22E7C5]/30 transition shadow-lg shadow-[#22E7C5]/20">
                <Route size={32} />
              </div>
              <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-[#22E7C5]/20 text-[#22E7C5] font-bold text-xl mb-6 group-hover:bg-[#22E7C5]/30 transition">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Track Journey</h3>
              <p className="text-[#B8C5D1] leading-relaxed">Monitor your entire immigration process with real-time insights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORTED VISA TYPES */}
      <section className="border-b border-white/5 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#22E7C5] uppercase tracking-widest mb-4">Visa Support</p>
            <h2 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
              Supported Visa Categories
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="group rounded-2xl border border-white/10 bg-[#083D4A]/40 p-8 backdrop-blur-sm hover:bg-[#083D4A]/60 hover:border-[#22E7C5]/30 transition duration-300">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-[#22E7C5]/20 text-[#22E7C5] mb-6 group-hover:bg-[#22E7C5]/30 transition shadow-lg shadow-[#22E7C5]/20">
                <GraduationCap size={36} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Student Visa</h3>
              <p className="text-[#B8C5D1]">Comprehensive assessment for educational pursuits worldwide.</p>
            </div>
            <div className="group rounded-2xl border border-white/10 bg-[#083D4A]/40 p-8 backdrop-blur-sm hover:bg-[#083D4A]/60 hover:border-[#22E7C5]/30 transition duration-300">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-[#22E7C5]/20 text-[#22E7C5] mb-6 group-hover:bg-[#22E7C5]/30 transition shadow-lg shadow-[#22E7C5]/20">
                <Briefcase size={36} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Work Visa</h3>
              <p className="text-[#B8C5D1]">Employment visa evaluation and document verification.</p>
            </div>
            <div className="group rounded-2xl border border-white/10 bg-[#083D4A]/40 p-8 backdrop-blur-sm hover:bg-[#083D4A]/60 hover:border-[#22E7C5]/30 transition duration-300">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-[#22E7C5]/20 text-[#22E7C5] mb-6 group-hover:bg-[#22E7C5]/30 transition shadow-lg shadow-[#22E7C5]/20">
                <Plane size={36} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Tourist Visa</h3>
              <p className="text-[#B8C5D1]">Travel visa processing and eligibility analysis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI IMMIGRATION INSIGHTS */}
      <section className="border-b border-white/5 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 items-center lg:grid-cols-2">
            <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden h-[400px]">
              <img
                src={immigrationOfficer}
                alt="AI Immigration Intelligence"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#061A28] to-transparent" />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#22E7C5] uppercase tracking-widest mb-4">Advanced Analytics</p>
              <h2 className="text-4xl font-bold text-white mb-6">
                AI-Powered Immigration Intelligence
              </h2>
              <p className="text-lg text-[#B8C5D1] leading-relaxed mb-6">
                Advanced assessment models help identify risks, improve application readiness and provide actionable recommendations tailored to your specific situation.
              </p>
              <ul className="space-y-3">
                {["Risk identification", "Readiness improvement", "Actionable insights"].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#22E7C5]" />
                    <span className="text-[#B8C5D1]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DOCUMENT INTELLIGENCE */}
      <section className="border-b border-white/5 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 items-center lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-[#22E7C5] uppercase tracking-widest mb-4">Smart Verification</p>
              <h2 className="text-4xl font-bold text-white mb-6">
                Smart Document Verification
              </h2>
              <p className="text-lg text-[#B8C5D1] leading-relaxed mb-6">
                Upload passports and supporting documents to extract information and verify readiness automatically. Our AI ensures compliance and completeness.
              </p>
              <ul className="space-y-3">
                {["Instant extraction", "Compliance check", "Automatic verification"].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#22E7C5]" />
                    <span className="text-[#B8C5D1]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden h-[400px]">
              <img
                src={airportPassport}
                alt="Smart Document Verification"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[#061A28] to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* MEET NAVI */}
      <section className="border-b border-white/5 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#083D4A]/60 to-[#061A28]/60 p-12 backdrop-blur-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#22E7C5]/10 rounded-full blur-3xl -z-10" />

            <div className="grid gap-12 items-center lg:grid-cols-2">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#22E7C5]/20 text-[#22E7C5] shadow-lg shadow-[#22E7C5]/20">
                    <Bot size={24} />
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#39F5D5]/20 text-[#39F5D5] shadow-lg shadow-[#39F5D5]/20">
                    <Sparkles size={20} />
                  </div>
                </div>
                <p className="text-sm font-semibold text-[#22E7C5] uppercase tracking-widest mb-4">Intelligent Assistant</p>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Meet Navi
                </h2>
                <p className="text-lg text-[#B8C5D1] leading-relaxed mb-8">
                  Your AI immigration assistant that helps guide applicants throughout the entire process. Navi provides real-time support, answers questions, and ensures you never miss a step.
                </p>
                <a
                  href="#assessment"
                  className="inline-flex items-center justify-center rounded-lg bg-[#22E7C5] px-8 py-3 text-sm font-semibold text-[#061A28] shadow-lg shadow-[#22E7C5]/20 transition hover:bg-[#39F5D5]"
                >
                  Chat with Navi
                </a>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm hover:border-[#22E7C5]/30 transition">
                <div className="w-full h-64 bg-gradient-to-br from-[#22E7C5]/20 to-[#083D4A]/40 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,231,197,0.1),transparent_70%)]" />
                  <div className="text-center relative z-10">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#22E7C5]/20 mx-auto mb-4 shadow-lg shadow-[#22E7C5]/30">
                      <Bot size={40} className="text-[#22E7C5]" />
                    </div>
                    <p className="text-sm font-semibold text-[#39F5D5]">Navi AI Assistant</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-b border-white/5 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-6">
            Start Your Immigration Journey Today
          </h2>
          <p className="text-xl text-[#B8C5D1] mb-10">
            Join thousands of applicants using BlueprintAI to navigate their visa process with confidence.
          </p>
          <a
            href="#assessment"
            className="inline-flex items-center justify-center rounded-lg bg-[#22E7C5] px-10 py-4 text-lg font-semibold text-[#061A28] shadow-lg shadow-[#22E7C5]/20 transition hover:bg-[#39F5D5]"
          >
            Start Assessment
          </a>
        </div>
      </section>

      {/* ASSESSMENT SECTION */}
      <section id="assessment" className="bg-[#083D4A] px-6 py-24 text-white lg:px-8">
        <div className="mx-auto max-w-4xl">
          {redirectMessage && (
            <div
              role="alert"
              className="mb-8 rounded-lg border border-[#22E7C5]/30 bg-[#22E7C5]/10 px-6 py-4 text-[#39F5D5] backdrop-blur"
            >
              {redirectMessage}
            </div>
          )}

          <div className="mb-12 text-center">
            <p className="text-sm font-semibold text-[#22E7C5] uppercase tracking-widest mb-4">
              Assessment Form
            </p>
            <h2 className="text-4xl font-bold text-white mb-4">
              Tell BlueprintAI about your application
            </h2>
            <p className="max-w-2xl mx-auto text-[#B8C5D1]">
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