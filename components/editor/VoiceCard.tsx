'use client';

import { memo, useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, AudioLines, Loader2, Pause, Play } from 'lucide-react';

const GRADIENTS = [
  'linear-gradient(135deg, #ff8a91, #e11d2a)',
  'linear-gradient(135deg, #818cf8, #4f46e5)',
  'linear-gradient(135deg, #d8b4fe, #a855f7)',
  'linear-gradient(135deg, #ff5964, #b3121a)',
  'linear-gradient(135deg, #ff8a91, #b3121a)',
  'linear-gradient(135deg, #ff5964, #b3121a)',
  'linear-gradient(135deg, #94a3b8, #475569)',
  'linear-gradient(135deg, #67e8f9, #0891b2)',
  'linear-gradient(135deg, #fcd34d, #d97706)',
  'linear-gradient(135deg, #fdba74, #ea580c)',
];

function hashSeed(seed: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

export function pickGradient(seed: string): string {
  return GRADIENTS[hashSeed(seed) % GRADIENTS.length];
}

export const COUNTRY_NAMES: Record<string, string> = {
  PT_BR: 'Brasil',
  EN_US: 'EUA',
  ES_ES: 'Espanha',
  IT_IT: 'Itália',
  FR_FR: 'França',
  DE_DE: 'Alemanha',
  ZH_CN: 'China',
  JA_JP: 'Japão',
  KO_KR: 'Coreia',
  RU_RU: 'Rússia',
  NL_NL: 'Holanda',
  PL_PL: 'Polônia',
  HI_IN: 'Índia',
  HE_IL: 'Israel',
  AR_SA: 'Arábia Saudita',
};

export const COUNTRY_PRIORITY = ['PT_BR', 'ES_ES', 'EN_US'];

export function countryLabel(code: string): string {
  return COUNTRY_NAMES[code] ?? code;
}

/**
 * Returns 'F' | 'M' | null based on the voice description text.
 * Callers translate to localized labels (Feminina/Female, etc).
 */
export function parseGender(description?: string): 'F' | 'M' | null {
  if (!description) return null;
  if (/\bfemale\b/i.test(description)) return 'F';
  if (/\bmale\b/i.test(description)) return 'M';
  return null;
}

export interface VoiceCardProps {
  selected: boolean;
  gradient: string;
  meta: string;
  name: string;
  playing?: boolean;
  loading?: boolean;
  progress?: number;
  hasPreview?: boolean;
  onPlay?: () => void;
  onSelect: () => void;
}

function VoiceCardImpl({
  selected,
  gradient,
  meta,
  name,
  playing,
  loading,
  progress = 0,
  hasPreview,
  onPlay,
  onSelect,
}: VoiceCardProps) {
  const active = !!playing || !!loading;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group relative flex min-h-[150px] cursor-pointer flex-col gap-2.5 overflow-hidden rounded-2xl border p-3 outline-none transition-all focus-visible:ring-2 focus-visible:ring-[#e11d2a]/50 ${selected
        ? 'border-[#e11d2a]/70 bg-gradient-to-br from-[#e11d2a]/[0.08] to-transparent shadow-[0_0_24px_rgba(225,29,42,0.12)]'
        : active
          ? 'border-[#e11d2a]/30 bg-[#e11d2a]/[0.03]'
          : 'border-[#f3f0ed]/[0.07] bg-[#0f1416] hover:border-[#e11d2a]/25 hover:bg-[#0f1416]/70'
        }`}
    >
      <div
        className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#3a0f16]/40 transition-all ${selected
          ? 'text-[#e11d2a]'
          : 'text-[#f3f0ed]/40 group-hover:bg-[#e11d2a]/15 group-hover:text-[#e11d2a]'
          }`}
        aria-hidden
      >
        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.25} />
      </div>

      <div
        className={`relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-md ring-1 ring-white/10 transition-transform ${playing ? 'scale-110' : ''
          }`}
        style={{ background: gradient }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/20" />
        <AudioLines
          className="relative h-4 w-4 text-white/90 drop-shadow-sm"
          strokeWidth={2.25}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-[#f3f0ed]/95">
          {name}
        </div>
        <div className="mt-1 truncate text-[10px] font-bold uppercase tracking-[0.12em] text-[#f3f0ed]/35">
          {meta}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {hasPreview && onPlay ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
            className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${active
              ? 'bg-[#e11d2a] text-[#111113] shadow-[0_0_12px_rgba(225,29,42,0.5)]'
              : 'bg-[#3a0f16]/40 text-[#f3f0ed]/70 hover:bg-[#e11d2a]/20 hover:text-[#e11d2a]'
              }`}
            aria-label={
              loading ? 'Carregando prévia' : playing ? 'Pausar prévia' : 'Tocar prévia'
            }
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : playing ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5 translate-x-0.5" />
            )}
          </button>
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3a0f16]/20 text-[#f3f0ed]/20">
            <Play className="h-3.5 w-3.5 translate-x-0.5" />
          </div>
        )}
        <Waveform
          seed={name}
          playing={!!playing}
          loading={!!loading}
          progress={progress}
        />
      </div>
    </div>
  );
}

export const VoiceCard = memo(VoiceCardImpl, (prev, next) => {
  // Ignore handler identity (onPlay/onSelect change every parent render but
  // that should not cause a re-render of cards whose data is unchanged).
  return (
    prev.selected === next.selected &&
    prev.gradient === next.gradient &&
    prev.meta === next.meta &&
    prev.name === next.name &&
    prev.playing === next.playing &&
    prev.loading === next.loading &&
    prev.progress === next.progress &&
    prev.hasPreview === next.hasPreview
  );
});

const WAVEFORM_BAR_COUNT = 16;

function Waveform({
  seed,
  playing,
  loading,
  progress,
}: {
  seed: string;
  playing: boolean;
  loading: boolean;
  progress: number;
}) {
  const baseBars = useMemo(() => {
    let h = hashSeed(seed) || 1;
    const out: number[] = [];
    for (let i = 0; i < WAVEFORM_BAR_COUNT; i++) {
      h = (Math.imul(h, 1664525) + 1013904223) >>> 0;
      out.push(20 + (h % 80));
    }
    return out;
  }, [seed]);

  const [animatedBars, setAnimatedBars] = useState<number[]>(baseBars);

  useEffect(() => {
    if (!playing) {
      setAnimatedBars(baseBars);
      return;
    }
    setAnimatedBars(baseBars);
    const id = setInterval(() => {
      setAnimatedBars(
        baseBars.map((b) => {
          const jitter = (Math.random() - 0.5) * 60;
          return Math.max(15, Math.min(100, b + jitter));
        }),
      );
    }, 110);
    return () => clearInterval(id);
  }, [playing, baseBars]);

  const total = animatedBars.length;
  const active = playing || loading;

  return (
    <div className="flex h-6 min-w-0 flex-1 items-center gap-[2px]">
      {animatedBars.map((pct, i) => {
        const barPosition = (i + 0.5) / total;
        const played = playing && barPosition <= progress;
        const color = active
          ? played
            ? 'bg-[#e11d2a]'
            : 'bg-[#e11d2a]/30'
          : 'bg-[#f3f0ed]/25';
        return (
          <div
            key={i}
            className={`w-[2px] rounded-full transition-[height,background-color] duration-100 ${color}`}
            style={{
              height: `${pct}%`,
              animationDelay: loading ? `${i * 60}ms` : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
