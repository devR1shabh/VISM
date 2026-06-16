// src/components/processor/ProcessorProtectedRoute.jsx

import { useProcessorAuth } from "../../context/ProcessorAuthContext";
import ProcessorLogin from "./ProcessorLogin";

function ProcessorProtectedRoute({ children }) {
  const { isAuthenticated } = useProcessorAuth();

  if (!isAuthenticated) {
    return <ProcessorLogin />;
  }

  return children;
}

export default ProcessorProtectedRoute;