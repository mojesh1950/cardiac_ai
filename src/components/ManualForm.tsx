import { FEATURES, FeatureValues, FeatureGroup, makeDefaults, SAMPLE_PATIENTS } from "@/lib/features";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Sparkles, RotateCcw } from "lucide-react";

interface Props {
  values: FeatureValues;
  onChange: (next: FeatureValues) => void;
}

const GROUPS: FeatureGroup[] = ["Demographics", "Clinical", "ECG / HRV", "2D Echo"];

export const ManualForm = ({ values, onChange }: Props) => {
  const setField = (key: string, raw: string) => {
    const num = raw === "" ? 0 : Number(raw);
    if (Number.isNaN(num)) return;
    onChange({ ...values, [key]: num });
  };

  const isAbnormal = (key: string, v: number) => {
    const f = FEATURES.find(f => f.key === key);
    if (!f) return false;
    return v < f.normal[0] || v > f.normal[1];
  };

  return (
    <div className="space-y-8">
      {/* Sample patients */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground mr-2">Quick load</span>
        {SAMPLE_PATIENTS.map(p => (
          <button
            key={p.name}
            type="button"
            onClick={() => onChange(p.values)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full bg-secondary border border-border hover:border-primary/50 hover:bg-accent transition"
            title={p.description}
          >
            <Sparkles className="w-3 h-3 text-primary" />
            {p.name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange(makeDefaults())}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full bg-transparent border border-border hover:border-foreground/40 transition text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      <TooltipProvider delayDuration={150}>
        {GROUPS.map(group => {
          const fields = FEATURES.filter(f => f.group === group);
          return (
            <div key={group}>
              <h3 className="font-display text-xl text-foreground mb-4">{group}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {fields.map(f => {
                  const v = values[f.key];
                  const abn = isAbnormal(f.key, v);
                  return (
                    <div key={f.key} className="rounded-xl border border-border bg-surface p-3 hover:border-primary/40 transition">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-foreground/80 flex items-center gap-1">
                          {f.label}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-3 h-3 text-muted-foreground/60 hover:text-primary transition cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs">
                              <p className="text-xs">{f.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">Normal: {f.normal[0]}–{f.normal[1]} {f.unit}</p>
                            </TooltipContent>
                          </Tooltip>
                        </label>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{f.unit}</span>
                      </div>
                      <input
                        type="number"
                        value={v}
                        min={f.min}
                        max={f.max}
                        step={f.step}
                        onChange={e => setField(f.key, e.target.value)}
                        className={`w-full px-2.5 py-1.5 text-sm rounded-md bg-background border transition font-mono ${
                          abn ? "border-risk-medium/60 focus:border-risk-medium" : "border-border focus:border-primary"
                        } focus:outline-none focus:ring-2 focus:ring-primary/20`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </TooltipProvider>
    </div>
  );
};
