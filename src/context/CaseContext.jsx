import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const CaseContext = createContext();

const STORAGE_KEYS = {
  caseData: "vism_caseData",
  uploadedDocuments: "vism_uploadedDocuments",
  activityFeed: "vism_activityFeed",
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
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch {
    // localStorage unavailable
  }
}

export function CaseProvider({
  children,
}) {
  const [caseData, setCaseDataRaw] =
    useState(() =>
      loadFromStorage(
        STORAGE_KEYS.caseData,
        null
      )
    );

  const [
    uploadedDocuments,
    setUploadedDocumentsRaw,
  ] = useState(() =>
    loadFromStorage(
      STORAGE_KEYS.uploadedDocuments,
      []
    )
  );

  const [
    activityFeed,
    setActivityFeedRaw,
  ] = useState(() =>
    loadFromStorage(
      STORAGE_KEYS.activityFeed,
      []
    )
  );

  useEffect(() => {
    saveToStorage(
      STORAGE_KEYS.caseData,
      caseData
    );
  }, [caseData]);

  useEffect(() => {
    saveToStorage(
      STORAGE_KEYS.uploadedDocuments,
      uploadedDocuments
    );
  }, [uploadedDocuments]);

  useEffect(() => {
    saveToStorage(
      STORAGE_KEYS.activityFeed,
      activityFeed
    );
  }, [activityFeed]);

  const setCaseData = (
    updater
  ) => {
    setCaseDataRaw((prev) => {
      const next =
        typeof updater ===
        "function"
          ? updater(prev)
          : updater;

      saveToStorage(
        STORAGE_KEYS.caseData,
        next
      );

      return next;
    });
  };

  const addDocument = (
    document
  ) => {
    setUploadedDocumentsRaw(
      (prev) => {
        const next = [
          ...prev,
          document,
        ];

        saveToStorage(
          STORAGE_KEYS.uploadedDocuments,
          next
        );

        return next;
      }
    );
  };

  const addActivity = (
    type,
    message
  ) => {
    const activity = {
      id: Date.now(),
      type,
      message,
      timestamp:
        new Date().toISOString(),
    };

    setActivityFeedRaw(
      (prev) => [
        activity,
        ...prev,
      ]
    );
  };

  const clearDocuments =
    () => {
      setUploadedDocumentsRaw(
        []
      );

      saveToStorage(
        STORAGE_KEYS.uploadedDocuments,
        []
      );
    };

  const clearActivity =
    () => {
      setActivityFeedRaw([]);

      saveToStorage(
        STORAGE_KEYS.activityFeed,
        []
      );
    };

  const clearCase = () => {
    setCaseDataRaw(null);

    saveToStorage(
      STORAGE_KEYS.caseData,
      null
    );

    setUploadedDocumentsRaw(
      []
    );

    saveToStorage(
      STORAGE_KEYS.uploadedDocuments,
      []
    );

    setActivityFeedRaw([]);

    saveToStorage(
      STORAGE_KEYS.activityFeed,
      []
    );
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

        clearCase,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}

export function useCase() {
  return useContext(
    CaseContext
  );
}