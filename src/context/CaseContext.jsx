import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import {
  normalizeUploadedDocuments,
  upsertUploadedDocument,
} from "../utils/documentUtils.js";

const CaseContext = createContext();

const STORAGE_KEYS = {
  caseData: "vism_caseData",
  uploadedDocuments: "vism_uploadedDocuments",
  activityFeed: "vism_activityFeed",
  naviMessages: "vism_naviMessages",
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

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.caseData, caseData);
  }, [caseData]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.uploadedDocuments, uploadedDocuments);
  }, [uploadedDocuments]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.activityFeed, activityFeed);
  }, [activityFeed]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.naviMessages, naviMessages);
  }, [naviMessages]);

  const setCaseData = (updater) => {
    setCaseDataRaw((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveToStorage(STORAGE_KEYS.caseData, next);
      return next;
    });
  };

  const addDocument = (document) => {
    setUploadedDocumentsRaw((prev) => {
      const next = upsertUploadedDocument(prev, document);
      saveToStorage(STORAGE_KEYS.uploadedDocuments, next);
      return next;
    });
  };

  const addActivity = (type, message) => {
    const activity = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toISOString(),
    };
    setActivityFeedRaw((prev) => [activity, ...prev]);
  };

  const clearDocuments = () => {
    setUploadedDocumentsRaw([]);
    saveToStorage(STORAGE_KEYS.uploadedDocuments, []);
  };

  const clearActivity = () => {
    setActivityFeedRaw([]);
    saveToStorage(STORAGE_KEYS.activityFeed, []);
  };

  const setNaviMessages = (updater) => {
    setNaviMessagesRaw((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveToStorage(STORAGE_KEYS.naviMessages, next);
      return next;
    });
  };

  const clearNaviMessages = () => {
    setNaviMessagesRaw([]);
    saveToStorage(STORAGE_KEYS.naviMessages, []);
  };

  /**
   * Called by DocumentUploadPanel when a passport with a DIFFERENT
   * passport number is detected. Wipes the Navi conversation only —
   * all other case data (case info, documents, activity) is preserved.
   */
  const onPassportReplaced = () => {
    setNaviMessagesRaw([]);
    saveToStorage(STORAGE_KEYS.naviMessages, []);
  };

  const clearCase = () => {
    setCaseDataRaw(null);
    saveToStorage(STORAGE_KEYS.caseData, null);

    setUploadedDocumentsRaw([]);
    saveToStorage(STORAGE_KEYS.uploadedDocuments, []);

    setActivityFeedRaw([]);
    saveToStorage(STORAGE_KEYS.activityFeed, []);

    setNaviMessagesRaw([]);
    saveToStorage(STORAGE_KEYS.naviMessages, []);
  };

  return (
    <CaseContext.Provider
      value={{
        caseData,
        setCaseData,

        uploadedDocuments,
        addDocument,
        clearDocuments,

        activityFeed,
        addActivity,
        clearActivity,

        naviMessages,
        setNaviMessages,
        clearNaviMessages,
        onPassportReplaced,

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