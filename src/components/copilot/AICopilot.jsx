// src/components/copilot/AICopilot.jsx

import { useState, useRef, useEffect } from "react";
import { useCase } from "../../context/CaseContext";
import { buildCaseContext, getSuggestedQuestions } from "../../utils/buildCaseContext";
import { sendCopilotMessage } from "../../services/api";

function AICopilot() {
  const { caseData, uploadedDocuments } = useCase();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Recompute context on every render — always fresh
  const caseContext = buildCaseContext(caseData, uploadedDocuments);

  const visaType = caseContext.visaType;
  const country = caseContext.country;
  const passportName = caseContext.passportData?.fullName;
  const firstName = passportName
    ? passportName.trim().split(" ")[0]
    : null;

  const { universal, specific } = getSuggestedQuestions(visaType);

  // Build greeting fresh each time it's needed
  function buildGreeting() {
    const name = firstName ? `${firstName} 👋` : "there 👋";

    if (!caseData) {
      return `Hi ${name}\n\nNo active case found. Please create a case first to get started.`;
    }

    const lines = [`Hi ${name}`];
    lines.push("");

    if (visaType && country) {
      lines.push(`You are applying for a **${visaType}** to **${country}**.`);
    } else if (visaType) {
      lines.push(`You are applying for a **${visaType}**.`);
    }

    lines.push("");

    const documentList = caseContext.uploadedDocuments || [];

    if (documentList.length > 0) {
      lines.push("**Document Status:**");
      documentList.forEach((doc) => {
        const icon = doc.valid ? "✓" : "✗";
        lines.push(`${icon} ${doc.requiredDocument}`);
      });
    } else {
      lines.push("No documents uploaded yet.");
    }

    lines.push("");
    lines.push("How can I help you today?");

    return lines.join("\n");
  }

  // When drawer opens: always re-inject a fresh greeting
  function handleOpen() {
    setIsOpen(true);

    // Always rebuild greeting so passport name / doc status is current
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        text: buildGreeting(),
      },
    ]);
    setHasGreeted(true);

    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function handleClose() {
    setIsOpen(false);
  }

  // If copilot is already open and passport gets uploaded, refresh greeting
  useEffect(() => {
    if (isOpen && hasGreeted) {
      setMessages((prev) => {
        const rest = prev.filter((m) => m.id !== prev[0]?.id);
        return [
          { id: Date.now(), role: "assistant", text: buildGreeting() },
          ...rest,
        ];
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passportName, uploadedDocuments]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  async function handleSend(messageText) {
    const text = (messageText || input).trim();
    if (!text || isLoading) return;

    const userMessage = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const data = await sendCopilotMessage(caseContext, text);

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", text: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
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

  // Show suggested questions only on the greeting message (no user messages yet)
  const showSuggestions =
    messages.length <= 1 && !isLoading && caseData;

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-all duration-200 hover:scale-110"
          title="Open VISM AI Copilot"
        >
          🤖
        </button>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-20 lg:bg-transparent"
          onClick={handleClose}
        />
      )}

      {/* Right Drawer */}
      <div
        className={`fixed top-0 right-0 h-full z-50 w-full sm:w-96 bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-blue-600 text-white px-4 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg">
              🤖
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">
                VISM AI Copilot
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
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-sm mr-2 shrink-0 mt-1">
                  🤖
                </div>
              )}
              <div
                className={`max-w-xs rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-sm"
                    : "bg-gray-100 text-gray-800 rounded-tl-sm"
                }`}
              >
                {renderText(msg.text)}
              </div>
            </div>
          ))}

          {/* Loading dots */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-sm mr-2 shrink-0">
                🤖
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
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

        {/* Suggested Questions */}
        {showSuggestions && (
          <div className="px-4 pb-2 shrink-0">
            <p className="text-xs text-gray-500 mb-2 font-medium">
              Suggested questions
            </p>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {[...specific, ...universal].map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-3 py-1.5 hover:bg-blue-100 transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-100 shrink-0">
          <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                caseData
                  ? "Ask about your case..."
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
            VISM AI Copilot · Powered by Groq
          </p>
        </div>
      </div>
    </>
  );
}

export default AICopilot;