/**
 * Feature flags do frontend.
 *
 * PLANS_ENABLED: planos de assinatura (mensal / modo ilimitado / gerenciar
 * assinatura) estão temporariamente desativados. No momento a monetização é
 * 100% via compra de pacotes de crédito (avulsos).
 *
 * Para reativar toda a UI de planos/assinatura, basta trocar para `true`.
 * Nenhum código de planos foi removido — apenas ocultado atrás desta flag.
 */
export const PLANS_ENABLED = false;
