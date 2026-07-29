// A ativação da assinatura (PerfectPay em USD, Cakto em BRL) casa a compra pelo
// email do comprador (ver webhooks na API). Por isso, ao mandar o usuário para o
// checkout, pré-preenchemos o email (e o nome) da conta logada para garantir que a
// compra caia na conta certa e reduzir atrito no formulário.
//
// A PerfectPay aceita `email`, `name` e `phone` como query params. A Cakto aceita
// `email`/`name` (confirmar nomes exatos no painel Cakto); se ela ignorar, o
// prefill apenas não ocorre — o usuário digita o email e o webhook casa mesmo assim.

interface CheckoutIdentity {
  email?: string | null;
  name?: string | null;
}

/**
 * Anexa a identidade do comprador (email/nome) a uma URL de checkout da PerfectPay,
 * preservando quaisquer parâmetros já existentes na URL. Se não houver email, retorna
 * a URL original sem alterações.
 */
export function withCheckoutIdentity(
  checkoutUrl: string,
  { email, name }: CheckoutIdentity,
): string {
  if (!email) return checkoutUrl;

  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set('email', email);
    if (name) url.searchParams.set('name', name);
    return url.toString();
  } catch {
    // URL malformada — devolve como veio para não quebrar o fluxo de pagamento.
    return checkoutUrl;
  }
}
