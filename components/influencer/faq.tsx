"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/components/landing/use-scroll-reveal";

const ITEMS = [
  {
    q: "How do I get started?",
    a: "You create your account in under 2 minutes, pick a plan and instantly get credits to generate your first AI influencer — photos, videos and voice. Cancel anytime, no fees and no hassle.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. The platform runs 100% online, straight from your browser. It works on desktop and mobile.",
  },
  {
    q: "Can I keep the same face across every generation?",
    a: "Yes. This is the heart of the platform: you lock your influencer's identity and the face stays consistent across every photo and video — the foundation for building a recognizable persona.",
  },
  {
    q: "Do I need editing or AI skills?",
    a: "No. If you can describe what you want, you can create it. Every tool takes you from a simple prompt to a finished result in a few clicks.",
  },
  {
    q: "Do the videos have a watermark?",
    a: "On paid plans, no. Everything you generate is yours, watermark-free and ready to publish on your channels.",
  },
  {
    q: "Can I use the content commercially?",
    a: "Yes. The images and videos you generate are yours to use across your channels, campaigns, stores and projects, following each platform's rules.",
  },
  {
    q: "What happens if I run out of credits?",
    a: "You can wait for the monthly renewal or buy extra credits at any time, without switching plans.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No fees, no charges, no hassle. Cancel right from your dashboard and keep using it until the end of your paid period.",
  },
];

function Item({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  const body = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);

  useEffect(() => {
    if (body.current) setH(open ? body.current.scrollHeight : 0);
  }, [open]);

  return (
    <div className="border-b border-[#f3f0ed]/[0.06]">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left sm:py-6"
      >
        <span className="text-[15px] font-medium text-landing-text sm:text-[16px]">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-landing-text-muted transition-transform duration-300",
            open && "rotate-180 text-landing-accent",
          )}
        />
      </button>
      <div
        style={{ height: h }}
        className="overflow-hidden transition-all duration-300 ease-out"
      >
        <div ref={body} className="pb-5 sm:pb-6">
          <p className="text-[14px] leading-relaxed text-landing-text-secondary">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function InfluencerFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="faq" className="relative py-16 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div
          ref={ref}
          className="landing-ease mx-auto max-w-2xl text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-landing-accent">
            FAQ
          </span>
          <h2 className="mt-4 font-sora text-[26px] font-bold tracking-tight text-landing-text sm:mt-5 sm:text-3xl lg:text-[44px]">
            Frequently asked questions
          </h2>
          <p className="mt-3.5 text-[15px] leading-relaxed text-landing-text-secondary sm:mt-5 sm:text-[17px]">
            Everything you need to know before getting started.
          </p>
        </div>

        <div className="mt-10 sm:mt-14">
          {ITEMS.map((item, i) => (
            <Item
              key={i}
              question={item.q}
              answer={item.a}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
