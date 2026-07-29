import { NextResponse, type NextRequest } from 'next/server';
import { LOCALE_COOKIE, LOCALE_HEADER, URL_LOCALES, type UrlLocale } from '@/i18n/config';

const URL_TO_INTERNAL: Record<UrlLocale, string> = {
  en: 'en',
  es: 'es',
  'pt-br': 'pt-BR',
};

function detectFromCountry(country: string | null): UrlLocale {
  // A UI é traduzida (pt-BR/es/en); os preços seguem 100% em dólar (o checkout
  // recorrente da PerfectPay cobra em USD). Países lusófonos caem em /pt-br,
  // hispânicos em /es, o resto em /en.
  const PORTUGUESE_COUNTRIES = new Set(['BR', 'PT']);
  const SPANISH_COUNTRIES = new Set([
    'ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'GT', 'CU', 'BO',
    'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'PR', 'GQ',
  ]);
  const c = country?.toUpperCase();
  if (c && PORTUGUESE_COUNTRIES.has(c)) return 'pt-br';
  if (c && SPANISH_COUNTRIES.has(c)) return 'es';
  return 'en';
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const segments = pathname.split('/');
  const first = segments[1]?.toLowerCase();

  if (first && (URL_LOCALES as readonly string[]).includes(first)) {
    const urlLocale = first as UrlLocale;
    const internalLocale = URL_TO_INTERNAL[urlLocale];
    const rest = '/' + segments.slice(2).join('/');
    const target = request.nextUrl.clone();
    target.pathname = rest === '/quiz' ? pathname : rest === '/' ? '/' : rest;

    const headers = new Headers(request.headers);
    headers.set(LOCALE_HEADER, internalLocale);

    const res = NextResponse.rewrite(target, { request: { headers } });
    res.cookies.set(LOCALE_COOKIE, internalLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    return res;
  }

  const country =
    request.headers.get('x-vercel-ip-country') ??
    request.headers.get('cf-ipcountry') ??
    request.headers.get('x-country-code');
  const urlLocale = detectFromCountry(country);

  const target = request.nextUrl.clone();
  target.pathname = `/${urlLocale}${pathname === '/' ? '' : pathname}`;
  target.search = search;
  const res = NextResponse.redirect(target);
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
