// src/pages/Home.jsx

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import airportPassport    from "../assets/hero/airport-passport.jpg";
import immigrationOfficer from "../assets/hero/immigration-officer.jpg";
import CaseForm from "../components/input/CaseForm";

function Home() {
  // ── Logic completely unchanged ────────────────────────────────────────────
  const location = useLocation();
  const navigate  = useNavigate();
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

      {/* ── HERO — full-bleed editorial photograph ─────────────────────────
          No dark overlay container. Image fills edge to edge.
          A small overline label sits top-left over the image.
          The image is the hero — not a background.
      ──────────────────────────────────────────────────────────────────────── */}
      <div className="relative">
        <img
          src={airportPassport}
          alt="Passport and identity documents"
          className="w-full object-cover object-center"
          style={{ height: "68vh", minHeight: "420px", maxHeight: "680px" }}
        />
        {/* Subtle gradient at bottom so stat band reads cleanly below */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
        {/* Overline label — editorial style */}
        <div className="absolute top-8 left-8 lg:left-12">
          <span className="inline-block bg-white/90 backdrop-blur-sm text-[var(--c-green)] text-[10px] font-bold tracking-[0.22em] uppercase px-3 py-1.5 rounded-[var(--r-sm)]">
            VISM Intelligence Platform
          </span>
        </div>
      </div>

      {/* ── STAT BAND — borderless editorial stat tiles ────────────────────
          Three columns separated by hairline rules. No cards, no shadows.
          Numbers in Playfair Display — pure editorial typography.
      ──────────────────────────────────────────────────────────────────────── */}
      <div className="border-b border-[var(--c-border)]">
        <div className="mx-auto max-w-7xl grid grid-cols-3">
          {[
            { label: "Visa Categories",   value: "3+"         },
            { label: "Verification Rate", value: "99.8%"      },
            { label: "Active Tracking",   value: "Real-time"  },
          ].map(({ label, value }, i) => (
            <div
              key={label}
              className={`px-8 py-10 lg:px-12 ${i < 2 ? "border-r border-[var(--c-border)]" : ""}`}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--c-text-muted)] mb-3">
                {label}
              </p>
              <p
                className="font-display font-bold text-[var(--c-text)] leading-none"
                style={{ fontSize: "clamp(36px, 4vw, 52px)" }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── THREE PHASES ───────────────────────────────────────────────────
          Off-white section. Left-aligned heading.
          Ghost step numbers in muted green. Zero decoration — no icons,
          no cards, no borders. Pure typographic hierarchy.
      ──────────────────────────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="bg-[var(--c-bg)] border-b border-[var(--c-border)] px-8 py-20 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-4xl font-bold text-[var(--c-text)] mb-14 lg:text-[42px]">
            Three phases of verification
          </h2>
          <div className="grid gap-12 sm:grid-cols-3">
            {[
              {
                num:   "01",
                title: "Initial Scan",
                body:  "Compute your eligibility across multiple jurisdictions using our AI engine and active visa databases.",
              },
              {
                num:   "02",
                title: "Document Audit",
                body:  "Every file is cross-referenced against embassy requirements to ensure absolute compliance before formal submission.",
              },
              {
                num:   "03",
                title: "Journey Tracking",
                body:  "Monitor your application lifecycle with direct links to government processing times and biometric scheduling.",
              },
            ].map(({ num, title, body }) => (
              <div key={num}>
                <span className="block text-sm font-semibold text-[var(--c-green-mid)] tracking-[0.12em] mb-5">
                  {num}
                </span>
                <h3 className="text-[17px] font-bold text-[var(--c-text)] mb-3">
                  {title}
                </h3>
                <p className="text-sm text-[var(--c-text-muted)] leading-[1.75]">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUPPORTED CATEGORIES — full-bleed photo cards ─────────────────
          Images fill each card entirely. Small uppercase label overlaid
          top-left. Title + description at the bottom over dark gradient.
          Cards flush to page edges, separated by 2px gap.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--c-bg)] border-b border-[var(--c-border)]">
        <div className="mx-auto max-w-7xl px-8 lg:px-12">
          <div className="flex items-baseline justify-between py-10">
            <h2 className="font-display text-4xl font-bold text-[var(--c-text)] lg:text-[42px]">
              Supported Categories
            </h2>
            <a
              href="#assessment"
              className="text-sm text-[var(--c-green-mid)] font-medium hover:underline underline-offset-4 shrink-0 ml-8"
            >
              View all pathways →
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: "2px" }}>
          {[
            {
              src:   immigrationOfficer,
              label: "Work Residency",
              title: "Professional Talent",
              sub:   "Specialised skills and H1-B equivalents.",
              pos:   "center",
            },
            {
              src:   airportPassport,
              label: "Student Visas",
              title: "Academic Pathways",
              sub:   "Higher education and research fellowships.",
              pos:   "center 60%",
            },
            {
              src:   immigrationOfficer,
              label: "Tourist & Business",
              title: "Short-stay Mobility",
              sub:   "Business meetings and cultural visits.",
              pos:   "right center",
            },
          ].map(({ src, label, title, sub, pos }) => (
            <div
              key={label}
              className="relative overflow-hidden cursor-pointer group"
              style={{ height: "360px" }}
            >
              <img
                src={src}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                style={{ objectPosition: pos }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/85 bg-black/25 px-2.5 py-1 rounded-[var(--r-sm)]">
                  {label}
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-display text-xl font-bold text-white mb-1">
                  {title}
                </p>
                <p className="text-sm text-white/70">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI INTELLIGENCE — two-column feature section ───────────────────
          White background. Left: text with check list.
          Right: dark app mockup panel showing live data.
          Eyebrow: tiny all-caps gray (NOT green).
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-[var(--c-border)] px-8 py-20 lg:px-12">
        <div className="mx-auto max-w-7xl grid gap-16 items-center lg:grid-cols-2">
          <div>
            <span className="block text-[10px] font-bold tracking-[0.22em] uppercase text-[var(--c-text-muted)] mb-4">
              Bureaucratic Intelligence
            </span>
            <h2 className="font-display text-3xl font-bold text-[var(--c-text)] mb-5 lg:text-4xl leading-[1.15]">
              AI-driven verification that mirrors consular standards
            </h2>
            <p className="text-[15px] text-[var(--c-text-mid)] leading-[1.8] mb-7">
              Our neural models are trained on over ten thousand successful visa
              applications across 40 jurisdictions. We identify potential rejection
              risks before they reach a human reviewer.
            </p>
            <ul className="space-y-3.5">
              {[
                "Legislative updates processed every 15 minutes",
                "Automatic translation of over 60 identity documents",
                "Risk identification across consular precedent",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg
                    className="w-4 h-4 text-[var(--c-green-mid)] shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-sm text-[var(--c-text-mid)]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* App mockup — dark panel with live-style data */}
          <div className="rounded-[var(--r-2xl)] bg-[#0a1628] overflow-hidden h-[340px] flex items-center justify-center p-8">
            <div className="w-full rounded-[var(--r-lg)] bg-[#0f2040] border border-[#1a3050] p-5">
              <div className="flex gap-1.5 mb-4">
                {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                  <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <p className="font-display text-center text-4xl font-bold text-[#4ade80] mb-1">
                81 / 100
              </p>
              <p className="text-center text-[10px] tracking-[0.12em] uppercase text-white/40 mb-4">
                Eligibility Score
              </p>
              <div className="border-t border-[#1a3050] pt-3 space-y-2.5">
                {[
                  ["CASE-1748779821", "Approved",   "#4ade80"],
                  ["Passport Extracted", "✓ Verified", "#4ade80"],
                  ["Risk Analysis",    "2 flags",    "#fbbf24"],
                  ["Documents",        "2 / 2",      "#4ade80"],
                ].map(([l, v, c]) => (
                  <div key={l} className="flex justify-between items-center text-[11px]">
                    <span className="text-white/55">{l}</span>
                    <span style={{ color: c }} className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SMART DOCUMENT VERIFICATION — reversed two-column ─────────────
          Off-white background. Text left, image right.
          img src/alt preserved exactly.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--c-bg)] border-b border-[var(--c-border)] px-8 py-20 lg:px-12">
        <div className="mx-auto max-w-7xl grid gap-16 items-center lg:grid-cols-2">
          <div>
            <span className="block text-[10px] font-bold tracking-[0.22em] uppercase text-[var(--c-text-muted)] mb-4">
              Smart Verification
            </span>
            <h2 className="font-display text-3xl font-bold text-[var(--c-text)] mb-5 lg:text-4xl leading-[1.15]">
              Smart Document Verification
            </h2>
            <p className="text-[15px] text-[var(--c-text-mid)] leading-[1.8] mb-7">
              Upload passports and supporting documents to extract information
              and verify readiness automatically. Our AI ensures compliance
              and completeness.
            </p>
            <ul className="space-y-3.5">
              {[
                "Instant extraction",
                "Compliance check",
                "Automatic verification",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg
                    className="w-4 h-4 text-[var(--c-green-mid)] shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-sm text-[var(--c-text-mid)]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="rounded-[var(--r-2xl)] overflow-hidden border border-[var(--c-border)]"
            style={{ height: "380px" }}
          >
            <img
              src={immigrationOfficer}
              alt="Smart Document Verification"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ────────────────────────────────────────────────────
          White background. Centered editorial heading in Playfair Display.
          Single dark green button. No dark navy section.
          href="#assessment" unchanged.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-[var(--c-border)] px-8 py-24 lg:px-12 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-4xl font-bold text-[var(--c-text)] mb-4 lg:text-5xl leading-[1.1]">
            Begin your assessment in under two minutes.
          </h2>
          <p className="text-[15px] text-[var(--c-text-muted)] mb-10">
            No account required. Receive a confidential eligibility report instantly.
          </p>
          <a
            href="#assessment"
            className="inline-flex items-center gap-2 bg-[var(--c-green)] text-white font-semibold text-sm px-8 py-3.5 rounded-[var(--r-lg)] transition hover:bg-[var(--c-green-mid)] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[var(--c-green)] focus:ring-offset-2"
          >
            Start Assessment
          </a>
        </div>
      </section>

      {/* ── ASSESSMENT FORM SECTION ────────────────────────────────────────
          Off-white background. Two-column: left = editorial copy, right = form.
          id="assessment" unchanged. role="alert" unchanged. <CaseForm /> unchanged.
      ──────────────────────────────────────────────────────────────────────── */}
      <section id="assessment" className="bg-[var(--c-bg)] border-b border-[var(--c-border)] px-8 py-20 lg:px-12">
        <div className="mx-auto max-w-7xl grid gap-16 items-start lg:grid-cols-2">

          {/* Editorial context copy */}
          <div className="lg:pt-6">
            <span className="block text-[10px] font-bold tracking-[0.22em] uppercase text-[var(--c-text-muted)] mb-4">
              Assessment Form
            </span>
            <h2 className="font-display text-3xl font-bold text-[var(--c-text)] mb-4 lg:text-4xl leading-[1.15]">
              Tell VISM about your case
            </h2>
            <p className="text-[15px] text-[var(--c-text-mid)] leading-[1.8]">
              Select your visa type and destination country to generate a full
              AI-powered eligibility analysis, risk assessment, and personalised
              document checklist.
            </p>
          </div>

          {/* Form */}
          <div>
            {redirectMessage && (
              <div
                role="alert"
                className="mb-5 rounded-[var(--r-lg)] border border-[var(--c-green-light)] bg-[var(--c-green-bg)] px-5 py-3.5 text-sm text-[var(--c-green)]"
              >
                {redirectMessage}
              </div>
            )}
            <CaseForm />
          </div>

        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────
          White background. Three-column grid.
          Left: VISM wordmark + tagline.
          Centre: PLATFORM links.
          Right: INSTITUTIONAL links including Processor Portal.
          Bottom strip: copyright + systems status.
      ──────────────────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-[var(--c-border)] px-8 pt-16 pb-8 lg:px-12">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr] mb-14">

            {/* Brand */}
            <div>
              <span className="font-display text-[20px] font-bold text-[var(--c-green)] block mb-3">
                VISM
              </span>
              <p className="text-sm text-[var(--c-text-muted)] leading-[1.75] max-w-[260px]">
                The international benchmark for algorithmic residency processing.
                Providing certainty in a world of complex borders.
              </p>
            </div>

            {/* Platform */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[var(--c-text-muted)] mb-4">
                Platform
              </p>
              {["Protocols", "Security", "Jurisdictions"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-sm text-[var(--c-text-mid)] mb-2.5 hover:text-[var(--c-text)] transition"
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Institutional — includes Processor Portal per approved architecture */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[var(--c-text-muted)] mb-4">
                Institutional
              </p>
              {["Legal Notice", "Privacy Policy", "Registry Access"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-sm text-[var(--c-text-mid)] mb-2.5 hover:text-[var(--c-text)] transition"
                >
                  {link}
                </a>
              ))}
              <a
                href="/processor"
                className="block text-sm text-[var(--c-text-muted)] mb-2.5 hover:text-[var(--c-text)] transition"
              >
                Processor Portal
              </a>
            </div>

          </div>

          {/* Bottom strip */}
          <div className="border-t border-[var(--c-border)] pt-6 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.06em] text-[var(--c-text-muted)]">
              © 2026 VISM Global Registry. All Rights Reserved.
            </span>
            <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.06em] text-[var(--c-text-muted)]">
              <span className="w-[7px] h-[7px] rounded-full bg-[#22c55e] inline-block" />
              Systems Operational
            </span>
          </div>

        </div>
      </footer>

    </main>
  );
}

export default Home;