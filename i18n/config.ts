// Locale interno (nome da pasta em messages/): pt-BR é Brazilian Portuguese.
export const locales = ['en', 'es', 'pt-BR'] as const;
export type Locale = (typeof locales)[number];

// Prefixo na URL (sempre minúsculo): /en, /es, /pt-br. O mapa URL→interno vive no proxy.
export const URL_LOCALES = ['en', 'es', 'pt-br'] as const;
export type UrlLocale = (typeof URL_LOCALES)[number];

export const defaultLocale: Locale = 'en';
export const LOCALE_COOKIE = 'theaimodelab-locale';
export const LOCALE_HEADER = 'x-theaimodelab-locale';
