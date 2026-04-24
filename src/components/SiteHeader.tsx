import { Heart } from "lucide-react";

export const HeartLogo = ({ className = "" }: { className?: string }) => (
  <div className={`relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary ${className}`}>
    <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
  </div>
);

export const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/60">
      <div className="container flex items-center justify-between h-16">
        <a href="#top" className="flex items-center gap-3 group">
          <HeartLogo />
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold text-ink">CardioInsight</div>
            <div className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">AI risk assessment</div>
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#assessment" className="hover:text-foreground transition-colors">Assessment</a>
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#models" className="hover:text-foreground transition-colors">Model</a>
          <a href="#safety" className="hover:text-foreground transition-colors">Safety</a>
        </nav>
        <a
          href="#assessment"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-ink text-ink-foreground hover:opacity-90 transition-colors"
        >
          Start assessment
        </a>
      </div>
    </header>
  );
};
