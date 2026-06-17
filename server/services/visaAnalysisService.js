// server/services/visaAnalysisService.js
// All visa types now share the same 15-document checklist.
// Per-visa compliance notes and journey steps remain specific.

const REQUIRED_DOCUMENTS = [
  "Passport",
  "Passport Size Photograph",
  "National ID Card",
  "Birth Certificate",
  "Address Proof",
  "Resume / CV",
  "Academic Transcript",
  "Degree Certificate",
  "Employment Letter",
  "Bank Statement",
  "Proof of Funds",
  "Travel History Document",
  "Statement of Purpose",
  "Police Clearance Certificate",
  "Medical Certificate",
];

export function generateRuleBasedAnalysis(visaType, country) {
  const complianceMap = {
    "Student Visa": [
      "Maintain full-time enrollment at an approved institution.",
      "Keep passport valid for the entire duration of studies.",
      "Meet minimum attendance requirements set by the institution.",
      "Do not engage in unauthorized employment.",
    ],
    "Work Visa": [
      "Work only for the authorized employer named on the visa.",
      "Maintain valid employment records throughout the visa period.",
      "Comply with all local labor laws and regulations.",
      "Notify authorities of any change in employment status.",
    ],
    "Tourist Visa": [
      "Do not overstay the permitted visa duration.",
      "Maintain valid travel documents at all times.",
      "Do not engage in employment or paid activities.",
      "Follow all destination-country entry and exit regulations.",
    ],
    "Permanent Residency Visa": [
      "Maintain continuous lawful residence as required.",
      "File taxes and comply with all financial obligations.",
      "Notify immigration authorities of any address changes.",
      "Do not abandon residency for extended periods without authorization.",
    ],
    "Business Visa": [
      "Engage only in permitted business activities.",
      "Do not enter into employment contracts with local entities.",
      "Maintain documentation of all business meetings and activities.",
      "Comply with destination-country business and trade regulations.",
    ],
    "Family Sponsorship Visa": [
      "Sponsor must maintain the financial support commitment.",
      "Sponsored individual must reside with or near the sponsor.",
      "Report any change in the sponsor–applicant relationship.",
      "Comply with all conditions attached to the sponsorship approval.",
    ],
    "Investor Visa": [
      "Maintain the required investment amount for the full visa period.",
      "Provide regular reports on investment activities to authorities.",
      "Ensure the investment meets all local regulatory requirements.",
      "Notify authorities of any material changes to the investment.",
    ],
  };

  const journeyMap = {
    "Student Visa": [
      { stage: "Document Collection",     duration: "1–2 Weeks"     },
      { stage: "Application Preparation", duration: "2–3 Days"      },
      { stage: "Submission",              duration: "1 Day"         },
      { stage: "Biometrics Appointment",  duration: "1–2 Weeks"     },
      { stage: "Processing",              duration: "4–8 Weeks"     },
      { stage: "Decision",                duration: "Final Outcome" },
    ],
    "Work Visa": [
      { stage: "Document Collection",   duration: "1–2 Weeks"     },
      { stage: "Employer Verification", duration: "3–5 Days"      },
      { stage: "Submission",            duration: "1 Day"         },
      { stage: "Processing",            duration: "6–12 Weeks"    },
      { stage: "Decision",              duration: "Final Outcome" },
    ],
    "Tourist Visa": [
      { stage: "Document Collection",     duration: "3–5 Days"      },
      { stage: "Application Preparation", duration: "1 Day"         },
      { stage: "Submission",              duration: "1 Day"         },
      { stage: "Processing",              duration: "2–4 Weeks"     },
      { stage: "Decision",               duration: "Final Outcome"  },
    ],
    "Permanent Residency Visa": [
      { stage: "Document Collection",     duration: "2–4 Weeks"     },
      { stage: "Application Preparation", duration: "1 Week"        },
      { stage: "Submission",              duration: "1 Day"         },
      { stage: "Background Check",        duration: "4–8 Weeks"     },
      { stage: "Processing",              duration: "3–6 Months"    },
      { stage: "Decision",                duration: "Final Outcome" },
    ],
    "Business Visa": [
      { stage: "Document Collection",     duration: "1–2 Weeks"     },
      { stage: "Application Preparation", duration: "2–3 Days"      },
      { stage: "Submission",              duration: "1 Day"         },
      { stage: "Processing",              duration: "2–4 Weeks"     },
      { stage: "Decision",                duration: "Final Outcome" },
    ],
    "Family Sponsorship Visa": [
      { stage: "Document Collection",  duration: "2–3 Weeks"     },
      { stage: "Sponsor Verification", duration: "1–2 Weeks"     },
      { stage: "Submission",           duration: "1 Day"         },
      { stage: "Processing",           duration: "8–16 Weeks"    },
      { stage: "Decision",             duration: "Final Outcome" },
    ],
    "Investor Visa": [
      { stage: "Document Collection",     duration: "2–4 Weeks"     },
      { stage: "Financial Verification",  duration: "1–2 Weeks"     },
      { stage: "Application Preparation", duration: "1 Week"        },
      { stage: "Submission",              duration: "1 Day"         },
      { stage: "Processing",              duration: "4–12 Weeks"    },
      { stage: "Decision",                duration: "Final Outcome" },
    ],
  };

  const defaultJourney = [
    { stage: "Document Collection",     duration: "1–2 Weeks"     },
    { stage: "Application Preparation", duration: "2–3 Days"      },
    { stage: "Submission",              duration: "1 Day"         },
    { stage: "Processing",              duration: "4–8 Weeks"     },
    { stage: "Decision",                duration: "Final Outcome" },
  ];

  const defaultCompliance = [
    "Ensure all documents are valid and up to date before submission.",
    "Comply with all destination-country immigration regulations.",
    "Respond promptly to any requests from immigration authorities.",
    "Keep copies of all submitted documents for your records.",
  ];

  return {
    // All visa types use the same 15-document list
    documents:       REQUIRED_DOCUMENTS,
    complianceNotes: complianceMap[visaType] || defaultCompliance,
    visaJourney:     journeyMap[visaType]    || defaultJourney,
  };
}