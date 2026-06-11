/**
 * Document state helpers — one record per required document type.
 * Latest upload (by uploadedAt) wins when deduplicating legacy data.
 */

function getUploadedTime(doc) {
  if (!doc?.uploadedAt) return 0;
  const time = new Date(doc.uploadedAt).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function normalizeUploadedDocuments(documents = []) {
  const byType = new Map();

  for (const doc of documents) {
    const type = doc?.requiredDocument;
    if (!type) continue;

    const existing = byType.get(type);
    if (!existing || getUploadedTime(doc) >= getUploadedTime(existing)) {
      byType.set(type, doc);
    }
  }

  return Array.from(byType.values());
}

export function upsertUploadedDocument(documents, newDoc) {
  const normalized = normalizeUploadedDocuments(documents);
  const type = newDoc?.requiredDocument;

  if (!type) {
    return [...normalized, newDoc];
  }

  const index = normalized.findIndex(
    (doc) => doc.requiredDocument === type
  );

  if (index >= 0) {
    const next = [...normalized];
    next[index] = newDoc;
    return next;
  }

  return [...normalized, newDoc];
}

export function getDocumentByType(documents, documentType) {
  return normalizeUploadedDocuments(documents).find(
    (doc) => doc.requiredDocument === documentType
  );
}

export function countVerifiedRequired(requiredDocuments = [], uploadedDocuments = []) {
  const normalized = normalizeUploadedDocuments(uploadedDocuments);

  return requiredDocuments.filter((requiredType) =>
    normalized.some(
      (doc) => doc.requiredDocument === requiredType && doc.valid
    )
  ).length;
}