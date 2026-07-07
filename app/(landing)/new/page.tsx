import type { Metadata } from "next";
import { InfluencerNavbar } from "@/components/influencer/navbar";
import { InfluencerHero } from "@/components/influencer/hero";
import { InfluencerStats } from "@/components/influencer/stats";
import { InfluencerFeatures } from "@/components/influencer/features";
import { InfluencerHowItWorks } from "@/components/influencer/how-it-works";
import { InfluencerUseCases } from "@/components/influencer/use-cases";
import { InfluencerTestimonials } from "@/components/influencer/testimonials";
import { InfluencerFaq } from "@/components/influencer/faq";
import { InfluencerFinalCta } from "@/components/influencer/final-cta";
import { InfluencerFooter } from "@/components/influencer/footer";
import { Pricing } from "@/components/landing/pricing";
import { SupportButton } from "@/components/editor/SupportButton";

export const metadata: Metadata = {
  title: "The AI Model Lab — Create your own AI influencer",
  description:
    "Create an AI influencer with a 100% consistent face, photos, videos and voice — all in one place. No camera, no studio, no need to show up.",
  openGraph: {
    title: "The AI Model Lab — Create your own AI influencer",
    description:
      "Consistent face, photos, videos and voice. Build your AI digital influencer in minutes.",
    type: "website",
    url: "https://theaimodelab.ai/new",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function NewLandingPage() {
  return (
    <main>
      <InfluencerNavbar />
      <InfluencerHero />
      <InfluencerStats />
      <InfluencerFeatures />
      <InfluencerHowItWorks />
      <Pricing />
      <InfluencerUseCases />
      <InfluencerTestimonials />
      <InfluencerFaq />
      <InfluencerFinalCta />
      <InfluencerFooter />
      <SupportButton />
    </main>
  );
}
