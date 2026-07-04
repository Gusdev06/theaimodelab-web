import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

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
    const authRes = await fetch(authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ googleToken: idToken }),
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
