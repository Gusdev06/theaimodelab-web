"use client";

import { useEffect, useRef, useState } from "react";

/* Monta o <video> apenas quando o card se aproxima do viewport e pausa fora
   dele — vídeos escondidos por CSS (display:none) nunca interceptam, então
   nunca baixam. Substitui autoplay imediato em todos os cards da landing. */
export function LazyVideo({
  src,
  poster,
  overlay,
}: {
  src: string;
  poster?: string;
  overlay?: boolean;
}) {
  const holderRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = holderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "260px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const el = holderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted]);

  return (
    <div ref={holderRef} className="absolute inset-0">
      {mounted && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setReady(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      {!ready && (
        <div className="absolute inset-0 animate-pulse bg-[#f3f0ed]/[0.03]" />
      )}
      {overlay && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/60 via-transparent to-transparent" />
      )}
    </div>
  );
}
