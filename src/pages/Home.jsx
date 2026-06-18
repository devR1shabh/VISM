// src/pages/Home.jsx

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import airportPassport    from "../assets/hero/airport-passport.jpg";
import immigrationOfficer from "../assets/hero/immigration-officer.jpg";
import heroVideo          from "../assets/hero/hero-video.mp4";
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
  ArrowRight,
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

      {/* ── HERO — full-bleed passport image ─────────────────────────────── */}
      <section className="relative h-[92vh] min-h-[560px] max-h-[900px] overflow-hidden">

        {/* Background image */}
        <img
          src={airportPassport}
          alt="Passport and travel documents"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Dark overlay — bottom-heavy for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Top-left eyebrow label */}
        <div className="absolute top-8 left-8 lg:top-10 lg:left-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
            Visa Application Intelligence Platform
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-14 lg:px-12 lg:pb-16">
          <div className="max-w-7xl mx-auto">

            <div className="max-w-2xl">
              <h1 className="font-display text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
                Visa Applications<br />Made Intelligent
              </h1>

              <p className="mt-5 text-base text-white/70 leading-relaxed max-w-lg sm:text-lg">
                VISM helps applicants assess eligibility, verify documents,
                and track their immigration journey from one platform.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#assessment"
                  className="inline-flex items-center gap-2 rounded-[var(--r-lg)] bg-[var(--c-green)] px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--c-green-mid)] active:scale-[0.98]"
                >
                  Start Assessment
                  <ArrowRight size={15} />
                </a>
                <button
                  onClick={() =>
                    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center justify-center rounded-[var(--r-lg)] border border-white/30 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.98]"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Stat band — sits inside hero above fold line */}
            <div className="mt-12 flex flex-wrap gap-px overflow-hidden rounded-[var(--r-lg)] border border-white/10">
              {[
                { label: "Visa Categories",    value: "7" },
                { label: "Verification Rate",  value: "AI-Driven" },
                { label: "Active Tracking",    value: "Real-time" },
              ].map(({ label, value }) => (
                <div key={label} className="flex-1 min-w-[120px] bg-black/30 backdrop-blur-sm px-6 py-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">{label}</p>
                  <p className="mt-1.5 text-xl font-bold text-white">{value}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-white border-b border-[var(--c-border)] px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="mb-16">
            <p className="text-[10px] font-semibold text-[var(--c-green-mid)] uppercase tracking-[0.28em] mb-4">
              How It Works
            </p>
            <h2 className="font-display text-4xl font-bold text-[var(--c-text)] max-w-sm lg:text-5xl">
              Three steps to clarity
            </h2>
          </div>

          <div className="grid gap-0 sm:grid-cols-3 border border-[var(--c-border)] rounded-[var(--r-xl)] overflow-hidden">
            {[
              { Icon: Search,      num: "01", title: "Assess Eligibility", desc: "Input your visa details. Our AI analyses your application fit and surfaces key risks." },
              { Icon: ShieldCheck, num: "02", title: "Verify Documents",   desc: "Upload passport and supporting documents. Receive instant verification and data extraction." },
              { Icon: Route,       num: "03", title: "Track Journey",      desc: "Monitor your entire immigration process from submission to decision in real time." },
            ].map(({ Icon, num, title, desc }, i) => (
              <div
                key={num}
                className={`group p-8 lg:p-10 transition hover:bg-[var(--c-green-bg)] ${
                  i < 2 ? "border-b sm:border-b-0 sm:border-r border-[var(--c-border)]" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[var(--r-lg)] bg-[var(--c-green-bg)] text-[var(--c-green)] group-hover:bg-[var(--c-green)] group-hover:text-white transition">
                    <Icon size={22} />
                  </div>
                  <span className="font-display text-4xl font-black text-[var(--c-border)] group-hover:text-[var(--c-green-light)] transition select-none">
                    {num}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[var(--c-text)] mb-3">{title}</h3>
                <p className="text-sm text-[var(--c-text-muted)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── AI INTELLIGENCE — image + text ────────────────────────────────── */}
      <section className="bg-white border-b border-[var(--c-border)] px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 items-center lg:grid-cols-2">

            <div className="relative overflow-hidden rounded-[var(--r-2xl)] h-[440px]">
              <img
                src={immigrationOfficer}
                alt="Immigration intelligence"
                className="w-full h-full object-cover"
              />
              {/* Subtle green tint overlay */}
              <div className="absolute inset-0 bg-[var(--c-green)]/10" />
            </div>

            <div>
              <p className="text-[10px] font-semibold text-[var(--c-green-mid)] uppercase tracking-[0.28em] mb-5">
                Advanced Analytics
              </p>
              <h2 className="font-display text-4xl font-bold text-[var(--c-text)] mb-6 leading-tight lg:text-5xl">
                AI-Powered Immigration Intelligence
              </h2>
              <p className="text-[var(--c-text-mid)] leading-relaxed mb-8 text-base">
                Advanced assessment models identify risks, improve application
                readiness, and surface actionable recommendations — tailored
                specifically to your visa type and destination.
              </p>
              <ul className="space-y-4">
                {[
                  { label: "Risk identification",   sub: "Surfaces application risks before submission" },
                  { label: "Readiness improvement", sub: "Tracks document completion in real time"      },
                  { label: "Actionable insights",   sub: "Clear next steps at every stage"              },
                ].map(({ label, sub }) => (
                  <li key={label} className="flex items-start gap-4">
                    <div className="mt-1 w-5 h-5 rounded-full border-2 border-[var(--c-green)] flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[var(--c-green)]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--c-text)]">{label}</p>
                      <p className="text-xs text-[var(--c-text-muted)] mt-0.5">{sub}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── SUPPORTED VISA TYPES ──────────────────────────────────────────── */}
      <section className="bg-[var(--c-bg)] border-b border-[var(--c-border)] px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
            <div>
              <p className="text-[10px] font-semibold text-[var(--c-green-mid)] uppercase tracking-[0.28em] mb-4">
                Visa Support
              </p>
              <h2 className="font-display text-4xl font-bold text-[var(--c-text)] lg:text-5xl">
                Supported Categories
              </h2>
            </div>
            <a
              href="#assessment"
              className="self-start sm:self-auto inline-flex items-center gap-2 text-sm font-semibold text-[var(--c-green)] hover:text-[var(--c-green-mid)] transition"
            >
              Start an assessment <ArrowRight size={14} />
            </a>
          </div>

          <div className="grid gap-px bg-[var(--c-border)] rounded-[var(--r-xl)] overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: GraduationCap, name: "Student Visa",            desc: "Education and academic pursuits worldwide."      },
              { Icon: Briefcase,     name: "Work Visa",                desc: "Employment and professional placement."          },
              { Icon: Plane,         name: "Tourist Visa",             desc: "Travel and short-term visits."                  },
              { Icon: HomeIcon,      name: "Permanent Residency",      desc: "Long-term settlement pathways."                 },
              { Icon: Building2,     name: "Business Visa",            desc: "Commercial activities and meetings."            },
              { Icon: Users,         name: "Family Sponsorship",       desc: "Reunification and family joining."              },
              { Icon: TrendingUp,    name: "Investor Visa",            desc: "Investment-based immigration routes."           },
            ].map(({ Icon, name, desc }) => (
              <div
                key={name}
                className="group bg-white px-6 py-7 transition hover:bg-[var(--c-green)] cursor-default"
              >
                <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-[var(--r-md)] bg-[var(--c-green-bg)] text-[var(--c-green)] group-hover:bg-white/20 group-hover:text-white transition">
                  <Icon size={18} />
                </div>
                <h3 className="text-sm font-bold text-[var(--c-text)] group-hover:text-white mb-1.5 transition">{name}</h3>
                <p className="text-xs text-[var(--c-text-muted)] group-hover:text-white/70 leading-relaxed transition">{desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── SMART DOCUMENT VERIFICATION ───────────────────────────────────── */}
      <section className="bg-white border-b border-[var(--c-border)] px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 items-center lg:grid-cols-2">

            <div>
              <p className="text-[10px] font-semibold text-[var(--c-green-mid)] uppercase tracking-[0.28em] mb-5">
                Smart Verification
              </p>
              <h2 className="font-display text-4xl font-bold text-[var(--c-text)] mb-6 leading-tight lg:text-5xl">
                Smart Document Verification
              </h2>
              <p className="text-[var(--c-text-mid)] leading-relaxed mb-8 text-base">
                Upload your passport and supporting documents. Our system
                extracts data automatically, verifies completeness, and
                flags any issues before submission.
              </p>
              <ul className="space-y-4">
                {[
                  { label: "Instant extraction",      sub: "Passport data read in seconds"              },
                  { label: "Compliance check",         sub: "Every document validated against requirements" },
                  { label: "Automatic verification",   sub: "AI confirms type-match for all 15 documents" },
                ].map(({ label, sub }) => (
                  <li key={label} className="flex items-start gap-4">
                    <div className="mt-1 w-5 h-5 rounded-full border-2 border-[var(--c-green)] flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[var(--c-green)]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--c-text)]">{label}</p>
                      <p className="text-xs text-[var(--c-text-muted)] mt-0.5">{sub}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-[var(--r-2xl)] h-[440px]">
              <video
                autoPlay muted loop playsInline
                className="w-full h-full object-cover"
              >
                <source src={heroVideo} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-[var(--c-green)]/15" />
            </div>

          </div>
        </div>
      </section>

      {/* ── MEET NAVI ─────────────────────────────────────────────────────── */}
      <section className="bg-[var(--c-bg)] border-b border-[var(--c-border)] px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 items-center lg:grid-cols-2">

            <div>
              <p className="text-[10px] font-semibold text-[var(--c-green-mid)] uppercase tracking-[0.28em] mb-5">
                Intelligent Assistant
              </p>
              <h2 className="font-display text-4xl font-bold text-[var(--c-text)] mb-6 lg:text-5xl">
                Meet Navi
              </h2>
              <p className="text-[var(--c-text-mid)] leading-relaxed mb-8 text-base max-w-md">
                Your AI immigration assistant. Navi guides applicants throughout
                the entire process — answering questions, tracking progress,
                and ensuring nothing is missed.
              </p>
              <a
                href="#assessment"
                className="inline-flex items-center gap-2 rounded-[var(--r-lg)] bg-[var(--c-green)] px-7 py-3 text-sm font-bold text-white transition hover:bg-[var(--c-green-mid)] active:scale-[0.98]"
              >
                Chat with Navi
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Navi card — clean, no glass */}
            <div className="rounded-[var(--r-2xl)] border border-[var(--c-border)] bg-white p-10 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-[var(--r-xl)] bg-[var(--c-green)]">
                  <Bot size={24} className="text-white" />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-[var(--r-lg)] bg-[var(--c-green-bg)]">
                  <Sparkles size={18} className="text-[var(--c-green)]" />
                </div>
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--c-text)] mb-2">Navi AI</h3>
              <p className="text-sm text-[var(--c-text-muted)] leading-relaxed mb-8">
                Trained on immigration processes across 50+ countries. Available
                24/7 throughout your visa application journey.
              </p>
              <div className="space-y-2.5">
                {[
                  "Real-time guidance",
                  "Document checklist support",
                  "Status updates",
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--c-green)] shrink-0" />
                    <span className="text-sm text-[var(--c-text-mid)]">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--c-green)] px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 items-center lg:grid-cols-2">
            <div>
              <h2 className="font-display text-4xl font-bold text-white lg:text-5xl leading-tight">
                Start Your Immigration<br />Journey Today
              </h2>
            </div>
            <div className="lg:text-right">
              <p className="text-white/65 mb-8 max-w-sm lg:ml-auto">
                Join thousands of applicants using BlueprintAI to navigate their
                visa process with confidence.
              </p>
              <a
                href="#assessment"
                className="inline-flex items-center gap-2 rounded-[var(--r-lg)] bg-white px-8 py-3.5 text-sm font-bold text-[var(--c-green)] shadow-sm transition hover:bg-[var(--c-green-light)] active:scale-[0.98]"
              >
                Start Assessment
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── ASSESSMENT FORM ───────────────────────────────────────────────── */}
      <section id="assessment" className="bg-white border-b border-[var(--c-border)] px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {redirectMessage && (
            <div
              role="alert"
              className="mb-8 rounded-[var(--r-lg)] border border-[var(--c-green-light)] bg-[var(--c-green-bg)] px-6 py-4 text-sm text-[var(--c-green)]"
            >
              {redirectMessage}
            </div>
          )}

          <div className="mb-10 text-center">
            <p className="text-[10px] font-semibold text-[var(--c-green-mid)] uppercase tracking-[0.28em] mb-4">
              Assessment Form
            </p>
            <h2 className="font-display text-4xl font-bold text-[var(--c-text)] mb-4">
              Tell us about your application
            </h2>
            <p className="text-[var(--c-text-muted)] leading-relaxed">
              Select your visa type and destination to generate a full AI eligibility analysis.
            </p>
          </div>

          <CaseForm />
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-[var(--c-green)] px-6 pt-16 pb-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-4 mb-12">

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
                    <a href={href} className="text-sm text-white/65 hover:text-white transition">{label}</a>
                  </li>
                ))}
              </ul>
            </div>

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