import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } catch (e) {
      // fallback for environments where window is unavailable
      try {
        window.scrollTo(0, 0);
      } catch (err) {
        /* noop */
      }
    }
  }, [pathname]);

  return null;
}
