import type { Metadata } from "next";
import { SalesQuiz } from "@/components/landing/sales-quiz";

export const metadata: Metadata = {
  title: "AI Model Sales Quiz — The AI Model Lab",
  description:
    "Find the AI model offer you should sell first, then choose the monthly production plan to launch it.",
  alternates: {
    canonical: "https://theaimodelab.ai/quiz",
  },
  openGraph: {
    title: "AI Model Sales Quiz — The AI Model Lab",
    description:
      "Answer 3 questions and find the AI model sales angle and monthly plan worth testing first.",
    type: "website",
    url: "https://theaimodelab.ai/quiz",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const quizJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "AI Model Sales Quiz",
  url: "https://theaimodelab.ai/quiz",
  description:
    "Find the AI model offer to sell first and choose the monthly production plan to launch it.",
  isPartOf: {
    "@type": "WebSite",
    name: "The AI Model Lab",
    url: "https://theaimodelab.ai",
  },
  about: {
    "@type": "SoftwareApplication",
    name: "The AI Model Lab",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
  },
};

export default function LocalizedQuizLandingPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizJsonLd) }}
      />
      <SalesQuiz />
    </main>
  );
}
