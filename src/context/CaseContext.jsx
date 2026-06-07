import {
  createContext,
  useContext,
  useState,
} from "react";

const CaseContext =
  createContext();

export function CaseProvider({
  children,
}) {
  const [caseData, setCaseData] =
    useState(null);

  const [uploadedDocuments,
    setUploadedDocuments] =
    useState([]);

  const addDocument = (
    document
  ) => {
    setUploadedDocuments(
      (prev) => [
        ...prev,
        document,
      ]
    );
  };

  const clearDocuments =
    () => {
      setUploadedDocuments([]);
    };
  

  return (
    <CaseContext.Provider
      value={{
        caseData,
        setCaseData,

        uploadedDocuments,
        addDocument,
        clearDocuments,
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