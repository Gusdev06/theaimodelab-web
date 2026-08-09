'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';

/**
 * Padrões de erros conhecidos → chave i18n em `home.errors`.
 * A ordem importa: o primeiro padrão que casar vence.
 * Qualquer mensagem que não case com nenhum padrão cai em `generic` — assim o
 * usuário nunca vê o erro técnico/cru do provedor.
 */
/** Recusa por política de uso (conteúdo proibido/bloqueado pelo provedor). */
const BLOCKED_CONTENT = /prohibited use|content policy|violat|blocked by|not allowed/i;
/** Recusa por conteúdo sensível/moderação (NSFW, safety filters). */
const SENSITIVE_CONTENT = /sensitive|flagged|nsfw|safety|moderation/i;

const KNOWN_PATTERNS: Array<[RegExp, string]> = [
  [/no image(s)? (returned|in response|generated)|did not return|empty (output|response)|nenhuma imagem/i, 'noResult'],
  [BLOCKED_CONTENT, 'blockedContent'],
  [SENSITIVE_CONTENT, 'sensitiveContent'],
  [/insufficient|not enough|saldo insuficiente|sem cr[eé]ditos?|cr[eé]ditos insuficientes/i, 'insufficientCredits'],
  [/limit reached|limite atingido|max(imum)? .* reached|plan limit|quota (exceeded|reached)|limite do (seu )?plano/i, 'limitReached'],
  [/rate[ -]?limit|too many requests|\b429\b/i, 'rateLimited'],
  [/tim(e|ed)?[ -]?out|deadline exceeded|timed out/i, 'timeout'],
];

/**
 * Retorna uma função que traduz qualquer mensagem de erro de geração para uma
 * versão amigável e localizada. Mensagens conhecidas usam a chave mapeada;
 * o resto cai na mensagem genérica.
 *
 * Funciona em qualquer componente — usa o namespace `home.errors`, que está
 * disponível em todos os locales carregados.
 */
/**
 * True quando a falha foi recusa por política/conteúdo sensível (moderação) —
 * usado para, em modelos censurados (Kling, Veo/Google…), sugerir os modelos
 * sem censura (LTX, Seedance Spicy, MiniMax).
 */
export function isContentPolicyError(raw?: string | null): boolean {
  if (!raw) return false;
  return BLOCKED_CONTENT.test(raw) || SENSITIVE_CONTENT.test(raw);
}

export function useGenerationErrorMessage() {
  const t = useTranslations('home.errors');

  return useCallback(
    (raw?: string | null): string => {
      if (!raw || !raw.trim()) return t('generic');
      for (const [pattern, key] of KNOWN_PATTERNS) {
        if (pattern.test(raw)) return t(key);
      }
      return t('generic');
    },
    [t],
  );
}
