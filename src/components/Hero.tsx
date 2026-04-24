import heartHero from "@/assets/heart-hero.jpg";
import { motion } from "framer-motion";
import { Activity, Image as ImageIcon, Video, Sparkles } from "lucide-react";
import { FEATURES } from "@/lib/features";

export const Hero = () => {
  return (
    <section id="top" className="relative overflow-hidden bg-hero pt-12 md:pt-20 pb-16 md:pb-24">
      <div className="container relative grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-xs tracking-wide uppercase text-muted-foreground mb-6 shadow-soft">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            AI-assisted clinical screening
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-balance text-ink">
            Cardiac risk,{" "}
            <span className="italic text-primary">decoded.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl text-balance">
            Upload an ECG image or 2D echo video, or enter clinical metrics manually. CardioInsight
            extracts features and estimates cardiac risk in seconds.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#assessment"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium shadow-soft hover:opacity-95 transition"
            >
              Begin assessment
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-ink text-ink-foreground font-medium hover:opacity-90 transition"
            >
              See how it works
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> {FEATURES.length} features</span>
            <span className="inline-flex items-center gap-2"><ImageIcon className="w-4 h-4 text-primary" /> ECG vision model</span>
            <span className="inline-flex items-center gap-2"><Video className="w-4 h-4 text-primary" /> Echo video model</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative rounded-3xl overflow-hidden bg-ink border border-border shadow-elev animate-float">
            <img
              src={heartHero}
              alt="Anatomical heart with ECG waveform visualization"
              className="w-full h-auto"
              width={1024}
              height={1024}
            />
          </div>
          <div className="absolute -inset-8 -z-10 bg-primary/15 blur-3xl rounded-full" />
        </motion.div>
      </div>
    </section>
  );
};
