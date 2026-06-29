// server/services/emailService.js
//
// Nodemailer transporter + email dispatch functions.
//
// Architecture decisions:
//   - Transporter is created lazily (first call) — no crash at startup if
//     SMTP env vars are not yet configured.
//   - Every send is fire-and-forget from the controller's perspective:
//     errors are logged but never propagated to the HTTP response.
//     A failed email must NEVER cause a 500 for the processor.
//   - EMAIL_ENABLED defaults to "true". Set EMAIL_ENABLED=false in .env
//     to disable all sending (useful in local dev without SMTP).
//   - In development (NODE_ENV !== "production") and without SMTP credentials,
//     emails are logged to console instead of sent — great for testing.
//
// Called from:
//   caseController.processorAction()  — processor actions on a case
//   caseController.createCase()       — new case submitted
//   authController.register()         — new applicant registered

import nodemailer from "nodemailer";
import dotenv     from "dotenv";

import {
  getTemplate,
  welcomeTemplate,
  caseSubmittedTemplate,
} from "./emailTemplates.js";

dotenv.config();

// ── Config ────────────────────────────────────────────────────────────────────
const EMAIL_ENABLED = process.env.EMAIL_ENABLED !== "false";
const IS_DEV        = process.env.NODE_ENV !== "production";

// ── Transporter (lazy singleton) ──────────────────────────────────────────────
let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    // Dev mode without SMTP configured — use a console logger
    console.warn(
      "[EmailService] SMTP_HOST / SMTP_USER / SMTP_PASS not set. " +
      "Emails will be logged to console instead of sent."
    );
    return null;
  }

  _transporter = nodemailer.createTransport({
    host,
    port:   parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_PORT === "465",  // true for port 465, false for 587
    auth:   { user, pass },
    // Improve deliverability: set a friendly name in the EHLO greeting
    name:   "vism-mailer",
  });

  return _transporter;
}

// ── Core send function ────────────────────────────────────────────────────────
// All public send functions funnel through here.
// Never throws — errors are caught and logged.

async function send({ to, subject, html, text }) {
  if (!EMAIL_ENABLED) {
    console.log(`[EmailService] Email disabled. Would have sent to: ${to} — Subject: ${subject}`);
    return;
  }

  if (!to || !to.trim()) {
    console.warn("[EmailService] Skipped: no recipient email address.");
    return;
  }

  const transporter = getTransporter();

  if (!transporter) {
    // Dev fallback — log the email content instead of sending
    console.log("\n──────────────────────────────────────────");
    console.log(`[EmailService] DEV MODE — Email not sent`);
    console.log(`  To      : ${to}`);
    console.log(`  Subject : ${subject}`);
    console.log(`  Text    :\n${text}`);
    console.log("──────────────────────────────────────────\n");
    return;
  }

  try {
    const info = await transporter.sendMail({
      from:    process.env.EMAIL_FROM || '"VISM" <noreply@vism.app>',
      to,
      subject,
      html,
      text,
    });

    console.log(`[EmailService] Sent to ${to} — MessageId: ${info.messageId}`);
  } catch (error) {
    // Log full error but do NOT rethrow — the caller used .catch() for safety
    // but belt-and-suspenders: we catch here too so any error chain is clean.
    console.error(`[EmailService] Failed to send to ${to}:`, error.message);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════════════════════════════

// ── sendWelcomeEmail ──────────────────────────────────────────────────────────
// Called from authController.register() after user is created.
// user: { name, email }

export async function sendWelcomeEmail(user) {
  try {
    const { subject, html, text } = welcomeTemplate(user);
    await send({ to: user.email, subject, html, text });
  } catch (err) {
    console.error("[EmailService] sendWelcomeEmail error:", err.message);
  }
}

// ── sendCaseSubmittedEmail ────────────────────────────────────────────────────
// Called from caseController.createCase() after case is persisted.
// caseRecord must have: applicantEmail, applicantName, caseId, visaType, country

export async function sendCaseSubmittedEmail(caseRecord) {
  if (!caseRecord.applicantEmail) return;

  try {
    const { subject, html, text } = caseSubmittedTemplate(caseRecord);
    await send({ to: caseRecord.applicantEmail, subject, html, text });
  } catch (err) {
    console.error("[EmailService] sendCaseSubmittedEmail error:", err.message);
  }
}

// ── sendCaseUpdateEmail ───────────────────────────────────────────────────────
// Called from caseController.processorAction() after any processor action.
//
// action:     one of approve | reject | request_documents | add_note
// caseRecord: the full updated Case document from MongoDB
// note:       the processor's note text (may be empty string)

export async function sendCaseUpdateEmail(caseRecord, action, note) {
  if (!caseRecord.applicantEmail) {
    console.warn(`[EmailService] No applicantEmail on case ${caseRecord.caseId} — skipping.`);
    return;
  }

  // Never email the applicant for a view_case action
  if (action === "view_case") return;

  try {
    const { subject, html, text } = getTemplate(action, caseRecord, note);
    await send({ to: caseRecord.applicantEmail, subject, html, text });
  } catch (err) {
    console.error("[EmailService] sendCaseUpdateEmail error:", err.message);
  }
}