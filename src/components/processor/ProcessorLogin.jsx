// src/components/processor/ProcessorLogin.jsx
//
// PHASE 3 CHANGE:
// - Field changed from "Username" to "Email" (processors now have email accounts)
// - login() is now async — it calls POST /api/auth/login via ProcessorAuthContext
// - Demo credentials box updated to show the seeded email
// - Everything else (layout, styles, loading spinner, error display) unchanged

import { useState } from "react";
import { Link }     from "react-router-dom";
import { useProcessorAuth } from "../../context/ProcessorAuthContext.jsx";

function ProcessorLogin() {
  const { login } = useProcessorAuth();

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
      // ProcessorProtectedRoute re-renders automatically when isAuthenticated
      // becomes true — no navigate() needed here.
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--c-bg)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <span className="font-display text-3xl font-bold text-[var(--c-green)]">VISM</span>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--c-text-muted)] mt-1">
            Processor Portal
          </p>
        </div>

        <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-2xl)] shadow-[var(--shadow-modal)] p-8">
          <div className="mb-7">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--c-text-muted)] font-semibold mb-2">
              Secure Access
            </p>
            <h2 className="text-2xl font-bold text-[var(--c-text)]">Processor Login</h2>
            <p className="mt-2 text-sm text-[var(--c-text-muted)] leading-relaxed">
              Enter your processor credentials to access the case management dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email — replaces old Username field */}
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
                placeholder="processor@vism.internal"
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
              className="w-full bg-[var(--c-green)] text-white py-3 rounded-[var(--r-lg)] text-sm font-semibold hover:bg-[var(--c-green-mid)] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Updated hint — points to the seeded account, not the old hardcoded creds */}
          <div className="mt-5 rounded-[var(--r-lg)] bg-[var(--c-bg)] border border-[var(--c-border)] px-4 py-3 text-xs text-[var(--c-text-mid)]">
            <p className="font-semibold text-[var(--c-text)] mb-1">Default Credentials</p>
            <p>Email: <span className="text-[var(--c-green)] font-mono font-bold">processor@vism.internal</span></p>
            <p>Password: <span className="text-[var(--c-green)] font-mono font-bold">ChangeMe123!</span></p>
            <p className="mt-1.5 text-[var(--c-text-muted)]">
              Set via <span className="font-mono">PROCESSOR_EMAIL</span> / <span className="font-mono">PROCESSOR_PASS</span> in <span className="font-mono">.env</span>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--c-text-muted)]">
          <Link to="/" className="text-[var(--c-green-mid)] hover:underline underline-offset-2">
            ← Back to Applicant Portal
          </Link>
        </p>

      </div>
    </main>
  );
}

export default ProcessorLogin;