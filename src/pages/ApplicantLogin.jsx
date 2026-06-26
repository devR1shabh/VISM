// src/pages/ApplicantLogin.jsx
//
// Login page for applicants.
// Matches the existing VISM design system exactly (tokens, radius, shadows).
// After a successful login, redirects to wherever the user was trying to go,
// or to "/" (home) if they came here directly.

import { useState }                       from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApplicantAuth }               from "../context/ApplicantAuthContext.jsx";

function ApplicantLogin() {
  const { login }    = useApplicantAuth();
  const navigate     = useNavigate();
  const location     = useLocation();

  // If the user was redirected here from a protected route, send them back
  // after login. Otherwise send them to home.
  const from = location.state?.from || "/";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
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
        <div className="text-center mb-10">
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

        {/* ── Card ─────────────────────────────────────────────────────── */}
        <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-2xl)] shadow-[var(--shadow-modal)] p-8">

          <div className="mb-7">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--c-text-muted)] font-semibold mb-2">
              Applicant Portal
            </p>
            <h1 className="text-2xl font-bold text-[var(--c-text)]">Sign In</h1>
            <p className="mt-2 text-sm text-[var(--c-text-muted)] leading-relaxed">
              Access your visa cases, documents, and application status.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
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

            {/* Password */}
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

            {/* Error */}
            {error && (
              <div className="rounded-[var(--r-lg)] border border-[var(--c-error-border)] bg-[var(--c-error-bg)] px-4 py-3 text-sm text-[var(--c-error)]">
                {error}
              </div>
            )}

            {/* Submit */}
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

          {/* ── Footer links ─────────────────────────────────────────── */}
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

        {/* ── Processor link ────────────────────────────────────────── */}
        <p className="mt-6 text-center text-xs text-[var(--c-text-muted)]">
          Are you a processor?{" "}
          <Link
            to="/processor"
            className="text-[var(--c-green-mid)] hover:underline underline-offset-2"
          >
            Go to Processor Portal →
          </Link>
        </p>

      </div>
    </main>
  );
}

export default ApplicantLogin;