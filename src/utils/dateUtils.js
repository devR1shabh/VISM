// src/utils/dateUtils.js
//
// Shared date formatting utilities.
//
// Phase 6 cleanup: formatDate() and formatDateTime() were copy-pasted
// into 8 separate components. Centralised here so any format change
// (locale, timezone, display style) is made in one place.
//
// Exported functions:
//   formatDate(iso)     — "15 Jun 2025"         (date only)
//   formatDateTime(iso) — "15 Jun 2025, 14:32"  (date + time)

/**
 * Formats an ISO date string as a short date.
 * Returns "—" for missing values (safe for table cells).
 * @param {string|Date|null} iso
 * @returns {string}
 */
export function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day:   "2-digit",
      month: "short",
      year:  "numeric",
    });
  } catch {
    return "—";
  }
}

/**
 * Formats an ISO date string as a date + time.
 * Returns "" for missing values (safe for inline labels).
 * @param {string|Date|null} iso
 * @returns {string}
 */
export function formatDateTime(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day:    "2-digit",
      month:  "short",
      year:   "numeric",
      hour:   "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}