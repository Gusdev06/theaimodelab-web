import type { Metadata } from "next";
import { SalesQuiz } from "@/components/landing/sales-quiz";
import { QuizOfferBridge } from "@/components/landing/quiz-offer-bridge";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/landing/footer";
import { SupportButton } from "@/components/editor/SupportButton";

export const metadata: Metadata = {
  title: "AI Model Sales Quiz — The AI Model Lab",
  description:
    "Find the AI model offer you should sell first, then pick the credit pack to test it.",
  openGraph: {
    title: "AI Model Sales Quiz — The AI Model Lab",
    description:
      "Answer 3 questions and find the AI model sales angle worth testing first.",
    type: "website",
    url: "https://theaimodelab.ai/quiz",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function QuizLandingPage() {
  return (
    <main>
      <SalesQuiz />
      <QuizOfferBridge />
      <Pricing />
      <Footer />
      <SupportButton />
    </main>
  );
}
