export const workflowPrompt = (
  visaType,
  country,
  description
) => `
Generate immigration workflow steps.

Visa Type:
${visaType}

Country:
${country}

Case:
${description}

Return a list of sequential immigration steps.
`;

export const documentPrompt = (
  visaType,
  country,
  description
) => `
Generate required documents.

Visa Type:
${visaType}

Country:
${country}

Case:
${description}

Return document checklist.
`;

export const riskPrompt = (
  visaType,
  country,
  description
) => `
Analyze visa rejection risks.

Visa Type:
${visaType}

Country:
${country}

Case:
${description}

Return risk factors.
`;