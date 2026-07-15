import { NextRequest, NextResponse } from 'next/server';

// Este handler roda no server (Vercel) e chama o backend diretamente, então precisa
// da origem ABSOLUTA — não pode depender de NEXT_PUBLIC_API_URL, que agora fica vazio
// (same-origin) pro browser. Usa API_ORIGIN e só cai no NEXT_PUBLIC_API_URL por retro-compat.
const BASE_URL = (process.env.API_ORIGIN ?? process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '');
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const PENDING_META_LEAD_COOKIE = 'theaimodelab_meta_pending_lead';

function safeJsonParse(value?: string) {
  if (!value) return null;
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function buildGoogleTracking(request: NextRequest, eventId: string, origin: string) {
  const attribution = safeJsonParse(request.cookies.get('theaimodelab_attribution')?.value) ?? {};
  const landingPage = typeof attribution.landing_page === 'string' ? attribution.landing_page : '/';
  const eventSourceUrl = (() => {
    try {
      return new URL(landingPage, origin).toString();
    } catch {
      return origin;
    }
  })();

  return {
    ...attribution,
    fbp: request.cookies.get('_fbp')?.value ?? attribution.fbp,
    fbc: request.cookies.get('_fbc')?.value ?? attribution.fbc,
    event_id: eventId,
    event_source_url: eventSourceUrl,
  };
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const error = request.nextUrl.searchParams.get('error');
  const origin = request.nextUrl.origin;

  if (error || !code) {
    return NextResponse.redirect(new URL('/login?error=google_denied', origin));
  }

  if (!BASE_URL) {
    console.error('[google-callback] NEXT_PUBLIC_API_URL is not set');
    return NextResponse.redirect(new URL('/login?error=google_config', origin));
  }

  try {
    // Exchange authorization code for tokens with Google.
    // Google's token endpoint requires application/x-www-form-urlencoded, NOT JSON.
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        redirect_uri: `${origin}/api/v1/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const body = await tokenRes.text();
      console.error('[google-callback] token exchange failed', tokenRes.status, body);
      return NextResponse.redirect(new URL('/login?error=google_exchange_failed', origin));
    }

    const tokens = await tokenRes.json();
    const idToken = tokens.id_token;

    if (!idToken) {
      console.error('[google-callback] no id_token in response', tokens);
      return NextResponse.redirect(new URL('/login?error=google_no_token', origin));
    }

    // Send ID token to backend (same endpoint used before)
    const authUrl = `${BASE_URL}/api/v1/auth/google`;
    const metaLeadEventId = `lead_google-${crypto.randomUUID()}`;
    const authRes = await fetch(authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        googleToken: idToken,
        tracking: buildGoogleTracking(request, metaLeadEventId, origin),
      }),
    });

    if (!authRes.ok) {
      const body = await authRes.text();
      console.error('[google-callback] backend auth failed', authUrl, authRes.status, body);
      return NextResponse.redirect(new URL('/login?error=auth_failed', origin));
    }

    const authData = await authRes.json();

    // Check if there's a plan redirect cookie from the landing page
    const planRedirect = request.cookies.get('theaimodelab-plan-redirect')?.value;
    const redirectTo = planRedirect ? `/checkout?plan=${planRedirect}` : '/home';

    // Set the same cookies the client-side auth context expects
    const response = NextResponse.redirect(new URL(redirectTo, origin));

    // Clear the plan redirect cookie
    if (planRedirect) {
      response.cookies.set('theaimodelab-plan-redirect', '', { path: '/', maxAge: 0 });
    }

    if (authData.isNewUser) {
      response.cookies.set(PENDING_META_LEAD_COOKIE, JSON.stringify({
        eventId: metaLeadEventId,
        method: 'google',
      }), {
        path: '/',
        maxAge: 300,
        sameSite: 'lax',
      });
    }

    response.cookies.set('theaimodelab-access-token', authData.accessToken, {
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax',
    });
    response.cookies.set('theaimodelab-refresh-token', authData.refreshToken, {
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax',
    });
    response.cookies.set('theaimodelab-user', JSON.stringify(authData.user), {
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax',
    });

    return response;
  } catch (err) {
    console.error('[google-callback] unexpected error', err);
    return NextResponse.redirect(new URL('/login?error=google_failed', origin));
  }
}
