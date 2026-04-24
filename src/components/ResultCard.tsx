import { motion } from "framer-motion";
import { Heart, Activity, Stethoscope, FileDown, AlertTriangle, ShieldCheck, Sparkles } from "lucide-react";
import { RISK_LABELS, RISK_SHORT, CLINICAL_RECOMMENDATIONS, FeatureValues, RiskClass } from "@/lib/features";
import type { PredictionResult } from "@/lib/predictor";
import { generateClinicalPdf, ReportPatient } from "@/lib/pdfReport";
import { useState } from "react";

interface Props {
  result: PredictionResult;
  values: FeatureValues;
  patient: ReportPatient;
  onPatientChange: (p: ReportPatient) => void;
}

const riskClassStyles: Record<RiskClass, { bar: string; pill: string; ring: string; icon: typeof Heart }> = {
  0: { bar: "bg-risk-low", pill: "risk-low-pill", ring: "ring-risk-low/40", icon: ShieldCheck },
  1: { bar: "bg-risk-medium", pill: "risk-medium-pill", ring: "ring-risk-medium/40", icon: Stethoscope },
  2: { bar: "bg-risk-high", pill: "risk-high-pill", ring: "ring-risk-high/40", icon: AlertTriangle },
};

export const ResultCard = ({ result, values, patient, onPatientChange }: Props) => {
  const styles = riskClassStyles[result.riskClass];
  const Icon = styles.icon;
  const rec = CLINICAL_RECOMMENDATIONS[result.riskClass];
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl bg-paper text-paper-foreground shadow-elev overflow-hidden border border-border/40"
    >
      {/* Header */}
      <div className={`p-6 md:p-8 ${styles.pill}`}>
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white/70 ring-4 ${styles.ring}`}>
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-[11px] tracking-[0.18em] uppercase opacity-70">Assessment result</div>
              <h3 className="font-display text-3xl md:text-4xl mt-1">{RISK_LABELS[result.riskClass]}</h3>
              <div className="mt-2 text-sm opacity-80">{rec.title}</div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[11px] tracking-[0.18em] uppercase opacity-70">Probability</div>
            <div className="font-display text-4xl md:text-5xl font-bold">{(result.confidence * 100).toFixed(0)}%</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 md:p-8 space-y-8">
        {/* Risk score bar */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="inline-flex items-center gap-1.5 opacity-70"><Heart className="w-4 h-4" /> Risk score</span>
            <span className="font-mono opacity-70">{result.scoreOutOf100}/100</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className={`h-full ${styles.bar}`}
              initial={{ width: 0 }}
              animate={{ width: `${result.scoreOutOf100}%` }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        {/* Class probabilities */}
        <div>
          <div className="text-xs uppercase tracking-wider opacity-60 mb-3">Class probabilities</div>
          <div className="grid grid-cols-3 gap-3">
            {([0, 1, 2] as RiskClass[]).map(c => {
              const p = result.probabilities[c];
              const active = c === result.riskClass;
              return (
                <div
                  key={c}
                  className={`p-3 rounded-lg border ${active ? "border-foreground/20 bg-background" : "border-border bg-background/60"}`}
                >
                  <div className="text-[11px] uppercase tracking-wider opacity-60">{RISK_SHORT[c]}</div>
                  <div className="font-display text-2xl mt-1">{(p * 100).toFixed(1)}%</div>
                  <div className="h-1 rounded-full bg-secondary mt-2 overflow-hidden">
                    <div className={`h-full ${riskClassStyles[c].bar}`} style={{ width: `${p * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contributing factors */}
        <div>
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-60 mb-3">
            <Activity className="w-3.5 h-3.5" /> Top contributing factors
          </div>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
            {result.contributingFactors.map((f, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${styles.bar}`} />
                <div>
                  <div className="font-medium">{f.feature}</div>
                  <div className="text-xs opacity-60">{f.reason}</div>
                </div>
              </li>
            ))}
            {result.contributingFactors.length === 0 && (
              <li className="text-sm opacity-60">No abnormal factors detected — values within expected ranges.</li>
            )}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="rounded-xl bg-secondary border border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <Stethoscope className="w-4 h-4" />
            <h4 className="font-display text-lg">Clinical recommendations</h4>
            <span className={`ml-auto text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${styles.pill}`}>{rec.urgency}</span>
          </div>
          <ul className="space-y-1.5">
            {rec.items.map((item, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Patient meta + export */}
        <div className="border-t border-border pt-6">
          <button
            type="button"
            onClick={() => setExpanded(e => !e)}
            className="text-xs uppercase tracking-wider opacity-60 hover:opacity-100 transition mb-3"
          >
            {expanded ? "Hide" : "Add"} patient details for report
          </button>
          {expanded && (
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <input
                placeholder="Patient ID"
                value={patient.patientId || ""}
                onChange={e => onPatientChange({ ...patient, patientId: e.target.value })}
                className="px-3 py-2 text-sm rounded-md bg-background border border-border focus:border-primary focus:outline-none"
              />
              <input
                placeholder="Patient name"
                value={patient.name || ""}
                onChange={e => onPatientChange({ ...patient, name: e.target.value })}
                className="px-3 py-2 text-sm rounded-md bg-background border border-border focus:border-primary focus:outline-none"
              />
              <textarea
                placeholder="Clinician notes"
                value={patient.notes || ""}
                onChange={e => onPatientChange({ ...patient, notes: e.target.value })}
                rows={3}
                className="sm:col-span-2 px-3 py-2 text-sm rounded-md bg-background border border-border focus:border-primary focus:outline-none"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="text-xs opacity-60 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Model: <span className="font-mono">{result.modelName}</span> · Acc {(result.modelAccuracy * 100).toFixed(0)}% · CV {(result.cvScore * 100).toFixed(0)}%
            </div>
            <button
              type="button"
              onClick={() => generateClinicalPdf(values, result, patient)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-ink text-ink-foreground hover:opacity-90 transition"
            >
              <FileDown className="w-4 h-4" />
              Export PDF report
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
