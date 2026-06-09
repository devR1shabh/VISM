// src/services/api.js

const API_URL = "http://localhost:5000/api";

export async function generateAnalysis(visaType, country, description) {
  const response = await fetch(`${API_URL}/analysis`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ visaType, country, description }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate analysis");
  }

  return response.json();
}

export async function uploadPassport(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/documents/passport`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Passport extraction failed");
  }

  return response.json();
}

export async function verifyDocument(file, documentType) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("documentType", documentType);

  const response = await fetch(`${API_URL}/documents/verify`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Document verification failed");
  }

  return response.json();
}

export async function sendCopilotMessage(caseContext, message) {
  const response = await fetch(`${API_URL}/copilot/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ caseContext, message }),
  });

  if (!response.ok) {
    throw new Error("Copilot request failed");
  }

  return response.json();
}