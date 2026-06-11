// src/components/upload/DocumentGuidelines.jsx

function CheckItem({ text }) {
  return (
    <li className="flex items-start gap-2 text-sm text-gray-700">
      <svg
        className="w-4 h-4 text-green-500 mt-0.5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {text}
    </li>
  );
}

function XItem({ text }) {
  return (
    <li className="flex items-start gap-2 text-sm text-gray-700">
      <svg
        className="w-4 h-4 text-red-400 mt-0.5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      {text}
    </li>
  );
}

function DocumentGuidelines() {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          Document Upload Guidelines
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Passport */}
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🛂</span>
            <h3 className="font-semibold text-blue-800 text-base">
              Passport Requirements
            </h3>
          </div>
          <ul className="space-y-2">
            <CheckItem text="Clear, well-lit image — all corners visible" />
            <CheckItem text="MRZ (machine-readable zone) clearly visible at bottom" />
            <CheckItem text="ICAO TD3 standard passport (full biographical page)" />
            <XItem text="No blur, glare, or shadows on the page" />
            <CheckItem text="Accepted formats: JPG, JPEG, PNG only" />
          </ul>
        </div>

        {/* Other Documents */}
        <div className="rounded-lg border border-purple-100 bg-purple-50 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📄</span>
            <h3 className="font-semibold text-purple-800 text-base">
              Other Documents (Resume / Transcript / Bank Statement)
            </h3>
          </div>
          <ul className="space-y-2">
            <CheckItem text="Clear, high-resolution image — all text readable" />
            <CheckItem text="All pages visible and in correct orientation" />
            <CheckItem text="Document must be complete — no cropping of content" />
            <XItem text="No handwritten annotations or alterations" />
            <CheckItem text="Accepted formats: JPG, JPEG, PNG only" />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DocumentGuidelines;