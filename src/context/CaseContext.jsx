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
  // Stores the completed questionnaire answers object.
  questionnaire:     "vism_questionnaire",
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
// 1 = case created       → unlocks /analysis
// 2 = analysis done      → unlocks /documents
// 3 = documents done     → unlocks /questionnaire
// 4 = questionnaire done → unlocks /journey
// 5 = journey done       → unlocks /dashboard
// 6 = all done           → unlocks /application-ready + PDF download
export const WORKFLOW_STEPS = {
  NONE:               0,
  CASE_CREATED:       1,
  ANALYSIS_DONE:      2,
  DOCUMENTS_DONE:     3,
  QUESTIONNAIRE_DONE: 4,
  JOURNEY_DONE:       5,
  ALL_DONE:           6,
};

export function CaseProvider({ children }) {
  // ── Initialize state from localStorage ───────────────────────────────────
  // PHASE 4 CHANGE: Removed the "fresh session" wipe that intentionally
  // destroyed case state on every new browser tab.
  //
  // That wipe was a workaround for the old anonymous session model where
  // each tab needed a clean slate because there was no user account to scope
  // cases to. Now that applicants have real JWT-authenticated accounts:
  //
  //   - The active case persists correctly across tabs and refreshes.
  //   - clearCase() is called explicitly on logout (Navbar.jsx) to wipe state
  //     when the user actually signs out — not on every new tab open.
  //   - If a different applicant logs in on the same machine, logout clears
  //     the previous user's case before the new session starts.
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

  const [applicantIdentity, setApplicantIdentityRaw] = useState(() =>
    loadFromStorage(STORAGE_KEYS.applicantIdentity, {
      fullName: null,
      passportNumber: null,
    })
  );

  // Questionnaire answers object — null until submitted
  const [questionnaire, setQuestionnaireRaw] = useState(() =>
    loadFromStorage(STORAGE_KEYS.questionnaire, null)
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
  const setWorkflowStep = (step) => {
    setCaseDataRaw((prev) => {
      if (!prev) return prev;
      if ((prev.workflowStep ?? 0) >= step) return prev;
      const next = { ...prev, workflowStep: step };
      saveToStorage(STORAGE_KEYS.caseData, next);
      return next;
    });
  };

  // ── addDocument ────────────────────────────────────────────────────────────
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

  // ── saveQuestionnaire ──────────────────────────────────────────────────────
  /**
   * Persists the completed questionnaire answers to localStorage.
   * @param {object} answers — the full answers object
   */
  const saveQuestionnaire = (answers) => {
    setQuestionnaireRaw(answers);
    saveToStorage(STORAGE_KEYS.questionnaire, answers);
  };

  // ── onPassportReplaced ─────────────────────────────────────────────────────
  const onPassportReplaced = (newIdentity = null) => {
    setNaviMessagesRaw([]);
    saveToStorage(STORAGE_KEYS.naviMessages, []);

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

    setQuestionnaireRaw(null);
    saveToStorage(STORAGE_KEYS.questionnaire, null);

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

        questionnaire,
        saveQuestionnaire,

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