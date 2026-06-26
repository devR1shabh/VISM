// src/pages/ApplicantRegister.jsx
//
// Registration page for new applicants.
// Identical design system to ApplicantLogin.jsx.
// On success, redirects to home — the user is already logged in.

import { useState }              from "react";
import { Link, useNavigate }     from "react-router-dom";
import { useApplicantAuth }      from "../context/ApplicantAuthContext.jsx";

function ApplicantRegister() {
  const { register } = useApplicantAuth();
  const navigate     = useNavigate();

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ── Client-side validation ─────────────────────────────────────────────
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await register(name.trim(), email.trim(), password);
      // After register, user is logged in — send to home to create first case
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
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
            <h1 className="text-2xl font-bold text-[var(--c-text)]">Create Account</h1>
            <p className="mt-2 text-sm text-[var(--c-text-muted)] leading-relaxed">
              Create an account to manage your visa applications and track their progress.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-[var(--c-text-mid)] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Jane Doe"
                className="w-full bg-[var(--c-card)] border border-[var(--c-border)] text-[var(--c-text)] px-4 py-3 rounded-[var(--r-lg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--c-green)] focus:border-[var(--c-green)] placeholder-[var(--c-text-muted)] transition"
              />
            </div>

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
                <span className="ml-2 text-[10px] font-normal text-[var(--c-text-muted)]">
                  (min. 8 characters)
                </span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full bg-[var(--c-card)] border border-[var(--c-border)] text-[var(--c-text)] px-4 py-3 rounded-[var(--r-lg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--c-green)] focus:border-[var(--c-green)] placeholder-[var(--c-text-muted)] transition"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-[var(--c-text-mid)] mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                className={`w-full bg-[var(--c-card)] border text-[var(--c-text)] px-4 py-3 rounded-[var(--r-lg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--c-green)] focus:border-[var(--c-green)] placeholder-[var(--c-text-muted)] transition ${
                  confirm && confirm !== password
                    ? "border-[var(--c-error)] bg-[var(--c-error-bg)]"
                    : "border-[var(--c-border)]"
                }`}
              />
              {confirm && confirm !== password && (
                <p className="mt-1.5 text-xs text-[var(--c-error)]">
                  Passwords do not match.
                </p>
              )}
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
              disabled={loading || !name || !email || !password || !confirm}
              className="w-full bg-[var(--c-green)] text-white py-3 rounded-[var(--r-lg)] text-sm font-semibold hover:bg-[var(--c-green-mid)] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* ── Footer link ──────────────────────────────────────────── */}
          <p className="mt-6 text-center text-sm text-[var(--c-text-muted)]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[var(--c-green)] hover:text-[var(--c-green-mid)] hover:underline underline-offset-2"
            >
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}

export default ApplicantRegister;