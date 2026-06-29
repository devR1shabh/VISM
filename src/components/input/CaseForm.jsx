// src/components/input/CaseForm.jsx
//
// FEATURE 5 CHANGE:
//   Reads selectedPackage from route state (set by Packages.jsx → navigate).
//   Shows a compact package banner above the form fields.
//   Stamps package + packageSelectedAt into every new case payload.
//   Defaults to "self_supported" if no package state is present.

import { useState }                         from "react";
import { useNavigate, useLocation, Link }   from "react-router-dom";
import Select                               from "react-select";

import countries                      from "../../data/countries";
import { useCase, WORKFLOW_STEPS }    from "../../context/CaseContext";
import { useApplicantAuth }           from "../../context/ApplicantAuthContext.jsx";
import { useConfig }                  from "../../context/ConfigContext.jsx";
import { createCase }                 from "../../services/api";
import { getPackageById }             from "../../data/packages.js";

// ── react-select styles — green token system ──────────────────────────────────
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
  menuList:         (base) => ({ ...base, backgroundColor: "#FFFFFF", padding: "4px 0" }),
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

// ── Package banner — shows selected tier above the form ───────────────────────
function PackageBanner({ pkg }) {
  const isFree     = pkg.price === 0;
  const isFeatured = pkg.id === "assisted";
  const isPremium  = pkg.id === "concierge";

  return (
    <div className={`flex items-center justify-between rounded-[var(--r-lg)] border px-4 py-3 mb-2 ${
      isPremium  ? "border-[var(--c-text)] bg-[var(--c-text)]/5"       :
      isFeatured ? "border-[var(--c-green)] bg-[var(--c-green-bg)]"    :
                   "border-[var(--c-border)] bg-[var(--c-bg)]"
    }`}>
      <div className="flex items-center gap-2.5">
        <span className={`text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full ${
          isPremium  ? "bg-[var(--c-text)] text-white"            :
          isFeatured ? "bg-[var(--c-green)] text-white"           :
                       "bg-[var(--c-border)] text-[var(--c-text-muted)]"
        }`}>
          {pkg.name}
        </span>
        <span className="text-sm font-semibold text-[var(--c-text)]">
          {isFree ? "Free" : pkg.priceDisplay}
        </span>
        <span className="text-xs text-[var(--c-text-muted)]">
          {pkg.tagline}
        </span>
      </div>
      <Link
        to="/packages"
        className="text-xs font-semibold text-[var(--c-green)] hover:text-[var(--c-green-mid)] hover:underline underline-offset-2 shrink-0"
      >
        Change plan →
      </Link>
    </div>
  );
}

function CaseForm() {
  const navigate              = useNavigate();
  const location              = useLocation();
  const { setCaseData, clearCase } = useCase();
  const { isAuthenticated }   = useApplicantAuth();
  const { visaTypes }         = useConfig();

  // ── Read selected package from route state ────────────────────────────────
  // Set by Packages.jsx when "Get Started" is clicked.
  // Preserved through register and login redirects.
  // Defaults to "self_supported" (free tier) if not set.
  const packageIdFromState = location.state?.selectedPackage || "self_supported";
  const selectedPkg        = getPackageById(packageIdFromState);

  const [visaType, setVisaType]       = useState("");
  const [country, setCountry]         = useState("");
  const [description, setDescription] = useState("");

  const visaOptions    = visaTypes.map((v) => ({ value: v, label: v }));
  const countryOptions = countries.map((c) => ({ value: c, label: c }));

  const handleAnalyze = async () => {
    if (!visaType || !country) return;

    if (!isAuthenticated) {
      // Pass the selected package through the login redirect
      navigate("/login", {
        state: {
          from:            "/",
          selectedPackage: selectedPkg.id,
        },
      });
      return;
    }

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
        // FEATURE 5: stamp the selected package on case creation
        package:           selectedPkg.id,
        packageSelectedAt: new Date().toISOString(),
        // Self-supported is free — mark as paid immediately
        // Paid tiers will be marked paid by the Razorpay flow (Feature 6)
        paymentStatus:     selectedPkg.price === 0 ? "paid" : "unpaid",
      };

      const savedCase = await createCase(newCase);
      setCaseData({ ...savedCase, workflowStep: WORKFLOW_STEPS.CASE_CREATED });
      navigate("/analysis");
    } catch (error) {
      console.error("Failed to create case:", error);
    }
  };

  return (
    <div className="bg-white border border-[var(--c-border)] rounded-[var(--r-2xl)] p-8 shadow-[var(--shadow-card)] space-y-5">

      {/* ── Package banner ──────────────────────────────────────────────── */}
      <PackageBanner pkg={selectedPkg} />

      {/* ── Visa type ───────────────────────────────────────────────────── */}
      <div>
        <label className="block mb-2 text-sm font-semibold text-[var(--c-text-mid)]">
          Visa Type
        </label>
        <Select
          options={visaOptions}
          placeholder="Search or Select Visa Type"
          onChange={(selected) => setVisaType(selected?.value || "")}
          isSearchable
          styles={selectStyles}
          classNamePrefix="vism-select"
        />
      </div>

      {/* ── Destination country ─────────────────────────────────────────── */}
      <div>
        <label className="block mb-2 text-sm font-semibold text-[var(--c-text-mid)]">
          Destination Country
        </label>
        <Select
          options={countryOptions}
          placeholder="Search or Select Country"
          onChange={(selected) => setCountry(selected?.value || "")}
          isSearchable
          styles={selectStyles}
          classNamePrefix="vism-select"
        />
      </div>

      {/* ── Case description ────────────────────────────────────────────── */}
      <div>
        <label className="block mb-2 text-sm font-semibold text-[var(--c-text-mid)]">
          Case Description
        </label>
        <textarea
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-white border border-[var(--c-border)] text-[var(--c-text)] p-3.5 rounded-[var(--r-lg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--c-green)] focus:border-[var(--c-green)] placeholder-[#9CA3AF] transition resize-none"
          placeholder="Describe the immigration or visa case in detail..."
        />
      </div>

      {/* ── Submit ──────────────────────────────────────────────────────── */}
      <button
        onClick={handleAnalyze}
        disabled={!visaType || !country}
        className="w-full bg-[var(--c-green)] text-white py-3.5 rounded-[var(--r-lg)] font-semibold text-sm hover:bg-[var(--c-green-mid)] active:scale-[0.99] transition duration-150 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
      >
        {isAuthenticated ? "Analyse Case" : "Sign In to Analyse Case"}
      </button>

    </div>
  );
}

export default CaseForm;