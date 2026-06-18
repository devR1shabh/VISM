// src/pages/Questionnaire.jsx
// Post-document questionnaire — collects applicant profile information
// that the processor can later review.
// Displays ONE question at a time with progress indicator.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCase, WORKFLOW_STEPS } from "../context/CaseContext";
import { saveQuestionnaire } from "../services/api";
import { PageHeader } from "../components/ui";
import { ClipboardList, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

// ── Question definitions ────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: "purpose",
    label: "What is the primary purpose of your application?",
    type: "radio",
    options: [
      "Study",
      "Employment",
      "Tourism",
      "Business",
      "Family Sponsorship",
      "Investment",
      "Permanent Settlement",
    ],
  },
  {
    id: "education",
    label: "What is your highest educational qualification?",
    type: "radio",
    options: [
      "High School",
      "Diploma",
      "Bachelor's Degree",
      "Master's Degree",
      "Doctorate (PhD)",
    ],
  },
  {
    id: "occupation",
    label: "What is your current occupation or status?",
    type: "text",
    placeholder: "e.g. Software Engineer, Student, Business Owner…",
  },
  {
    id: "experience",
    label: "How many years of professional or academic experience do you have?",
    type: "radio",
    options: [
      "Less than 1 year",
      "1–3 years",
      "3–5 years",
      "5–10 years",
      "10+ years",
    ],
  },
  {
    id: "travelHistory",
    label: "Have you previously travelled internationally?",
    type: "radio",
    options: ["Yes", "No"],
  },
  {
    id: "previousRefusal",
    label: "Have you ever been refused a visa, permit, or immigration application?",
    type: "radio",
    options: ["Yes", "No"],
    conditional: {
      triggerValue: "Yes",
      field: "previousRefusalDetails",
      fieldLabel: "Provide brief details",
      fieldType: "textarea",
      fieldPlaceholder: "Briefly describe the refusal — country, year, and reason if known…",
    },
  },
  {
    id: "financialCapacity",
    label: "What is your estimated financial capacity for this application?",
    type: "radio",
    options: [
      "Under $5,000",
      "$5,000–$20,000",
      "$20,000–$50,000",
      "Above $50,000",
    ],
  },
  {
    id: "hasSponsor",
    label:
      "Do you have a sponsor, employer, educational institution, business partner, or family member supporting your application?",
    type: "radio",
    options: ["Yes", "No"],
    conditional: {
      triggerValue: "Yes",
      field: "sponsorName",
      fieldLabel: "Supporter / Organization Name",
      fieldType: "text",
      fieldPlaceholder: "e.g. University of Melbourne, ABC Corp Pty Ltd, John Smith…",
    },
  },
  {
    id: "existingArrangements",
    label:
      "Have you already secured accommodation, employment, admission, sponsorship, or business arrangements in your destination country?",
    type: "radio",
    options: ["Yes", "No", "In Progress"],
  },
  {
    id: "additionalNotes",
    label: "Is there any additional information you would like the processor to consider?",
    type: "textarea",
    placeholder: "Any context, special circumstances, or notes that may be relevant to your application…",
    optional: true,
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function isQuestionAnswered(q, answers) {
  if (q.optional) return true;
  const val = answers[q.id];
  if (q.type === "radio") return Boolean(val);
  if (q.type === "text" || q.type === "textarea") return Boolean(val?.trim());
  return false;
}

// ── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="space-y-2 mb-8">
      <div className="flex items-center justify-between text-xs font-semibold text-[var(--c-text-muted)]">
        <span className="uppercase tracking-[0.18em]">Question {current} of {total}</span>
        <span>{pct}% complete</span>
      </div>
      <div className="h-1.5 rounded-full bg-[var(--c-border)] overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--c-green)] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function RadioGroup({ options, value, onChange }) {
  return (
    <div className="space-y-3">
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`w-full text-left flex items-center gap-3 rounded-[var(--r-lg)] border px-4 py-3.5 text-sm font-medium transition-all cursor-pointer
              ${selected
                ? "border-[var(--c-green)] bg-[var(--c-green-bg)] text-[var(--c-green)]"
                : "border-[var(--c-border)] bg-white text-[var(--c-text-mid)] hover:border-[var(--c-green-mid)] hover:bg-[var(--c-green-bg)]"
              }`}
          >
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                selected ? "border-[var(--c-green)] bg-[var(--c-green)]" : "border-[var(--c-border)]"
              }`}
            >
              {selected && (
                <span className="w-2 h-2 rounded-full bg-white" />
              )}
            </span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-[var(--r-lg)] border border-[var(--c-border)] bg-white px-4 py-3 text-sm text-[var(--c-text)] placeholder-[var(--c-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--c-green)] focus:border-transparent transition"
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      rows={rows}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-[var(--r-lg)] border border-[var(--c-border)] bg-white px-4 py-3 text-sm text-[var(--c-text)] placeholder-[var(--c-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--c-green)] focus:border-transparent transition resize-none"
    />
  );
}

// ── Review screen ────────────────────────────────────────────────────────────

const REVIEW_LABELS = {
  purpose:               "Primary Purpose",
  education:             "Highest Education",
  occupation:            "Current Occupation",
  experience:            "Years of Experience",
  travelHistory:         "International Travel",
  previousRefusal:       "Previous Refusal",
  previousRefusalDetails:"Refusal Details",
  financialCapacity:     "Financial Capacity",
  hasSponsor:            "Has Sponsor/Supporter",
  sponsorName:           "Supporter / Organization",
  existingArrangements:  "Existing Arrangements",
  additionalNotes:       "Additional Notes",
};

function ReviewScreen({ answers, onBack, onSubmit, submitting }) {
  const displayEntries = Object.entries(REVIEW_LABELS).filter(([key]) => {
    const val = answers[key];
    return val && val.toString().trim() !== "";
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--c-text)] mb-1">Review Your Answers</h2>
        <p className="text-sm text-[var(--c-text-muted)]">
          Please review your responses before submitting. You can go back to make changes.
        </p>
      </div>

      <div className="bg-[var(--c-bg)] border border-[var(--c-border)] rounded-[var(--r-xl)] overflow-hidden">
        {displayEntries.map(([key, label], idx) => (
          <div
            key={key}
            className={`flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 px-5 py-3.5 text-sm ${
              idx !== displayEntries.length - 1 ? "border-b border-[var(--c-border)]" : ""
            }`}
          >
            <span className="w-full sm:w-48 shrink-0 font-semibold text-[var(--c-text-muted)] text-xs uppercase tracking-[0.1em] pt-0.5">
              {label}
            </span>
            <span className="text-[var(--c-text-mid)] font-medium leading-relaxed">
              {answers[key]}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-[var(--r-lg)] border border-[var(--c-border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--c-text-mid)] hover:border-[var(--c-green-mid)] hover:text-[var(--c-green)] transition disabled:opacity-50"
        >
          <ChevronLeft size={16} />
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-[var(--r-lg)] bg-[var(--c-green)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--c-green-mid)] transition disabled:opacity-60 disabled:cursor-not-allowed flex-1 sm:flex-none"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              <CheckCircle size={16} />
              Submit Questionnaire
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

function Questionnaire() {
  const navigate = useNavigate();
  const { caseData, questionnaire, saveQuestionnaire: persistQuestionnaire, setWorkflowStep } = useCase();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(() => questionnaire || {});
  const [showReview, setShowReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Transition animation key — changes on question change to trigger CSS
  const [transitionKey, setTransitionKey] = useState(0);

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!caseData) {
    return (
      <main className="min-h-screen bg-[var(--c-bg)]">
        <PageHeader
          eyebrow="Applicant Questionnaire"
          title="Application Questionnaire"
          description="Help us understand your background and application context."
        />
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 text-center">
          <div className="bg-white border border-[var(--c-border)] rounded-xl shadow-sm p-12 max-w-md mx-auto">
            <ClipboardList size={40} className="text-[var(--c-text-muted)] mx-auto mb-4" />
            <h2 className="text-lg font-bold text-[var(--c-text)] mb-2">No Case Yet</h2>
            <p className="text-sm text-[var(--c-text-muted)] mb-6">
              Create a case on the home page first to begin the questionnaire.
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--c-green)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--c-green-mid)] transition"
            >
              Go to Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  const q = QUESTIONS[currentIndex];
  const totalQuestions = QUESTIONS.length;
  const answered = isQuestionAnswered(q, answers);

  // ── Navigation helpers ─────────────────────────────────────────────────────

  const goTo = (nextIndex) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setTransitionKey((k) => k + 1);
      setAnimating(false);
    }, 180);
  };

  const handleNext = () => {
    if (!answered) return;
    if (currentIndex < totalQuestions - 1) {
      goTo(currentIndex + 1);
    } else {
      // Last question — go to review
      setAnimating(true);
      setTimeout(() => {
        setShowReview(true);
        setAnimating(false);
      }, 180);
    }
  };

  const handlePrev = () => {
    if (currentIndex === 0) return;
    goTo(currentIndex - 1);
  };

  const handleBackFromReview = () => {
    setShowReview(false);
    setCurrentIndex(totalQuestions - 1);
    setTransitionKey((k) => k + 1);
  };

  // ── Answer setter ──────────────────────────────────────────────────────────
  const setAnswer = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Persist answers locally
      persistQuestionnaire(answers);

      // Persist to backend if we have a case _id
      if (caseData?._id) {
        await saveQuestionnaire(caseData._id, answers);
      }

      // Advance workflow
      setWorkflowStep(WORKFLOW_STEPS.QUESTIONNAIRE_DONE);

      navigate("/journey");
    } catch (err) {
      console.error("Questionnaire save failed:", err);
      // Still proceed — questionnaire is locally saved
      persistQuestionnaire(answers);
      setWorkflowStep(WORKFLOW_STEPS.QUESTIONNAIRE_DONE);
      navigate("/journey");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Keyboard support ───────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (showReview || submitting) return;
      if (e.key === "Enter" && answered) handleNext();
      if (e.key === "ArrowLeft" && currentIndex > 0) handlePrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showReview, submitting, answered, currentIndex]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[var(--c-bg)]">

      <PageHeader
        eyebrow="Applicant Questionnaire"
        title="Application Questionnaire"
        description="Your answers help the processor understand your background and assess your application accurately."
      />

      <div className="mx-auto max-w-2xl px-6 py-10 lg:px-8">

        <div
          className={`bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-2xl)] shadow-[var(--shadow-card)] p-8 transition-opacity duration-180 ${
            animating ? "opacity-0" : "opacity-100"
          }`}
        >
          {showReview ? (
            <ReviewScreen
              answers={answers}
              onBack={handleBackFromReview}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          ) : (
            <div key={transitionKey}>
              {/* Progress */}
              <ProgressBar current={currentIndex + 1} total={totalQuestions} />

              {/* Question */}
              <div className="mb-7">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--c-green-mid)] font-semibold mb-2">
                  Question {currentIndex + 1}
                  {q.optional && (
                    <span className="ml-2 normal-case text-[var(--c-text-muted)] tracking-normal font-normal">
                      (optional)
                    </span>
                  )}
                </p>
                <h2 className="text-lg font-bold text-[var(--c-text)] leading-snug">
                  {q.label}
                </h2>
              </div>

              {/* Input */}
              <div className="mb-6">
                {q.type === "radio" && (
                  <RadioGroup
                    options={q.options}
                    value={answers[q.id]}
                    onChange={(val) => setAnswer(q.id, val)}
                  />
                )}
                {q.type === "text" && (
                  <TextInput
                    value={answers[q.id]}
                    onChange={(val) => setAnswer(q.id, val)}
                    placeholder={q.placeholder}
                  />
                )}
                {q.type === "textarea" && (
                  <TextArea
                    value={answers[q.id]}
                    onChange={(val) => setAnswer(q.id, val)}
                    placeholder={q.placeholder}
                  />
                )}

                {/* Conditional follow-up */}
                {q.conditional && answers[q.id] === q.conditional.triggerValue && (
                  <div className="mt-4 p-4 rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)]">
                    <label className="block text-xs font-semibold text-[var(--c-text-muted)] uppercase tracking-[0.12em] mb-2">
                      {q.conditional.fieldLabel}
                    </label>
                    {q.conditional.fieldType === "textarea" ? (
                      <TextArea
                        value={answers[q.conditional.field]}
                        onChange={(val) => setAnswer(q.conditional.field, val)}
                        placeholder={q.conditional.fieldPlaceholder}
                        rows={3}
                      />
                    ) : (
                      <TextInput
                        value={answers[q.conditional.field]}
                        onChange={(val) => setAnswer(q.conditional.field, val)}
                        placeholder={q.conditional.fieldPlaceholder}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--c-border)]">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="inline-flex items-center gap-1.5 rounded-[var(--r-lg)] border border-[var(--c-border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--c-text-mid)] hover:border-[var(--c-green-mid)] hover:text-[var(--c-green)] transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <span className="text-xs text-[var(--c-text-muted)] hidden sm:block">
                  {answered ? "Press Enter to continue" : "Answer to continue"}
                </span>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!answered}
                  className="inline-flex items-center gap-1.5 rounded-[var(--r-lg)] bg-[var(--c-green)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--c-green-mid)] transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {currentIndex === totalQuestions - 1 ? "Review Answers" : "Next"}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Keyboard hint */}
        {!showReview && (
          <p className="text-center text-xs text-[var(--c-text-muted)] mt-4">
            Use arrow keys ← → or Enter to navigate
          </p>
        )}

      </div>
    </main>
  );
}

export default Questionnaire;