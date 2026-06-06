import { useEffect, useRef } from "react";
import mermaid from "mermaid";

function VisaJourneyDiagram() {
  const diagramRef = useRef(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: "default",
    });

    const renderDiagram = async () => {
      try {
        const graphDefinition = `
graph TD
    A[Document Collection] --> B[Application Preparation]
    B --> C[Submission]
    C --> D[Biometrics]
    D --> E[Decision]
`;

        const id = `mermaid-${Date.now()}`;

        const { svg } = await mermaid.render(
          id,
          graphDefinition
        );

        if (diagramRef.current) {
          diagramRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error("Mermaid Error:", error);

        if (diagramRef.current) {
          diagramRef.current.innerHTML =
            "<p>Failed to render diagram.</p>";
        }
      }
    };

    renderDiagram();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold mb-4">
        Visa Journey Diagram
      </h2>

      <div
        ref={diagramRef}
        className="overflow-x-auto"
      />

    </div>
  );
}

export default VisaJourneyDiagram;