// src/App.jsx

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar                  from "./components/layout/Navbar";
import ProtectedRoute          from "./components/layout/ProtectedRoute";
import ScrollToTop             from "./components/layout/ScrollToTop";
import ProcessorProtectedRoute from "./components/processor/ProcessorProtectedRoute";

import Home                from "./pages/Home";
import Analysis            from "./pages/Analysis";
import Documents           from "./pages/Documents";
import Journey             from "./pages/Journey";
import Dashboard           from "./pages/Dashboard";
import ApplicationReady    from "./pages/ApplicationReady";
import ProcessorDashboard  from "./pages/ProcessorDashboard";
import ProcessorCaseDetail from "./pages/ProcessorCaseDetail";

import Navi from "./components/navi/Navi";

const NAVI_ROUTES            = ["/analysis", "/documents", "/journey"];
const PROCESSOR_ROUTE_PREFIX = "/processor";

function AppContent() {
  const location = useLocation();

  const isProcessorRoute = location.pathname.startsWith(PROCESSOR_ROUTE_PREFIX);
  const showNavi         = !isProcessorRoute && NAVI_ROUTES.includes(location.pathname);
  const showApplicantNav = !isProcessorRoute;

  return (
    <div className="min-h-screen bg-[var(--c-bg)]">
      <ScrollToTop />

      {showApplicantNav && <Navbar />}

      <Routes>
        {/* Applicant routes */}
        <Route path="/" element={<Home />} />

        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <Analysis />
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/journey"
          element={
            <ProtectedRoute>
              <Journey />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/application-ready"
          element={
            <ProtectedRoute>
              <ApplicationReady />
            </ProtectedRoute>
          }
        />

        {/* Processor routes */}
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