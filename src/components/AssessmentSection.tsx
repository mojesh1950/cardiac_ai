import { useState, useMemo } from "react";
import { Activity, FileImage, Video, Layers, Heart, Loader2, CheckCircle2 } from "lucide-react";
import { ManualForm } from "@/components/ManualForm";
import { UploadDropzone } from "@/components/UploadDropzone";
import { ResultCard } from "@/components/ResultCard";
import { FeatureValues, makeDefaults, FEATURES, SOURCE_COUNTS } from "@/lib/features";
import { predictRisk, PredictionResult } from "@/lib/predictor";
import { ReportPatient } from "@/lib/pdfReport";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "manual" | "ecg" | "echo";

const TABS: { id: Tab; label: string; icon: typeof Activity }[] = [
  { id: "manual", label: "Manual", icon: Activity },
  { id: "ecg", label: "Upload ECG", icon: FileImage },
  { id: "echo", label: "Upload Echo", icon: Video },
];

export const AssessmentSection = () => {
  const [tab, setTab] = useState<Tab>("manual");
  const [values, setValues] = useState<FeatureValues>(makeDefaults());
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<ReportPatient>({});
  const [filledSources, setFilledSources] = useState<{ ecg: boolean; echo: boolean }>({ ecg: false, echo: false });

  const populated = useMemo(() => {
    // count fields where the value differs from 0 OR the user provided any value (we count all by default since defaults exist)
    return FEATURES.filter(f => values[f.key] !== undefined).length;
  }, [values]);

  const onPredict = async () => {
    setLoading(true);
    try {
      const [r] = await Promise.all([predictRisk(values), new Promise(r => setTimeout(r, 600))]);
      setResult(r);
      setTimeout(() => document.getElementById("result-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="assessment" className="py-20 md:py-24">
      <div className="container">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.18em] text-primary">Assessment</span>
            <h2 className="font-display text-4xl md:text-5xl mt-2 text-balance">Run a cardiac risk evaluation</h2>
            <p className="mt-3 text-muted-foreground">
              Use any combination: AI-extract from ECG / echo, then refine values manually before predicting.
            </p>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Fields populated</div>
            <div className="font-display text-3xl mt-1 text-ink">
              {populated}<span className="text-muted-foreground">/{FEATURES.length}</span>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-surface border border-border shadow-card p-5 md:p-8">
          {/* Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-secondary border border-border mb-8">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition ${
                  tab === t.id ? "bg-surface text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {tab === "manual" && (
                <div id="manual-form-anchor">
                  <ManualForm values={values} onChange={setValues} />
                </div>
              )}
              {tab === "ecg" && (
                <UploadDropzone
                  variant="ecg"
                  onAutofill={(v) => {
                    setValues({ ...values, ...v });
                    setFilledSources(s => ({ ...s, ecg: true }));
                    setTab("manual");
                  }}
                />
              )}
              {tab === "echo" && (
                <UploadDropzone
                  variant="echo"
                  onAutofill={(v) => {
                    setValues({ ...values, ...v });
                    setFilledSources(s => ({ ...s, echo: true }));
                    setTab("manual");
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Combined feature set summary */}
        <div className="mt-6 rounded-2xl bg-accent/40 border border-primary/20 p-6">
          <div className="flex items-start gap-3 mb-4">
            <Layers className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground">Combined feature set</h4>
              <p className="text-sm text-muted-foreground mt-1">
                The model fuses <strong className="text-foreground">all three sources</strong> into a single {FEATURES.length}-feature vector before predicting.
                Use any combination — ECG + Echo + Manual inputs are merged automatically.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { label: "ECG features", count: SOURCE_COUNTS.ECG, filled: filledSources.ecg },
              { label: "Echo features", count: SOURCE_COUNTS.Echo, filled: filledSources.echo },
              { label: "Clinical / Manual", count: SOURCE_COUNTS.Clinical, filled: true },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-3 rounded-xl bg-surface border border-border p-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${b.filled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{b.label}</div>
                  <div className="text-xs text-muted-foreground">{b.count} features contributing</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predict CTA */}
        <div className="mt-6 rounded-2xl bg-secondary border border-border p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-display text-xl text-foreground">Ready to predict?</div>
            <div className="text-sm text-muted-foreground mt-1">
              All {FEATURES.length} features (ECG + Echo + Clinical) will be combined and sent to the prediction model.
            </div>
          </div>
          <button
            onClick={onPredict}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-ink text-ink-foreground font-medium hover:opacity-90 transition disabled:opacity-60 disabled:cursor-wait"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4 text-primary-glow" fill="currentColor" />}
            {loading ? "Analyzing…" : "Predict combined risk"}
          </button>
        </div>

        {/* Result */}
        <div id="result-anchor" className="mt-10">
          {result && (
            <ResultCard
              result={result}
              values={values}
              patient={patient}
              onPatientChange={setPatient}
            />
          )}
        </div>
      </div>
    </section>
  );
};
