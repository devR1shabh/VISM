// src/components/navi/Navi.jsx
// Phase 1 — Redesigned to match the VISM design system exactly.
// All logic, API integrations, context handling, and message history preserved.
// Only visual layer updated to match tokens.css / existing dashboard patterns.

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, X, Sparkles, MessageSquare } from "lucide-react";
import { useCase } from "../../context/CaseContext";
import { buildCaseContext, getSuggestedQuestions } from "../../utils/buildCaseContext";
import { sendNaviMessage } from "../../services/api";

const EMPTY_MESSAGES = [];
const INTRO_MESSAGE_ID = "navi-intro";

// ── Timestamp helper ──────────────────────────────────────────────────────────
function formatTime(date = new Date()) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── Markdown-lite text renderer (bold only) ───────────────────────────────────
function MessageText({ text }) {
  return (
    <span>
      {text.split("\n").map((line, i) => {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <span key={i}>
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j}>{part}</strong> : part
            )}
            {i < text.split("\n").length - 1 && <br />}
          </span>
        );
      })}
    </span>
  );
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      {/* Navi avatar */}
      <div className="w-7 h-7 rounded-full bg-[var(--c-green)] flex items-center justify-center shrink-0">
        <Sparkles size={12} className="text-white" />
      </div>
      <div className="bg-[var(--c-card)] border border-[var(--c-border)] rounded-[var(--r-xl)] rounded-bl-[var(--r-sm)] px-4 py-3 shadow-[var(--shadow-card)]">
        <div className="flex gap-1 items-center h-4">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="w-1.5 h-1.5 rounded-full bg-[var(--c-text-muted)] animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Suggested prompt chip ─────────────────────────────────────────────────────
function SuggestChip({ label, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="shrink-0 text-left rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-bg)] px-3 py-2 text-xs text-[var(--c-text-mid)] leading-snug transition hover:border-[var(--c-green)] hover:bg-[var(--c-green-bg)] hover:text-[var(--c-green)] disabled:cursor-not-allowed disabled:opacity-40 max-w-[13rem] whitespace-normal"
    >
      {label}
    </button>
  );
}

// ── Welcome / empty state ─────────────────────────────────────────────────────
function WelcomeState({ introText, onSuggest, disabled }) {
  const quickTemplates = getSuggestedQuestions().slice(0, 4);
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-10 text-center">
      {/* Icon */}
      <div className="w-14 h-14 rounded-full bg-[var(--c-green-bg)] border border-[var(--c-green-light)] flex items-center justify-center mb-4">
        <Sparkles size={24} className="text-[var(--c-green)]" />
      </div>

      {/* Intro text */}
      <div className="text-sm text-[var(--c-text-mid)] leading-relaxed mb-6 max-w-xs">
        <MessageText text={introText} />
      </div>

      {/* Suggested prompts grid */}
      <div className="w-full text-left">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--c-text-muted)] font-semibold mb-3">
          Suggested questions
        </p>
        <div className="grid grid-cols-1 gap-2">
          {quickTemplates.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onSuggest(q)}
              disabled={disabled}
              className="text-left rounded-[var(--r-lg)] border border-[var(--c-border)] bg-[var(--c-card)] px-4 py-3 text-sm text-[var(--c-text-mid)] transition hover:border-[var(--c-green)] hover:bg-[var(--c-green-bg)] hover:text-[var(--c-green)] disabled:opacity-40 disabled:cursor-not-allowed shadow-[var(--shadow-card)]"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Navi component ───────────────────────────────────────────────────────
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
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messages = naviMessages ?? EMPTY_MESSAGES;

  // Recompute context on every render — always fresh
  const caseContext = buildCaseContext(caseData, uploadedDocuments);
  const { visaType, country, passportData } = caseContext;
  const quickTemplates = getSuggestedQuestions();

  // ── Greeting builder (unchanged logic) ───────────────────────────────────
  const buildIntroMessage = useCallback(() => {
    if (passportData?.fullName) {
      const firstName = passportData.fullName.trim().split(" ")[0];
      const caseDetail =
        visaType && country
          ? `I can see you're currently preparing a ${visaType} application for ${country}.`
          : visaType
          ? `I can see you're currently preparing a ${visaType} application.`
          : "";

      return [
        `Hi ${firstName} 👋`,
        "",
        `I'm Navi, your visa and immigration assistant.${caseDetail ? " " + caseDetail : ""}`,
        "",
        "I can help explain your visa process, identify potential risks, answer application questions, and guide you through your visa journey.",
      ].join("\n");
    }

    return [
      "Hi, I'm Navi 👋",
      "",
      "I'm your visa and immigration assistant. I can help explain your visa process, identify potential risks, answer application questions, and guide you through your visa journey.",
    ].join("\n");
  }, [passportData, visaType, country]);

  // ── Launcher bubble auto-hide (unchanged) ────────────────────────────────
  useEffect(() => {
    if (isOpen) return;
    const timer = window.setTimeout(() => setShowLauncherGreeting(false), 6500);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  // ── Passport-aware greeting refresh (unchanged) ──────────────────────────
  useEffect(() => {
    if (messages.length > 0) return;
    if (isOpen) {
      setNaviMessages([
        { id: INTRO_MESSAGE_ID, role: "assistant", text: buildIntroMessage(), time: formatTime() },
      ]);
    }
  }, [messages.length, isOpen, buildIntroMessage, setNaviMessages]);

  function handleOpen() {
    setIsOpen(true);
    setShowLauncherGreeting(false);
    setUnreadCount(0);

    if (messages.length === 0) {
      setNaviMessages([
        { id: INTRO_MESSAGE_ID, role: "assistant", text: buildIntroMessage(), time: formatTime() },
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

  // ── Send message (unchanged logic) ───────────────────────────────────────
  async function handleSend(messageText) {
    const text = (messageText || input).trim();
    if (!text || isLoading) return;

    setNaviMessages((prev) => {
      const current =
        prev.length > 0
          ? prev
          : [{ id: INTRO_MESSAGE_ID, role: "assistant", text: buildIntroMessage(), time: formatTime() }];

      return [
        ...current,
        { id: `user-${current.length}`, role: "user", text, time: formatTime() },
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
          time: formatTime(),
        },
      ]);
      if (!isOpen) setUnreadCount((c) => c + 1);
    } catch {
      setNaviMessages((prev) => [
        ...prev,
        {
          id: `assistant-${prev.length}`,
          role: "assistant",
          text: "Sorry, I couldn't process that. Please try again.",
          time: formatTime(),
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

  // Has the user sent any messages yet (beyond the intro)?
  const hasConversation = messages.length > 1;

  return (
    <>
      {/* ── Launcher button ─────────────────────────────────────────────── */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
          {/* Greeting bubble */}
          {showLauncherGreeting && (
            <button
              type="button"
              onClick={handleOpen}
              className="mb-1 max-w-[14rem] rounded-[var(--r-xl)] border border-[var(--c-border)] bg-[var(--c-card)] px-4 py-3 text-left shadow-[var(--shadow-modal)] transition hover:border-[var(--c-green)] hover:shadow-[var(--shadow-card-hover)] animate-fade-in"
            >
              <span className="block text-sm font-semibold text-[var(--c-text)]">
                👋 Hi, I&apos;m Navi
              </span>
              <span className="text-xs text-[var(--c-text-muted)]">
                Ask me about your visa process.
              </span>
            </button>
          )}

          {/* FAB */}
          <button
            onClick={handleOpen}
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[var(--c-green)] text-white shadow-[var(--shadow-modal)] ring-4 ring-[var(--c-green-light)] transition hover:bg-[var(--c-green-mid)] hover:scale-105 active:scale-95"
            title="Open Navi — AI Visa Assistant"
            aria-label="Open Navi"
          >
            <MessageSquare size={22} />

            {/* Unread badge */}
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--c-error)] text-[10px] font-bold text-white border-2 border-white">
                {unreadCount}
              </span>
            )}

            {/* Online dot */}
            <span className="absolute right-1 bottom-1 h-3 w-3 rounded-full border-2 border-white bg-[var(--c-success)]" />
          </button>
        </div>
      )}

      {/* ── Backdrop ────────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/10 lg:bg-transparent"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* ── Drawer ──────────────────────────────────────────────────────── */}
      <div
        className={`fixed top-0 right-0 h-full z-50 w-full sm:w-[26rem] flex flex-col bg-[var(--c-bg)] shadow-[var(--shadow-modal)] transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Navi AI Assistant"
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="bg-[var(--c-green)] px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">Navi</p>
              <p className="text-[11px] text-white/60 leading-tight mt-0.5">
                {visaType && country
                  ? `${visaType} · ${country}`
                  : visaType || "AI Visa Assistant"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status dot */}
            <span className="flex items-center gap-1.5 text-[11px] text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-success)] inline-block" />
              Online
            </span>
            <button
              onClick={handleClose}
              className="ml-2 w-8 h-8 rounded-[var(--r-lg)] bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"
              aria-label="Close Navi"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Context strip ───────────────────────────────────────────── */}
        {caseData && (
          <div className="bg-[var(--c-green-bg)] border-b border-[var(--c-green-light)] px-5 py-2 flex gap-3 overflow-x-auto scrollbar-none">
            {[
              { label: "Case", value: caseData.caseId || caseData.id || "—" },
              { label: "Type", value: visaType || "—" },
              { label: "Destination", value: country || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="shrink-0 flex items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--c-green)] font-semibold opacity-70">
                  {label}:
                </span>
                <span className="text-[11px] font-semibold text-[var(--c-green)]">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Messages area ────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 py-5 scroll-smooth">
          {/* Welcome / empty state */}
          {!hasConversation && messages.length > 0 ? (
            <WelcomeState
              introText={messages[0].text}
              onSuggest={handleSend}
              disabled={isLoading || !caseData}
            />
          ) : (
            <div className="space-y-5">
              {messages.map((msg, index) => (
                <div
                  key={msg.id ?? `${msg.role}-${index}`}
                  className={`flex items-end gap-2 animate-fade-in ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Assistant avatar */}
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-[var(--c-green)] flex items-center justify-center shrink-0">
                      <Sparkles size={12} className="text-white" />
                    </div>
                  )}

                  <div className="flex flex-col gap-1 max-w-[78%]">
                    {/* Bubble */}
                    <div
                      className={`px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[var(--c-green)] text-white rounded-[var(--r-xl)] rounded-br-[var(--r-sm)] shadow-[var(--shadow-card)]"
                          : "bg-[var(--c-card)] text-[var(--c-text-mid)] border border-[var(--c-border)] rounded-[var(--r-xl)] rounded-bl-[var(--r-sm)] shadow-[var(--shadow-card)]"
                      }`}
                    >
                      <MessageText text={msg.text} />
                    </div>
                    {/* Timestamp */}
                    {msg.time && (
                      <span
                        className={`text-[10px] text-[var(--c-text-muted)] ${
                          msg.role === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        {msg.time}
                      </span>
                    )}
                  </div>

                  {/* User avatar */}
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-[var(--c-border)] flex items-center justify-center shrink-0 text-xs font-bold text-[var(--c-text-muted)]">
                      {passportData?.fullName
                        ? passportData.fullName.trim()[0].toUpperCase()
                        : "U"}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ── Quick templates strip ────────────────────────────────────── */}
        {hasConversation && (
          <div className="border-t border-[var(--c-border)] bg-[var(--c-card)] px-4 pt-3 pb-2 shrink-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--c-text-muted)] font-semibold mb-2">
              Quick questions · scroll →
            </p>
            <div
              className="flex gap-2 overflow-x-auto pb-2"
              style={{ scrollbarWidth: "thin", scrollbarColor: "var(--c-border) transparent" }}
            >
              {quickTemplates.map((template) => (
                <SuggestChip
                  key={template}
                  label={template}
                  onClick={() => handleSend(template)}
                  disabled={isLoading || !caseData}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Input area ───────────────────────────────────────────────── */}
        <div className="border-t border-[var(--c-border)] bg-[var(--c-card)] px-4 py-3 shrink-0">
          <div
            className={`flex items-end gap-2 rounded-[var(--r-lg)] border bg-[var(--c-bg)] px-3 py-2 transition-colors ${
              caseData && !isLoading
                ? "border-[var(--c-border)] focus-within:border-[var(--c-green)] focus-within:bg-white"
                : "border-[var(--c-border)] opacity-60"
            }`}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                caseData
                  ? "Ask Navi about your case…"
                  : "Create a case to get started"
              }
              disabled={!caseData || isLoading}
              rows={1}
              className="flex-1 bg-transparent text-sm text-[var(--c-text)] placeholder-[var(--c-text-muted)] outline-none resize-none max-h-28 leading-relaxed"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading || !caseData}
              className="shrink-0 w-8 h-8 rounded-[var(--r-lg)] bg-[var(--c-green)] text-white flex items-center justify-center transition hover:bg-[var(--c-green-mid)] disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
              aria-label="Send message"
            >
              <Send size={13} />
            </button>
          </div>
          <p className="text-[10px] text-[var(--c-text-muted)] mt-1.5 text-center">
            Navi · Powered by Groq · AI can make mistakes
          </p>
        </div>
      </div>
    </>
  );
}

export default Navi;