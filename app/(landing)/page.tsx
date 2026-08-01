import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { SocialProof } from "@/components/landing/social-proof";
import { HowItWorks } from "@/components/landing/how-it-works";
import { StickyCta } from "@/components/landing/sticky-cta";
import { Features } from "@/components/landing/features";
import { Gallery } from "@/components/landing/gallery";
import { ModelWall } from "@/components/landing/model-wall";
import { Comparison } from "@/components/landing/comparison";
import { UseCases } from "@/components/landing/use-cases";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { SupportButton } from "@/components/editor/SupportButton";

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <SocialProof />
      <Features />
      <HowItWorks />
      <Gallery />
      <UseCases />
      <Comparison />
      <Pricing />
      <Testimonials />
      <ModelWall />
      <Faq />
      <FinalCta />
      <Footer />
      <StickyCta />
      <SupportButton />
    </main>
  );
}
