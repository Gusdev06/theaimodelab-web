import type { Plan, CreditPackage } from './api';
import type { LucideIcon } from 'lucide-react';
import { Flame, Zap, Trophy, Users, TestTubeDiagonal, Sprout, TrendingUp, Crown } from 'lucide-react';

export const PLAN_ORDER = ['free', 'ultra-basic', 'starter', 'basic', 'creator', 'pro', 'advanced', 'studio'];

/**
 * @deprecated Use `editorPlans.subtitles.<slug>` via next-intl.
 * Kept for backward compatibility with non-i18n callers.
 */
export const PLAN_SUBTITLES: Record<string, string> = {
  'ultra-basic': 'Iniciante',
  starter: 'Explorador',
  basic: 'Essencial',
  creator: 'Criador',
  pro: 'Produtor',
  advanced: 'Avançado',
  studio: 'Profissional',
};

export interface PlanGenerationExample {
  label: string;
  /** @deprecated Use `countNumber` + `unit` + translate via `editorPlans.units.<unit>`. */
  count: string;
  blocked?: boolean;
}

export type GenerationUnit = 'image' | 'generation' | 'video' | 'audio' | 'voiceClone';

export interface PlanGenerationEntry {
  label: string;
  countNumber: number;
  unit: GenerationUnit;
  blocked?: boolean;
}

/**
 * Locale-agnostic generation examples. Use this with
 * `useTranslations('editorPlans')` to render `units.<unit>` with ICU plural.
 */
export const PLAN_GENERATION_ENTRIES: Record<string, PlanGenerationEntry[]> = {
  free: [
    { label: 'Nano Banana 2', countNumber: 3, unit: 'image' },
    { label: 'Motion Control', countNumber: 1, unit: 'generation' },
    { label: 'Veo 3.1 Fast', countNumber: 2, unit: 'video' },
    { label: 'Veo 3.1 Quality', countNumber: 2, unit: 'video' },
    { label: 'The AI Model Lab', countNumber: 0, unit: 'video', blocked: true },
    { label: 'Áudio (TTS)', countNumber: 8, unit: 'audio' },
    { label: 'Clonar voz', countNumber: 0, unit: 'voiceClone', blocked: true },
  ],
  'ultra-basic': [
    { label: 'Nano Banana 2', countNumber: 7, unit: 'image' },
    { label: 'Motion Control', countNumber: 1, unit: 'generation' },
    { label: 'Veo 3.1 Fast', countNumber: 2, unit: 'video' },
    { label: 'Veo 3.1 Quality', countNumber: 1, unit: 'video' },
    { label: 'The AI Model Lab Fast', countNumber: 0, unit: 'video', blocked: true },
    { label: 'The AI Model Lab Quality', countNumber: 0, unit: 'video', blocked: true },
    { label: 'Áudio (TTS)', countNumber: 20, unit: 'audio' },
    { label: 'Clonar voz', countNumber: 1, unit: 'voiceClone' },
  ],
  starter: [
    { label: 'Nano Banana 2', countNumber: 44, unit: 'image' },
    { label: 'Motion Control', countNumber: 5, unit: 'generation' },
    { label: 'Veo 3.1 Fast', countNumber: 13, unit: 'video' },
    { label: 'Veo 3.1 Quality', countNumber: 6, unit: 'video' },
    { label: 'The AI Model Lab Fast', countNumber: 3, unit: 'video' },
    { label: 'The AI Model Lab Quality', countNumber: 1, unit: 'video' },
    { label: 'Áudio (TTS)', countNumber: 100, unit: 'audio' },
    { label: 'Clonar voz', countNumber: 3, unit: 'voiceClone' },
  ],
  basic: [
    { label: 'Nano Banana 2', countNumber: 77, unit: 'image' },
    { label: 'Motion Control', countNumber: 10, unit: 'generation' },
    { label: 'Veo 3.1 Fast', countNumber: 23, unit: 'video' },
    { label: 'Veo 3.1 Quality', countNumber: 10, unit: 'video' },
    { label: 'The AI Model Lab Fast', countNumber: 5, unit: 'video' },
    { label: 'The AI Model Lab Quality', countNumber: 2, unit: 'video' },
    { label: 'Áudio (TTS)', countNumber: 200, unit: 'audio' },
    { label: 'Clonar voz', countNumber: 5, unit: 'voiceClone' },
  ],
  creator: [
    { label: 'Nano Banana 2', countNumber: 133, unit: 'image' },
    { label: 'Motion Control', countNumber: 17, unit: 'generation' },
    { label: 'Veo 3.1 Fast', countNumber: 40, unit: 'video' },
    { label: 'Veo 3.1 Quality', countNumber: 18, unit: 'video' },
    { label: 'The AI Model Lab Fast', countNumber: 9, unit: 'video' },
    { label: 'The AI Model Lab Quality', countNumber: 4, unit: 'video' },
    { label: 'Áudio (TTS)', countNumber: 340, unit: 'audio' },
    { label: 'Clonar voz', countNumber: 8, unit: 'voiceClone' },
  ],
  pro: [
    { label: 'Nano Banana 2', countNumber: 333, unit: 'image' },
    { label: 'Motion Control', countNumber: 42, unit: 'generation' },
    { label: 'Veo 3.1 Fast', countNumber: 100, unit: 'video' },
    { label: 'Veo 3.1 Quality', countNumber: 46, unit: 'video' },
    { label: 'The AI Model Lab Fast', countNumber: 23, unit: 'video' },
    { label: 'The AI Model Lab Quality', countNumber: 10, unit: 'video' },
    { label: 'Áudio (TTS)', countNumber: 850, unit: 'audio' },
    { label: 'Clonar voz', countNumber: 12, unit: 'voiceClone' },
  ],
  advanced: [
    { label: 'Nano Banana 2', countNumber: 555, unit: 'image' },
    { label: 'Motion Control', countNumber: 71, unit: 'generation' },
    { label: 'Veo 3.1 Fast', countNumber: 166, unit: 'video' },
    { label: 'Veo 3.1 Quality', countNumber: 76, unit: 'video' },
    { label: 'The AI Model Lab Fast', countNumber: 38, unit: 'video' },
    { label: 'The AI Model Lab Quality', countNumber: 17, unit: 'video' },
    { label: 'Áudio (TTS)', countNumber: 1400, unit: 'audio' },
    { label: 'Clonar voz', countNumber: 15, unit: 'voiceClone' },
  ],
  studio: [
    { label: 'Nano Banana 2', countNumber: 888, unit: 'image' },
    { label: 'Motion Control', countNumber: 114, unit: 'generation' },
    { label: 'Veo 3.1 Fast', countNumber: 266, unit: 'video' },
    { label: 'Veo 3.1 Quality', countNumber: 123, unit: 'video' },
    { label: 'The AI Model Lab Fast', countNumber: 61, unit: 'video' },
    { label: 'The AI Model Lab Quality', countNumber: 27, unit: 'video' },
    { label: 'Áudio (TTS)', countNumber: 2280, unit: 'audio' },
    { label: 'Clonar voz', countNumber: 15, unit: 'voiceClone' },
  ],
};

/**
 * Custo canônico em créditos por geração (mirror do backend `credit_costs`),
 * usado para calcular quantas gerações de CADA modelo o plano rende.
 * Config exibida: imagens = menor resolução do modelo; vídeos cobrados por
 * segundo = clipe de 5s (720p quando há tiers); vídeos de preço fixo = 720p.
 * Áudio (TTS) ≈ 35 créditos/áudio. Voz clonada é por cota (não por crédito).
 *
 * Mantém uma única fonte da verdade: se o preço mudar, os cards se atualizam.
 */
const VIDEO_CLIP_SECONDS = 5;
export const GENERATABLE_MODELS: {
  label: string;
  unit: GenerationUnit;
  creditsPerGeneration: number;
}[] = [
  // ── Imagens (preço fixo por geração) ──
  { label: 'Nano Banana 2', unit: 'image', creditsPerGeneration: 90 },
  { label: 'Nano Banana Pro', unit: 'image', creditsPerGeneration: 190 },
  { label: 'GPT Image 2', unit: 'image', creditsPerGeneration: 90 },
  { label: 'Sem Censura', unit: 'image', creditsPerGeneration: 130 },
  { label: 'Seedream Lite', unit: 'image', creditsPerGeneration: 60 },
  { label: 'Deepdeep', unit: 'image', creditsPerGeneration: 200 },
  // ── Vídeos de preço fixo por geração ──
  { label: 'Veo 3.1 Fast', unit: 'video', creditsPerGeneration: 810 },
  { label: 'Veo 3.1 Quality', unit: 'video', creditsPerGeneration: 1800 },
  { label: 'The AI Model Lab Fast', unit: 'video', creditsPerGeneration: 600 },
  { label: 'The AI Model Lab Quality', unit: 'video', creditsPerGeneration: 1000 },
  // ── Vídeos cobrados por segundo (clipe de 5s) ──
  { label: 'Motion Control', unit: 'video', creditsPerGeneration: 70 * VIDEO_CLIP_SECONDS },
  { label: 'LTX 2.3 Spicy', unit: 'video', creditsPerGeneration: 80 * VIDEO_CLIP_SECONDS },
  { label: 'Seedance 2.0 Spicy', unit: 'video', creditsPerGeneration: 200 * VIDEO_CLIP_SECONDS },
  { label: 'Kling V3 Turbo', unit: 'video', creditsPerGeneration: 220 * VIDEO_CLIP_SECONDS },
  { label: 'WAN', unit: 'video', creditsPerGeneration: 120 * VIDEO_CLIP_SECONDS },
  { label: 'Grok Imagine', unit: 'video', creditsPerGeneration: 80 * VIDEO_CLIP_SECONDS },
  // ── Áudio ──
  { label: 'Áudio (TTS)', unit: 'audio', creditsPerGeneration: 35 },
];

/**
 * Calcula, a partir dos créditos mensais do plano, quantas gerações de cada
 * modelo o usuário consegue fazer. Inclui "Clonar voz" pela cota de vozes
 * salvas (não é baseada em créditos). Já vem ordenado por volume desc.
 */
export function getPlanGenerationEntries(
  creditsPerMonth: number,
  slug?: string,
): PlanGenerationEntry[] {
  const entries: PlanGenerationEntry[] = GENERATABLE_MODELS.map((m) => ({
    label: m.label,
    unit: m.unit,
    countNumber: Math.floor(creditsPerMonth / m.creditsPerGeneration),
  }));

  const voiceQuota = slug ? PLAN_SAVED_VOICES_QUOTAS[slug] : undefined;
  if (voiceQuota !== undefined) {
    entries.push({
      label: 'Clonar voz',
      unit: 'voiceClone',
      countNumber: voiceQuota,
      blocked: voiceQuota === 0,
    });
  }

  return entries;
}

/**
 * Quantidade estimada de gerações inclusas no plano via créditos
 * (vídeos = Veo Fast 720p sem áudio; imagens = NB2 1K). Exibido no
 * dialog de planos para o usuário ter ideia do volume.
 */
export interface PlanGenerationsIncluded {
  videos: number;
  images: number;
}
export const PLAN_GENERATIONS_INCLUDED: Record<string, PlanGenerationsIncluded> = {
  'ultra-basic': { videos: 16, images: 7 },
  starter: { videos: 29, images: 44 },
  basic: { videos: 39, images: 77 },
  creator: { videos: 56, images: 133 },
  pro: { videos: 116, images: 333 },
  advanced: { videos: 182, images: 555 },
  studio: { videos: 282, images: 888 },
};

/**
 * Resumo dos modelos liberados no modo ilimitado por plano (somente
 * Creator/Pro/Advanced/Studio têm modo ilimitado). Os valores são
 * chaves i18n dentro de `editorPlans.unlimited.features.*`.
 */
export const PLAN_UNLIMITED_FEATURE_KEYS: Record<string, string[]> = {
  creator: ['veoFast720'],
  pro: ['veoFast720And1080'],
  advanced: ['veoBoth720', 'nb2_1K'],
  studio: ['veoBoth720And1080', 'nbBoth1K'],
};

/**
 * Quantidade máxima de vozes salvas por plano (mirror do backend
 * `voices.constants.ts` → VOICE_PROFILE_QUOTAS).
 */
export const PLAN_SAVED_VOICES_QUOTAS: Record<string, number> = {
  free: 0,
  'ultra-basic': 1,
  starter: 3,
  basic: 5,
  creator: 8,
  pro: 12,
  advanced: 15,
  studio: 15,
};

/**
 * @deprecated Use `PLAN_GENERATION_ENTRIES` + translations instead.
 * Retained for backward compatibility.
 */
export const PLAN_GENERATIONS: Record<string, PlanGenerationExample[]> = {
  free: [
    { label: 'Nano Banana 2', count: '3 Imagens' },
    { label: 'Motion Control', count: '1 Geração' },
    { label: 'Veo 3.1 Fast', count: '2 Vídeos Grátis' },
    { label: 'Veo 3.1 Quality', count: '2 Vídeos Grátis' },
    { label: 'The AI Model Lab', count: 'Bloqueado', blocked: true },
    { label: 'Áudio (TTS)', count: '8 Áudios' },
    { label: 'Clonar voz', count: 'Bloqueado', blocked: true },
  ],
  'ultra-basic': [
    { label: 'Nano Banana 2', count: '7 Imagens' },
    { label: 'Motion Control', count: '1 Geração' },
    { label: 'Veo 3.1 Fast', count: '2 Vídeos' },
    { label: 'Veo 3.1 Quality', count: '1 Vídeo' },
    { label: 'The AI Model Lab Fast', count: 'Bloqueado', blocked: true },
    { label: 'The AI Model Lab Quality', count: 'Bloqueado', blocked: true },
    { label: 'Áudio (TTS)', count: '20 Áudios' },
    { label: 'Clonar voz', count: '1 Clonagem' },
  ],
  starter: [
    { label: 'Nano Banana 2', count: '44 Imagens' },
    { label: 'Motion Control', count: '5 Gerações' },
    { label: 'Veo 3.1 Fast', count: '13 Vídeos' },
    { label: 'Veo 3.1 Quality', count: '6 Vídeos' },
    { label: 'The AI Model Lab Fast', count: '3 Vídeos' },
    { label: 'The AI Model Lab Quality', count: '1 Vídeo' },
    { label: 'Áudio (TTS)', count: '100 Áudios' },
    { label: 'Clonar voz', count: '3 Clonagens' },
  ],
  basic: [
    { label: 'Nano Banana 2', count: '77 Imagens' },
    { label: 'Motion Control', count: '10 Gerações' },
    { label: 'Veo 3.1 Fast', count: '23 Vídeos' },
    { label: 'Veo 3.1 Quality', count: '10 Vídeos' },
    { label: 'The AI Model Lab Fast', count: '5 Vídeos' },
    { label: 'The AI Model Lab Quality', count: '2 Vídeos' },
    { label: 'Áudio (TTS)', count: '200 Áudios' },
    { label: 'Clonar voz', count: '5 Clonagens' },
  ],
  creator: [
    { label: 'Nano Banana 2', count: '133 Imagens' },
    { label: 'Motion Control', count: '17 Gerações' },
    { label: 'Veo 3.1 Fast', count: '40 Vídeos' },
    { label: 'Veo 3.1 Quality', count: '18 Vídeos' },
    { label: 'The AI Model Lab Fast', count: '9 Vídeos' },
    { label: 'The AI Model Lab Quality', count: '4 Vídeos' },
    { label: 'Áudio (TTS)', count: '340 Áudios' },
    { label: 'Clonar voz', count: '8 Clonagens' },
  ],
  pro: [
    { label: 'Nano Banana 2', count: '333 Imagens' },
    { label: 'Motion Control', count: '42 Gerações' },
    { label: 'Veo 3.1 Fast', count: '100 Vídeos' },
    { label: 'Veo 3.1 Quality', count: '46 Vídeos' },
    { label: 'The AI Model Lab Fast', count: '23 Vídeos' },
    { label: 'The AI Model Lab Quality', count: '10 Vídeos' },
    { label: 'Áudio (TTS)', count: '850 Áudios' },
    { label: 'Clonar voz', count: '12 Clonagens' },
  ],
  advanced: [
    { label: 'Nano Banana 2', count: '555 Imagens' },
    { label: 'Motion Control', count: '71 Gerações' },
    { label: 'Veo 3.1 Fast', count: '166 Vídeos' },
    { label: 'Veo 3.1 Quality', count: '76 Vídeos' },
    { label: 'The AI Model Lab Fast', count: '38 Vídeos' },
    { label: 'The AI Model Lab Quality', count: '17 Vídeos' },
    { label: 'Áudio (TTS)', count: '1.400 Áudios' },
    { label: 'Clonar voz', count: '15 Clonagens' },
  ],
  studio: [
    { label: 'Nano Banana 2', count: '888 Imagens' },
    { label: 'Motion Control', count: '114 Gerações' },
    { label: 'Veo 3.1 Fast', count: '266 Vídeos' },
    { label: 'Veo 3.1 Quality', count: '123 Vídeos' },
    { label: 'The AI Model Lab Fast', count: '61 Vídeos' },
    { label: 'The AI Model Lab Quality', count: '27 Vídeos' },
    { label: 'Áudio (TTS)', count: '2.280 Áudios' },
    { label: 'Clonar voz', count: '15 Clonagens' },
  ],
};

/* ── Boost packages ── */

export interface BoostMeta {
  label: string;
  description: string;
}

export type BoostMetaKey = 'mini' | 'plus' | 'pro-pack' | 'mega' | 'ultra';

/** @deprecated Use `getBoostMetaKey` + `editorPlans.boost.<key>.{label,description}`. */
export const BOOST_META: Record<BoostMetaKey, BoostMeta> = {
  'mini': { label: 'Mini', description: 'Recarrega rápida para continuar gerando' },
  'plus': { label: 'Plus', description: 'Um empurrão extra para o dia a dia' },
  'pro-pack': { label: 'Pro Pack', description: 'Créditos extras para projetos maiores' },
  'mega': { label: 'Mega', description: 'Volume alto para produção intensa' },
  'ultra': { label: 'Ultra', description: 'Quase um plano!' },
};

export function getBoostMetaKey(pkg: CreditPackage): BoostMetaKey | null {
  switch (pkg.credits) {
    case 550: return 'mini';
    case 1700: return 'plus';
    case 3200: return 'pro-pack';
    case 6500: return 'mega';
    case 14000: return 'ultra';
    default: return null;
  }
}

/** @deprecated Use `getBoostMetaKey` + translations instead. */
export function getBoostMeta(pkg: CreditPackage): BoostMeta {
  const key = getBoostMetaKey(pkg);
  if (key) return BOOST_META[key];
  return { label: pkg.name, description: '' };
}

/** @deprecated Use `formatCurrency(cents, currency, locale)` instead. */
export function formatBoostPrice(priceCents: number): string;
export function formatBoostPrice(priceCents: number, currency: string, locale: string): string;
export function formatBoostPrice(
  priceCents: number,
  currency = 'BRL',
  locale = 'pt-BR',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}

export function formatCurrency(priceCents: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(priceCents / 100);
}

/**
 * Custo em créditos (mirror do backend `credit_costs`) usado para estimar
 * quantas gerações cada pacote de créditos rende. Exibido nos cards de
 * pacote como "Até X ...".
 *
 * - imageHQ: Nano Banana 2 em 1K (TEXT/IMAGE_TO_IMAGE RES_1K)
 * - motionVideo: Motion Control 720p (70 créd/seg) × 10s = 700
 * - upscale4k: upscale cobra como IMAGE_TO_IMAGE 2K do NB2 (130)
 */
export const PACKAGE_PERK_COSTS = {
  imageHQ: 90,
  motionVideo: 700,
  upscale4k: 130,
} as const;

export type PackageGenerationPerkKey = 'imagesHQ' | 'motionVideos' | 'upscales4k';

export interface PackageGenerationPerk {
  key: PackageGenerationPerkKey;
  count: number;
}

/**
 * Estima quantas gerações de cada tipo o pacote rende, a partir dos créditos.
 * Usado com `useTranslations('editorPlans')` → `packages.perks.<key>` (ICU count).
 */
export function getPackageGenerationPerks(credits: number): PackageGenerationPerk[] {
  return [
    { key: 'imagesHQ', count: Math.floor(credits / PACKAGE_PERK_COSTS.imageHQ) },
    { key: 'motionVideos', count: Math.floor(credits / PACKAGE_PERK_COSTS.motionVideo) },
    { key: 'upscales4k', count: Math.floor(credits / PACKAGE_PERK_COSTS.upscale4k) },
  ];
}

/** @deprecated Use locale-aware translated perks in the component. */
export function getPackagePerks(pkg: CreditPackage): string[] {
  return [
    `${pkg.credits.toLocaleString('pt-BR')} créditos`,
    'Créditos entram na hora',
    'Acumulam com os do plano',
  ];
}

export function getPackageBadge(
  index: number,
  total: number,
): 'popular' | 'best' | null {
  if (total <= 1) return null;
  if (total === 2) return index === 1 ? 'best' : null;
  if (index === Math.floor(total / 2)) return 'popular';
  if (index === total - 1) return 'best';
  return null;
}

/* ── Discount / anchor pricing ── */

export const PLAN_ORIGINAL_PRICES: Record<string, number> = {
  'ultra-basic': 1590,
  starter: 6900,
  basic: 7990,
  creator: 14900,
  pro: 29900,
  advanced: 35690,
  studio: 69900,
};

export const PLAN_DISCOUNT_LABELS: Record<string, string> = {
  'ultra-basic': '19% OFF',
  starter: '29% OFF',
  basic: '25% OFF',
  creator: '33% OFF',
  pro: '33% OFF',
  advanced: '30% OFF',
  studio: '28% OFF',
};

export const PLAN_SOCIAL_PROOF_ICONS: Record<string, LucideIcon> = {
  'ultra-basic': Sprout,
  starter: Users,
  basic: TrendingUp,
  creator: Flame,
  pro: Zap,
  advanced: Crown,
  studio: Trophy,
};

/** @deprecated Use `PLAN_SOCIAL_PROOF_ICONS` + `plans.socialProof.<slug>`. */
export const PLAN_SOCIAL_PROOF: Record<string, { icon: LucideIcon; text: string }> = {
  'ultra-basic': { icon: Sprout, text: 'Dê o primeiro passo' },
  starter: { icon: Users, text: 'Ideal para projetos pessoais' },
  basic: { icon: TrendingUp, text: 'Para quem está crescendo' },
  creator: { icon: Flame, text: 'Escolha de 68% dos criadores' },
  pro: { icon: Zap, text: 'Para quem leva a sério' },
  advanced: { icon: Crown, text: 'Poder e controle total' },
  studio: { icon: Trophy, text: 'Para equipes e agências' },
};

/* ── Price formatting ── */

const FREE_LABEL: Record<string, string> = {
  'pt-BR': 'Grátis',
  en: 'Free',
};

const PER_MONTH: Record<string, string> = {
  'pt-BR': '/mês',
  en: '/mo',
};

/** @deprecated Prefer `formatPlanPrice(plan, locale, t)` — pass translated free/per-month labels. */
export function formatPrice(
  priceCents: number,
  currency = 'BRL',
  locale = 'pt-BR',
): { main: string; sub: string | null } {
  if (priceCents === 0) return { main: FREE_LABEL[locale] ?? 'Free', sub: null };
  const main = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(priceCents / 100);
  return { main, sub: PER_MONTH[locale] ?? '/mo' };
}

export function formatPriceRaw(
  priceCents: number,
  currency = 'BRL',
  locale = 'pt-BR',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(priceCents / 100);
}

export interface PlanFeatureEntry {
  key: string;
  values?: Record<string, string | number>;
}

/**
 * Returns a list of i18n keys (+ ICU values) that callers resolve with
 * `useTranslations('editorPlans')` under `features.*`.
 */
export function getPlanFeatureKeys(plan: Plan): PlanFeatureEntry[] {
  const features: PlanFeatureEntry[] = [];

  if (plan.slug === 'free') {
    features.push({ key: 'features.credits', values: { count: 350 } });
    features.push({ key: 'features.emailSupport' });
    features.push({ key: 'features.gallery7' });
    features.push({ key: 'features.tryNoCommit' });
    features.push({ key: 'features.noVoiceCloning' });
    return features;
  }

  features.push({ key: 'features.credits', values: { count: plan.creditsPerMonth } });

  if (plan.slug === 'pro' || plan.slug === 'studio' || plan.slug === 'advanced') {
    features.push({ key: 'features.queuePriority' });
    features.push({ key: 'features.fasterGenerations' });
    features.push({ key: 'features.prioritySupport' });
    features.push({ key: 'features.gallery365' });
  } else if (plan.slug === 'creator' || plan.slug === 'basic') {
    features.push({ key: 'features.fasterGenerations' });
    features.push({ key: 'features.emailSupport' });
    features.push({ key: 'features.gallery180' });
  } else {
    features.push({ key: 'features.emailSupport' });
    features.push({ key: 'features.gallery90' });
  }

  features.push({ key: 'features.freeVideoGenerations' });

  return features;
}

/**
 * @deprecated Use `getPlanFeatureKeys` together with next-intl in components.
 * Kept for `app/creditos/page.tsx` (non-scope) — returns PT strings.
 */
export function getPlanFeatures(plan: Plan): string[] {
  const features: string[] = [];

  if (plan.slug === 'free') {
    features.push('350 créditos');
    features.push('Suporte por e-mail');
    features.push('7 dias de galeria');
    features.push('Teste sem compromisso');
    return features;
  }

  features.push(`${plan.creditsPerMonth.toLocaleString('pt-BR')} créditos`);

  if (plan.slug === 'pro' || plan.slug === 'studio' || plan.slug === 'advanced') {
    features.push('Prioridade na fila de gerações');
    features.push('Velocidade maior nas gerações');
    features.push('Suporte prioritário');
    features.push('365 dias de galeria');
  } else if (plan.slug === 'creator' || plan.slug === 'basic') {
    features.push('Velocidade maior nas gerações');
    features.push('Suporte por e-mail');
    features.push('180 dias de galeria');
  } else {
    features.push('Suporte por e-mail');
    features.push('90 dias de galeria');
  }

  return features;
}
