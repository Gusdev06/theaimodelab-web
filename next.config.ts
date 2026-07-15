import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// Origem do backend NestJS. Em produção o browser NÃO fala direto com esse host
// (VPS único em São Paulo, só IPv4, sem CDN) — o que fazia usuários em redes
// IPv6-only e certos países/ISPs receberem "Failed to fetch" ao logar. As chamadas
// agora passam same-origin pela Vercel via o rewrite abaixo, herdando edge global +
// IPv6 + anycast. Requer NEXT_PUBLIC_API_URL vazio no client (ver lib/api.ts BASE_URL).
const API_ORIGIN = (process.env.API_ORIGIN ?? process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '');

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    if (!API_ORIGIN) return [];
    // afterFiles: as rotas locais em app/api/v1/auth/google/* têm prioridade;
    // todo o resto de /api/v1/* é proxied pro backend.
    return {
      afterFiles: [
        { source: '/api/v1/:path*', destination: `${API_ORIGIN}/api/v1/:path*` },
      ],
    };
  },
};

export default withNextIntl(nextConfig);
