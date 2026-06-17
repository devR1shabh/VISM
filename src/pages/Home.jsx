// src/pages/Home.jsx

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import heroVideo        from "../assets/hero/hero-video.mp4";
import immigrationOfficer from "../assets/hero/immigration-officer.jpg";
import airportPassport  from "../assets/hero/airport-passport.jpg";
import {
  Search,
  ShieldCheck,
  Route,
  GraduationCap,
  Briefcase,
  Plane,
  Bot,
  Sparkles,
  Building2,
  Users,
  TrendingUp,
  Home as HomeIcon,
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
    <main className="bg-white text-[var(--c-text)]">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--c-green)] overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">

          {/* LEFT — content */}
          <div>
            <p className="mb-5 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white/90">
              AI-Powered Immigration Platform
            </p>

            <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Visa Applications<br />Made Intelligent
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
              BlueprintAI helps applicants assess eligibility, verify documents,
              generate AI-powered insights, and track their immigration journey —
              from one unified platform.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#assessment"
                className="inline-flex items-center justify-center rounded-[var(--r-lg)] bg-white px-8 py-3 text-sm font-bold text-[var(--c-green)] shadow-sm transition hover:bg-[var(--c-green-light)] active:scale-[0.98]"
              >
                Start Assessment
              </a>
              <button
                onClick={() =>
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center justify-center rounded-[var(--r-lg)] border border-white/30 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.98]"
              >
                Learn More
              </button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-3">
              {[
                { label: "Visa Types",    value: "7+" },
                { label: "Verification", value: "AI"  },
                { label: "Tracking",     value: "Live" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-[var(--r-lg)] border border-white/15 bg-white/8 p-4">
                  <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wide">{label}</p>
                  <p className="mt-2 text-xl font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — video */}
          <div className="relative h-[420px] lg:h-[520px]">
            <div className="absolute inset-0 rounded-[var(--r-2xl)] overflow-hidden border border-white/15 shadow-[0_16px_48px_rgba(0,0,0,0.3)]">
              <video autoPlay muted loop playsInline className="h-full w-full object-cover">
                <source src={heroVideo} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--c-green)]/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-base font-bold text-white">AI-Powered Immigration Intelligence</h3>
                <p className="mt-1 text-sm text-white/70">
                  Analyse eligibility, verify documents and track your visa journey.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-white border-b border-[var(--c-border)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <p className="text-[10px] font-semibold text-[var(--c-green-mid)] uppercase tracking-[0.22em] mb-3">
              How It Works
            </p>
            <h2 className="font-display text-3xl font-bold text-[var(--c-text)] sm:text-4xl">
              Three Simple Steps to Success
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { Icon: Search,      num: "01", title: "Assess Eligibility", desc: "Input your visa details and let our AI analyse your application fit."       },
              { Icon: ShieldCheck, num: "02", title: "Verify Documents",   desc: "Upload documents and receive instant verification and extraction."           },
              { Icon: Route,       num: "03", title: "Track Journey",      desc: "Monitor your entire immigration process with real-time insights."            },
            ].map(({ Icon, num, title, desc }) => (
              <div key={num} className="group rounded-[var(--r-xl)] border border-[var(--c-border)] bg-white p-8 shadow-[var(--shadow-card)] transition hover:border-[var(--c-green)] hover:shadow-[var(--shadow-card-hover)]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[var(--r-lg)] bg-[var(--c-green-bg)] text-[var(--c-green)] group-hover:bg-[var(--c-green)] group-hover:text-white transition">
                    <Icon size={24} />
                  </div>
                  <span className="font-display text-3xl font-black text-[var(--c-border)] group-hover:text-[var(--c-green-light)] transition">
                    {num}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[var(--c-text)] mb-2">{title}</h3>
                <p className="text-sm text-[var(--c-text-muted)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUPPORTED VISA TYPES ──────────────────────────────────────────── */}
      <section className="bg-[var(--c-bg)] border-b border-[var(--c-border)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <p className="text-[10px] font-semibold text-[var(--c-green-mid)] uppercase tracking-[0.22em] mb-3">
              Visa Support
            </p>
            <h2 className="font-display text-3xl font-bold text-[var(--c-text)] sm:text-4xl">
              Supported Visa Categories
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[
              { Icon: GraduationCap, name: "Student Visa",            desc: "Comprehensive assessment for educational pursuits worldwide."        },
              { Icon: Briefcase,     name: "Work Visa",                desc: "Employment visa evaluation and document verification."               },
              { Icon: Plane,         name: "Tourist Visa",             desc: "Travel visa processing and eligibility analysis."                   },
              { Icon: HomeIcon,      name: "Permanent Residency Visa", desc: "Pathway to permanent residence assessment and guidance."            },
              { Icon: Building2,     name: "Business Visa",            desc: "Business travel and commercial activity visa evaluation."           },
              { Icon: Users,         name: "Family Sponsorship Visa",  desc: "Family reunification and sponsorship eligibility review."           },
              { Icon: TrendingUp,    name: "Investor Visa",            desc: "Investment-based immigration and entrepreneur visa support."        },
            ].map(({ Icon, name, desc }) => (
              <div key={name} className="group rounded-[var(--r-xl)] border border-[var(--c-border)] bg-white p-5 shadow-[var(--shadow-card)] transition hover:border-[var(--c-green)] hover:shadow-[var(--shadow-card-hover)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--r-lg)] bg-[var(--c-green-bg)] text-[var(--c-green)] mb-4 group-hover:bg-[var(--c-green)] group-hover:text-white transition">
                  <Icon size={22} />
                </div>
                <h3 className="text-sm font-bold text-[var(--c-text)] mb-1">{name}</h3>
                <p className="text-xs text-[var(--c-text-muted)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI IMMIGRATION INSIGHTS ───────────────────────────────────────── */}
      <section className="bg-white border-b border-[var(--c-border)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 items-center lg:grid-cols-2">
            <div className="relative rounded-[var(--r-2xl)] overflow-hidden h-[380px] shadow-[var(--shadow-card)] border border-[var(--c-border)]">
              <img src={immigrationOfficer} alt="AI Immigration Intelligence" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[var(--c-green-mid)] uppercase tracking-[0.22em] mb-3">
                Advanced Analytics
              </p>
              <h2 className="font-display text-3xl font-bold text-[var(--c-text)] mb-5 lg:text-4xl">
                AI-Powered Immigration Intelligence
              </h2>
              <p className="text-[var(--c-text-mid)] leading-relaxed mb-6">
                Advanced assessment models help identify risks, improve application
                readiness and provide actionable recommendations tailored to your
                specific situation.
              </p>
              <ul className="space-y-3">
                {["Risk identification", "Readiness improvement", "Actionable insights"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[var(--c-green)] shrink-0" />
                    <span className="text-sm text-[var(--c-text-mid)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SMART DOCUMENT VERIFICATION ───────────────────────────────────── */}
      <section className="bg-[var(--c-bg)] border-b border-[var(--c-border)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 items-center lg:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold text-[var(--c-green-mid)] uppercase tracking-[0.22em] mb-3">
                Smart Verification
              </p>
              <h2 className="font-display text-3xl font-bold text-[var(--c-text)] mb-5 lg:text-4xl">
                Smart Document Verification
              </h2>
              <p className="text-[var(--c-text-mid)] leading-relaxed mb-6">
                Upload passports and supporting documents to extract information
                and verify readiness automatically. Our AI ensures compliance
                and completeness.
              </p>
              <ul className="space-y-3">
                {["Instant extraction", "Compliance check", "Automatic verification"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[var(--c-green)] shrink-0" />
                    <span className="text-sm text-[var(--c-text-mid)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-[var(--r-2xl)] overflow-hidden h-[380px] shadow-[var(--shadow-card)] border border-[var(--c-border)]">
              <img src={airportPassport} alt="Smart Document Verification" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── MEET NAVI ─────────────────────────────────────────────────────── */}
      <section className="bg-[var(--c-green)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 items-center lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-[var(--r-lg)] bg-white/15">
                  <Bot size={20} className="text-white" />
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-[var(--r-lg)] bg-white/10">
                  <Sparkles size={16} className="text-white" />
                </div>
              </div>
              <p className="text-[10px] font-semibold text-white/60 uppercase tracking-[0.22em] mb-3">
                Intelligent Assistant
              </p>
              <h2 className="font-display text-4xl font-bold text-white mb-5">
                Meet Navi
              </h2>
              <p className="text-white/70 leading-relaxed mb-8 max-w-md">
                Your AI immigration assistant that helps guide applicants throughout
                the entire process. Navi provides real-time support, answers questions,
                and ensures you never miss a step.
              </p>
              <a
                href="#assessment"
                className="inline-flex items-center justify-center rounded-[var(--r-lg)] bg-white px-8 py-3 text-sm font-bold text-[var(--c-green)] shadow-sm transition hover:bg-[var(--c-green-light)] active:scale-[0.98]"
              >
              
                Chat with Navi
              </a>
            </div>
            <div className="rounded-[var(--r-2xl)] border border-white/15 bg-white/8 p-8">
              <div className="w-full h-52 bg-white/10 rounded-[var(--r-xl)] flex items-center justify-center">
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/15 mx-auto mb-4">
                    <Bot size={32} className="text-white" />
                  </div>
                  <p className="text-sm font-semibold text-white">Navi AI Assistant</p>
                  <p className="text-xs text-white/55 mt-1">Always here to help</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-[var(--c-bg)] border-b border-[var(--c-border)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-[var(--c-text)] sm:text-4xl mb-5">
            Start Your Immigration Journey Today
          </h2>
          <p className="text-[var(--c-text-muted)] mb-8 max-w-xl mx-auto">
            Join thousands of applicants using BlueprintAI to navigate their
            visa process with confidence.
          </p>
          <a
            href="#assessment"
            className="inline-flex items-center justify-center rounded-[var(--r-lg)] bg-[var(--c-green)] px-10 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--c-green-mid)] active:scale-[0.98]"
          >
            Start Assessment
          </a>
        </div>
      </section>

      {/* ── ASSESSMENT FORM ───────────────────────────────────────────────── */}
      <section id="assessment" className="bg-white border-b border-[var(--c-border)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {redirectMessage && (
            <div
              role="alert"
              className="mb-8 rounded-[var(--r-lg)] border border-[var(--c-green-light)] bg-[var(--c-green-bg)] px-6 py-4 text-sm text-[var(--c-green)]"
            >
              {redirectMessage}
            </div>
          )}

          <div className="mb-8 text-center">
            <p className="text-[10px] font-semibold text-[var(--c-green-mid)] uppercase tracking-[0.22em] mb-3">
              Assessment Form
            </p>
            <h2 className="font-display text-3xl font-bold text-[var(--c-text)] mb-3">
              Tell BlueprintAI about your application
            </h2>
            <p className="text-[var(--c-text-muted)] text-sm">
              Select your visa type and destination to generate an application analysis.
            </p>
          </div>

          <CaseForm />
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-[var(--c-green)] px-6 pt-16 pb-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-4 mb-12">

            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-[var(--r-lg)] bg-white/15">
                  <span className="text-sm font-black text-white">V</span>
                </div>
                <span className="font-display text-lg font-bold text-white">VISM</span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed max-w-xs">
                AI-powered visa immigration services. Assess eligibility, verify
                documents, and track your journey from one platform.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4">Platform</h3>
              <ul className="space-y-2.5">
                {[
                  { href: "/analysis",  label: "Analysis"  },
                  { href: "/documents", label: "Documents" },
                  { href: "/journey",   label: "Journey"   },
                  { href: "/dashboard", label: "Dashboard" },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <a href={href} className="text-sm text-white/65 hover:text-white transition">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Institutional */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4">Institutional</h3>
              <ul className="space-y-2.5">
                <li>
                  <a href="/processor" className="text-sm text-white/65 hover:text-white transition">
                    Processor Portal
                  </a>
                </li>
              </ul>
            </div>

            {/* System */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4">System</h3>
              <ul className="space-y-2.5">
                {["Privacy Policy", "Terms of Service"].map((label) => (
                  <li key={label}>
                    <span className="text-sm text-white/40 cursor-default">{label}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <div className="border-t border-white/15 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">© 2026 VISM. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-green-light)]" />
              <span className="text-xs text-white/40">Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}

export default Home;