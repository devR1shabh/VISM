// server/services/emailTemplates.js
//
// HTML + plain-text email templates for every VISM notification event.
//
// Design decisions:
//   - Inline CSS only — most email clients strip <style> blocks.
//   - A single shared layout wrapper keeps the visual language consistent.
//   - Every template returns { subject, html, text } so emailService.js
//     never needs to know which template is being used.
//   - Plain-text versions are required for accessibility and deliverability.
//   - The applicant's name is personalised on every email.
//   - A portal link is included on every email so the applicant can
//     always navigate back to their case with one click.

// ── Design constants ──────────────────────────────────────────────────────────
// These mirror the VISM token system as hex values (email clients don't
// support CSS variables).
const GREEN       = "#1C4532";
const GREEN_MID   = "#2D6A4F";
const GREEN_LIGHT = "#D1FAE5";
const BG          = "#F7F7F5";
const CARD        = "#FFFFFF";
const BORDER      = "#E5E5E3";
const TEXT        = "#111111";
const TEXT_MID    = "#374151";
const TEXT_MUTED  = "#6B7280";
const WARNING_BG  = "#FEF3C7";
const WARNING     = "#92400E";
const ERROR_BG    = "#FEE2E2";
const ERROR       = "#7F1D1D";
const INFO_BG     = "#DBEAFE";
const INFO        = "#1E3A8A";

const PORTAL_URL  = process.env.FRONTEND_URL || "http://localhost:5173";

// ── Shared HTML layout ────────────────────────────────────────────────────────
function layout({ title, preheader, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <!-- Preheader (hidden preview text) -->
  <span style="display:none;font-size:1px;color:${BG};max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${preheader}
  </span>

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG};padding:32px 16px;">
    <tr>
      <td align="center">
        <!-- Card -->
        <table role="presentation" width="100%" style="max-width:560px;background-color:${CARD};border:1px solid ${BORDER};border-radius:12px;overflow:hidden;">

          <!-- Header bar -->
          <tr>
            <td style="background-color:${GREEN};padding:24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:22px;font-weight:800;color:#FFFFFF;letter-spacing:-0.01em;">VISM</span>
                    <br/>
                    <span style="font-size:10px;font-weight:600;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.2em;">Visa &amp; Immigration Services</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:${BG};border-top:1px solid ${BORDER};padding:20px 32px;">
              <p style="margin:0;font-size:11px;color:${TEXT_MUTED};line-height:1.6;">
                This email was sent by VISM — Visa &amp; Immigration Services Management.
                You are receiving this because you have an active applicant account.<br/>
                Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Reusable HTML snippets ────────────────────────────────────────────────────

function h1(text) {
  return `<h1 style="margin:0 0 8px 0;font-size:22px;font-weight:700;color:${TEXT};line-height:1.2;">${text}</h1>`;
}

function para(text, color = TEXT_MID) {
  return `<p style="margin:0 0 16px 0;font-size:14px;color:${color};line-height:1.6;">${text}</p>`;
}

function caseMetaTable(caseRecord) {
  const rows = [
    ["Case ID",      caseRecord.caseId  || "—"],
    ["Visa Type",    caseRecord.visaType || "—"],
    ["Destination",  caseRecord.country  || "—"],
  ];

  const rowsHtml = rows.map(([label, value]) => `
    <tr>
      <td style="padding:8px 12px;font-size:12px;font-weight:600;color:${TEXT_MUTED};text-transform:uppercase;letter-spacing:0.08em;white-space:nowrap;width:120px;">${label}</td>
      <td style="padding:8px 12px;font-size:13px;color:${TEXT_MID};border-left:1px solid ${BORDER};">${value}</td>
    </tr>`).join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="border:1px solid ${BORDER};border-radius:8px;overflow:hidden;margin:20px 0;">
      <tbody>${rowsHtml}</tbody>
    </table>`;
}

function noteBox(note, bg = INFO_BG, color = INFO) {
  if (!note || !note.trim()) return "";
  return `
    <div style="background-color:${bg};border-left:3px solid ${color};border-radius:0 6px 6px 0;padding:12px 16px;margin:16px 0;">
      <p style="margin:0 0 4px 0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${color};">
        Processor Note
      </p>
      <p style="margin:0;font-size:13px;color:${TEXT_MID};line-height:1.5;">${note}</p>
    </div>`;
}

function ctaButton(label, url) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 0 0;">
      <tr>
        <td style="background-color:${GREEN};border-radius:8px;">
          <a href="${url}" target="_blank"
            style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:8px;">
            ${label}
          </a>
        </td>
      </tr>
    </table>`;
}

function divider() {
  return `<hr style="border:none;border-top:1px solid ${BORDER};margin:24px 0;" />`;
}

// ── Plain-text builder ────────────────────────────────────────────────────────
function plainText(lines) {
  return lines.filter(Boolean).join("\n\n") + `\n\n──────────────────────────────\nVISM — Visa & Immigration Services\nThis is an automated notification. Please do not reply.\n`;
}

// ═════════════════════════════════════════════════════════════════════════════
// TEMPLATE 1 — Welcome (sent on registration)
// ═════════════════════════════════════════════════════════════════════════════
export function welcomeTemplate(user) {
  const subject   = "Welcome to VISM — Your account is ready";
  const preheader = "Your VISM applicant account has been created. Start your visa journey today.";

  const bodyHtml = `
    ${h1("Welcome to VISM")}
    ${para(`Hi ${user.name},`)}
    ${para("Your applicant account has been created successfully. You can now create and manage visa cases, upload documents, and track your application status — all in one place.")}
    ${divider()}
    <p style="margin:0 0 6px 0;font-size:12px;font-weight:600;color:${TEXT_MUTED};text-transform:uppercase;letter-spacing:0.08em;">Your Account</p>
    <p style="margin:0 0 16px 0;font-size:14px;color:${TEXT_MID};">
      <strong>Name:</strong> ${user.name}<br/>
      <strong>Email:</strong> ${user.email}
    </p>
    ${ctaButton("Go to My Cases", `${PORTAL_URL}/my-cases`)}`;

  const text = plainText([
    "WELCOME TO VISM",
    `Hi ${user.name},`,
    "Your applicant account has been created successfully. You can now create and manage visa cases, upload documents, and track your application status.",
    `Account: ${user.name} (${user.email})`,
    `Log in: ${PORTAL_URL}/login`,
  ]);

  return { subject, html: layout({ title: subject, preheader, bodyHtml }), text };
}

// ═════════════════════════════════════════════════════════════════════════════
// TEMPLATE 2 — Case Submitted (sent on case creation)
// ═════════════════════════════════════════════════════════════════════════════
export function caseSubmittedTemplate(caseRecord) {
  const name    = caseRecord.applicantName || "Applicant";
  const subject = `[VISM] Case Submitted — ${caseRecord.caseId}`;
  const preheader = `Your visa application for ${caseRecord.visaType} (${caseRecord.country}) has been submitted and is under review.`;

  const bodyHtml = `
    ${h1("Case Submitted Successfully")}
    ${para(`Hi ${name},`)}
    ${para("Your visa application has been submitted and is now in our queue for review. A processor will assess your case shortly.")}
    ${caseMetaTable(caseRecord)}
    ${para("You will receive an email notification whenever your case status changes.", TEXT_MUTED)}
    ${ctaButton("View My Cases", `${PORTAL_URL}/my-cases`)}`;

  const text = plainText([
    "CASE SUBMITTED",
    `Hi ${name},`,
    "Your visa application has been submitted and is now in our queue for review.",
    `Case ID: ${caseRecord.caseId}`,
    `Visa Type: ${caseRecord.visaType}`,
    `Destination: ${caseRecord.country}`,
    `View your cases: ${PORTAL_URL}/my-cases`,
  ]);

  return { subject, html: layout({ title: subject, preheader, bodyHtml }), text };
}

// ═════════════════════════════════════════════════════════════════════════════
// TEMPLATE 3 — Case Approved
// ═════════════════════════════════════════════════════════════════════════════
export function caseApprovedTemplate(caseRecord, note) {
  const name    = caseRecord.applicantName || "Applicant";
  const subject = `[VISM] Case Approved — ${caseRecord.caseId}`;
  const preheader = `Great news! Your ${caseRecord.visaType} application for ${caseRecord.country} has been approved.`;

  const bodyHtml = `
    <div style="background-color:${GREEN_LIGHT};border:1px solid #6EE7B7;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center;">
      <span style="font-size:28px;">✅</span>
      <p style="margin:8px 0 0 0;font-size:16px;font-weight:700;color:${GREEN};">Application Approved</p>
    </div>
    ${h1("Congratulations!")}
    ${para(`Hi ${name},`)}
    ${para(`Your visa application has been <strong style="color:${GREEN};">approved</strong>. This is a significant milestone in your immigration journey.`)}
    ${caseMetaTable(caseRecord)}
    ${noteBox(note, GREEN_LIGHT, GREEN_MID)}
    ${para("Please log in to your portal to view the full approval details and next steps.", TEXT_MUTED)}
    ${ctaButton("View My Cases", `${PORTAL_URL}/my-cases`)}`;

  const text = plainText([
    "CASE APPROVED — CONGRATULATIONS!",
    `Hi ${name},`,
    `Your visa application has been APPROVED.`,
    `Case ID: ${caseRecord.caseId}`,
    `Visa Type: ${caseRecord.visaType}`,
    `Destination: ${caseRecord.country}`,
    note ? `Processor Note: ${note}` : null,
    `View your cases: ${PORTAL_URL}/my-cases`,
  ]);

  return { subject, html: layout({ title: subject, preheader, bodyHtml }), text };
}

// ═════════════════════════════════════════════════════════════════════════════
// TEMPLATE 4 — Case Rejected
// ═════════════════════════════════════════════════════════════════════════════
export function caseRejectedTemplate(caseRecord, note) {
  const name    = caseRecord.applicantName || "Applicant";
  const subject = `[VISM] Case Update — ${caseRecord.caseId}`;
  const preheader = `An update regarding your ${caseRecord.visaType} application for ${caseRecord.country}.`;

  const bodyHtml = `
    <div style="background-color:${ERROR_BG};border:1px solid #FECACA;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center;">
      <span style="font-size:28px;">❌</span>
      <p style="margin:8px 0 0 0;font-size:16px;font-weight:700;color:${ERROR};">Application Not Approved</p>
    </div>
    ${h1("Update on Your Application")}
    ${para(`Hi ${name},`)}
    ${para("We regret to inform you that your visa application has not been approved at this time. Please review the processor's notes below for further information.")}
    ${caseMetaTable(caseRecord)}
    ${noteBox(note, ERROR_BG, ERROR)}
    ${para("If you have questions about this decision, please contact our support team. You may be eligible to reapply after addressing the concerns raised.", TEXT_MUTED)}
    ${ctaButton("View My Cases", `${PORTAL_URL}/my-cases`)}`;

  const text = plainText([
    "CASE UPDATE",
    `Hi ${name},`,
    "We regret to inform you that your visa application has not been approved at this time.",
    `Case ID: ${caseRecord.caseId}`,
    `Visa Type: ${caseRecord.visaType}`,
    `Destination: ${caseRecord.country}`,
    note ? `Processor Note: ${note}` : null,
    `View your cases: ${PORTAL_URL}/my-cases`,
  ]);

  return { subject, html: layout({ title: subject, preheader, bodyHtml }), text };
}

// ═════════════════════════════════════════════════════════════════════════════
// TEMPLATE 5 — Additional Documents Required
// ═════════════════════════════════════════════════════════════════════════════
export function documentsRequiredTemplate(caseRecord, note) {
  const name    = caseRecord.applicantName || "Applicant";
  const subject = `[VISM] Action Required — ${caseRecord.caseId}`;
  const preheader = `Your processor has requested additional documents for your ${caseRecord.visaType} application.`;

  const bodyHtml = `
    <div style="background-color:${INFO_BG};border:1px solid #BFDBFE;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center;">
      <span style="font-size:28px;">📎</span>
      <p style="margin:8px 0 0 0;font-size:16px;font-weight:700;color:${INFO};">Additional Documents Required</p>
    </div>
    ${h1("Action Required")}
    ${para(`Hi ${name},`)}
    ${para("Your processor has reviewed your application and requires additional documents before they can proceed. Please upload the requested items as soon as possible to avoid delays.")}
    ${caseMetaTable(caseRecord)}
    ${noteBox(note, INFO_BG, INFO)}
    ${para("Log in to your portal, open your case, and upload the required documents under the Documents section.", TEXT_MUTED)}
    ${ctaButton("Upload Documents", `${PORTAL_URL}/my-cases`)}`;

  const text = plainText([
    "ACTION REQUIRED — ADDITIONAL DOCUMENTS NEEDED",
    `Hi ${name},`,
    "Your processor has reviewed your application and requires additional documents.",
    `Case ID: ${caseRecord.caseId}`,
    `Visa Type: ${caseRecord.visaType}`,
    `Destination: ${caseRecord.country}`,
    note ? `Processor Note: ${note}` : null,
    `Upload documents: ${PORTAL_URL}/my-cases`,
  ]);

  return { subject, html: layout({ title: subject, preheader, bodyHtml }), text };
}

// ═════════════════════════════════════════════════════════════════════════════
// TEMPLATE 6 — Processor Note Added
// ═════════════════════════════════════════════════════════════════════════════
export function noteAddedTemplate(caseRecord, note) {
  const name    = caseRecord.applicantName || "Applicant";
  const subject = `[VISM] New Note on Your Case — ${caseRecord.caseId}`;
  const preheader = `Your processor has added a note to your ${caseRecord.visaType} application.`;

  const bodyHtml = `
    ${h1("Your Processor Left a Note")}
    ${para(`Hi ${name},`)}
    ${para("Your processor has added a note to your visa case. Please review it below.")}
    ${caseMetaTable(caseRecord)}
    ${noteBox(note)}
    ${para("No action is required unless the note specifically requests one. Log in to your portal for the full case context.", TEXT_MUTED)}
    ${ctaButton("View My Cases", `${PORTAL_URL}/my-cases`)}`;

  const text = plainText([
    "NEW NOTE ON YOUR CASE",
    `Hi ${name},`,
    "Your processor has added a note to your visa case.",
    `Case ID: ${caseRecord.caseId}`,
    `Visa Type: ${caseRecord.visaType}`,
    `Destination: ${caseRecord.country}`,
    note ? `Note: ${note}` : null,
    `View your cases: ${PORTAL_URL}/my-cases`,
  ]);

  return { subject, html: layout({ title: subject, preheader, bodyHtml }), text };
}

// ═════════════════════════════════════════════════════════════════════════════
// TEMPLATE DISPATCHER
// Used by emailService.sendCaseUpdateEmail() to select the right template.
// ═════════════════════════════════════════════════════════════════════════════
export function getTemplate(action, caseRecord, note) {
  switch (action) {
    case "approve":           return caseApprovedTemplate(caseRecord, note);
    case "reject":            return caseRejectedTemplate(caseRecord, note);
    case "request_documents": return documentsRequiredTemplate(caseRecord, note);
    case "add_note":          return noteAddedTemplate(caseRecord, note);
    case "case_submitted":    return caseSubmittedTemplate(caseRecord);
    default:
      // Fallback for unknown action types — generic note template
      return noteAddedTemplate(caseRecord, note);
  }
}