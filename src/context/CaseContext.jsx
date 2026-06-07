import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const CaseContext = createContext();

const STORAGE_KEYS = {
  caseData:          "vism_caseData",
  uploadedDocuments: "vism_uploadedDocuments",
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
    // localStorage unavailable — graceful degradation
  }
}

export function CaseProvider({ children }) {
  const [caseData, setCaseDataRaw] = useState(
    () => loadFromStorage(STORAGE_KEYS.caseData, null)
  );

  const [uploadedDocuments, setUploadedDocumentsRaw] = useState(
    () => loadFromStorage(STORAGE_KEYS.uploadedDocuments, [])
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.caseData, caseData);
  }, [caseData]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.uploadedDocuments, uploadedDocuments);
  }, [uploadedDocuments]);

  const setCaseData = (updater) => {
    setCaseDataRaw((prev) => {
      const next =
        typeof updater === "function" ? updater(prev) : updater;
      saveToStorage(STORAGE_KEYS.caseData, next);
      return next;
    });
  };

  const addDocument = (document) => {
    setUploadedDocumentsRaw((prev) => {
      const next = [...prev, document];
      saveToStorage(STORAGE_KEYS.uploadedDocuments, next);
      return next;
    });
  };

  const clearDocuments = () => {
    setUploadedDocumentsRaw([]);
    saveToStorage(STORAGE_KEYS.uploadedDocuments, []);
  };

  const clearCase = () => {
    setCaseDataRaw(null);
    saveToStorage(STORAGE_KEYS.caseData, null);
    setUploadedDocumentsRaw([]);
    saveToStorage(STORAGE_KEYS.uploadedDocuments, []);
  };

  return (
    <CaseContext.Provider
      value={{
        caseData,
        setCaseData,

        uploadedDocuments,
        addDocument,
        clearDocuments,
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