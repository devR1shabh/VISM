// src/pages/ApplicantLogin.jsx
//
// ONBOARDING REDESIGN CHANGE:
//   Shows a success banner when arriving from /register.
//   Reads pending package from sessionStorage.
//   After login: navigates to /apply if package in session, else /my-cases.

import { useState }                         from "react";
import { Link, useNavigate, useLocation }   from "react-router-dom";
import { useApplicantAuth }                 from "../context/ApplicantAuthContext.jsx";
import { getPackageById }                   from "../data/packages.js";

const PENDING_PACKAGE_KEY = "vism_pending_package";

function ApplicantLogin() {
  const { login }  = useApplicantAuth();
  const navigate   = useNavigate();
  const location   = useLocation();

  // Success state from register redirect
  const registered      = location.state?.registered      || false;
  const registeredName  = location.state?.registeredName  || "";
  const registeredEmail = location.state?.registeredEmail || "";

  // Read pending package from sessionStorage for context banner
  const pendingPackageId = sessionStorage.getItem(PENDING_PACKAGE_KEY) || null;
  const pendingPkg       = pendingPackageId ? getPackageById(pendingPackageId) : null;
  const showBanner       = pendingPkg && pendingPkg.id !== "self_supported";

  const [email, setEmail]       = useState(registeredEmail);
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email.trim(), password);

      // If there's a pending package in sessionStorage, go to the Apply wizard.
      // Otherwise go to the cases dashboard.
      const hasPendingPackage = Boolean(sessionStorage.getItem(PENDING_PACKAGE_KEY));
      navigate(hasPendingPackage ? "/apply" : "/my-cases", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--c-bg)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* ── Brand ────────────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--c-green)] shadow-sm">
              <span className="text-lg font-black tracking-[0.1em] text-white">V</span>
            </div>
            <span className="font-display text-2xl font-bold text-[var(--c-green)] mt-2">VISM</span>
          </Link>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--c-text-muted)] mt-1">
            Visa &amp; Immigration Services
          </p>
        </div>

        {/* ── Registration success banner ───────────────────────────────── */}
        {registered && (
          <div className="mb-4 rounded-[var(--r-lg)] border border-[var(--c-success-border)] bg-[var(--c-success-bg)] px-4 py-3">
            <p className="text-sm font-semibold text-[var(--c-success)]">
              Account created{registeredName ? `, ${registeredName}` : ""}!
            </p>
            <p className="text-xs text-[var(--c-success)] mt-0.5 opacity-80">
              Please sign in to continue your application.
            </p>
          </div>
        )}

        {/* ── Package context banner ────────────────────────────────────── */}
        {showBanner && (
          <div className="mb-4 flex items-center justify-between rounded-[var(--r-lg)] border border-[var(--c-green)] bg-[var(--c-green-bg)] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] bg-[var(--c-green)] text-white px-2 py-0.5 rounded-full">
                {pendingPkg.name}
              </span>
              <span className="text-sm font-semibold text-[var(--c-green)]">
                {pendingPkg.priceDisplay} selected
              </span>
            </div>
            <Link
              to="/packages"
              className="text-xs text-[var(--c-green-mid)] hover:underline underline-offset-2"
            >
              Change →
            </Link>
          </div>
        )}

        {/* ── Card ─────────────────────────────────────────────────────── */}
        <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-2xl)] shadow-[var(--shadow-modal)] p-8">

          <div className="mb-7">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--c-text-muted)] font-semibold mb-2">
              Applicant Portal
            </p>
            <h1 className="text-2xl font-bold text-[var(--c-text)]">
              {registered ? "Welcome to VISM" : "Sign In"}
            </h1>
            <p className="mt-2 text-sm text-[var(--c-text-muted)] leading-relaxed">
              {registered
                ? "Sign in to start your visa application."
                : "Access your visa cases, documents, and application status."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-semibold text-[var(--c-text-mid)] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full bg-[var(--c-card)] border border-[var(--c-border)] text-[var(--c-text)] px-4 py-3 rounded-[var(--r-lg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--c-green)] focus:border-[var(--c-green)] placeholder-[var(--c-text-muted)] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--c-text-mid)] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-[var(--c-card)] border border-[var(--c-border)] text-[var(--c-text)] px-4 py-3 rounded-[var(--r-lg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--c-green)] focus:border-[var(--c-green)] placeholder-[var(--c-text-muted)] transition"
              />
            </div>

            {error && (
              <div className="rounded-[var(--r-lg)] border border-[var(--c-error-border)] bg-[var(--c-error-bg)] px-4 py-3 text-sm text-[var(--c-error)]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-[var(--c-green)] text-white py-3 rounded-[var(--r-lg)] text-sm font-semibold hover:bg-[var(--c-green-mid)] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--c-text-muted)]">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[var(--c-green)] hover:text-[var(--c-green-mid)] hover:underline underline-offset-2"
            >
              Create one
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--c-text-muted)]">
          Are you a processor?{" "}
          <Link to="/processor" className="text-[var(--c-green-mid)] hover:underline underline-offset-2">
            Go to Processor Portal →
          </Link>
        </p>

      </div>
    </main>
  );
}

export default ApplicantLogin;