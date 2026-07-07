"use client";

import { useCountUp } from "@/components/landing/use-count-up";

const STATS = [
  { value: 6, label: "Tools in one platform", prefix: "" },
  { value: 25000, label: "Images generated", prefix: "+" },
  { value: 5000, label: "Videos produced", prefix: "+" },
] as const;

function Stat({
  value,
  label,
  prefix,
}: {
  value: number;
  label: string;
  prefix?: string;
}) {
  const { ref, count } = useCountUp(value);
  return (
    <div ref={ref} className="flex flex-col items-center gap-1.5">
      <span className="font-sora text-[24px] font-bold tabular-nums text-landing-text sm:text-[32px]">
        {prefix}
        {count.toLocaleString("en-US")}
      </span>
      <span className="text-[13px] font-medium tracking-wide text-landing-text-muted">
        {label}
      </span>
    </div>
  );
}

export function BusinessStats() {
  return (
    <section className="relative border-y border-[#f3f0ed]/[0.04] bg-landing-bg-secondary py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="landing-reveal grid grid-cols-3 gap-5 sm:gap-10 md:flex md:items-center md:justify-center md:gap-16 lg:gap-24">
          {STATS.map((s) => (
            <Stat key={s.label} value={s.value} prefix={s.prefix} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
