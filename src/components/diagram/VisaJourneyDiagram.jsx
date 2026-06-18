import { useEffect, useRef } from "react";
import mermaid from "mermaid";

import { useCase } from "../../context/CaseContext";

function VisaJourneyDiagram() {
  const diagramRef = useRef(null);

  const { caseData } = useCase();

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: "default",
    });

    const renderDiagram = async () => {
      try {
        let graphDefinition = "";

        switch (caseData?.visaType) {
          case "Student Visa":
            graphDefinition = `
graph TD
    A[Academic Documents]
    --> B[Financial Verification]
    --> C[University Offer Review]
    --> D[Visa Submission]
    --> E[Biometrics]
    --> F[Decision]
`;
            break;

          case "Work Visa":
            graphDefinition = `
graph TD
    A[Employment Documents]
    --> B[Employer Verification]
    --> C[Work Authorization Review]
    --> D[Visa Submission]
    --> E[Processing]
    --> F[Decision]
`;
            break;

          case "Tourist Visa":
            graphDefinition = `
graph TD
    A[Travel Documents]
    --> B[Financial Verification]
    --> C[Accommodation Review]
    --> D[Visa Submission]
    --> E[Processing]
    --> F[Decision]
`;
            break;

          case "Permanent Residency Visa":
            graphDefinition = `
graph TD
    A[Identity Documents]
    --> B[Residency Eligibility Review]
    --> C[Background Check]
    --> D[Visa Submission]
    --> E[Processing]
    --> F[Decision]
`;
            break;

          case "Business Visa":
            graphDefinition = `
graph TD
    A[Business Documents]
    --> B[Financial Verification]
    --> C[Employment Review]
    --> D[Visa Submission]
    --> E[Processing]
    --> F[Decision]
`;
            break;

          case "Family Sponsorship Visa":
            graphDefinition = `
graph TD
    A[Sponsor Documents]
    --> B[Relationship Verification]
    --> C[Financial Proof Review]
    --> D[Visa Submission]
    --> E[Processing]
    --> F[Decision]
`;
            break;

          case "Investor Visa":
            graphDefinition = `
graph TD
    A[Investment Documents]
    --> B[Proof of Funds Review]
    --> C[Business Plan Assessment]
    --> D[Visa Submission]
    --> E[Processing]
    --> F[Decision]
`;
            break;

          default:
            graphDefinition = `
graph TD
    A[Document Collection]
    --> B[Application Preparation]
    --> C[Visa Submission]
    --> D[Processing]
    --> E[Decision]
`;
        }

        const id = `mermaid-${Date.now()}`;

        const { svg } = await mermaid.render(
          id,
          graphDefinition
        );

        if (diagramRef.current) {
          diagramRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error(
          "Mermaid Error:",
          error
        );

        if (diagramRef.current) {
          diagramRef.current.innerHTML =
            "<p>Failed to render diagram.</p>";
        }
      }
    };

    renderDiagram();
  }, [caseData]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">
        Visa Processing Journey
      </h2>

      <div
        ref={diagramRef}
        className="overflow-x-auto"
      />
    </div>
  );
}

export default VisaJourneyDiagram;