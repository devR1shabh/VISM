// src/pages/PackageDetail.jsx
//
// Full-detail page for a single package tier.
// URL: /packages/self_supported | /packages/assisted | /packages/concierge
//
// On "Continue" click:
//   - Saves packageId to sessionStorage key "vism_pending_package"
//   - Authenticated users → /apply
//   - Unauthenticated users → /register

import { useParams, useNavigate, Link }   from "react-router-dom";
import { Check, X, ArrowRight, ArrowLeft } from "lucide-react";

import { useApplicantAuth }  from "../context/ApplicantAuthContext.jsx";
import { getPackageById, PACKAGES } from "../data/packages.js";

const PENDING_PACKAGE_KEY = "vism_pending_package";

// ── Per-package content ───────────────────────────────────────────────────────

const PACKAGE_CONTENT = {
  self_supported: {
    journey: [
      { num: "01", label: "Create Application",         sub: "Select visa type and destination"              },
      { num: "02", label: "Upload Documents",           sub: "9 mandatory + 6 supporting documents"          },
      { num: "03", label: "AI Readiness Assessment",    sub: "Autonomous agent scores your application"      },
      { num: "04", label: "Review & Submit",            sub: "Download PDF summary and submit"               },
    ],
    forWho: [
      "You have applied for visas before and know the process",
      "You are comfortable organising your own paperwork",
      "You want free access to AI analysis and document verification",
      "Your application is straightforward with no complex circumstances",
    ],
    highlight: "Zero cost. Full access to AI tools, document verification, and Navi assistant.",
  },
  assisted: {
    journey: [
      { num: "01", label: "Pay ₹1,999",                sub: "Secure checkout via Razorpay"                  },
      { num: "02", label: "Create Application",         sub: "Select visa type and destination"              },
      { num: "03", label: "Upload Documents",           sub: "AI verifies each document as you upload"       },
      { num: "04", label: "Processor Reviews",          sub: "A VISM specialist reviews all your documents"  },
      { num: "05", label: "Receive Written Remarks",    sub: "Specific feedback on anything that needs fixing" },
      { num: "06", label: "AI Assessment & Submit",     sub: "Final readiness score and PDF download"        },
    ],
    forWho: [
      "First-time visa applicants who want expert backup",
      "You want a professional to catch errors before submission",
      "Your application has moderate complexity or unusual circumstances",
      "You need structured guidance without full hand-holding",
    ],
    highlight: "A real VISM processor reviews every document you upload and flags any issues in writing.",
  },
  concierge: {
    journey: [
      { num: "01", label: "Pay ₹4,999",                sub: "Secure checkout via Razorpay"                   },
      { num: "02", label: "Officer Assigned",           sub: "A dedicated VISM case officer contacts you"    },
      { num: "03", label: "Create Application",         sub: "Your officer guides the entire setup"          },
      { num: "04", label: "Document Preparation",       sub: "Officer advises on every document needed"      },
      { num: "05", label: "Pre-Submission Review Call", sub: "Walk through your application with your officer" },
      { num: "06", label: "Priority Submit",            sub: "Highest priority queue, fastest processing"    },
    ],
    forWho: [
      "High-stakes or complex visa applications (investor, PR, family sponsorship)",
      "You want zero involvement in paperwork — your officer handles everything",
      "You need the fastest possible processing time",
      "Premium, full-service support from a dedicated expert",
    ],
    highlight: "A dedicated VISM case officer is assigned to you personally and guides every step.",
  },
};

// ── Feature row with description ──────────────────────────────────────────────
const FEATURE_DESCRIPTIONS = {
  "AI visa eligibility analysis":                   "Instant assessment of your visa fit based on type and destination",
  "Document checklist (9 mandatory + 6 supporting)":"Full categorised document list tailored to your visa type",
  "AI-powered document verification":               "Each document is verified by AI for type-match and completeness",
  "Navi AI assistant (24/7)":                       "Chat with Navi at any stage — questions answered instantly",
  "Readiness assessment agent":                     "Autonomous AI agent scores your application before submission",
  "PDF application summary download":               "Download a full application summary PDF at any time",
  "Email status notifications":                     "Automatic updates at every major milestone",
  "Everything in Self-Supported":                   "All free-tier features included",
  "Processor reviews all your documents":           "A trained VISM specialist manually reviews every uploaded document",
  "Flags issues before you submit":                 "Any problems are caught before your application goes anywhere",
  "Written processor remarks & guidance":           "Specific written feedback you can action immediately",
  "Priority processing queue":                      "Your case is prioritised over standard queue cases",
  "Visa confidence score report":                   "AI-generated 0–100 approval probability score with breakdown",
  "Everything in Assisted":                         "All Assisted features included",
  "Dedicated case officer assigned":                "One VISM expert assigned specifically to your application",
  "Document preparation guidance":                  "Your officer advises on every document before you upload",
  "WhatsApp support channel":                       "Direct WhatsApp line to your case officer",
  "Highest priority queue":                         "Processed before all other case types",
  "Pre-submission review walkthrough":              "A video or call walkthrough of your full application before submission",
};

function FeatureRow({ feature, included }) {
  return (
    <div className={`flex items-start gap-3 py-3 border-b border-[var(--c-border)] last:border-0 ${!included ? "opacity-40" : ""}`}>
      <span className={`flex h-5 w-5 items-center justify-center rounded-full shrink-0 mt-0.5 ${
        included ? "bg-[var(--c-green-bg)]" : "bg-[var(--c-bg)]"
      }`}>
        {included
          ? <Check size={11} className="text-[var(--c-green)] stroke-[2.5]" />
          : <X size={11} className="text-[var(--c-text-muted)] stroke-[2]" />
        }
      </span>
      <div className="min-w-0">
        <p className={`text-sm font-semibold ${included ? "text-[var(--c-text)]" : "text-[var(--c-text-muted)] line-through"}`}>
          {feature}
        </p>
        {included && FEATURE_DESCRIPTIONS[feature] && (
          <p className="text-xs text-[var(--c-text-muted)] mt-0.5 leading-relaxed">
            {FEATURE_DESCRIPTIONS[feature]}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Journey step ──────────────────────────────────────────────────────────────
function JourneyStep({ num, label, sub, isLast }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--c-green)] shrink-0">
          <span className="text-xs font-bold text-white">{num}</span>
        </div>
        {!isLast && <div className="w-px flex-1 bg-[var(--c-green-light)] mt-2 mb-0 min-h-[2rem]" />}
      </div>
      <div className="pb-6">
        <p className="text-sm font-bold text-[var(--c-text)] leading-snug">{label}</p>
        <p className="text-xs text-[var(--c-text-muted)] mt-0.5 leading-relaxed">{sub}</p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
function PackageDetail() {
  const { packageId } = useParams();
  const navigate       = useNavigate();
  const { isAuthenticated } = useApplicantAuth();

  const pkg     = getPackageById(packageId);
  const content = PACKAGE_CONTENT[pkg.id] || PACKAGE_CONTENT.self_supported;

  // If URL has an unknown packageId, getPackageById falls back to self_supported
  // which is fine — the page renders with valid data.

  const isFeatured = pkg.id === "assisted";
  const isPremium  = pkg.id === "concierge";
  const isFree     = pkg.price === 0;

  const handleContinue = () => {
    // Save selection to sessionStorage — persists through login/register redirects
    sessionStorage.setItem(PENDING_PACKAGE_KEY, pkg.id);
    navigate(isAuthenticated ? "/apply" : "/register");
  };

  const allFeatures   = [...pkg.features, ...pkg.notIncluded];

  return (
    <main className="min-h-screen bg-[var(--c-bg)] pb-28">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--c-green)] px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">

          <Link
            to="/packages"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium transition mb-8"
          >
            <ArrowLeft size={14} />
            All Plans
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              {(isFeatured || isPremium) && (
                <span className="inline-flex items-center rounded-full bg-white/20 border border-white/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white mb-3">
                  {pkg.badge}
                </span>
              )}
              <h1 className="font-display text-4xl font-bold text-white lg:text-5xl">
                {pkg.name}
              </h1>
              <p className="mt-3 text-white/70 text-base max-w-md leading-relaxed">
                {pkg.tagline}
              </p>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-[var(--r-2xl)] px-8 py-6 text-center shrink-0">
              {isFree ? (
                <p className="text-4xl font-bold text-white">Free</p>
              ) : (
                <>
                  <p className="text-4xl font-bold text-white">{pkg.priceDisplay}</p>
                  <p className="text-sm text-white/60 mt-1">one-time per application</p>
                </>
              )}
            </div>
          </div>

          {/* Highlight callout */}
          <div className="mt-8 rounded-[var(--r-xl)] bg-white/10 border border-white/20 px-5 py-4">
            <p className="text-sm text-white/90 leading-relaxed">
              <span className="font-bold text-white">Key advantage: </span>
              {content.highlight}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 space-y-14">

        {/* ── What's Included ────────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--c-green-mid)] mb-3">
            What&apos;s Included
          </p>
          <h2 className="font-display text-2xl font-bold text-[var(--c-text)] mb-6">
            Full feature breakdown
          </h2>
          <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-2xl)] shadow-[var(--shadow-card)] divide-y divide-[var(--c-border)] overflow-hidden">
            <div className="p-6">
              {pkg.features.map((feat) => (
                <FeatureRow key={feat} feature={feat} included={true} />
              ))}
              {pkg.notIncluded.map((feat) => (
                <FeatureRow key={feat} feature={feat} included={false} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Your Journey ───────────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--c-green-mid)] mb-3">
            Your Journey
          </p>
          <h2 className="font-display text-2xl font-bold text-[var(--c-text)] mb-6">
            What happens after you select this plan
          </h2>
          <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-2xl)] shadow-[var(--shadow-card)] p-6">
            {content.journey.map((step, idx) => (
              <JourneyStep
                key={step.num}
                num={step.num}
                label={step.label}
                sub={step.sub}
                isLast={idx === content.journey.length - 1}
              />
            ))}
          </div>
        </section>

        {/* ── Who This Is For ─────────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--c-green-mid)] mb-3">
            Who This Is For
          </p>
          <h2 className="font-display text-2xl font-bold text-[var(--c-text)] mb-6">
            Is {pkg.name} right for you?
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {content.forWho.map((point, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-[var(--r-xl)] border border-[var(--c-border)] bg-[var(--c-card)] p-4 shadow-[var(--shadow-card)]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--c-green-bg)] shrink-0 mt-0.5">
                  <Check size={12} className="text-[var(--c-green)] stroke-[2.5]" />
                </span>
                <p className="text-sm text-[var(--c-text-mid)] leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Compare other plans ────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--c-green-mid)] mb-4">
            Other Plans
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {PACKAGES.filter((p) => p.id !== pkg.id).map((other) => (
              <Link
                key={other.id}
                to={`/packages/${other.id}`}
                className="group flex items-center justify-between rounded-[var(--r-xl)] border border-[var(--c-border)] bg-[var(--c-card)] p-4 hover:border-[var(--c-green-light)] hover:shadow-[var(--shadow-card)] transition"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--c-text-muted)]">{other.name}</p>
                  <p className="text-sm font-bold text-[var(--c-text)] mt-0.5">{other.priceDisplay}</p>
                </div>
                <ArrowRight size={14} className="text-[var(--c-text-muted)] group-hover:text-[var(--c-green)] transition" />
              </Link>
            ))}
          </div>
        </section>

      </div>

      {/* ── Sticky bottom CTA ─────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[var(--c-border)] shadow-[var(--shadow-modal)]">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-xs text-[var(--c-text-muted)] font-medium">Selected Plan</p>
            <p className="text-sm font-bold text-[var(--c-text)]">
              {pkg.name} — {isFree ? "Free" : pkg.priceDisplay}
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/packages"
              className="flex-1 sm:flex-none text-center rounded-[var(--r-lg)] border border-[var(--c-border)] px-5 py-3 text-sm font-semibold text-[var(--c-text-muted)] hover:bg-[var(--c-bg)] transition"
            >
              Compare Plans
            </Link>
            <button
              type="button"
              onClick={handleContinue}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-[var(--r-lg)] bg-[var(--c-green)] px-6 py-3 text-sm font-bold text-white hover:bg-[var(--c-green-mid)] transition active:scale-[0.98] shadow-sm"
            >
              Continue with {pkg.name}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

    </main>
  );
}

export default PackageDetail;