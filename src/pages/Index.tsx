import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { AssessmentSection } from "@/components/AssessmentSection";
import { HowItWorks, ModelComparison, Safety, Footer } from "@/components/Sections";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <AssessmentSection />
        <HowItWorks />
        <ModelComparison />   {/* keep it */}
        <Safety />
      </main>
      <Footer />
    </div>
  );
};

export default Index;