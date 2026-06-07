export function createCase({
  visaType,
  country,
  description,
}) {
  return {
    id: `CASE-${Date.now()}`,

    createdAt: new Date().toISOString(),

    status: "In Progress",

    applicant: {
      name: "",
      email: "",
      phone: "",
    },

    caseDetails: {
      visaType,
      country,
      description,
    },

    documents: [],

    uploadedDocuments: [],

    risks: [],

    timeline: [],

    notifications: [],

    tasks: [],

    score: 0,

    assessment: null,
  };
}