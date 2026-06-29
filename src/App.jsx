// src/App.jsx
//
// ONBOARDING REDESIGN CHANGE:
//   Added /packages/:packageId (PackageDetail) — public route
//   Added /apply (Apply wizard) — protected route
//   Updated PUBLIC_ROUTES to include new public pages

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar                     from "./components/layout/Navbar.jsx";
import ProtectedRoute             from "./components/layout/ProtectedRoute.jsx";
import ApplicantProtectedRoute    from "./components/layout/ApplicantProtectedRoute.jsx";
import ScrollToTop                from "./components/layout/ScrollToTop.jsx";
import ProcessorProtectedRoute    from "./components/processor/ProcessorProtectedRoute.jsx";

import Home                from "./pages/Home.jsx";
import ApplicantLogin      from "./pages/ApplicantLogin.jsx";
import ApplicantRegister   from "./pages/ApplicantRegister.jsx";
import ApplicantDashboard  from "./pages/ApplicantDashboard.jsx";
import Packages            from "./pages/Packages.jsx";
import PackageDetail       from "./pages/PackageDetail.jsx";
import Apply               from "./pages/Apply.jsx";
import Analysis            from "./pages/Analysis.jsx";
import Documents           from "./pages/Documents.jsx";
import Questionnaire       from "./pages/Questionnaire.jsx";
import Journey             from "./pages/Journey.jsx";
import Dashboard           from "./pages/Dashboard.jsx";
import ApplicationReady    from "./pages/ApplicationReady.jsx";
import ProcessorDashboard  from "./pages/ProcessorDashboard.jsx";
import ProcessorCaseDetail from "./pages/ProcessorCaseDetail.jsx";

import Navi from "./components/navi/Navi.jsx";

const NAVI_ROUTES            = ["/analysis", "/documents", "/questionnaire", "/journey"];
const PROCESSOR_ROUTE_PREFIX = "/processor";

// Pages where the applicant navbar is NOT shown
// (public marketing pages + auth pages + wizard pages)
const PUBLIC_ROUTES = ["/", "/login", "/register", "/packages", "/apply"];

function AppContent() {
  const location = useLocation();

  const isProcessorRoute = location.pathname.startsWith(PROCESSOR_ROUTE_PREFIX);
  // Also treat /packages/:id as public (no nav)
  const isPackageDetail  = location.pathname.startsWith("/packages/");
  const isPublicRoute    = PUBLIC_ROUTES.includes(location.pathname) || isPackageDetail;
  const showNavi         = !isProcessorRoute && NAVI_ROUTES.includes(location.pathname);
  const showApplicantNav = !isProcessorRoute && !isPublicRoute;

  return (
    <div className="min-h-screen bg-[var(--c-bg)]">
      <ScrollToTop />

      {showApplicantNav && <Navbar />}

      <Routes>

        {/* ── Public / marketing ─────────────────────────────────────────── */}
        <Route path="/"         element={<Home />}              />
        <Route path="/login"    element={<ApplicantLogin />}    />
        <Route path="/register" element={<ApplicantRegister />} />

        {/* ── Package pages — fully public ───────────────────────────────── */}
        <Route path="/packages"            element={<Packages />}      />
        <Route path="/packages/:packageId" element={<PackageDetail />} />

        {/* ── Applicant: cases dashboard ─────────────────────────────────── */}
        <Route
          path="/my-cases"
          element={
            <ApplicantProtectedRoute>
              <ApplicantDashboard />
            </ApplicantProtectedRoute>
          }
        />

        {/* ── Applicant: new application wizard ──────────────────────────── */}
        <Route
          path="/apply"
          element={
            <ApplicantProtectedRoute>
              <Apply />
            </ApplicantProtectedRoute>
          }
        />

        {/* ── Applicant: active case workflow ────────────────────────────── */}
        <Route
          path="/analysis"
          element={
            <ApplicantProtectedRoute>
              <ProtectedRoute>
                <Analysis />
              </ProtectedRoute>
            </ApplicantProtectedRoute>
          }
        />

        <Route
          path="/documents"
          element={
            <ApplicantProtectedRoute>
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            </ApplicantProtectedRoute>
          }
        />

        <Route
          path="/questionnaire"
          element={
            <ApplicantProtectedRoute>
              <ProtectedRoute>
                <Questionnaire />
              </ProtectedRoute>
            </ApplicantProtectedRoute>
          }
        />

        <Route
          path="/journey"
          element={
            <ApplicantProtectedRoute>
              <ProtectedRoute>
                <Journey />
              </ProtectedRoute>
            </ApplicantProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ApplicantProtectedRoute>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </ApplicantProtectedRoute>
          }
        />

        <Route
          path="/application-ready"
          element={
            <ApplicantProtectedRoute>
              <ProtectedRoute>
                <ApplicationReady />
              </ProtectedRoute>
            </ApplicantProtectedRoute>
          }
        />

        {/* ── Processor routes ────────────────────────────────────────────── */}
        <Route
          path="/processor"
          element={
            <ProcessorProtectedRoute>
              <ProcessorDashboard />
            </ProcessorProtectedRoute>
          }
        />

        <Route
          path="/processor/case/:id"
          element={
            <ProcessorProtectedRoute>
              <ProcessorCaseDetail />
            </ProcessorProtectedRoute>
          }
        />

      </Routes>

      {showNavi && <Navi />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;