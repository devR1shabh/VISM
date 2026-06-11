// src/components/navi/Navi.jsx

import { useState, useRef, useEffect } from "react";
import { useCase } from "../../context/CaseContext";
import { buildCaseContext, getSuggestedQuestions } from "../../utils/buildCaseContext";
import { sendNaviMessage } from "../../services/api";

const EMPTY_MESSAGES = [];
const INTRO_MESSAGE_ID = "navi-intro";

function Navi() {
  const {
    caseData,
    uploadedDocuments,
    naviMessages,
    setNaviMessages,
  } = useCase();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLauncherGreeting, setShowLauncherGreeting] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messages = naviMessages ?? EMPTY_MESSAGES;

  // Recompute context on every render - always fresh
  const caseContext = buildCaseContext(caseData, uploadedDocuments);

  const visaType = caseContext.visaType;
  const country = caseContext.country;
  const quickTemplates = getSuggestedQuestions();

  useEffect(() => {
    if (isOpen) return;

    const timer = window.setTimeout(() => {
      setShowLauncherGreeting(false);
    }, 6500);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  function buildIntroMessage() {
    return [
      "Hi, I'm Navi 👋",
      "",
      "I'm your visa and immigration assistant. I can help explain your visa process, identify potential risks, answer application questions, and guide you through your visa journey.",
    ].join("\n");
  }

  function handleOpen() {
    setIsOpen(true);
    setShowLauncherGreeting(false);

    if (messages.length === 0) {
      setNaviMessages([
        {
          id: INTRO_MESSAGE_ID,
          role: "assistant",
          text: buildIntroMessage(),
        },
      ]);
    }

    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function handleClose() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  async function handleSend(messageText) {
    const text = (messageText || input).trim();
    if (!text || isLoading) return;

    setNaviMessages((prev) => {
      const current = prev.length > 0
        ? prev
        : [
            {
              id: INTRO_MESSAGE_ID,
              role: "assistant",
              text: buildIntroMessage(),
            },
          ];

      return [
        ...current,
        {
          id: `user-${current.length}`,
          role: "user",
          text,
        },
      ];
    });
    setInput("");
    setIsLoading(true);

    try {
      const data = await sendNaviMessage(caseContext, text);

      setNaviMessages((prev) => [
        ...prev,
        {
          id: `assistant-${prev.length}`,
          role: "assistant",
          text: data.reply,
        },
      ]);
    } catch {
      setNaviMessages((prev) => [
        ...prev,
        {
          id: `assistant-${prev.length}`,
          role: "assistant",
          text: "Sorry, I couldn't process that. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function renderText(text) {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
          <br />
        </span>
      );
    });
  }

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
          {showLauncherGreeting && (
            <button
              type="button"
              onClick={handleOpen}
              className="mb-1 max-w-56 rounded-lg border border-blue-100 bg-white px-3 py-2 text-left text-sm text-gray-700 shadow-lg transition-all duration-300 hover:border-blue-200 hover:bg-blue-50"
            >
              <span className="block font-semibold text-gray-900">
                👋 Hi, I'm Navi
              </span>
              <span className="text-xs text-gray-500">
                Ask me about your visa process.
              </span>
            </button>
          )}

          <button
            onClick={handleOpen}
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-2xl text-white shadow-xl ring-4 ring-blue-100 transition-all duration-200 hover:scale-110 hover:bg-blue-700 hover:shadow-2xl animate-pulse"
            title="Open Navi"
          >
            🤖
            <span className="absolute right-1 top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
          </button>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-20 lg:bg-transparent"
          onClick={handleClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full z-50 w-full sm:w-96 bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="bg-blue-600 text-white px-4 py-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg">
              🤖
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">
                Navi
              </p>
              <p className="text-xs text-blue-100">
                {visaType && country
                  ? `${visaType} · ${country}`
                  : visaType || "No active case"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-blue-200 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-5 space-y-4 scroll-smooth">
          {messages.map((msg, index) => (
            <div
              key={msg.id ?? `${msg.role}-${msg.text}-${index}`}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 bg-white border border-blue-100 rounded-full flex items-center justify-center text-sm mr-2 shrink-0 mt-1 shadow-sm">
                  🤖
                </div>
              )}
              <div
                className={`max-w-xs rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-sm"
                    : "bg-white text-gray-800 rounded-tl-sm border border-gray-100"
                }`}
              >
                {renderText(msg.text)}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 bg-white border border-blue-100 rounded-full flex items-center justify-center text-sm mr-2 shrink-0 shadow-sm">
                🤖
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center h-4">
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-100 bg-white px-4 py-3 shrink-0">
          <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">
            Quick templates
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {quickTemplates.map((template) => (
              <button
                key={template}
                type="button"
                onClick={() => handleSend(template)}
                disabled={isLoading || !caseData}
                className="shrink-0 max-w-56 whitespace-normal rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-left text-xs leading-snug text-blue-700 transition-colors hover:border-blue-200 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {template}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 border-t border-gray-100 bg-white shrink-0">
          <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 transition-colors focus-within:border-blue-200 focus-within:bg-white">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                caseData
                  ? "Ask Navi about your case..."
                  : "Create a case to get started"
              }
              disabled={!caseData || isLoading}
              rows={1}
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none resize-none max-h-24"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading || !caseData}
              className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1.5 text-center">
            Navi · Powered by Groq
          </p>
        </div>
      </div>
    </>
  );
}

export default Navi;
