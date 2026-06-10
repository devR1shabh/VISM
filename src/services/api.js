const API_URL =
  "http://localhost:5000/api";

/* =========================
   VISA ANALYSIS
========================= */

export async function generateAnalysis(
  visaType,
  country,
  description
) {
  const response =
    await fetch(
      `${API_URL}/analysis`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          visaType,
          country,
          description,
        }),
      }
    );

  if (!response.ok) {
    throw new Error(
      "Failed to generate analysis"
    );
  }

  return response.json();
}

/* =========================
   PASSPORT OCR
========================= */

export async function uploadPassport(
  file
) {
  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  const response =
    await fetch(
      `${API_URL}/documents/passport`,
      {
        method: "POST",
        body: formData,
      }
    );

  if (!response.ok) {
    throw new Error(
      "Passport extraction failed"
    );
  }

  return response.json();
}

/* =========================
   DOCUMENT VERIFICATION
========================= */

export async function verifyDocument(
  file,
  documentType
) {
  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  formData.append(
    "documentType",
    documentType
  );

  const response =
    await fetch(
      `${API_URL}/documents/verify`,
      {
        method: "POST",
        body: formData,
      }
    );

  if (!response.ok) {
    throw new Error(
      "Document verification failed"
    );
  }

  return response.json();
}

/* =========================
   CASE MANAGEMENT
========================= */

export async function createCase(
  caseData
) {
  const response =
    await fetch(
      `${API_URL}/cases`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          caseData
        ),
      }
    );

  if (!response.ok) {
    throw new Error(
      "Failed to create case"
    );
  }

  return response.json();
}

export async function getCase(
  caseId
) {
  const response =
    await fetch(
      `${API_URL}/cases/${caseId}`
    );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch case"
    );
  }

  return response.json();
}

export async function updateCase(
  caseId,
  caseData
) {
  const response =
    await fetch(
      `${API_URL}/cases/${caseId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          caseData
        ),
      }
    );

  if (!response.ok) {
    throw new Error(
      "Failed to update case"
    );
  }

  return response.json();
}

/* =========================
   DOCUMENT STORAGE
========================= */

export async function addVerifiedDocument(
  caseId,
  documentType
) {
  const response =
    await fetch(
      `${API_URL}/cases/${caseId}/documents`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          documentType,
        }),
      }
    );

  if (!response.ok) {
    throw new Error(
      "Failed to save document"
    );
  }

  return response.json();
}

/* =========================
   AI COPILOT
========================= */

export async function sendCopilotMessage(
  caseContext,
  message
) {
  const response =
    await fetch(
      `${API_URL}/copilot/chat`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          caseContext,
          message,
        }),
      }
    );

  if (!response.ok) {
    const error =
      await response.json();

    throw new Error(
      error.error ||
      "Copilot request failed"
    );
  }

  return response.json();
}