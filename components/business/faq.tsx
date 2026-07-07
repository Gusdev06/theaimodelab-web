"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/components/landing/use-scroll-reveal";

const ITEMS = [
  {
    q: "What can I create with The AI Model Lab?",
    a: "Images, videos, voiceovers and talking avatars — all from one platform. You can generate content from scratch with a prompt or transform media you already have.",
  },
  {
    q: "Do I need design or editing skills?",
    a: "No. If you can describe what you want, you can create it. Every tool is built to go from a simple prompt to a finished result in a few clicks.",
  },
  {
    q: "How does pricing work?",
    a: "You use credits to generate content and pick the plan that fits your volume. Credits renew each month and you can scale up or cancel whenever you want.",
  },
  {
    q: "Can I use what I create commercially?",
    a: "Yes. The content you generate is yours to use in your own projects, campaigns, stores and social channels.",
  },
  {
    q: "Is my content private?",
    a: "Your generations belong to your account. You control what you keep, download or delete from your gallery.",
  },
  {
    q: "How fast is it?",
    a: "Most images and voiceovers are ready in seconds, and videos in a couple of minutes — so you can iterate quickly instead of waiting on production.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. There are no cancellation fees. You keep full access until the end of your paid period.",
  },
  {
    q: "Do you offer support?",
    a: "Yes. Our team is available to help you get the most out of the platform whenever you need it.",
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
    <div className="border-b border-[#f3f0ed]/[0.05]">
      <button
        onClick={onToggle}
        className="landing-ease group flex w-full items-center justify-between py-5 text-left sm:py-6"
      >
        <span className="landing-ease pr-6 text-[14px] font-medium text-landing-text sm:text-[15px] transition-colors group-hover:text-landing-accent">
          {question}
        </span>
        <div
          className={cn(
            "landing-ease flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-all duration-400",
            open
              ? "border-landing-accent/30 bg-landing-accent/10"
              : "border-[#f3f0ed]/[0.08] bg-transparent",
          )}
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-all duration-400",
              open ? "rotate-180 text-landing-accent" : "text-landing-text-muted",
            )}
          />
        </div>
      </button>
      <div
        className="overflow-hidden transition-all duration-400 ease-out"
        style={{ maxHeight: h }}
      >
        <div ref={body} className="pb-6">
          <p className="text-[14px] leading-relaxed text-landing-text-secondary">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function BusinessFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="faq" className="bg-landing-bg-secondary py-16 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div
          ref={ref}
          className="landing-reveal text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-landing-accent">
            FAQ
          </span>
          <h2 className="mt-4 font-sora text-[26px] font-bold tracking-tight text-landing-text sm:mt-5 sm:text-3xl lg:text-[44px]">
            Questions, answered
          </h2>
          <p className="mt-3.5 text-[15px] leading-relaxed text-landing-text-secondary sm:mt-5 sm:text-[17px]">
            Everything you need to know before you start creating.
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
