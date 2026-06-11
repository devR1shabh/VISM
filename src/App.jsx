// src/App.jsx

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";

import Home from "./pages/Home";
import Analysis from "./pages/Analysis";
import Documents from "./pages/Documents";
import Journey from "./pages/Journey";
import Dashboard from "./pages/Dashboard";
import ApplicationReady from "./pages/ApplicationReady";

import Navi from "./components/navi/Navi";

const NAVI_ROUTES = ["/analysis", "/documents", "/journey"];

function AppContent() {
  const location = useLocation();
  const showNavi = NAVI_ROUTES.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <Routes>
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