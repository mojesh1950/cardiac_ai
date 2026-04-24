// CardioInsight — 21-feature schema (ECG/HRV + Clinical + 2D Echo)

export type FeatureGroup = "Demographics" | "Clinical" | "ECG / HRV" | "2D Echo";
export type FeatureSource = "ECG" | "Echo" | "Clinical";

export interface FeatureDef {
  key: string;
  label: string;
  unit: string;
  group: FeatureGroup;
  source: FeatureSource;
  min: number;
  max: number;
  step: number;
  normal: [number, number];
  description: string;
  default: number;
}

export const FEATURES: FeatureDef[] = [
  // ── Demographics ──
  { key: "AGE", label: "Age", unit: "years", group: "Demographics", source: "Clinical",
    min: 0, max: 120, step: 1, normal: [18, 65], default: 55,
    description: "Patient age. Cardiac risk increases markedly after 55." },
  { key: "GENDER", label: "Gender (1=M, 0=F)", unit: "", group: "Demographics", source: "Clinical",
    min: 0, max: 1, step: 1, normal: [0, 1], default: 1,
    description: "Encoded gender (0 = female, 1 = male)." },

  // ── Clinical ──
  { key: "RestingBP", label: "Resting BP", unit: "mmHg", group: "Clinical", source: "Clinical",
    min: 60, max: 220, step: 1, normal: [90, 130], default: 130,
    description: "Resting systolic blood pressure." },
  { key: "Cholesterol", label: "Cholesterol", unit: "mg/dL", group: "Clinical", source: "Clinical",
    min: 80, max: 600, step: 1, normal: [125, 200], default: 220,
    description: "Total serum cholesterol." },
  { key: "FastingBS", label: "Fasting BS > 120", unit: "1/0", group: "Clinical", source: "Clinical",
    min: 0, max: 1, step: 1, normal: [0, 0], default: 0,
    description: "Fasting blood sugar > 120 mg/dL (1 = true)." },
  { key: "MaxHR", label: "Max HR achieved", unit: "bpm", group: "Clinical", source: "Clinical",
    min: 60, max: 220, step: 1, normal: [120, 200], default: 150,
    description: "Maximum heart rate achieved during stress test." },
  { key: "Oldpeak", label: "Oldpeak (ST dep.)", unit: "", group: "Clinical", source: "Clinical",
    min: 0, max: 8, step: 0.1, normal: [0, 1], default: 1,
    description: "ST depression induced by exercise relative to rest." },
  { key: "ExerciseAngina", label: "Exercise angina", unit: "1/0", group: "Clinical", source: "Clinical",
    min: 0, max: 1, step: 1, normal: [0, 0], default: 0,
    description: "Exercise-induced angina (1 = yes)." },

  // ── ECG / HRV ──
  { key: "ECG_Rate_Mean", label: "HR mean", unit: "bpm", group: "ECG / HRV", source: "ECG",
    min: 30, max: 200, step: 1, normal: [60, 100], default: 72,
    description: "Mean heart rate from ECG." },
  { key: "HRV_RMSSD", label: "RMSSD", unit: "ms", group: "ECG / HRV", source: "ECG",
    min: 0, max: 250, step: 0.1, normal: [20, 100], default: 35,
    description: "Vagal tone marker. Lower values associated with cardiac risk." },
  { key: "HRV_SDNN", label: "SDNN", unit: "ms", group: "ECG / HRV", source: "ECG",
    min: 0, max: 300, step: 0.1, normal: [50, 150], default: 50,
    description: "Standard deviation of NN intervals." },
  { key: "HRV_pNN50", label: "pNN50", unit: "%", group: "ECG / HRV", source: "ECG",
    min: 0, max: 100, step: 0.1, normal: [3, 30], default: 12,
    description: "Percent of successive RR intervals differing >50ms." },
  { key: "HRV_LF", label: "LF power", unit: "ms²", group: "ECG / HRV", source: "ECG",
    min: 0, max: 5000, step: 1, normal: [200, 1500], default: 600,
    description: "Low-frequency power (0.04–0.15 Hz)." },
  { key: "HRV_HF", label: "HF power", unit: "ms²", group: "ECG / HRV", source: "ECG",
    min: 0, max: 5000, step: 1, normal: [150, 1200], default: 300,
    description: "High-frequency power (0.15–0.4 Hz). Parasympathetic activity." },
  { key: "HRV_LFHF", label: "LF/HF ratio", unit: "", group: "ECG / HRV", source: "ECG",
    min: 0, max: 20, step: 0.01, normal: [0.5, 2], default: 1.5,
    description: "Sympatho-vagal balance." },
  { key: "HRV_SD1", label: "Poincaré SD1", unit: "ms", group: "ECG / HRV", source: "ECG",
    min: 0, max: 200, step: 0.1, normal: [10, 60], default: 25,
    description: "Short-term variability from Poincaré plot." },
  { key: "HRV_SD2", label: "Poincaré SD2", unit: "ms", group: "ECG / HRV", source: "ECG",
    min: 0, max: 400, step: 0.1, normal: [30, 180], default: 70,
    description: "Long-term variability from Poincaré plot." },

  // ── 2D Echo ──
  { key: "EjectionFraction", label: "Ejection Fraction", unit: "%", group: "2D Echo", source: "Echo",
    min: 10, max: 80, step: 0.1, normal: [55, 70], default: 60,
    description: "Left ventricular ejection fraction. <40% suggests systolic dysfunction." },
  { key: "ESV", label: "End-Systolic Volume", unit: "mL", group: "2D Echo", source: "Echo",
    min: 5, max: 250, step: 0.1, normal: [20, 50], default: 50,
    description: "Left ventricular volume at end systole." },
  { key: "EDV", label: "End-Diastolic Volume", unit: "mL", group: "2D Echo", source: "Echo",
    min: 30, max: 400, step: 0.1, normal: [65, 130], default: 110,
    description: "Left ventricular volume at end diastole." },
  { key: "EF_Ratio", label: "EF ratio (EF/10)", unit: "", group: "2D Echo", source: "Echo",
    min: 0, max: 10, step: 0.01, normal: [5.5, 7], default: 6,
    description: "Engineered ejection fraction ratio." },
];

export const ENGINEERED_KEY = "LF_HF_New";

export type RiskClass = 0 | 1 | 2;
export const RISK_LABELS: Record<RiskClass, string> = {
  0: "Low Cardiac Risk",
  1: "Medium Cardiac Risk",
  2: "High Cardiac Risk",
};
export const RISK_SHORT: Record<RiskClass, string> = { 0: "Low", 1: "Medium", 2: "High" };

export const CLINICAL_RECOMMENDATIONS: Record<RiskClass, { title: string; items: string[]; urgency: string }> = {
  0: {
    urgency: "Routine",
    title: "Routine monitoring & lifestyle reinforcement",
    items: [
      "Annual physical examination with baseline ECG",
      "Reinforce lifestyle: aerobic exercise 150 min/week",
      "Mediterranean-style diet, smoking cessation if applicable",
      "Re-assess in 12 months or sooner if symptoms develop",
    ],
  },
  1: {
    urgency: "Elevated",
    title: "Cardiologist consultation recommended",
    items: [
      "Refer to cardiology within 4–6 weeks",
      "Repeat ECG and consider 24-hour Holter monitoring",
      "Lipid panel, HbA1c, and inflammatory markers (hs-CRP)",
      "Review current medications; consider antiplatelet therapy",
      "Echocardiogram if not done in past 12 months",
    ],
  },
  2: {
    urgency: "Urgent",
    title: "Immediate specialist review required",
    items: [
      "Same-day or next-day cardiology referral",
      "Continuous telemetry monitoring",
      "Troponin, BNP, and full cardiac workup",
      "Consider hospital admission for observation",
      "Prepare for possible interventional planning (cath lab readiness)",
    ],
  },
};

export type FeatureValues = Record<string, number>;

export function makeDefaults(): FeatureValues {
  const v: FeatureValues = {};
  for (const f of FEATURES) v[f.key] = f.default;
  return v;
}

export function withEngineered(values: FeatureValues): FeatureValues {
  return { ...values, [ENGINEERED_KEY]: values.HRV_LF / (values.HRV_HF + 1) };
}

// Source counts shown in the "Combined feature set" summary
export const SOURCE_COUNTS = {
  ECG: FEATURES.filter(f => f.source === "ECG").length,
  Echo: FEATURES.filter(f => f.source === "Echo").length,
  Clinical: FEATURES.filter(f => f.source === "Clinical").length,
};

// Sample patient presets — clinically realistic, all 21 features
export const SAMPLE_PATIENTS: { name: string; description: string; values: FeatureValues }[] = [
  {
    name: "Healthy Adult",
    description: "42 yo female, normal HRV & echo",
    values: {
      AGE: 42, GENDER: 0,
      RestingBP: 118, Cholesterol: 180, FastingBS: 0, MaxHR: 175, Oldpeak: 0, ExerciseAngina: 0,
      ECG_Rate_Mean: 68, HRV_RMSSD: 52, HRV_SDNN: 95, HRV_pNN50: 18,
      HRV_LF: 850, HRV_HF: 700, HRV_LFHF: 1.2, HRV_SD1: 38, HRV_SD2: 130,
      EjectionFraction: 65, ESV: 35, EDV: 105, EF_Ratio: 6.5,
    },
  },
  {
    name: "Borderline (Middle-aged)",
    description: "58 yo male, mild autonomic & structural changes",
    values: {
      AGE: 58, GENDER: 1,
      RestingBP: 138, Cholesterol: 235, FastingBS: 0, MaxHR: 142, Oldpeak: 1.4, ExerciseAngina: 0,
      ECG_Rate_Mean: 78, HRV_RMSSD: 22, HRV_SDNN: 42, HRV_pNN50: 5,
      HRV_LF: 480, HRV_HF: 180, HRV_LFHF: 2.7, HRV_SD1: 16, HRV_SD2: 75,
      EjectionFraction: 52, ESV: 58, EDV: 125, EF_Ratio: 5.2,
    },
  },
  {
    name: "High-risk Cardiac",
    description: "71 yo male, reduced HRV + EF",
    values: {
      AGE: 71, GENDER: 1,
      RestingBP: 162, Cholesterol: 285, FastingBS: 1, MaxHR: 118, Oldpeak: 2.8, ExerciseAngina: 1,
      ECG_Rate_Mean: 92, HRV_RMSSD: 9, HRV_SDNN: 18, HRV_pNN50: 0.5,
      HRV_LF: 120, HRV_HF: 35, HRV_LFHF: 3.4, HRV_SD1: 6, HRV_SD2: 28,
      EjectionFraction: 38, ESV: 95, EDV: 155, EF_Ratio: 3.8,
    },
  },
];
