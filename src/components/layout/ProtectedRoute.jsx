import { Navigate, useLocation } from "react-router-dom";
import { useCase } from "../../context/CaseContext";

function ProtectedRoute({ children }) {
  const { caseData } = useCase();
  const location = useLocation();

  if (!caseData) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          from: location.pathname,
          message:
            "Please create and analyze a case before accessing this section.",
        }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
