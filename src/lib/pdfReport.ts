import { jsPDF } from "jspdf";
import { FEATURES, ENGINEERED_KEY, RISK_LABELS, CLINICAL_RECOMMENDATIONS, FeatureValues, withEngineered } from "./features";
import type { PredictionResult } from "./predictor";

export interface ReportPatient {
  patientId?: string;
  name?: string;
  notes?: string;
}

export function generateClinicalPdf(values: FeatureValues, result: PredictionResult, patient: ReportPatient = {}) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 48;
  let y = M;

  // Header band
  doc.setFillColor(15, 28, 38);
  doc.rect(0, 0, W, 90, "F");
  doc.setTextColor(64, 200, 180);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("CardioInsight", M, 50);
  doc.setTextColor(220, 235, 235);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("AI-Assisted Cardiac Risk Assessment Report", M, 68);
  doc.setFontSize(9);
  doc.text(new Date().toLocaleString(), W - M, 50, { align: "right" });

  y = 120;
  doc.setTextColor(30, 30, 30);

  // Patient block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Patient", M, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`ID: ${patient.patientId || "—"}`, M, y);
  doc.text(`Name: ${patient.name || "—"}`, M + 200, y);
  y += 26;

  // Result band
  const colors: Record<number, [number, number, number]> = {
    0: [22, 163, 74],
    1: [217, 119, 6],
    2: [220, 38, 38],
  };
  const [r, g, b] = colors[result.riskClass];
  doc.setFillColor(r, g, b);
  doc.rect(M, y, W - 2 * M, 60, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(RISK_LABELS[result.riskClass], M + 16, y + 26);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Risk score: ${result.scoreOutOf100}/100   ·   Confidence: ${(result.confidence * 100).toFixed(1)}%`, M + 16, y + 46);
  y += 80;

  // Probabilities
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Class probabilities", M, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  ["Low", "Medium", "High"].forEach((label, i) => {
    const pct = (result.probabilities[i] * 100).toFixed(1);
    doc.text(`${label}: ${pct}%`, M + i * 160, y);
  });
  y += 24;

  // Model meta
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  doc.text(`Model: ${result.modelName}   ·   Accuracy: ${(result.modelAccuracy * 100).toFixed(1)}%   ·   CV: ${(result.cvScore * 100).toFixed(1)}%`, M, y);
  y += 22;

  // Contributing factors
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Top contributing factors", M, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  result.contributingFactors.slice(0, 6).forEach(f => {
    doc.text(`• ${f.feature} — ${f.reason}`, M, y);
    y += 14;
  });
  y += 10;

  // Recommendations
  const rec = CLINICAL_RECOMMENDATIONS[result.riskClass];
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Clinical recommendations — ${rec.urgency}`, M, y);
  y += 14;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text(rec.title, M, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  rec.items.forEach(item => {
    const lines = doc.splitTextToSize(`• ${item}`, W - 2 * M);
    doc.text(lines, M, y);
    y += 14 * lines.length;
  });
  y += 12;

  // Feature table
  if (y > 680) { doc.addPage(); y = M; }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Input features", M, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const enriched = withEngineered(values);
  const all = [...FEATURES.map(f => ({ key: f.key, label: f.label, unit: f.unit })), { key: ENGINEERED_KEY, label: "LF/HF (engineered)", unit: "" }];
  all.forEach((f, i) => {
    if (y > 780) { doc.addPage(); y = M; }
    const v = enriched[f.key];
    const txt = `${f.label}: ${typeof v === "number" ? v.toFixed(2) : v} ${f.unit}`;
    doc.text(txt, M + (i % 2) * 250, y);
    if (i % 2 === 1) y += 13;
  });
  y += 20;

  // Notes
  if (patient.notes) {
    if (y > 720) { doc.addPage(); y = M; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Clinician notes", M, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(patient.notes, W - 2 * M);
    doc.text(lines, M, y);
    y += 14 * lines.length;
  }

  // Disclaimer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  const disclaimer = "DISCLAIMER: CardioInsight is a decision-support tool for licensed clinicians. It does not provide a medical diagnosis and must not replace clinical judgement. Always interpret results in the context of the full clinical picture.";
  const dLines = doc.splitTextToSize(disclaimer, W - 2 * M);
  doc.text(dLines, M, doc.internal.pageSize.getHeight() - M);

  const filename = `cardio-report-${patient.patientId || "patient"}-${Date.now()}.pdf`;
  doc.save(filename);
}
