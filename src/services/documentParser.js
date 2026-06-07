export function parseDocument(
  fileName
) {
  const lower =
    fileName.toLowerCase();

  if (
    lower.includes("passport")
  ) {
    return {
      type: "Passport",
      status: "Detected",
      extractedData: {
        validity:
          "Passport appears valid",
      },
    };
  }

  if (
    lower.includes("bank")
  ) {
    return {
      type:
        "Bank Statement",
      status: "Detected",
      extractedData: {
        finances:
          "Financial evidence found",
      },
    };
  }

  if (
    lower.includes("offer")
  ) {
    return {
      type:
        "Offer Letter",
      status: "Detected",
      extractedData: {
        admission:
          "Admission evidence found",
      },
    };
  }

  return {
    type:
      "Unknown Document",
    status:
      "Needs Review",
    extractedData: {},
  };
}