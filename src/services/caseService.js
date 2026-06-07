import { createCase } from "../models/caseModel";

export function initializeCase(
  visaType,
  country,
  description
) {
  return createCase({
    visaType,
    country,
    description,
  });
}

export function updateCase(
  existingCase,
  updates
) {
  return {
    ...existingCase,
    ...updates,
  };
}