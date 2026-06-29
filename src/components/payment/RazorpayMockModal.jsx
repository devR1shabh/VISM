// src/components/payment/RazorpayMockModal.jsx
//
// Mock Razorpay payment modal for Assisted and Concierge plans.
// Shown by Apply.jsx after a paid-tier case is created.
//
// Three states:
//   "form"       — card input form (any values accepted — it's a mock)
//   "processing" — 2-second spinner animation
//   "success"    — 1.5-second success screen, then calls onSuccess
//
// Props:
//   pkg        — package object { id, name, price, priceDisplay }
//   caseId     — MongoDB _id of the just-created case
//   onSuccess  — called with the updatedCase after payment is confirmed
//   onDismiss  — called if the user cancels payment

import { useState, useEffect, useRef } from "react";
import { ShieldCheck, Lock, X }         from "lucide-react";
import { completePayment }              from "../../services/api.js";

// ── Card number formatter — groups into blocks of 4 ──────────────────────────
function formatCardNumber(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.match(/.{1,4}/g)?.join(" ") || digits;
}

// ── Expiry formatter — MM/YY ──────────────────────────────────────────────────
function formatExpiry(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

// ── Input field ───────────────────────────────────────────────────────────────
function PayField({ label, value, onChange, placeholder, maxLength, inputMode = "text", hint }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--c-text-mid)] mb-1.5 uppercase tracking-[0.1em]">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        autoComplete="off"
        className="w-full bg-white border border-[var(--c-border)] text-[var(--c-text)] px-3.5 py-2.5 rounded-[var(--r-lg)] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--c-green)] focus:border-[var(--c-green)] placeholder-[var(--c-text-muted)] transition"
      />
      {hint && (
        <p className="mt-1 text-[10px] text-[var(--c-text-muted)]">{hint}</p>
      )}
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────
function RazorpayMockModal({ pkg, caseId, onSuccess, onDismiss }) {
  const [stage,        setStage]       = useState("form");      // "form" | "processing" | "success"
  const [cardNumber,   setCardNumber]  = useState("");
  const [expiry,       setExpiry]      = useState("");
  const [cvv,          setCvv]         = useState("");
  const [name,         setName]        = useState("");
  const [error,        setError]       = useState("");
  const timerRef = useRef(null);

  // Auto-progress from success → onSuccess callback
  useEffect(() => {
    if (stage === "success") {
      timerRef.current = setTimeout(() => {
        onSuccess();
      }, 1800);
    }
    return () => clearTimeout(timerRef.current);
  }, [stage, onSuccess]);

  const canPay = cardNumber.replace(/\s/g, "").length === 16
              && expiry.length  === 5
              && cvv.length     >= 3
              && name.trim().length > 0;

  const handlePay = async () => {
    if (!canPay) return;
    setError("");
    setStage("processing");

    // Simulate 2-second processing delay
    await new Promise((r) => setTimeout(r, 2000));

    try {
      await completePayment(caseId, {
        amount:    pkg.price,
        packageId: pkg.id,
      });
      setStage("success");
    } catch (err) {
      setStage("form");
      setError(err.message || "Payment failed. Please try again.");
    }
  };

  return (
    // Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm">

      <div className="relative w-full max-w-sm bg-white rounded-[var(--r-2xl)] shadow-[var(--shadow-modal)] overflow-hidden">

        {/* ── Processing state ──────────────────────────────────────────── */}
        {stage === "processing" && (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <div className="w-14 h-14 rounded-full border-4 border-[var(--c-border)] border-t-[var(--c-green)] animate-spin mb-6" />
            <p className="text-base font-bold text-[var(--c-text)] mb-1">Processing Payment</p>
            <p className="text-sm text-[var(--c-text-muted)]">Please wait, do not close this window...</p>
          </div>
        )}

        {/* ── Success state ─────────────────────────────────────────────── */}
        {stage === "success" && (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--c-success-bg)] border-2 border-[var(--c-success-border)] flex items-center justify-center mb-6">
              <ShieldCheck size={28} className="text-[var(--c-success)]" />
            </div>
            <p className="text-lg font-bold text-[var(--c-text)] mb-1">Payment Successful</p>
            <p className="text-sm text-[var(--c-text-muted)] mb-4">
              {pkg.priceDisplay} charged for {pkg.name}
            </p>
            <p className="text-xs text-[var(--c-text-muted)]">Activating your plan...</p>
          </div>
        )}

        {/* ── Form state ───────────────────────────────────────────────── */}
        {stage === "form" && (
          <>
            {/* Header */}
            <div className="bg-[var(--c-green)] px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lock size={14} className="text-white/80" />
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                    Secure Checkout
                  </span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] bg-white/20 border border-white/30 text-white px-2 py-0.5 rounded-full">
                  TEST MODE
                </span>
              </div>

              <div>
                <p className="text-white/70 text-xs uppercase tracking-[0.1em] font-semibold mb-0.5">
                  {pkg.name} Plan
                </p>
                <p className="text-3xl font-bold text-white">{pkg.priceDisplay}</p>
                <p className="text-white/60 text-xs mt-1">One-time application fee · Non-refundable</p>
              </div>
            </div>

            {/* Form body */}
            <div className="p-6 space-y-4">

              <PayField
                label="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
                inputMode="numeric"
                hint="Test mode — use any 16-digit number"
              />

              <div className="grid grid-cols-2 gap-3">
                <PayField
                  label="Expiry"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  maxLength={5}
                  inputMode="numeric"
                />
                <PayField
                  label="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="123"
                  maxLength={4}
                  inputMode="numeric"
                />
              </div>

              <PayField
                label="Cardholder Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
              />

              {error && (
                <div className="rounded-[var(--r-lg)] border border-[var(--c-error-border)] bg-[var(--c-error-bg)] px-4 py-3 text-xs text-[var(--c-error)]">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handlePay}
                disabled={!canPay}
                className="w-full flex items-center justify-center gap-2 rounded-[var(--r-lg)] bg-[var(--c-green)] py-3.5 text-sm font-bold text-white hover:bg-[var(--c-green-mid)] transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm"
              >
                <Lock size={13} />
                Pay {pkg.priceDisplay} Securely
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={onDismiss}
                  className="text-xs text-[var(--c-text-muted)] hover:text-[var(--c-error)] transition underline underline-offset-2"
                >
                  Cancel payment
                </button>
                <div className="flex items-center gap-1.5 text-[10px] text-[var(--c-text-muted)]">
                  <Lock size={10} />
                  <span>256-bit SSL encrypted</span>
                </div>
              </div>

            </div>

            {/* Razorpay footer */}
            <div className="border-t border-[var(--c-border)] bg-[var(--c-bg)] px-6 py-3 flex items-center justify-center gap-2">
              <span className="text-[10px] text-[var(--c-text-muted)]">Powered by</span>
              <span className="text-[11px] font-bold text-[#072654]">Razorpay</span>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default RazorpayMockModal;