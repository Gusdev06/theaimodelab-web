export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  fbp?: string;
  fbc?: string;
  gclid?: string;
  referrer?: string;
  landing_page?: string;
  event_id?: string;
  event_source_url?: string;
};

export type MetaEventContext = {
  eventId?: string;
  eventSourceUrl?: string;
  fbp?: string;
  fbc?: string;
};

type MetaStandardEvent =
  | 'PageView'
  | 'ViewContent'
  | 'Lead'
  | 'InitiateCheckout'
  | 'Purchase';

type MetaServerEvent = 'PageView' | 'ViewContent' | 'Lead';

type MetaServerUserData = {
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
};

type CaptureMarketingLeadInput = {
  name?: string;
  email: string;
  phone?: string;
  source?: string;
  quizResult?: string;
  quizAnswers?: Record<string, unknown>;
  eventId?: string;
};

type FbqFunction = (
  command: 'track' | 'init',
  eventOrPixelId: string,
  parameters?: Record<string, unknown>,
  options?: { eventID?: string },
) => void;

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
  }
}

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || '1327084455720433';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');
const ATTRIBUTION_COOKIE_NAME = 'theaimodelab_attribution';
const PENDING_META_LEAD_COOKIE_NAME = 'theaimodelab_meta_pending_lead';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 90;
const TRACKABLE_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'gclid',
] as const;

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${MAX_AGE_SECONDS};samesite=lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;path=/;max-age=0;samesite=lax`;
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setAttributionCookie(value: string) {
  setCookie(ATTRIBUTION_COOKIE_NAME, value);
}

function randomDigits(): string {
  const array = new Uint32Array(2);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
    return `${array[0]}${array[1]}`;
  }
  return `${Math.floor(Math.random() * 1_000_000_000)}${Date.now()}`;
}

function ensureFbp(): string {
  const existing = readCookie('_fbp');
  if (existing) return existing;
  const value = `fb.1.${Date.now()}.${randomDigits()}`;
  setCookie('_fbp', value);
  return value;
}

function ensureFbc(fbclid?: string | null): string | undefined {
  const existing = readCookie('_fbc');
  if (existing) return existing;
  if (!fbclid) return undefined;
  const value = `fb.1.${Date.now()}.${fbclid}`;
  setCookie('_fbc', value);
  return value;
}

export function readAttribution(): Attribution | null {
  if (typeof document === 'undefined') return null;
  const rawValue = readCookie(ATTRIBUTION_COOKIE_NAME);
  if (!rawValue) return null;
  try {
    return JSON.parse(rawValue) as Attribution;
  } catch {
    return null;
  }
}

export function getMetaBrowserIds(fbclid?: string | null): Pick<Attribution, 'fbp' | 'fbc'> {
  if (typeof document === 'undefined') return {};
  return {
    fbp: ensureFbp(),
    fbc: ensureFbc(fbclid),
  };
}

/**
 * Captures UTMs and click ids as first-touch attribution.
 * Existing attribution is preserved, but Meta browser ids are still refreshed.
 */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get('fbclid');
  const metaIds = getMetaBrowserIds(fbclid);
  const captured: Attribution = {};

  for (const key of TRACKABLE_KEYS) {
    const value = params.get(key);
    if (value) captured[key] = value.slice(0, 512);
  }

  if (Object.keys(captured).length === 0 || readAttribution()) return;

  captured.fbp = metaIds.fbp;
  captured.fbc = metaIds.fbc;
  captured.referrer = document.referrer ? document.referrer.slice(0, 1024) : undefined;
  captured.landing_page = (window.location.pathname + window.location.search).slice(0, 1024);

  setAttributionCookie(JSON.stringify(captured));
}

export function generateMetaEventId(prefix: string): string {
  const normalizedPrefix = prefix.replace(/[^a-z0-9_-]/gi, '').toLowerCase() || 'event';
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${normalizedPrefix}-${crypto.randomUUID()}`;
  }
  return `${normalizedPrefix}-${Date.now()}-${randomDigits()}`;
}

export function buildTrackingPayload(eventId?: string): Attribution | null {
  if (typeof window === 'undefined') return null;
  const attribution = readAttribution() ?? {};
  const metaIds = getMetaBrowserIds(attribution.fbclid);

  return {
    ...attribution,
    ...metaIds,
    ...(eventId ? { event_id: eventId } : {}),
    event_source_url: window.location.href.slice(0, 2048),
  };
}

export function buildMetaEventContext(eventId?: string): MetaEventContext | undefined {
  if (typeof window === 'undefined') return undefined;
  const metaIds = getMetaBrowserIds(readAttribution()?.fbclid);
  return {
    eventId,
    eventSourceUrl: window.location.href.slice(0, 2048),
    fbp: metaIds.fbp,
    fbc: metaIds.fbc,
  };
}

export function trackMetaPixelEvent(
  eventName: MetaStandardEvent,
  parameters: Record<string, unknown> = {},
  eventId = generateMetaEventId(eventName),
): string {
  if (!META_PIXEL_ID || typeof window === 'undefined') return eventId;
  callFbq(eventName, parameters, eventId);
  return eventId;
}

export function trackPageView(): string {
  const eventId = trackMetaPixelEvent('PageView', {});
  void sendMetaServerEvent('PageView', {}, eventId);
  return eventId;
}

export function trackViewContent(parameters: Record<string, unknown>): string {
  const eventId = trackMetaPixelEvent('ViewContent', parameters);
  void sendMetaServerEvent('ViewContent', parameters, eventId);
  return eventId;
}

export function trackLeadEvent(
  parameters: Record<string, unknown>,
  userData?: MetaServerUserData,
): string {
  const eventId = trackMetaPixelEvent('Lead', parameters);
  void sendMetaServerEvent('Lead', parameters, eventId, userData);
  return eventId;
}

export async function captureMarketingLead(input: CaptureMarketingLeadInput): Promise<void> {
  // API_BASE_URL vazio = same-origin (proxied pela Vercel); só bloqueia no server.
  if (typeof window === 'undefined' || (API_BASE_URL === undefined)) return;
  const attribution = buildTrackingPayload(input.eventId) ?? {};

  try {
    await fetch(`${API_BASE_URL}/api/v1/marketing-leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        phone: input.phone,
        source: input.source ?? 'sales_quiz',
        quizResult: input.quizResult,
        quizAnswers: input.quizAnswers,
        eventId: input.eventId ?? attribution.event_id,
        eventSourceUrl: attribution.event_source_url,
        utmSource: attribution.utm_source,
        utmMedium: attribution.utm_medium,
        utmCampaign: attribution.utm_campaign,
        utmContent: attribution.utm_content,
        utmTerm: attribution.utm_term,
        fbclid: attribution.fbclid,
        fbp: attribution.fbp,
        fbc: attribution.fbc,
        gclid: attribution.gclid,
        landingPage: attribution.landing_page,
        referrer: attribution.referrer,
        attribution,
      }),
    });
  } catch {
    // Lead capture must never block the quiz result.
  }
}

export function flushPendingMetaLead(): void {
  const rawValue = readCookie(PENDING_META_LEAD_COOKIE_NAME);
  if (!rawValue) return;
  deleteCookie(PENDING_META_LEAD_COOKIE_NAME);

  try {
    const pending = JSON.parse(rawValue) as { eventId?: string; method?: string };
    trackMetaPixelEvent('Lead', {
      content_name: 'account_signup',
      method: pending.method ?? 'google',
      status: true,
    }, pending.eventId || generateMetaEventId('lead_google'));
  } catch {
    trackMetaPixelEvent('Lead', {
      content_name: 'account_signup',
      method: 'google',
      status: true,
    }, generateMetaEventId('lead_google'));
  }
}

async function sendMetaServerEvent(
  eventName: MetaServerEvent,
  customData: Record<string, unknown>,
  eventId: string,
  userData?: MetaServerUserData,
): Promise<void> {
  // API_BASE_URL vazio = same-origin (proxied pela Vercel); só bloqueia no server.
  if (typeof window === 'undefined' || (API_BASE_URL === undefined)) return;
  const metaIds = getMetaBrowserIds(readAttribution()?.fbclid);

  try {
    await fetch(`${API_BASE_URL}/api/v1/meta/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        eventName,
        eventId,
        eventSourceUrl: window.location.href.slice(0, 2048),
        fbp: metaIds.fbp,
        fbc: metaIds.fbc,
        customData,
        ...userData,
      }),
    });
  } catch {
    // Tracking must never block UX.
  }
}

function callFbq(
  eventName: MetaStandardEvent,
  parameters: Record<string, unknown>,
  eventId: string,
  retries = 8,
) {
  if (typeof window === 'undefined') return;
  if (window.fbq) {
    window.fbq('track', eventName, parameters, { eventID: eventId });
    return;
  }
  if (retries > 0) {
    window.setTimeout(() => callFbq(eventName, parameters, eventId, retries - 1), 150);
  }
}
