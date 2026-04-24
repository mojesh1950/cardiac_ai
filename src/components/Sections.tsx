import { Activity, FileImage, Stethoscope, ShieldCheck, BrainCircuit } from "lucide-react";

const STEPS = [
  {
    icon: FileImage,
    title: "Capture data",
    body: "Upload a 12-lead ECG image or a 2D echo loop. The vision and video models extract HRV and structural features into the form.",
  },
  {
    icon: BrainCircuit,
    title: "Predict",
    body: "21 features (Demographics + Clinical + ECG/HRV + 2D Echo) feed a tuned Random Forest / XGBoost ensemble selected by cross-validation.",
  },
  {
    icon: Stethoscope,
    title: "Decide",
    body: "Get a 3-class risk estimate, calibrated probabilities, contributing factors, and clinical recommendations aligned with severity.",
  },
];

export const HowItWorks = () => (
  <section id="how" className="py-24 bg-surface border-y border-border">
    <div className="container">
      <div className="max-w-2xl">
        <span className="text-xs uppercase tracking-[0.18em] text-primary">How it works</span>
        <h2 className="font-display text-4xl md:text-5xl mt-3 text-ink">From signal to decision in seconds.</h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Designed for screening clinics and tele-cardiology workflows. Outputs are auditable and
          framed as decision support — never as a standalone diagnosis.
        </p>
      </div>
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        {STEPS.map((s, i) => (
          <div key={s.title} className="p-6 rounded-2xl bg-background border border-border shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-mono text-muted-foreground">0{i + 1}</span>
            </div>
            <h3 className="font-display text-2xl mt-4 text-ink">{s.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const MODELS = [
  { name: "Logistic Regression (scratch)", acc: 0.79 },
  { name: "Decision Tree (scratch)", acc: 0.74 },
  { name: "ANN (scratch)", acc: 0.81 },
  { name: "Random Forest (tuned)", acc: 0.91, best: true },
  { name: "SVM", acc: 0.83 },
  { name: "XGBoost (tuned)", acc: 0.89 },
];

export const ModelComparison = () => (
  <section id="models" className="py-24">
    <div className="container">
      <div className="max-w-2xl">
        <span className="text-xs uppercase tracking-[0.18em] text-primary">Model transparency</span>
        <h2 className="font-display text-4xl md:text-5xl mt-3 text-ink">Six models. One winner.</h2>
        <p className="mt-4 text-muted-foreground text-lg">
          We trained three models from scratch and three production libraries. The best by 5-fold cross-validation
          is automatically selected for inference.
        </p>
      </div>
      <div className="mt-10 rounded-2xl bg-surface border border-border shadow-card p-6 md:p-8">
        <ul className="space-y-3">
          {MODELS.map(m => (
            <li key={m.name} className="grid grid-cols-[1fr_auto] items-center gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm">
                  <span>{m.name}</span>
                  {m.best && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">Selected</span>}
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full ${m.best ? "bg-gradient-primary" : "bg-muted-foreground/40"}`} style={{ width: `${m.acc * 100}%` }} />
                </div>
              </div>
              <div className="font-mono text-sm tabular-nums">{(m.acc * 100).toFixed(1)}%</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export const Safety = () => (
  <section id="safety" className="py-24 bg-surface border-t border-border">
    <div className="container max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="w-6 h-6 text-primary" />
        <h2 className="font-display text-3xl md:text-4xl text-ink">Safety & responsible use</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
        {[
          "CardioInsight is a decision-support tool intended for licensed clinicians. It does not provide a medical diagnosis.",
          "All inference runs locally in your browser. Patient data is not transmitted to any server.",
          "Predictions must always be interpreted in the context of clinical history, examination, and other investigations.",
          "The model has known performance limits in pediatric cohorts and patients with implanted pacemakers.",
        ].map((t, i) => (
          <div key={i} className="p-4 rounded-xl bg-background border border-border leading-relaxed">{t}</div>
        ))}
      </div>
    </div>
  </section>
);

export const Footer = () => (
  <footer className="py-10 border-t border-border bg-background">
    <div className="container flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-primary" />
        CardioInsight · AI-Assisted Clinical Decision Support
      </div>
      <div>For research & screening use. Not a medical device.</div>
    </div>
  </footer>
);
