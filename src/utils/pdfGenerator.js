// src/utils/pdfGenerator.js
// Phase 2 — Redesigned PDF export matching VISM design system.
// Uses jsPDF + jspdf-autotable.
// Branding: forest green (#1C4532) as sole accent, warm off-white backgrounds,
// Inter for body, editorial hierarchy, A4 page breaks handled.

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { normalizeUploadedDocuments } from "./documentUtils.js";
import { calculateReadiness, deriveDocumentSummary } from "../engines/readinessEngine.js";

// ── Design tokens (mirrors tokens.css exactly) ──────────────────────────────
const T = {
  green:       [28,  69, 50],   // #1C4532
  greenMid:    [45, 106, 79],   // #2D6A4F
  greenLight:  [209, 250, 229], // #D1FAE5
  greenBg:     [240, 253, 244], // #F0FDF4
  bg:          [247, 247, 245], // #F7F7F5
  bgAlt:       [239, 239, 237], // #EFEFED
  card:        [255, 255, 255], // #FFFFFF
  border:      [229, 229, 227], // #E5E5E3
  text:        [17,  17,  17],  // #111111
  textMid:     [55,  65,  81],  // #374151
  textMuted:   [107, 114, 128], // #6B7280
  success:     [22, 163, 74],   // #16A34A
  successBg:   [220, 252, 231], // #DCFCE7
  warning:     [217, 119,  6],  // #D97706
  warningBg:   [254, 243, 199], // #FEF3C7
  error:       [220,  38, 38],  // #DC2626
  errorBg:     [254, 226, 226], // #FEE2E2
  info:        [37,  99, 235],  // #2563EB
  infoBg:      [219, 234, 254], // #DBEAFE
  white:       [255, 255, 255],
};

// ── Page constants (A4 in mm) ────────────────────────────────────────────────
const PAGE_W    = 210;
const PAGE_H    = 297;
const MARGIN    = 16;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ── Helpers ──────────────────────────────────────────────────────────────────
function rgb(doc, color) {
  doc.setTextColor(...color);
}
function fill(doc, color) {
  doc.setFillColor(...color);
}
function stroke(doc, color) {
  doc.setDrawColor(...color);
}
function setFont(doc, size, style = "normal") {
  doc.setFontSize(size);
  doc.setFont("helvetica", style);
}

// Check if there is enough space; add page if not
function ensureSpace(doc, y, needed) {
  if (y + needed > PAGE_H - 20) {
    doc.addPage();
    return MARGIN + 10;
  }
  return y;
}

// Thin horizontal rule using border token
function rule(doc, y) {
  stroke(doc, T.border);
  doc.setLineWidth(0.2);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  return y + 4;
}

// Eyebrow label (10px uppercase muted)
function eyebrow(doc, text, x, y) {
  setFont(doc, 7, "bold");
  rgb(doc, T.textMuted);
  doc.text(text.toUpperCase(), x, y);
  return y + 4;
}

// Section heading with green left-bar accent
function sectionHeading(doc, text, y) {
  y = ensureSpace(doc, y, 14);
  fill(doc, T.green);
  doc.rect(MARGIN, y - 4, 3, 8, "F");
  setFont(doc, 11, "bold");
  rgb(doc, T.text);
  doc.text(text, MARGIN + 6, y + 1);
  return y + 9;
}

// Small status badge pill
function badge(doc, text, x, y, bgColor, textColor) {
  const label = text.toUpperCase();
  setFont(doc, 7, "bold");
  const w = doc.getTextWidth(label) + 6;
  fill(doc, bgColor);
  stroke(doc, bgColor);
  doc.roundedRect(x, y - 3.5, w, 5.5, 1.5, 1.5, "F");
  rgb(doc, textColor);
  doc.text(label, x + 3, y + 0.5);
  return x + w + 3;
}

// Readiness colour map (mirrors readinessEngine colour output)
function readinessColor(color) {
  const map = {
    gray:  T.textMuted,
    red:   T.error,
    amber: T.warning,
    blue:  T.info,
    green: T.success,
  };
  return map[color] || T.textMuted;
}

// Risk level colours
function riskColors(level) {
  switch (level) {
    case "HIGH":   return { bg: T.errorBg,   text: T.error,   label: "HIGH"   };
    case "MEDIUM": return { bg: T.warningBg, text: T.warning, label: "MEDIUM" };
    default:       return { bg: T.successBg, text: T.success, label: "LOW"    };
  }
}

// ── Cover / header band ──────────────────────────────────────────────────────
function drawCoverHeader(doc, caseData, passportData) {
  // Green header band
  fill(doc, T.green);
  doc.rect(0, 0, PAGE_W, 52, "F");

  // Brand name
  setFont(doc, 18, "bold");
  rgb(doc, T.white);
  doc.text("BlueprintAI", MARGIN, 18);

  // Sub-title
  setFont(doc, 9, "normal");
  rgb(doc, [255, 255, 255]);
  doc.setTextColor(255, 255, 255);
  doc.setGState && doc.setGState(doc.GState({ opacity: 0.65 }));
  doc.text("Visa Application Summary Report", MARGIN, 26);
  doc.setGState && doc.setGState(doc.GState({ opacity: 1 }));

  // Date badge — right aligned
  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
  setFont(doc, 8, "normal");
  rgb(doc, T.white);
  doc.text(dateStr, PAGE_W - MARGIN, 26, { align: "right" });

  // Accent divider line (light green)
  fill(doc, T.greenMid);
  doc.rect(0, 52, PAGE_W, 1.5, "F");

  // Green-bg summary band beneath header
  fill(doc, T.greenBg);
  doc.rect(0, 53.5, PAGE_W, 28, "F");
  stroke(doc, T.greenLight);
  doc.setLineWidth(0.2);
  doc.line(0, 81.5, PAGE_W, 81.5);

  const pills = [
    { label: "Visa Type",    value: caseData?.visaType || "—" },
    { label: "Destination",  value: caseData?.country  || "—" },
    { label: "Case ID",      value: caseData?.caseId || caseData?.id || "—" },
    { label: "Applicant",    value: passportData?.fullName || "—" },
  ];

  const colW = CONTENT_W / pills.length;
  pills.forEach(({ label, value }, i) => {
    const x = MARGIN + i * colW;
    eyebrow(doc, label, x, 62);
    setFont(doc, 9, "bold");
    rgb(doc, T.green);
    doc.text(value, x, 72);
  });

  return 92; // y position after header
}

// ── Applicant summary card ───────────────────────────────────────────────────
function drawApplicantSummary(doc, passportData, y) {
  y = sectionHeading(doc, "Applicant Information", y);

  if (!passportData) {
    setFont(doc, 9, "normal");
    rgb(doc, T.textMuted);
    doc.text("No passport data available.", MARGIN + 6, y);
    return y + 10;
  }

  const fields = [
    ["Full Name",          passportData.fullName         || "—"],
    ["Nationality",        passportData.nationality      || "—"],
    ["Date of Birth",      passportData.dateOfBirth      || "—"],
    ["Passport Number",    passportData.passportNumber   || "—"],
    ["Expiry Date",        passportData.expiryDate       || "—"],
    ["Issuing Country",    passportData.issuingCountry   || "—"],
  ];

  const halfW = CONTENT_W / 2 - 3;

  fields.forEach(([label, value], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = MARGIN + col * (halfW + 6);
    const ry = y + row * 16;

    y = ensureSpace(doc, ry + 14, 14);

    // Subtle row background
    fill(doc, col === 0 && row % 2 === 0 ? T.bg : T.card);
    doc.rect(x, ry - 3, halfW, 13, "F");
    stroke(doc, T.border);
    doc.setLineWidth(0.2);
    doc.rect(x, ry - 3, halfW, 13);

    eyebrow(doc, label, x + 3, ry + 1);
    setFont(doc, 9, "bold");
    rgb(doc, T.text);
    doc.text(value, x + 3, ry + 8);
  });

  return y + Math.ceil(fields.length / 2) * 16 + 6;
}

// ── Readiness score bar ──────────────────────────────────────────────────────
function drawReadinessScore(doc, score, label, color, valid, required, y) {
  y = sectionHeading(doc, "Application Readiness Score", y);

  const barY   = y + 2;
  const barH   = 7;
  const barW   = CONTENT_W;
  const fillW  = Math.max(0, Math.min(1, score / 100)) * barW;
  const barCol = readinessColor(color);

  // Track
  fill(doc, T.border);
  doc.roundedRect(MARGIN, barY, barW, barH, 2, 2, "F");
  // Fill
  if (fillW > 0) {
    fill(doc, barCol);
    doc.roundedRect(MARGIN, barY, fillW, barH, 2, 2, "F");
  }
  // Score text inside bar
  if (score > 10) {
    setFont(doc, 7, "bold");
    rgb(doc, T.white);
    doc.text(`${score}%`, MARGIN + fillW / 2, barY + 4.8, { align: "center" });
  }

  y = barY + barH + 3;
  setFont(doc, 9, "normal");
  rgb(doc, T.textMid);
  doc.text(`${label}  ·  ${valid} of ${required} required documents ready`, MARGIN, y);

  return y + 10;
}

// ── Risk assessment ──────────────────────────────────────────────────────────
function drawRiskAssessment(doc, aiRisks, y) {
  y = sectionHeading(doc, "Risk Assessment", y);

  if (!aiRisks || aiRisks.length === 0) {
    setFont(doc, 9, "normal");
    rgb(doc, T.success);
    doc.text("✓ No risks detected — all required documents appear complete.", MARGIN + 6, y);
    return y + 10;
  }

  aiRisks.forEach((risk, index) => {
    y = ensureSpace(doc, y, 20);
    const { bg, text, label } = riskColors(risk.level);

    // Row background
    fill(doc, bg);
    doc.rect(MARGIN, y - 2, CONTENT_W, 16, "F");
    // Left border
    fill(doc, text);
    doc.rect(MARGIN, y - 2, 3, 16, "F");

    // Badge
    badge(doc, label, MARGIN + 6, y + 4, bg, text);

    // Message
    setFont(doc, 9, "normal");
    rgb(doc, text);
    const lines = doc.splitTextToSize(risk.message || "—", CONTENT_W - 50);
    doc.text(lines, MARGIN + 42, y + 5);

    y += Math.max(16, lines.length * 5 + 4);
  });

  return y + 4;
}

// ── AI Overview ──────────────────────────────────────────────────────────────
function drawAIOverview(doc, overview, y) {
  y = sectionHeading(doc, "AI Application Overview", y);

  if (!overview) {
    setFont(doc, 9, "normal");
    rgb(doc, T.textMuted);
    doc.text("No overview available.", MARGIN + 6, y);
    return y + 10;
  }

  setFont(doc, 9, "normal");
  rgb(doc, T.textMid);
  const lines = doc.splitTextToSize(overview, CONTENT_W - 4);
  lines.forEach((line) => {
    y = ensureSpace(doc, y, 6);
    doc.text(line, MARGIN + 4, y);
    y += 5.5;
  });

  return y + 6;
}

// ── Document checklist (autoTable) ───────────────────────────────────────────
function drawDocumentChecklist(doc, requiredDocs, uploadedDocuments, y) {
  y = sectionHeading(doc, "Document Checklist", y);

  if (!requiredDocs || requiredDocs.length === 0) {
    setFont(doc, 9, "normal");
    rgb(doc, T.textMuted);
    doc.text("No documents required.", MARGIN + 6, y);
    return y + 10;
  }

  const normalized = normalizeUploadedDocuments(uploadedDocuments);

  const rows = requiredDocs.map((docName) => {
    const uploaded = normalized.find((u) => u.requiredDocument === docName);
    if (!uploaded) return [docName, "Missing", "—"];
    return [
      docName,
      uploaded.valid ? "Verified" : "Failed",
      uploaded.fileName || "—",
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [["Document", "Status", "File Name"]],
    body: rows,
    margin: { left: MARGIN, right: MARGIN },
    styles: {
      font: "helvetica",
      fontSize: 9,
      textColor: T.text,
      cellPadding: { top: 4, bottom: 4, left: 5, right: 5 },
      lineColor: T.border,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: T.green,
      textColor: T.white,
      fontStyle: "bold",
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: T.bg,
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 30 },
      2: { cellWidth: "auto" },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 1) {
        const status = data.cell.raw;
        if (status === "Verified") {
          data.cell.styles.textColor = T.success;
          data.cell.styles.fontStyle = "bold";
        } else if (status === "Failed") {
          data.cell.styles.textColor = T.error;
          data.cell.styles.fontStyle = "bold";
        } else {
          data.cell.styles.textColor = T.warning;
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  return doc.lastAutoTable.finalY + 8;
}

// ── Recommendations ──────────────────────────────────────────────────────────
function drawRecommendations(doc, recs, y) {
  y = sectionHeading(doc, "AI Recommendations", y);

  if (!recs || recs.length === 0) {
    setFont(doc, 9, "normal");
    rgb(doc, T.textMuted);
    doc.text("No recommendations available.", MARGIN + 6, y);
    return y + 10;
  }

  recs.forEach((rec, index) => {
    y = ensureSpace(doc, y, 16);

    // Number badge
    fill(doc, T.greenBg);
    doc.circle(MARGIN + 5, y + 1, 4, "F");
    setFont(doc, 7, "bold");
    rgb(doc, T.green);
    doc.text(String(index + 1), MARGIN + 5, y + 2.5, { align: "center" });

    // Text
    setFont(doc, 9, "normal");
    rgb(doc, T.textMid);
    const lines = doc.splitTextToSize(rec, CONTENT_W - 16);
    doc.text(lines, MARGIN + 12, y + 1.5);

    y += Math.max(10, lines.length * 5.5 + 3);
  });

  return y + 4;
}

// ── Timeline ─────────────────────────────────────────────────────────────────
function drawTimeline(doc, timeline, y) {
  y = sectionHeading(doc, "Visa Journey Timeline", y);

  if (!timeline || timeline.length === 0) {
    setFont(doc, 9, "normal");
    rgb(doc, T.textMuted);
    doc.text("No timeline available.", MARGIN + 6, y);
    return y + 10;
  }

  timeline.forEach((item, index) => {
    y = ensureSpace(doc, y, 16);
    const isLast = index === timeline.length - 1;

    // Vertical line connector (not for last)
    if (!isLast) {
      stroke(doc, T.greenLight);
      doc.setLineWidth(0.8);
      doc.line(MARGIN + 5, y + 6, MARGIN + 5, y + 18);
    }

    // Step dot
    fill(doc, T.green);
    doc.circle(MARGIN + 5, y + 2, 3.5, "F");
    setFont(doc, 7, "bold");
    rgb(doc, T.white);
    doc.text(String(index + 1), MARGIN + 5, y + 3.5, { align: "center" });

    const stageText = typeof item === "string"
      ? item
      : item.stage || item.name || "Stage";
    const subText = typeof item === "object"
      ? item.duration || item.status || item.notes || ""
      : "";

    setFont(doc, 9, "bold");
    rgb(doc, T.text);
    doc.text(stageText, MARGIN + 13, y + 3);

    if (subText) {
      setFont(doc, 8, "normal");
      rgb(doc, T.textMuted);
      doc.text(subText, MARGIN + 13, y + 8.5);
      y += 14;
    } else {
      y += 10;
    }
  });

  return y + 6;
}

// ── Compliance notes ─────────────────────────────────────────────────────────
function drawComplianceNotes(doc, notes, y) {
  y = sectionHeading(doc, "Compliance Notes", y);

  if (!notes || notes.length === 0) {
    setFont(doc, 9, "normal");
    rgb(doc, T.textMuted);
    doc.text("No compliance notes.", MARGIN + 6, y);
    return y + 10;
  }

  notes.forEach((note) => {
    y = ensureSpace(doc, y, 10);
    fill(doc, T.greenMid);
    doc.circle(MARGIN + 4, y + 0.5, 1.5, "F");
    setFont(doc, 9, "normal");
    rgb(doc, T.textMid);
    const lines = doc.splitTextToSize(note, CONTENT_W - 12);
    doc.text(lines, MARGIN + 9, y + 1.5);
    y += lines.length * 5.5 + 4;
  });

  return y + 4;
}

// ── Follow-up actions ─────────────────────────────────────────────────────────
function drawFollowUpActions(doc, actions, y) {
  y = sectionHeading(doc, "Follow-Up Actions", y);

  if (!actions || actions.length === 0) {
    setFont(doc, 9, "normal");
    rgb(doc, T.textMuted);
    doc.text("No follow-up actions.", MARGIN + 6, y);
    return y + 10;
  }

  actions.forEach((action, index) => {
    y = ensureSpace(doc, y, 12);
    setFont(doc, 9, "bold");
    rgb(doc, T.green);
    doc.text(`${index + 1}.`, MARGIN + 2, y);
    setFont(doc, 9, "normal");
    rgb(doc, T.textMid);
    const lines = doc.splitTextToSize(action, CONTENT_W - 14);
    doc.text(lines, MARGIN + 10, y);
    y += lines.length * 5.5 + 4;
  });

  return y + 4;
}

// ── Footer band on every page ────────────────────────────────────────────────
function drawFooters(doc, totalPages, caseId) {
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const footerY = PAGE_H - 10;
    stroke(doc, T.border);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, footerY - 3, PAGE_W - MARGIN, footerY - 3);
    setFont(doc, 7, "normal");
    rgb(doc, T.textMuted);
    doc.text("Generated by BlueprintAI · Confidential", MARGIN, footerY);
    doc.text(
      `Case ${caseId || "—"}  ·  Page ${i} of ${totalPages}`,
      PAGE_W - MARGIN,
      footerY,
      { align: "right" }
    );
  }
}

// ── Public export function ───────────────────────────────────────────────────
export function generateVisaPDF(caseData, analysis, uploadedDocuments) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  const normalizedDocs = normalizeUploadedDocuments(uploadedDocuments || []);
  const requiredDocs   = analysis?.documents || caseData?.analysis?.documents || [];

  // Passport data — only from verified passport upload
  const passportDoc  = normalizedDocs.find(
    (d) => d.requiredDocument === "Passport" && d.valid && d.passportData
  );
  const passportData = passportDoc?.passportData || null;

  // Readiness
  const { valid, required } = deriveDocumentSummary(requiredDocs, normalizedDocs);
  const readiness = calculateReadiness(valid, required);

  // ── Page 1 ──────────────────────────────────────────────────────────────
  let y = drawCoverHeader(doc, caseData, passportData);

  y = drawApplicantSummary(doc, passportData, y);
  y = rule(doc, y) + 2;

  y = drawReadinessScore(
    doc,
    readiness.score,
    readiness.label,
    readiness.color,
    valid,
    required,
    y
  );
  y = rule(doc, y) + 2;

  y = drawRiskAssessment(doc, analysis?.aiRisks || [], y);
  y = rule(doc, y) + 2;

  // ── Page break before overview ───────────────────────────────────────────
  y = ensureSpace(doc, y, 60);
  y = drawAIOverview(doc, analysis?.aiOverview, y);
  y = rule(doc, y) + 2;

  // ── Document checklist ───────────────────────────────────────────────────
  y = drawDocumentChecklist(doc, requiredDocs, normalizedDocs, y);

  // ── Recommendations ──────────────────────────────────────────────────────
  y = ensureSpace(doc, y, 40);
  y = drawRecommendations(doc, analysis?.aiRecommendations || [], y);
  y = rule(doc, y) + 2;

  // ── Timeline ─────────────────────────────────────────────────────────────
  y = ensureSpace(doc, y, 40);
  y = drawTimeline(doc, analysis?.visaJourney || [], y);
  y = rule(doc, y) + 2;

  // ── Compliance notes ─────────────────────────────────────────────────────
  y = ensureSpace(doc, y, 30);
  y = drawComplianceNotes(doc, analysis?.complianceNotes || [], y);
  y = rule(doc, y) + 2;

  // ── Follow-up actions ─────────────────────────────────────────────────────
  y = ensureSpace(doc, y, 30);
  y = drawFollowUpActions(doc, analysis?.followUpActions || [], y);

  // ── Footers on all pages ──────────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages();
  drawFooters(doc, totalPages, caseData?.caseId || caseData?.id);

  // ── Save ──────────────────────────────────────────────────────────────────
  const safeName = (caseData?.caseId || caseData?.id || "visa").replace(/[^a-z0-9_-]/gi, "_");
  doc.save(`BlueprintAI_Visa_Report_${safeName}.pdf`);
}