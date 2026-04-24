import { useRef, useState } from "react";
import { Upload, FileImage, FileVideo, CheckCircle2, ArrowRight } from "lucide-react";
import { FeatureValues, FEATURES, SAMPLE_PATIENTS } from "@/lib/features";

interface Props {
  variant: "ecg" | "echo";
  // Returns ONLY the keys this source extracts — caller merges into existing values.
  onAutofill: (partial: Partial<FeatureValues>) => void;
}

export const UploadDropzone = ({ variant, onAutofill }: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const accept = variant === "ecg" ? "image/*" : "video/*";
  const Icon = variant === "ecg" ? FileImage : FileVideo;
  const title = variant === "ecg" ? "Upload ECG image" : "Upload 2D echo video";
  const desc = variant === "ecg"
    ? "12-lead or single-lead ECG, JPG/PNG. The vision model extracts HR & HRV features."
    : "Apical 4-chamber loop, MP4/MOV. The video model estimates ejection-fraction-related metrics.";

  const sourceFilter = variant === "ecg" ? "ECG" : "Echo";
  const extractedKeys = FEATURES.filter(f => f.source === sourceFilter).map(f => f.key);

  const handleFile = (f: File) => {
    setFile(f);
    if (variant === "ecg") {
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  const autofillNow = () => {
    // Mock: pull values for THIS source only from the borderline preset.
    const sample = SAMPLE_PATIENTS[1].values;
    const partial: Partial<FeatureValues> = {};
    extractedKeys.forEach(k => { partial[k] = sample[k]; });
    onAutofill(partial);
    document.getElementById("manual-form-anchor")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => ref.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        className="relative cursor-pointer group rounded-2xl border-2 border-dashed border-border hover:border-primary/60 bg-background hover:bg-accent/40 transition p-10 text-center"
      >
        <input
          ref={ref}
          type="file"
          accept={accept}
          className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 mb-4 group-hover:scale-110 transition">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        <h4 className="font-display text-xl mb-2 text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">{desc}</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border text-sm">
          <Upload className="w-4 h-4" /> Click or drop file
        </div>
        <p className="mt-4 text-[11px] text-muted-foreground">
          Extracts <strong className="text-foreground">{extractedKeys.length}</strong> features into the manual form
        </p>
      </div>

      {file && (
        <div className="rounded-xl bg-surface border border-border p-4 shadow-soft">
          <div className="flex items-start gap-4">
            {previewUrl && (
              <img src={previewUrl} alt="Uploaded preview" className="w-24 h-24 object-cover rounded-lg border border-border" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="truncate font-medium">{file.name}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{(file.size / 1024).toFixed(1)} KB</div>
              <div className="mt-3 text-xs text-muted-foreground bg-accent/40 rounded-md p-2.5 border border-primary/20">
                <strong className="text-foreground">Note:</strong> the {variant === "ecg" ? "vision" : "video"} model
                {" "}auto-fills <strong>{extractedKeys.length} {variant === "ecg" ? "ECG/HRV" : "echo"} features</strong> into the manual form. Review and adjust before predicting.
              </div>
              <button
                type="button"
                onClick={autofillNow}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-95 transition"
              >
                Auto-fill manual form <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
