// src/App.jsx

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
const PUBLIC_ROUTES          = ["/", "/login", "/register"];

function AppContent() {
  const location = useLocation();

  const isProcessorRoute = location.pathname.startsWith(PROCESSOR_ROUTE_PREFIX);
  const isPublicRoute    = PUBLIC_ROUTES.includes(location.pathname);
  const showNavi         = !isProcessorRoute && NAVI_ROUTES.includes(location.pathname);
  // Show the applicant navbar everywhere except processor routes and pure public pages
  const showApplicantNav = !isProcessorRoute && !isPublicRoute;

  return (
    <div className="min-h-screen bg-[var(--c-bg)]">
      <ScrollToTop />

      {showApplicantNav && <Navbar />}

      <Routes>

        {/* ── Public routes ─────────────────────────────────────────── */}
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<ApplicantLogin />} />
        <Route path="/register" element={<ApplicantRegister />} />

        {/* ── Applicant: multi-case dashboard ───────────────────────── */}
        {/* Phase 4: new route — shows ALL the user's cases */}
        <Route
          path="/my-cases"
          element={
            <ApplicantProtectedRoute>
              <ApplicantDashboard />
            </ApplicantProtectedRoute>
          }
        />

        {/* ── Applicant: active-case workflow routes ─────────────────── */}
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

        {/* ── Processor routes ───────────────────────────────────────── */}
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