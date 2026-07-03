'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

type AuthSlide = {
  id: number;
  slideKey: string;
  bg: string;
  accent: string;
  video?: string;
  image?: string;
};

// Single source of truth for the auth side-panel slides (used by both the
// full-page /login and the LoginModal).
export const authSlides: AuthSlide[] = [
  {
    id: 0,
    slideKey: 's0',
    bg: 'bg-black',
    accent: '#e11d2a',
    video: 'https://zayraai.com/videos/motion-showcase-3.mp4?v=2',
  },
  {
    id: 1,
    slideKey: 's1',
    bg: 'bg-black',
    accent: '#ff6b9d',
    video: 'https://zayraai.com/videos/motion-zaza.mp4',
  },
];

const SLIDE_DURATION = 5000;
const TICK_MS = 50;

export function AuthCarousel({ className = '' }: { className?: string }) {
  const tSlides = useTranslations('auth.common.slides');

  const slides = authSlides;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [progresses, setProgresses] = useState<number[]>(slides.map(() => 0));
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videosRef = useRef<Map<number, HTMLVideoElement>>(new Map());
  const advancedRef = useRef(false);
  const [loadedMedia, setLoadedMedia] = useState<Set<number>>(new Set());

  const markLoaded = useCallback((id: number) => {
    setLoadedMedia((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const setVideoRef = useCallback(
    (id: number) => (el: HTMLVideoElement | null) => {
      if (el) videosRef.current.set(id, el);
      else videosRef.current.delete(id);
    },
    [],
  );

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setProgresses((prev) => prev.map((_, i) => (i < index ? 100 : 0)));
    const targetVideo = videosRef.current.get(slides[index]?.id);
    if (targetVideo) targetVideo.currentTime = 0;
  }, [slides]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      const next = (prev + 1) % slides.length;
      setProgresses(slides.map((_, i) => (i < next ? 100 : 0)));
      const targetVideo = videosRef.current.get(slides[next]?.id);
      if (targetVideo) targetVideo.currentTime = 0;
      return next;
    });
  }, [slides]);

  // Attach timeupdate/ended to every video slide
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    slides.forEach((s, idx) => {
      if (!s.video) return;
      const video = videosRef.current.get(s.id);
      if (!video) return;
      const onTimeUpdate = () => {
        if (!video.duration || isPaused) return;
        const pct = (video.currentTime / video.duration) * 100;
        setProgresses((prev) => prev.map((v, i) => (i === idx ? pct : v)));
      };
      const onEnded = () => {
        if (!advancedRef.current) {
          advancedRef.current = true;
          nextSlide();
        }
      };
      video.addEventListener('timeupdate', onTimeUpdate);
      video.addEventListener('ended', onEnded);
      cleanups.push(() => {
        video.removeEventListener('timeupdate', onTimeUpdate);
        video.removeEventListener('ended', onEnded);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, [isPaused, nextSlide, slides]);

  // Play only the active video slide, pause the others
  useEffect(() => {
    slides.forEach((s) => {
      if (!s.video) return;
      const video = videosRef.current.get(s.id);
      if (!video) return;
      if (s.id === currentSlide && !isPaused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [currentSlide, isPaused, slides]);

  useEffect(() => {
    advancedRef.current = false;
  }, [currentSlide]);

  // Timer-based progress for non-video slides only
  useEffect(() => {
    if (isPaused || slides[currentSlide]?.video) return;
    intervalRef.current = setInterval(() => {
      setProgresses((prev) => {
        const updated = [...prev];
        if (updated[currentSlide] >= 100) {
          if (!advancedRef.current) {
            advancedRef.current = true;
            nextSlide();
          }
          return updated;
        }
        updated[currentSlide] = Math.min(
          100,
          updated[currentSlide] + 100 / (SLIDE_DURATION / TICK_MS),
        );
        return updated;
      });
    }, TICK_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, currentSlide, nextSlide, slides]);

  const slide = slides[currentSlide];

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${s.bg} ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          {s.video ? (
            <video
              ref={setVideoRef(s.id)}
              src={s.video}
              autoPlay
              muted
              playsInline
              onCanPlay={() => markLoaded(s.id)}
              className={`absolute inset-0 h-full w-full object-cover transition-[filter] duration-700 ${loadedMedia.has(s.id) ? '' : 'blur-xl scale-105'}`}
            />
          ) : s.image ? (
            <Image
              src={s.image}
              alt={tSlides(`${s.slideKey}.title`)}
              fill
              className={`object-cover transition-[filter] duration-700 ${loadedMedia.has(s.id) ? '' : 'blur-xl scale-105'}`}
              priority={i === 0}
              onLoad={() => markLoaded(s.id)}
            />
          ) : (
            <>
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                }}
              />
              <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-[120px] opacity-30 bg-white/20" />
              <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full blur-[100px] opacity-20 bg-white/10" />
            </>
          )}
        </div>
      ))}

      {/* Progress bars */}
      <div className="absolute top-6 left-6 right-6 flex gap-1.5 z-20">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goToSlide(i)}
            className="flex-1 h-[3px] rounded-full bg-white/20 overflow-hidden cursor-pointer"
          >
            <div
              className="h-full bg-white rounded-full transition-none"
              style={{ width: `${i < currentSlide ? 100 : i === currentSlide ? progresses[i] : 0}%` }}
            />
          </button>
        ))}
      </div>

      {/* Bottom scrim */}
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 pointer-events-none" />

      {/* Slide content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
        <div
          className="mb-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase transition-all duration-500 backdrop-blur-sm"
          style={{ borderColor: `${slide.accent}50`, color: slide.accent, backgroundColor: `${slide.accent}20` }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: slide.accent }} />
          {tSlides(`${slide.slideKey}.tag`)}
        </div>
        <h2
          key={`title-${currentSlide}`}
          className="text-2xl font-bold text-white leading-tight mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
        >
          {tSlides(`${slide.slideKey}.title`)}
        </h2>
        <p
          key={`desc-${currentSlide}`}
          className="text-sm text-white/70 leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500 delay-75"
          style={{ textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}
        >
          {tSlides(`${slide.slideKey}.description`)}
        </p>
        <div className="mt-4 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/25 hover:bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
