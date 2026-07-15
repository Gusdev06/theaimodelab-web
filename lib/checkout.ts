// A ativação da assinatura na PerfectPay casa a compra pelo email do comprador
// (ver webhook `perfectpay-webhook.service` na API). Por isso, ao mandar o usuário
// para o checkout, pré-preenchemos o email (e o nome, quando houver) da conta logada
// para garantir que a compra caia na conta certa e reduzir atrito no formulário.
//
// A PerfectPay aceita os parâmetros de query `email`, `name` e `phone` para
// pré-preencher os campos do checkout.

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
