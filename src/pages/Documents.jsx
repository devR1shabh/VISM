import { useLocation } from "react-router-dom";

import DocumentCollectionTracker from "../components/output/DocumentCollectionTracker";
import DocumentUploadPanel from "../components/output/DocumentUploadPanel";

function Documents() {
  const location = useLocation();

  const documents =
    location.state?.documents || [];

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-8">
          Document Center
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          <DocumentCollectionTracker
            documents={documents}
          />

          <DocumentUploadPanel
            documents={documents}
          />

        </div>

      </div>

    </div>
  );
}

export default Documents;