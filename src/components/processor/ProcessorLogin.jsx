// src/components/processor/ProcessorLogin.jsx

import { useState } from "react";
import { useProcessorAuth } from "../../context/ProcessorAuthContext";

function ProcessorLogin() {
  const { login } = useProcessorAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const success = login(username.trim(), password);
    if (!success) {
      setError("Invalid credentials. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#061A28] text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#22E7C5] to-[#1AC9D6] shadow-[0_18px_40px_-28px_rgba(34,231,197,0.85)]">
            <span className="text-xl font-black tracking-[0.2em] text-slate-950">V</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white">VISM</h1>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Processor Portal</p>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-[#083D4A]/80 p-8 shadow-[0_40px_120px_-40px_rgba(34,231,197,0.25)] backdrop-blur-xl">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.32em] text-[#22E7C5] mb-2">Secure Access</p>
            <h2 className="text-2xl font-bold text-white">Processor Login</h2>
            <p className="mt-2 text-sm text-[#B8C5D1]">
              Enter your processor credentials to access the case management dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#B8C5D1] mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="processor"
                className="w-full bg-[#061A28] border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22E7C5] focus:border-[#22E7C5] placeholder-[#B8C5D1]/50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#B8C5D1] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-[#061A28] border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22E7C5] focus:border-[#22E7C5] placeholder-[#B8C5D1]/50 transition"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full bg-[#22E7C5] text-[#061A28] py-3 rounded-xl font-semibold hover:bg-[#39F5D5] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#22E7C5]/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#061A28]/40 border-t-[#061A28] rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 rounded-xl bg-white/5 border border-white/8 px-4 py-3 text-xs text-[#B8C5D1]">
            <p className="font-semibold text-white mb-1">Demo Credentials</p>
            <p>Username: <span className="text-[#22E7C5] font-mono">processor</span></p>
            <p>Password: <span className="text-[#22E7C5] font-mono">vism2024</span></p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#B8C5D1]">
          <a href="/" className="text-[#22E7C5] hover:underline">← Back to Applicant Portal</a>
        </p>
      </div>
    </main>
  );
}

export default ProcessorLogin;