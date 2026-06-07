import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import Documents from "./pages/Documents";
import Tasks from "./pages/Tasks";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/analysis"
          element={<Analysis />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/documents"
          element={<Documents />}
        />

        <Route
          path="/tasks"
          element={<Tasks />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;