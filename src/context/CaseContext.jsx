// src/context/CaseContext.jsx

import {
  createContext,
  useContext,
  useState,
} from "react";

import {
  normalizeUploadedDocuments,
  upsertUploadedDocument,
} from "../utils/documentUtils.js";

const CaseContext = createContext();

const STORAGE_KEYS = {
  caseData:          "vism_caseData",
  uploadedDocuments: "vism_uploadedDocuments",
  activityFeed:      "vism_activityFeed",
  naviMessages:      "vism_naviMessages",
  // Stores { fullName, passportNumber } of the last successfully-extracted passport.
  // Used to detect identity changes on re-upload.
  applicantIdentity: "vism_applicantIdentity",
};

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable
  }
}

// ── Workflow step constants (exported for use in guards) ─────────────────────
// 0 = no active case
// 1 = case created  → unlocks /analysis
// 2 = analysis done → unlocks /documents
// 3 = documents done → unlocks /journey
// 4 = journey done  → unlocks /dashboard
// 5 = all done      → unlocks /application-ready + PDF download
export const WORKFLOW_STEPS = {
  NONE:           0,
  CASE_CREATED:   1,
  ANALYSIS_DONE:  2,
  DOCUMENTS_DONE: 3,
  JOURNEY_DONE:   4,
  ALL_DONE:       5,
};

export function CaseProvider({ children }) {
  const [caseData, setCaseDataRaw] = useState(() =>
    loadFromStorage(STORAGE_KEYS.caseData, null)
  );

  const [uploadedDocuments, setUploadedDocumentsRaw] = useState(() =>
    normalizeUploadedDocuments(
      loadFromStorage(STORAGE_KEYS.uploadedDocuments, [])
    )
  );

  const [activityFeed, setActivityFeedRaw] = useState(() =>
    loadFromStorage(STORAGE_KEYS.activityFeed, [])
  );

  const [naviMessages, setNaviMessagesRaw] = useState(() =>
    loadFromStorage(STORAGE_KEYS.naviMessages, [])
  );

  // { fullName: string | null, passportNumber: string | null }
  const [applicantIdentity, setApplicantIdentityRaw] = useState(() =>
    loadFromStorage(STORAGE_KEYS.applicantIdentity, {
      fullName: null,
      passportNumber: null,
    })
  );

  // ── setCaseData ────────────────────────────────────────────────────────────
  const setCaseData = (updater) => {
    setCaseDataRaw((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveToStorage(STORAGE_KEYS.caseData, next);
      return next;
    });
  };

  // ── setWorkflowStep ────────────────────────────────────────────────────────
  // Advances (or sets) the workflowStep on the current caseData.
  // Only advances forward — never regresses.
  const setWorkflowStep = (step) => {
    setCaseDataRaw((prev) => {
      if (!prev) return prev;
      // Only advance, never regress
      if ((prev.workflowStep ?? 0) >= step) return prev;
      const next = { ...prev, workflowStep: step };
      saveToStorage(STORAGE_KEYS.caseData, next);
      return next;
    });
  };

  // ── addDocument ────────────────────────────────────────────────────────────
  // Always upserts (one record per requiredDocument type — no duplicates).
  const addDocument = (document) => {
    setUploadedDocumentsRaw((prev) => {
      const next = upsertUploadedDocument(prev, document);
      saveToStorage(STORAGE_KEYS.uploadedDocuments, next);
      return next;
    });
  };

  // ── addActivity ────────────────────────────────────────────────────────────
  const addActivity = (type, message) => {
    const activity = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toISOString(),
    };
    setActivityFeedRaw((prev) => {
      const next = [activity, ...prev];
      saveToStorage(STORAGE_KEYS.activityFeed, next);
      return next;
    });
  };

  // ── clearDocuments ─────────────────────────────────────────────────────────
  const clearDocuments = () => {
    setUploadedDocumentsRaw([]);
    saveToStorage(STORAGE_KEYS.uploadedDocuments, []);
  };

  // ── clearActivity ──────────────────────────────────────────────────────────
  const clearActivity = () => {
    setActivityFeedRaw([]);
    saveToStorage(STORAGE_KEYS.activityFeed, []);
  };

  // ── setNaviMessages ────────────────────────────────────────────────────────
  const setNaviMessages = (updater) => {
    setNaviMessagesRaw((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveToStorage(STORAGE_KEYS.naviMessages, next);
      return next;
    });
  };

  // ── clearNaviMessages ──────────────────────────────────────────────────────
  const clearNaviMessages = () => {
    setNaviMessagesRaw([]);
    saveToStorage(STORAGE_KEYS.naviMessages, []);
  };

  // ── onPassportReplaced ─────────────────────────────────────────────────────
  /**
   * Called by PassportUploadSection when a passport with a DIFFERENT identity
   * (name OR passport number) is detected.
   *
   * Behaviour:
   *  - Clears Navi conversation so a fresh personalised greeting is shown.
   *  - Updates the stored applicant identity to the new passport.
   *  - All other case data (case info, documents, activity) is preserved.
   *
   * When the SAME passport is re-uploaded (same name + number), this function
   * is NOT called — the conversation is preserved.
   *
   * @param {{ fullName: string, passportNumber: string } | null} newIdentity
   */
  const onPassportReplaced = (newIdentity = null) => {
    // Wipe Navi conversation
    setNaviMessagesRaw([]);
    saveToStorage(STORAGE_KEYS.naviMessages, []);

    // Update stored identity
    if (newIdentity) {
      const updated = {
        fullName:       newIdentity.fullName       ?? null,
        passportNumber: newIdentity.passportNumber ?? null,
      };
      setApplicantIdentityRaw(updated);
      saveToStorage(STORAGE_KEYS.applicantIdentity, updated);
    }
  };

  // ── updateApplicantIdentity ────────────────────────────────────────────────
  /**
   * Called by PassportUploadSection after successful extraction when the
   * identity has NOT changed (same applicant re-uploading their passport).
   * Keeps the stored identity fresh without touching Navi messages.
   *
   * @param {{ fullName: string, passportNumber: string }} identity
   */
  const updateApplicantIdentity = (identity) => {
    const updated = {
      fullName:       identity.fullName       ?? null,
      passportNumber: identity.passportNumber ?? null,
    };
    setApplicantIdentityRaw(updated);
    saveToStorage(STORAGE_KEYS.applicantIdentity, updated);
  };

  // ── clearCase ──────────────────────────────────────────────────────────────
  const clearCase = () => {
    setCaseDataRaw(null);
    saveToStorage(STORAGE_KEYS.caseData, null);

    setUploadedDocumentsRaw([]);
    saveToStorage(STORAGE_KEYS.uploadedDocuments, []);

    setActivityFeedRaw([]);
    saveToStorage(STORAGE_KEYS.activityFeed, []);

    setNaviMessagesRaw([]);
    saveToStorage(STORAGE_KEYS.naviMessages, []);

    const emptyIdentity = { fullName: null, passportNumber: null };
    setApplicantIdentityRaw(emptyIdentity);
    saveToStorage(STORAGE_KEYS.applicantIdentity, emptyIdentity);
  };

  // ── Derived: current workflow step ─────────────────────────────────────────
  const workflowStep = caseData?.workflowStep ?? WORKFLOW_STEPS.NONE;

  return (
    <CaseContext.Provider
      value={{
        caseData,
        setCaseData,

        workflowStep,
        setWorkflowStep,

        uploadedDocuments,
        addDocument,
        clearDocuments,

        activityFeed,
        addActivity,
        clearActivity,

        naviMessages,
        setNaviMessages,
        clearNaviMessages,

        applicantIdentity,
        onPassportReplaced,
        updateApplicantIdentity,

        clearCase,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}

export function useCase() {
  return useContext(CaseContext);
}