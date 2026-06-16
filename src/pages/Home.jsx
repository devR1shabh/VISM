import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import heroVideo from "../assets/hero/hero-video.mp4";
import immigrationOfficer from "../assets/hero/immigration-officer.jpg";
import airportPassport from "../assets/hero/airport-passport.jpg";
import {
  Search,
  ShieldCheck,
  Route,
  GraduationCap,
  Briefcase,
  Plane,
  Bot,
  Sparkles,
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
    <main className="bg-white text-[#111827]">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#071E3D]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(77,199,247,0.12),transparent_50%)]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-68px)] max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-8">

          {/* LEFT */}
          <div className="max-w-2xl">
            <p className="mb-6 inline-flex rounded-full border border-[#4DC7F7]/30 bg-[#4DC7F7]/10 px-4 py-1.5 text-sm font-semibold text-[#4DC7F7]">
              AI-Powered Immigration Platform
            </p>

            <h1 className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1]">
              Visa Applications Made Intelligent
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-white/65 sm:text-xl">
              BlueprintAI helps applicants assess eligibility, verify documents,
              generate AI-powered insights, and track their immigration journey
              from one unified platform.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#assessment"
                className="inline-flex items-center justify-center rounded-lg bg-[#4DC7F7] px-8 py-3 text-sm font-bold text-[#0A2E57] shadow-lg shadow-[#4DC7F7]/25 transition hover:bg-[#2AA6D8] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#4DC7F7] focus:ring-offset-2 focus:ring-offset-[#071E3D]"
              >
                Start Assessment
              </a>
              <button
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center justify-center rounded-lg border border-white/25 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                Learn More
              </button>
            </div>

            <div className="mt-14 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/8">
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wide">Visa Types</p>
                <p className="mt-2.5 text-xl font-bold text-[#4DC7F7]">3+</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/8">
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wide">Verification</p>
                <p className="mt-2.5 text-xl font-bold text-[#4DC7F7]">AI Powered</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/8">
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wide">Tracking</p>
                <p className="mt-2.5 text-xl font-bold text-[#4DC7F7]">End-to-End</p>
              </div>
            </div>
          </div>

          {/* RIGHT - VIDEO */}
          <div className="relative h-[500px] lg:h-full lg:min-h-[580px]">
            <div className="absolute inset-0 rounded-2xl border border-white/10 overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              >
                <source src={heroVideo} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-[#071E3D]/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <h3 className="text-xl font-bold text-white">
                  AI-Powered Immigration Intelligence
                </h3>
                <p className="mt-1.5 text-sm text-white/65">
                  Analyze eligibility, verify documents and track your visa journey.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-white border-b border-[#E6E8EB] px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-[#2AA6D8] uppercase tracking-[0.18em] mb-3">
              How It Works
            </p>
            <h2 className="font-display text-4xl font-bold text-[#0A2E57] sm:text-5xl">
              Three Simple Steps to Success
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="group rounded-xl border border-[#E6E8EB] bg-white p-8 shadow-sm transition hover:border-[#4DC7F7] hover:shadow-md">
              <div className="flex items-center justify-between mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#E8F4FD] text-[#2AA6D8] group-hover:bg-[#4DC7F7]/15 transition">
                  <Search size={28} />
                </div>
                <span className="text-3xl font-black text-[#E6E8EB] group-hover:text-[#4DC7F7]/20 transition font-display">
                  01
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-2">Assess Eligibility</h3>
              <p className="text-[#6B7280] leading-relaxed text-sm">
                Input your visa details and let our AI analyze your application fit.
              </p>
            </div>

            <div className="group rounded-xl border border-[#E6E8EB] bg-white p-8 shadow-sm transition hover:border-[#4DC7F7] hover:shadow-md">
              <div className="flex items-center justify-between mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#E8F4FD] text-[#2AA6D8] group-hover:bg-[#4DC7F7]/15 transition">
                  <ShieldCheck size={28} />
                </div>
                <span className="text-3xl font-black text-[#E6E8EB] group-hover:text-[#4DC7F7]/20 transition font-display">
                  02
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-2">Verify Documents</h3>
              <p className="text-[#6B7280] leading-relaxed text-sm">
                Upload documents and receive instant verification and extraction.
              </p>
            </div>

            <div className="group rounded-xl border border-[#E6E8EB] bg-white p-8 shadow-sm transition hover:border-[#4DC7F7] hover:shadow-md">
              <div className="flex items-center justify-between mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#E8F4FD] text-[#2AA6D8] group-hover:bg-[#4DC7F7]/15 transition">
                  <Route size={28} />
                </div>
                <span className="text-3xl font-black text-[#E6E8EB] group-hover:text-[#4DC7F7]/20 transition font-display">
                  03
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-2">Track Journey</h3>
              <p className="text-[#6B7280] leading-relaxed text-sm">
                Monitor your entire immigration process with real-time insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORTED VISA TYPES */}
      <section className="bg-[#F7F8FA] border-b border-[#E6E8EB] px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-[#2AA6D8] uppercase tracking-[0.18em] mb-3">
              Visa Support
            </p>
            <h2 className="font-display text-4xl font-bold text-[#0A2E57] sm:text-5xl">
              Supported Visa Categories
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="group rounded-xl border border-[#E6E8EB] bg-white p-8 shadow-sm transition hover:border-[#4DC7F7] hover:shadow-md">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#E8F4FD] text-[#2AA6D8] mb-5 group-hover:bg-[#4DC7F7]/15 transition">
                <GraduationCap size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-2">Student Visa</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                Comprehensive assessment for educational pursuits worldwide.
              </p>
            </div>

            <div className="group rounded-xl border border-[#E6E8EB] bg-white p-8 shadow-sm transition hover:border-[#4DC7F7] hover:shadow-md">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#E8F4FD] text-[#2AA6D8] mb-5 group-hover:bg-[#4DC7F7]/15 transition">
                <Briefcase size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-2">Work Visa</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                Employment visa evaluation and document verification.
              </p>
            </div>

            <div className="group rounded-xl border border-[#E6E8EB] bg-white p-8 shadow-sm transition hover:border-[#4DC7F7] hover:shadow-md">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#E8F4FD] text-[#2AA6D8] mb-5 group-hover:bg-[#4DC7F7]/15 transition">
                <Plane size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-2">Tourist Visa</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                Travel visa processing and eligibility analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI IMMIGRATION INSIGHTS */}
      <section className="bg-white border-b border-[#E6E8EB] px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 items-center lg:grid-cols-2">
            <div className="relative rounded-2xl overflow-hidden h-[400px] shadow-sm border border-[#E6E8EB]">
              <img
                src={immigrationOfficer}
                alt="AI Immigration Intelligence"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
            </div>

            <div>
              <p className="text-xs font-semibold text-[#2AA6D8] uppercase tracking-[0.18em] mb-3">
                Advanced Analytics
              </p>
              <h2 className="font-display text-3xl font-bold text-[#0A2E57] mb-5 lg:text-4xl">
                AI-Powered Immigration Intelligence
              </h2>
              <p className="text-[#374151] leading-relaxed mb-6">
                Advanced assessment models help identify risks, improve application
                readiness and provide actionable recommendations tailored to your
                specific situation.
              </p>
              <ul className="space-y-3">
                {["Risk identification", "Readiness improvement", "Actionable insights"].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#4DC7F7] shrink-0" />
                    <span className="text-[#374151] text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SMART DOCUMENT VERIFICATION */}
      <section className="bg-[#F7F8FA] border-b border-[#E6E8EB] px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 items-center lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-[#2AA6D8] uppercase tracking-[0.18em] mb-3">
                Smart Verification
              </p>
              <h2 className="font-display text-3xl font-bold text-[#0A2E57] mb-5 lg:text-4xl">
                Smart Document Verification
              </h2>
              <p className="text-[#374151] leading-relaxed mb-6">
                Upload passports and supporting documents to extract information
                and verify readiness automatically. Our AI ensures compliance
                and completeness.
              </p>
              <ul className="space-y-3">
                {["Instant extraction", "Compliance check", "Automatic verification"].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#4DC7F7] shrink-0" />
                    <span className="text-[#374151] text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative rounded-2xl overflow-hidden h-[400px] shadow-sm border border-[#E6E8EB]">
              <img
                src={airportPassport}
                alt="Smart Document Verification"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[#F7F8FA]/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* MEET NAVI */}
      <section className="bg-[#071E3D] border-b border-white/8 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-white/10 bg-white/4 p-10 lg:p-14 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#4DC7F7]/8 rounded-full blur-3xl pointer-events-none" />

            <div className="grid gap-12 items-center lg:grid-cols-2 relative">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#4DC7F7]/15 text-[#4DC7F7]">
                    <Bot size={22} />
                  </div>
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#4DC7F7]/10 text-[#4DC7F7]">
                    <Sparkles size={18} />
                  </div>
                </div>

                <p className="text-xs font-semibold text-[#4DC7F7] uppercase tracking-[0.18em] mb-3">
                  Intelligent Assistant
                </p>
                <h2 className="font-display text-4xl font-bold text-white mb-5">
                  Meet Navi
                </h2>
                <p className="text-white/65 leading-relaxed mb-8">
                  Your AI immigration assistant that helps guide applicants
                  throughout the entire process. Navi provides real-time support,
                  answers questions, and ensures you never miss a step.
                </p>
                <a
                  href="#assessment"
                  className="inline-flex items-center justify-center rounded-lg bg-[#4DC7F7] px-8 py-3 text-sm font-bold text-[#0A2E57] shadow-lg shadow-[#4DC7F7]/20 transition hover:bg-[#2AA6D8] active:scale-[0.98]"
                >
                  Chat with Navi
                </a>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-8">
                <div className="w-full h-56 bg-gradient-to-br from-[#4DC7F7]/15 to-[#0A2E57]/40 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(77,199,247,0.08),transparent_70%)]" />
                  <div className="text-center relative z-10">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#4DC7F7]/15 mx-auto mb-4">
                      <Bot size={38} className="text-[#4DC7F7]" />
                    </div>
                    <p className="text-sm font-semibold text-[#4DC7F7]">
                      Navi AI Assistant
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#0A2E57] px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-4xl font-bold text-white sm:text-5xl mb-5">
            Start Your Immigration Journey Today
          </h2>
          <p className="text-lg text-white/65 mb-10 max-w-2xl mx-auto">
            Join thousands of applicants using BlueprintAI to navigate their
            visa process with confidence.
          </p>
          <a
            href="#assessment"
            className="inline-flex items-center justify-center rounded-lg bg-[#4DC7F7] px-10 py-4 text-base font-bold text-[#0A2E57] shadow-lg shadow-[#4DC7F7]/25 transition hover:bg-[#2AA6D8] active:scale-[0.98]"
          >
            Start Assessment
          </a>
        </div>
      </section>

      {/* ASSESSMENT */}
      <section id="assessment" className="bg-[#0A2E57] px-6 pb-24 pt-0 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="border-t border-white/10 mb-16" />

          {redirectMessage && (
            <div
              role="alert"
              className="mb-8 rounded-lg border border-[#4DC7F7]/30 bg-[#4DC7F7]/10 px-6 py-4 text-[#4DC7F7]"
            >
              {redirectMessage}
            </div>
          )}

          <div className="mb-10 text-center">
            <p className="text-xs font-semibold text-[#4DC7F7] uppercase tracking-[0.18em] mb-3">
              Assessment Form
            </p>
            <h2 className="font-display text-3xl font-bold text-white mb-3 lg:text-4xl">
              Tell BlueprintAI about your application
            </h2>
            <p className="max-w-xl mx-auto text-white/60 text-sm">
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