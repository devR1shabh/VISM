export function buildVisaAnalysisPrompt(
  visaType,
  country,
  description
) {
  return `
You are an expert immigration consultant.

Analyze the following visa case.

Visa Type:
${visaType}

Destination Country:
${country}

Case Description:
${description}

Provide:

1. Application Overview

2. Required Documents

3. Risk Factors

4. Immigration Journey Steps

5. Compliance Notes

6. Estimated Timeline

7. Follow-Up Actions

8. Application Readiness Score

Return the response in a structured format.
`;
}