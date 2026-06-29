// src/pages/Apply.jsx
//
// 3-step guided application wizard. Protected route.
//
// FEATURE 6 CHANGE:
//   After case creation, paid tiers (Assisted / Concierge) show
//   RazorpayMockModal before navigating to /analysis.
//   Free tier (Self-Supported) continues directly as before.
//   Added: showPaymentModal, createdCase state.
//   Added: handlePaymentSuccess, handlePaymentDismiss callbacks.

import { useState }                       from "react";
import { useNavigate, Link }              from "react-router-dom";
import { Check, ArrowRight, ArrowLeft }   from "lucide-react";
import Select                             from "react-select";

import { useCase, WORKFLOW_STEPS }  from "../context/CaseContext.jsx";
import { useConfig }                from "../context/ConfigContext.jsx";
import { createCase }               from "../services/api.js";
import { PACKAGES, getPackageById } from "../data/packages.js";
import countries                    from "../data/countries.js";
import RazorpayMockModal            from "../components/payment/RazorpayMockModal.jsx";

const PENDING_PACKAGE_KEY = "vism_pending_package";

// ── react-select styles ───────────────────────────────────────────────────────
const selectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#FFFFFF",
    borderColor: state.isFocused ? "#1C4532" : "#E5E5E3",
    borderWidth: "1px",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(28,69,50,0.12)" : "none",
    "&:hover": { borderColor: "#1C4532" },
    cursor: "pointer",
    minHeight: "44px",
    borderRadius: "8px",
  }),
  placeholder: (base) => ({ ...base, color: "#9CA3AF", fontSize: "14px" }),
  input:       (base) => ({ ...base, color: "#111111", fontSize: "14px" }),
  singleValue: (base) => ({ ...base, color: "#111111", fontSize: "14px" }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E5E3",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    borderRadius: "8px",
    overflow: "hidden",
  }),
  menuList: (base) => ({ ...base, backgroundColor: "#FFFFFF", padding: "4px 0" }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#1C4532" : state.isFocused ? "#F7F7F5" : "#FFFFFF",
    color: state.isSelected ? "#FFFFFF" : "#111111",
    cursor: "pointer",
    padding: "10px 14px",
    fontSize: "14px",
    "&:active": { backgroundColor: "#F0FDF4", color: "#1C4532" },
  }),
  loadingMessage:   (base) => ({ ...base, color: "#6B7280", fontSize: "14px" }),
  noOptionsMessage: (base) => ({ ...base, color: "#6B7280", fontSize: "14px" }),
};

// ── Step indicator ────────────────────────────────────────────────────────────
function StepIndicator({ current }) {
  const steps = ["Package", "Visa & Country", "Details"];
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((label, idx) => {
        const num      = idx + 1;
        const isDone   = num < current;
        const isActive = num === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                isDone   ? "border-[var(--c-green)] bg-[var(--c-green)]" :
                isActive ? "border-[var(--c-green)] bg-white"            :
                           "border-[var(--c-border)] bg-white"
              }`}>
                {isDone ? (
                  <Check size={14} className="text-white stroke-[2.5]" />
                ) : (
                  <span className={`text-xs font-bold ${isActive ? "text-[var(--c-green)]" : "text-[var(--c-text-muted)]"}`}>
                    {num}
                  </span>
                )}
              </div>
              <span className={`mt-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] whitespace-nowrap ${
                isActive ? "text-[var(--c-green)]" : "text-[var(--c-text-muted)]"
              }`}>
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-16 sm:w-24 h-px mx-2 mb-5 transition-all ${
                isDone ? "bg-[var(--c-green)]" : "bg-[var(--c-border)]"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Package card (compact, selectable) ───────────────────────────────────────
function PackageCard({ pkg, selected, onSelect }) {
  const isSelected = selected === pkg.id;
  const isFeatured = pkg.id === "assisted";
  return (
    <button
      type="button"
      onClick={() => onSelect(pkg.id)}
      className={`w-full text-left rounded-[var(--r-xl)] border-2 p-5 transition-all active:scale-[0.99] ${
        isSelected
          ? "border-[var(--c-green)] bg-[var(--c-green-bg)] shadow-[var(--shadow-card)]"
          : "border-[var(--c-border)] bg-[var(--c-card)] hover:border-[var(--c-green-light)]"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          {isFeatured && (
            <span className="inline-flex items-center rounded-full bg-[var(--c-green)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white mb-1.5">
              Most Popular
            </span>
          )}
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--c-text-muted)]">{pkg.name}</p>
          <p className={`text-xl font-bold mt-0.5 ${isSelected ? "text-[var(--c-green)]" : "text-[var(--c-text)]"}`}>
            {pkg.priceDisplay}
          </p>
        </div>
        <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 shrink-0 mt-1 transition-all ${
          isSelected ? "border-[var(--c-green)] bg-[var(--c-green)]" : "border-[var(--c-border)]"
        }`}>
          {isSelected && <Check size={10} className="text-white stroke-[3]" />}
        </div>
      </div>
      <p className="text-xs text-[var(--c-text-muted)] mb-3 leading-relaxed">{pkg.tagline}</p>
      <ul className="space-y-1.5">
        {pkg.features.slice(0, 3).map((feat) => (
          <li key={feat} className="flex items-center gap-2">
            <Check size={10} className="text-[var(--c-green)] shrink-0 stroke-[2.5]" />
            <span className="text-xs text-[var(--c-text-mid)] truncate">{feat}</span>
          </li>
        ))}
        {pkg.features.length > 3 && (
          <li className="text-xs text-[var(--c-text-muted)] pl-4">
            +{pkg.features.length - 3} more features
          </li>
        )}
      </ul>
    </button>
  );
}

// ── Navigation buttons ────────────────────────────────────────────────────────
function NavButtons({ onBack, onNext, nextLabel = "Continue", nextDisabled = false, loading = false }) {
  return (
    <div className="flex items-center justify-between pt-6 mt-6 border-t border-[var(--c-border)]">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--c-text-muted)] hover:text-[var(--c-text)] transition"
        >
          <ArrowLeft size={14} />
          Back
        </button>
      ) : <div />}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || loading}
        className="inline-flex items-center gap-2 rounded-[var(--r-lg)] bg-[var(--c-green)] px-6 py-3 text-sm font-bold text-white hover:bg-[var(--c-green-mid)] transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Creating...
          </>
        ) : (
          <>
            {nextLabel}
            <ArrowRight size={14} />
          </>
        )}
      </button>
    </div>
  );
}

// ── Main wizard ───────────────────────────────────────────────────────────────
function Apply() {
  const navigate               = useNavigate();
  const { setCaseData, clearCase } = useCase();
  const { visaTypes }          = useConfig();

  const [selectedPackageId, setSelectedPackageId] = useState(
    () => sessionStorage.getItem(PENDING_PACKAGE_KEY) || "self_supported"
  );
  const [visaType,    setVisaType]    = useState("");
  const [country,     setCountry]     = useState("");
  const [description, setDescription] = useState("");
  const [step,        setStep]        = useState(1);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  // FEATURE 6: payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdCase,      setCreatedCase]      = useState(null);

  const selectedPkg    = getPackageById(selectedPackageId);
  const visaOptions    = visaTypes.map((v) => ({ value: v, label: v }));
  const countryOptions = countries.map((c) => ({ value: c, label: c }));

  // ── Create case ───────────────────────────────────────────────────────────
  const handleCreate = async () => {
    setError("");
    setLoading(true);

    try {
      clearCase();

      const newCase = {
        caseId:            `CASE-${Date.now()}`,
        visaType,
        country,
        description,
        status:            "In Progress",
        createdAt:         new Date().toISOString(),
        documents:         [],
        extractedData:     {},
        risks:             [],
        tasks:             [],
        notifications:     [],
        readinessScore:    null,
        workflowStep:      WORKFLOW_STEPS.CASE_CREATED,
        package:           selectedPkg.id,
        packageSelectedAt: new Date().toISOString(),
        // Free tier: immediately paid. Paid tier: awaiting payment modal.
        paymentStatus:     selectedPkg.price === 0 ? "paid" : "unpaid",
      };

      const savedCase = await createCase(newCase);

      if (selectedPkg.price === 0) {
        // ── Free tier — no payment needed ────────────────────────────────
        sessionStorage.removeItem(PENDING_PACKAGE_KEY);
        setCaseData({ ...savedCase, workflowStep: WORKFLOW_STEPS.CASE_CREATED });
        navigate("/analysis");
      } else {
        // ── Paid tier — show mock Razorpay modal ─────────────────────────
        setCreatedCase(savedCase);
        setShowPaymentModal(true);
        setLoading(false);
      }
    } catch (err) {
      console.error("[Apply] createCase failed:", err);
      setError("Failed to create your application. Please try again.");
      setLoading(false);
    }
  };

  // ── Payment success callback ──────────────────────────────────────────────
  // Called by RazorpayMockModal after the backend confirms payment.
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    sessionStorage.removeItem(PENDING_PACKAGE_KEY);
    // Update local case state with paid status before navigating
    setCaseData({
      ...createdCase,
      paymentStatus: "paid",
      workflowStep:  WORKFLOW_STEPS.CASE_CREATED,
    });
    navigate("/analysis");
  };

  // ── Payment dismissed (cancelled) ────────────────────────────────────────
  // Case exists with paymentStatus: "unpaid". Navigate to dashboard —
  // the case will be visible there. Future feature can allow payment retry.
  const handlePaymentDismiss = () => {
    setShowPaymentModal(false);
    sessionStorage.removeItem(PENDING_PACKAGE_KEY);
    navigate("/my-cases");
  };

  return (
    <main className="min-h-screen bg-[var(--c-bg)]">

      {/* ── Payment modal — rendered above everything ─────────────────────── */}
      {showPaymentModal && createdCase && (
        <RazorpayMockModal
          pkg={selectedPkg}
          caseId={createdCase._id}
          onSuccess={handlePaymentSuccess}
          onDismiss={handlePaymentDismiss}
        />
      )}

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="bg-[var(--c-green)] px-6 py-10 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Link
            to="/my-cases"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-medium transition mb-4"
          >
            <ArrowLeft size={12} />
            Back to Dashboard
          </Link>
          <h1 className="font-display text-3xl font-bold text-white">New Application</h1>
          <p className="mt-2 text-white/70 text-sm">
            We&apos;ll guide you through the setup in 3 quick steps.
          </p>
        </div>
      </div>

      {/* ── Wizard body ───────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-2xl px-6 py-10 lg:px-8">

        <StepIndicator current={step} />

        <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-2xl)] shadow-[var(--shadow-card)] p-8">

          {/* ── Step 1: Package ─────────────────────────────────────────── */}
          {step === 1 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--c-text-muted)] font-semibold mb-1">
                Step 1 of 3
              </p>
              <h2 className="text-xl font-bold text-[var(--c-text)] mb-1">Choose Your Plan</h2>
              <p className="text-sm text-[var(--c-text-muted)] mb-6">
                Select the level of support you need for this application.
                {selectedPkg.id !== "self_supported" && (
                  <span className="text-[var(--c-green)] font-semibold"> {selectedPkg.name} is pre-selected.</span>
                )}
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                {PACKAGES.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    selected={selectedPackageId}
                    onSelect={setSelectedPackageId}
                  />
                ))}
              </div>

              <p className="mt-4 text-xs text-[var(--c-text-muted)] text-center">
                Want to compare in detail?{" "}
                <Link to="/packages" className="text-[var(--c-green)] hover:underline">
                  View full plan comparison →
                </Link>
              </p>

              <NavButtons onNext={() => setStep(2)} />
            </div>
          )}

          {/* ── Step 2: Visa & Country ──────────────────────────────────── */}
          {step === 2 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--c-text-muted)] font-semibold mb-1">
                Step 2 of 3
              </p>
              <h2 className="text-xl font-bold text-[var(--c-text)] mb-1">Visa &amp; Destination</h2>
              <p className="text-sm text-[var(--c-text-muted)] mb-6">
                Tell us which visa you are applying for and where you are going.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[var(--c-text-mid)] mb-2">
                    Visa Type
                  </label>
                  <Select
                    options={visaOptions}
                    value={visaType ? { value: visaType, label: visaType } : null}
                    placeholder="Search or select visa type"
                    onChange={(s) => setVisaType(s?.value || "")}
                    isSearchable
                    styles={selectStyles}
                    classNamePrefix="vism-select"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--c-text-mid)] mb-2">
                    Destination Country
                  </label>
                  <Select
                    options={countryOptions}
                    value={country ? { value: country, label: country } : null}
                    placeholder="Search or select country"
                    onChange={(s) => setCountry(s?.value || "")}
                    isSearchable
                    styles={selectStyles}
                    classNamePrefix="vism-select"
                  />
                </div>
              </div>

              <NavButtons
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
                nextDisabled={!visaType || !country}
              />
            </div>
          )}

          {/* ── Step 3: Details + Summary ───────────────────────────────── */}
          {step === 3 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--c-text-muted)] font-semibold mb-1">
                Step 3 of 3
              </p>
              <h2 className="text-xl font-bold text-[var(--c-text)] mb-1">Application Details</h2>
              <p className="text-sm text-[var(--c-text-muted)] mb-6">
                Add context to help the AI analysis and your case processor.
              </p>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-[var(--c-text-mid)] mb-2">
                    Application Purpose
                    <span className="ml-2 text-[10px] font-normal text-[var(--c-text-muted)]">(optional)</span>
                  </label>
                  <textarea
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe why you are applying — your situation, employment status, ties to your home country, travel history, etc."
                    className="w-full bg-white border border-[var(--c-border)] text-[var(--c-text)] p-3.5 rounded-[var(--r-lg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--c-green)] focus:border-[var(--c-green)] placeholder-[var(--c-text-muted)] resize-none transition"
                  />
                </div>

                {/* Summary */}
                <div className="rounded-[var(--r-xl)] border border-[var(--c-green-light)] bg-[var(--c-green-bg)] p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--c-green-mid)] mb-4">
                    Application Summary
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--c-text-muted)] font-medium">Plan</span>
                      <span className="font-bold text-[var(--c-text)]">
                        {selectedPkg.name}
                        {selectedPkg.price > 0 && (
                          <span className="text-[var(--c-green)] ml-1">— {selectedPkg.priceDisplay}</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--c-text-muted)] font-medium">Visa Type</span>
                      <span className="font-bold text-[var(--c-text)]">{visaType}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--c-text-muted)] font-medium">Country</span>
                      <span className="font-bold text-[var(--c-text)]">{country}</span>
                    </div>
                    <div className="border-t border-[var(--c-green-light)] pt-3 mt-3">
                      <p className="text-xs text-[var(--c-text-muted)] leading-relaxed">
                        {selectedPkg.price === 0
                          ? "Free plan — no payment required. AI analysis starts immediately after creation."
                          : `You will be prompted to pay ${selectedPkg.priceDisplay} via our secure checkout after creation.`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-[var(--r-lg)] border border-[var(--c-error-border)] bg-[var(--c-error-bg)] px-4 py-3 text-sm text-[var(--c-error)]">
                  {error}
                </div>
              )}

              <NavButtons
                onBack={() => setStep(2)}
                onNext={handleCreate}
                nextLabel={selectedPkg.price === 0 ? "Create Application" : `Create & Pay ${selectedPkg.priceDisplay}`}
                loading={loading}
              />
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

export default Apply;