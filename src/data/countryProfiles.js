const countryProfiles = {
  Canada: {
    student: {
      documents: [
        "Passport",
        "Letter of Acceptance",
        "GIC Proof",
        "Tuition Payment Receipt",
        "Academic Transcripts"
      ],
      risks: [
        "Insufficient financial proof",
        "Incomplete academic records"
      ],
      score: 90
    }
  },

  "United States": {
    student: {
      documents: [
        "Passport",
        "I-20 Form",
        "SEVIS Fee Receipt",
        "Financial Evidence",
        "Academic Records"
      ],
      risks: [
        "Weak financial documentation",
        "Interview performance"
      ],
      score: 88
    }
  },

  "United Kingdom": {
    student: {
      documents: [
        "Passport",
        "CAS Letter",
        "Financial Proof",
        "Academic Records",
        "English Test Results"
      ],
      risks: [
        "Missing CAS details",
        "Insufficient funds"
      ],
      score: 87
    }
  },

  Australia: {
    student: {
      documents: [
        "Passport",
        "CoE",
        "OSHC Insurance",
        "Financial Proof",
        "Academic Records"
      ],
      risks: [
        "Incomplete CoE",
        "Insufficient financial evidence"
      ],
      score: 86
    }
  },

  Germany: {
    student: {
      documents: [
        "Passport",
        "University Admission Letter",
        "Blocked Account Proof",
        "Health Insurance",
        "Academic Records"
      ],
      risks: [
        "Missing blocked account",
        "Incomplete insurance coverage"
      ],
      score: 85
    }
  }
};

export default countryProfiles;