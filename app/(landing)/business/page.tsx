import type { Metadata } from "next";
import { BusinessNavbar } from "@/components/business/navbar";
import { BusinessHero } from "@/components/business/hero";
import { BusinessStats } from "@/components/business/stats";
import { BusinessFeatures } from "@/components/business/features";
import { BusinessHowItWorks } from "@/components/business/how-it-works";
import { BusinessUseCases } from "@/components/business/use-cases";
import { BusinessFaq } from "@/components/business/faq";
import { BusinessFinalCta } from "@/components/business/final-cta";
import { BusinessFooter } from "@/components/business/footer";
import { Pricing } from "@/components/landing/pricing";
import { SupportButton } from "@/components/editor/SupportButton";

export const metadata: Metadata = {
  title: "The AI Model Lab — Create Images, Videos, Voices & Avatars with AI",
  description:
    "A complete AI creative studio. Generate high-quality images, produce videos end to end, clone voices, and build avatars — all in one platform.",
  openGraph: {
    title: "The AI Model Lab — Your Complete AI Creation Studio",
    description:
      "Generate images, videos, voices and avatars with AI, all in one place. Try it free.",
    type: "website",
    url: "https://theaimodelab.ai/business",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function BusinessLandingPage() {
  return (
    <main>
      <BusinessNavbar />
      <BusinessHero />
      <BusinessStats />
      <BusinessFeatures />
      <BusinessHowItWorks />
      <Pricing />
      <BusinessUseCases />
      <BusinessFaq />
      <BusinessFinalCta />
      <BusinessFooter />
      <SupportButton />
    </main>
  );
}
