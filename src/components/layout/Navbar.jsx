import { NavLink } from "react-router-dom";
import { useCase } from "../../context/CaseContext";

const NAV_ITEMS = [
  { to: "/analysis", label: "Analysis" },
  { to: "/documents", label: "Documents" },
  { to: "/tasks", label: "Tasks" },
  { to: "/dashboard", label: "Dashboard" },
];

function LockIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 ml-1.5 shrink-0 opacity-80"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function getNavItemClass(isActive, isDisabled) {
  if (isDisabled) {
    return "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed select-none";
  }

  if (isActive) {
    return "inline-flex items-center px-3 py-2 rounded-md text-sm font-semibold text-blue-700 bg-blue-50 border-b-2 border-blue-600";
  }

  return "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors";
}

function Navbar() {
  const { caseData } = useCase();
  const isCaseReady = Boolean(caseData);

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-1 sm:gap-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive
              ? "mr-4 sm:mr-6 text-lg font-bold text-blue-700 border-b-2 border-blue-600 pb-0.5"
              : "mr-4 sm:mr-6 text-lg font-bold text-blue-600 hover:text-blue-700 transition-colors"
          }
        >
          BlueprintAI
        </NavLink>

        {NAV_ITEMS.map((item) => {
          if (!isCaseReady) {
            return (
              <span
                key={item.to}
                className={getNavItemClass(false, true)}
                title="Create and analyze a case to unlock this section"
                aria-disabled="true"
              >
                {item.label}
                <LockIcon />
              </span>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                getNavItemClass(isActive, false)
              }
            >
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;
