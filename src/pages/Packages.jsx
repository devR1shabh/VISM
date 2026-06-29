// src/pages/Packages.jsx
//
// ONBOARDING REDESIGN CHANGE:
//   "Get Started" buttons now navigate to /packages/:packageId (detail page)
//   instead of directly selecting a package.
//   Removed the onSelect/handleSelect auth-check logic — that now lives in PackageDetail.

import { Link }             from "react-router-dom";
import { Check, X, ArrowRight } from "lucide-react";
import { PACKAGES }         from "../data/packages.js";

function Tick() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--c-green-bg)] shrink-0">
      <Check size={11} className="text-[var(--c-green)] stroke-[2.5]" />
    </span>
  );
}

function Cross() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--c-bg)] shrink-0">
      <X size={11} className="text-[var(--c-text-muted)] stroke-[2]" />
    </span>
  );
}

function PackageCard({ pkg }) {
  const isFeatured = pkg.color === "featured";
  const isFree     = pkg.price === 0;

  return (
    <div className={`relative flex flex-col rounded-[var(--r-2xl)] border shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-modal)] ${
      isFeatured
        ? "border-[var(--c-green)] ring-2 ring-[var(--c-green)] ring-offset-2 bg-white scale-[1.02]"
        : "border-[var(--c-border)] bg-white"
    }`}>
      {pkg.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
            isFeatured ? "bg-[var(--c-green)] text-white" : "bg-[var(--c-text)] text-white"
          }`}>
            {pkg.badge}
          </span>
        </div>
      )}

      <div className="p-8 flex flex-col flex-1">

        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--c-text-muted)] mb-2">
            {pkg.name}
          </p>
          <div className="flex items-baseline gap-1 mb-3">
            {isFree ? (
              <span className="text-4xl font-bold text-[var(--c-green)]">Free</span>
            ) : (
              <>
                <span className="text-4xl font-bold text-[var(--c-text)]">{pkg.priceDisplay}</span>
                <span className="text-sm text-[var(--c-text-muted)]">/ application</span>
              </>
            )}
          </div>
          <p className="text-sm text-[var(--c-text-muted)] leading-relaxed">{pkg.tagline}</p>
        </div>

        <div className="border-t border-[var(--c-border)] mb-6" />

        <ul className="space-y-3 mb-6 flex-1">
          {pkg.features.map((feat) => (
            <li key={feat} className="flex items-start gap-3">
              <Tick />
              <span className="text-sm text-[var(--c-text-mid)] leading-snug">{feat}</span>
            </li>
          ))}
          {pkg.notIncluded.map((feat) => (
            <li key={feat} className="flex items-start gap-3 opacity-50">
              <Cross />
              <span className="text-sm text-[var(--c-text-muted)] leading-snug line-through">{feat}</span>
            </li>
          ))}
        </ul>

        {/* Navigate to detail page — not direct selection */}
        <Link
          to={`/packages/${pkg.id}`}
          className={`w-full inline-flex items-center justify-center gap-2 rounded-[var(--r-lg)] px-6 py-3.5 text-sm font-bold transition active:scale-[0.98] ${
            isFeatured
              ? "bg-[var(--c-green)] text-white hover:bg-[var(--c-green-mid)] shadow-sm"
              : "border border-[var(--c-green)] text-[var(--c-green)] hover:bg-[var(--c-green-bg)]"
          }`}
        >
          {isFree ? "Learn More" : `Learn More`}
          <ArrowRight size={14} />
        </Link>

      </div>
    </div>
  );
}

function Packages() {
  return (
    <main className="min-h-screen bg-[var(--c-bg)]">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--c-green)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/60 mb-4">
            Pricing
          </p>
          <h1 className="font-display text-4xl font-bold text-white mb-5 lg:text-5xl">
            Choose Your Plan
          </h1>
          <p className="text-base text-white/70 max-w-xl mx-auto leading-relaxed">
            Start free and apply on your own, or get expert support from our
            processors. All plans include full AI analysis and document verification.
          </p>
        </div>
      </section>

      {/* ── Cards ─────────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
            {PACKAGES.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* ── What's included note ───────────────────────────────────────────── */}
      <section className="border-t border-[var(--c-border)] bg-white px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--c-green-mid)] mb-3">
              All Plans Include
            </p>
            <h2 className="font-display text-2xl font-bold text-[var(--c-text)]">
              Core platform features, no matter which plan you choose
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "AI Eligibility Analysis",      desc: "Instant assessment of your visa fit based on type and destination."  },
              { title: "Document Verification",         desc: "AI validates every document against the required checklist."          },
              { title: "Navi AI Assistant",             desc: "24/7 AI chat support throughout your application journey."            },
              { title: "Readiness Assessment Agent",    desc: "Autonomous agent scores your application readiness."                 },
              { title: "Email Notifications",           desc: "Automatic updates at every major milestone."                         },
              { title: "PDF Application Summary",       desc: "Download a full summary of your case at any time."                   },
            ].map(({ title, desc }) => (
              <div key={title} className="rounded-[var(--r-xl)] border border-[var(--c-border)] bg-[var(--c-bg)] p-5">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--c-green-bg)] shrink-0">
                    <Check size={12} className="text-[var(--c-green)] stroke-[2.5]" />
                  </span>
                  <p className="text-sm font-bold text-[var(--c-text)]">{title}</p>
                </div>
                <p className="text-xs text-[var(--c-text-muted)] leading-relaxed pl-8">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="border-t border-[var(--c-border)] bg-[var(--c-bg)] px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--c-green-mid)] mb-6">
            Common Questions
          </p>
          {[
            {
              q: "Can I upgrade my plan after starting?",
              a: "Yes. You can move from Self-Supported to Assisted or Concierge at any point before your application is submitted. Contact support to upgrade.",
            },
            {
              q: "What does a processor actually do?",
              a: "A VISM processor is a trained immigration document specialist. On Assisted and Concierge plans, they review every document you upload, flag any issues, and leave written remarks you can act on.",
            },
            {
              q: "Is the free plan really free?",
              a: "Yes — the Self-Supported plan is completely free with no hidden charges. You get full access to AI analysis, document verification, and the Navi assistant.",
            },
            {
              q: "How does the Razorpay payment work?",
              a: "Assisted and Concierge plans are paid once per application at the time of case creation. Payment is processed securely through Razorpay. You will receive an email receipt immediately.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="rounded-[var(--r-xl)] border border-[var(--c-border)] bg-white p-6">
              <p className="text-sm font-bold text-[var(--c-text)] mb-2">{q}</p>
              <p className="text-sm text-[var(--c-text-muted)] leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section className="border-t border-[var(--c-border)] bg-[var(--c-green)] px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-lg font-bold text-white mb-1">Still not sure which plan is right for you?</p>
            <p className="text-sm text-white/65">Start with the free plan — you can always upgrade.</p>
          </div>
          <Link
            to="/packages/self_supported"
            className="shrink-0 inline-flex items-center gap-2 rounded-[var(--r-lg)] bg-white px-7 py-3 text-sm font-bold text-[var(--c-green)] hover:bg-[var(--c-green-light)] transition active:scale-[0.98]"
          >
            Start for Free
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

    </main>
  );
}

export default Packages;