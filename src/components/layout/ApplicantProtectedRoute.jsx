// src/components/layout/ApplicantProtectedRoute.jsx
//
// TRUE authentication guard for applicant routes.
//
// This is DIFFERENT from the existing ProtectedRoute.jsx which only checks
// workflow step progress. This guard checks JWT authentication first.
//
// Behaviour:
//   - While the initial /me check is in flight (isLoading) → show spinner
//   - If not authenticated → redirect to /login, preserving the intended URL
//     so we can redirect back after login
//   - If authenticated → render children
//
// Composed with the existing ProtectedRoute (workflow-step guard) in App.jsx:
//   <ApplicantProtectedRoute>      ← checks: are you logged in?
//     <ProtectedRoute>             ← checks: have you completed the workflow step?
//       <Documents />
//     </ProtectedRoute>
//   </ApplicantProtectedRoute>

import { Navigate, useLocation } from "react-router-dom";
import { useApplicantAuth }      from "../../context/ApplicantAuthContext.jsx";

function ApplicantProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useApplicantAuth();
  const location = useLocation();

  // ── Loading state ─────────────────────────────────────────────────────────
  // The context is verifying the stored JWT with the server on first render.
  // Show a minimal spinner rather than flashing a redirect.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--c-bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--c-border)] border-t-[var(--c-green)] rounded-full animate-spin" />
          <p className="text-xs text-[var(--c-text-muted)] uppercase tracking-[0.15em]">
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  // ── Not authenticated ─────────────────────────────────────────────────────
  // Redirect to /login. Pass the attempted path in state so login can
  // redirect back after a successful sign-in.
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // ── Authenticated ─────────────────────────────────────────────────────────
  return children;
}

export default ApplicantProtectedRoute;