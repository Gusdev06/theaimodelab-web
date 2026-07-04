# Alterações — Pacotes de crédito + Ocultar planos

**Data:** 2026-07-04
**Escopo:** `theaimodelab-web` (frontend Next.js). Nenhuma alteração no backend (`theaimodelab-api`).
**Autor da sessão:** Claude (Opus 4.8) a pedido do dono do projeto.

Este documento registra **tudo** que foi feito nesta sessão, com o racional das decisões e o **passo a passo para reverter** cada parte. Serve de contexto para uma futura conversa em que parte disso poderá ser desfeita.

---

## Índice

1. [Tarefa 1 — Mostrar "o que dá pra gerar" em cada pacote de crédito](#tarefa-1)
2. [Tarefa 2 — Ocultar tudo que fala de "plano" (deixar só compra de créditos)](#tarefa-2)
3. [Como reverter cada coisa](#reverter)
4. [Pontos em aberto / decisões a revisar](#pendencias)

---

<a id="tarefa-1"></a>
## Tarefa 1 — "O que dá pra gerar" nos cards de pacote de crédito

### Objetivo
Nos cards de compra de **pacote de crédito** (avulso), passar a exibir uma estimativa do que o usuário consegue gerar com aquele pacote, no formato:

```
Até 133 imagens em alta qualidade
Até 17 vídeos imitando movimentos
Até 92 upscales em 4K
Produção intensa sem se preocupar
Créditos não expiram
```

Antes, os cards mostravam 3 perks genéricos fixos (`instant`, `neverExpire`, `stackWithPlan`).

### Como o número é calculado
`floor(créditos_do_pacote / custo_do_modelo)`. Os custos são um **espelho (hardcoded)** da tabela `credit_costs` do backend (seed em `theaimodelab-api/prisma/seed.ts`).

**Bases de custo escolhidas pelo dono (decisão de negócio/marketing):**

| Linha exibida | Modelo/base | Créditos |
|---|---|---|
| Imagens em alta qualidade | Nano Banana 2 (NB2) 1K | **90** |
| Vídeos imitando movimentos | Motion Control 720p × 10s (70/seg) | **700** |
| Upscales em 4K | Upscale = image-to-image 2K do NB2 | **130** |

> Havia outras opções oferecidas (NB2 2K/4K para imagem; 5s/1080p para motion; NBPro para upscale). O dono escolheu explicitamente as bases acima.

**Resultado por pacote ativo:**

| Pacote | Créditos | Imagens (÷90) | Vídeos motion (÷700) | Upscales (÷130) |
|---|---|---|---|---|
| Creator | 12.000 | 133 | 17 | 92 |
| Pro | 30.000 | 333 | 42 | 230 |
| Advanced | 50.000 | 555 | 71 | 384 |
| Studio | 80.000 | 888 | 114 | 615 |

### Arquivos alterados (Tarefa 1)

1. **`lib/plans.ts`** — adicionado:
   - `PACKAGE_PERK_COSTS` (constantes de custo: `imageHQ: 90`, `motionVideo: 700`, `upscale4k: 130`).
   - Tipos `PackageGenerationPerkKey`, `PackageGenerationPerk`.
   - Função `getPackageGenerationPerks(credits)` → retorna `[{key:'imagesHQ',count}, {key:'motionVideos',count}, {key:'upscales4k',count}]`.
   - Inserido logo **antes** de `export function getPackagePerks(...)`.

2. **`components/editor/CreditPackagesGrid.tsx`**:
   - Import: adicionado `getPackageGenerationPerks` no import de `@/lib/plans`.
   - Bloco de perks (`<ul>`): trocado de 3 perks fixos (`['instant','neverExpire','stackWithPlan']`) para:
     - 3 linhas dinâmicas via `getPackageGenerationPerks(pkg.credits)` (`packages.perks.<key>` com `{ count }`).
     - 2 linhas fixas: `intenseProduction` e `creditsNeverExpire`.
   - Removido o `min-h-[55px]/min-h-[80px]` da `<ul>` (agora são 5 itens, o conteúdo cresce).

3. **i18n** — novas chaves em `editorPlans.packages.perks` nos 3 locales:
   - `messages/pt-BR/editor-plans.json`
   - `messages/en/editor-plans.json`
   - `messages/es/editor-plans.json`

   Chaves adicionadas: `imagesHQ`, `motionVideos`, `upscales4k` (com ICU `{count, number}`), `intenseProduction`, `creditsNeverExpire`. As chaves antigas (`instant`, `neverExpire`, `stackWithPlan`) **foram mantidas** (não são mais usadas no grid, mas continuam no arquivo).

   Textos pt-BR:
   - `imagesHQ`: "Até {count, number} imagens em alta qualidade"
   - `motionVideos`: "Até {count, number} vídeos imitando movimentos"
   - `upscales4k`: "Até {count, number} upscales em 4K"
   - `intenseProduction`: "Produção intensa sem se preocupar"
   - `creditsNeverExpire`: "Créditos não expiram"

### ⚠️ Observações importantes (Tarefa 1)
- Os números são **estimativas de marketing** com base fixa. O custo real varia conforme resolução/modelo escolhido na hora da geração (ex.: imagem 4K = 190, não 90).
- Os custos ficam **hardcoded no frontend** (`PACKAGE_PERK_COSTS` em `lib/plans.ts`). **Se os preços mudarem no seed do backend, é preciso atualizar essas 3 constantes manualmente.** Não puxa da API.
- Vale para as duas telas que usam o grid: landing pública (`components/landing/pricing.tsx`) e pricing autenticado (`components/pricing/PricingView.tsx`) — ambas passam `packages` por props.

---

<a id="tarefa-2"></a>
## Tarefa 2 — Ocultar tudo que fala de "plano" (só créditos)

### Objetivo
Desativar temporariamente **toda a UI de planos de assinatura** (mensal / modo ilimitado / gerenciar assinatura) e deixar apenas a **compra de pacotes de crédito**.

### Decisões do dono
- **Método:** feature flag reversível (não deletar código).
- **Comportamento:** esconder o que fala de plano **e redirecionar** os CTAs para compra de créditos.

### Mecanismo central: feature flag
Arquivo novo: **`lib/features.ts`**
```ts
export const PLANS_ENABLED = false;
```
Trocar para `true` reativa **toda** a UI de planos. Todo o resto foi gateado atrás dessa constante.

### Contexto do estado anterior
As telas de pricing **já vinham** com a aba inicial em `'credits'` e um comentário `// Assinaturas descontinuadas: monetização é 100% via pacotes de crédito.`. Mas a aba "Planos", os grids, o modo ilimitado, "gerenciar assinatura" e vários CTAs ainda apareciam. Esta tarefa terminou de esconder isso.

### Arquivos alterados (Tarefa 2)

Todos importam `import { PLANS_ENABLED } from '@/lib/features';`.

#### Telas com abas Planos/Créditos (agora só créditos — a barra de abas some inteira)
1. **`components/pricing/PricingView.tsx`** (`/pricing`)
   - Barra de abas embrulhada em `{PLANS_ENABLED && ( ... )}`.
   - Bloco de planos: `{activeTab === 'plans' && (` → `{PLANS_ENABLED && activeTab === 'plans' && (`.

2. **`components/editor/PlansModal.tsx`** (modal aberto pelo botão "Comprar créditos" e por paywalls)
   - Bloco `{/* Tabs */}` embrulhado em `{PLANS_ENABLED && ( ... )}`.
   - `{activeTab === 'plans' && (` → `{PLANS_ENABLED && activeTab === 'plans' && (`.

3. **`app/creditos/page.tsx`** (`/creditos`)
   - Effect de auto-checkout `?plan=`: adicionado `!PLANS_ENABLED ||` como primeira condição de `return`.
   - Modal "zero créditos": botão **"Renovar agora"** embrulhado em `{PLANS_ENABLED && (...)}`; o botão **"Comprar créditos extras"** passou a ser o primário (vermelho) quando planos off.
   - Banner "créditos baixos": botão **"Renovar plano"** embrulhado em `{PLANS_ENABLED && (...)}`; **"Comprar boost"** vira o destaque.
   - "Tab toggle": `{packages && ... && (` → `{PLANS_ENABLED && packages && ... && (`.
   - Bloco de planos: `{activeTab === 'plans' && ...` → `{PLANS_ENABLED && activeTab === 'plans' && ...`.

#### Assinatura / modo ilimitado / badges
4. **`components/editor/UnlimitedToggle.tsx`**
   - Early return: `if (!PLANS_ENABLED) return null;` (após os hooks). Esconde **todas** as instâncias do toggle "Modo Ilimitado" nos painéis de imagem/vídeo de uma vez.

5. **`components/editor/UnlimitedUpgradeModal.tsx`**
   - Early return `if (!PLANS_ENABLED) return null;` logo antes do `return (` (após todos os hooks). Garante que a modal de upgrade de ilimitado nunca renderize (mesmo se aberta por paywall de erro de geração).

6. **`components/app/GenerationCostEstimate.tsx`**
   - Branch do badge "Ilimitado": `if (unlimited)` → `if (unlimited && PLANS_ENABLED)`.

7. **`components/editor/TopNavbar.tsx`**
   - Item de menu **"Planos"** (`tMenu('plans')`, 3 ocorrências): cada `<DropdownItem ... />` embrulhado em `{PLANS_ENABLED && <DropdownItem ... />}`.
   - **Badge de plano** (`{planName && (` → `{PLANS_ENABLED && planName && (`, 3 ocorrências) — o chip "Free"/"Pro" ao lado do nome do usuário.
   - **Mantido:** botão "Comprar créditos" (+) e item "Créditos" do menu.

8. **`components/profile/ProfileView.tsx`**
   - Bloco "plano + assinatura" (grid com "Plano" + "Assinatura") embrulhado em `{PLANS_ENABLED && (...)}`.
   - Botão **"Gerenciar assinatura"** embrulhado em `{PLANS_ENABLED && (...)}`.
   - Bloco de reativação: `{subStatus?... && cancelAtPeriodEnd && (` → `{PLANS_ENABLED && subStatus?... && cancelAtPeriodEnd && (`.
   - Render do `ManageSubscriptionModal`: `{showManageModal && ...` → `{PLANS_ENABLED && showManageModal && ...`.

#### Redirecionamento
9. **`components/tiktok-shop/TikTokShopView.tsx`**
   - Paywall de plano grátis: botão `onClick={() => router.push('/pricing')}` → `router.push('/creditos')`. (Label i18n `viewPlans` = "Ver planos" ficou igual — ver pendências.)

### Componentes que NÃO precisaram mexer
- `components/landing/pricing.tsx` — já era só créditos (`api.credits.packagesPublic`).
- `components/editor/CreditPackagesGrid.tsx` — é o grid de créditos (permanece; alterado só na Tarefa 1).
- `components/editor/PlansGrid.tsx` — **não** foi tocado; fica invisível porque todos os seus locais de uso (PricingView, PlansModal, creditos) estão gateados.
- `components/editor/ManageSubscriptionModal.tsx` — não tocado; só o local que o abre/renderiza foi gateado.
- `components/editor/UnlimitedHeaderButton.tsx` — código morto (não é importado em lugar nenhum), ignorado.
- Paywalls em `GenerateImagePanel`/`GenerateVideoPanel` e `WeeklyClaimWidget`/`SidebarWeeklyClaim` que abrem o `PlansModal` — **mantidos**; o modal agora abre só na aba de créditos.

### Decisões tomadas (deviations conscientes)
1. **Link "Preços" (`components/app/AppTopbar.tsx`) e comando "Preços" da command palette (`lib/home-nav.ts`) → MANTIDOS.** Eles apontam para `/pricing`, que ficou só-créditos. Escondê-los removeria o único caminho de compra no shell fora do menu, e o texto "Preços" não diz "plano". **Não foram alterados.**
2. **Microcopy residual que cita "plano"**: alguns chips de garantia nas telas de crédito ainda dizem *"Acumulam com os créditos do plano"* (i18n `editorPlans.plansModal.stackWithPlan` e `account.credits.accumulates`). Foram **mantidos** (strings compartilhadas). Hoje soam desatualizados sem planos.

---

<a id="reverter"></a>
## Como reverter

### Reverter a Tarefa 2 inteira (reativar planos) — 1 linha
Em **`lib/features.ts`**, trocar:
```ts
export const PLANS_ENABLED = false;
```
por
```ts
export const PLANS_ENABLED = true;
```
Isso reexibe **todas** as abas de planos, grids, modo ilimitado, badges, "gerenciar assinatura", banners "Renovar plano", etc. Como tudo foi só gateado (não deletado), volta ao comportamento anterior.

> ⚠️ Exceção — o redirecionamento do **TikTok Shop** (`router.push('/creditos')`) **não** está atrás da flag. Para voltar a apontar para `/pricing`, reeditar `components/tiktok-shop/TikTokShopView.tsx` manualmente.

### Reverter só a Tarefa 1 (voltar aos 3 perks genéricos)
Em **`components/editor/CreditPackagesGrid.tsx`**, restaurar o `<ul>` para mapear `['instant','neverExpire','stackWithPlan']` (chaves i18n antigas, que continuam existindo). Opcionalmente remover `PACKAGE_PERK_COSTS`/`getPackageGenerationPerks` de `lib/plans.ts` e as chaves novas dos 3 `editor-plans.json`. As chaves i18n antigas nunca foram removidas, então o revert é direto.

### Ajustar os números da Tarefa 1 (sem reverter)
Editar `PACKAGE_PERK_COSTS` em **`lib/plans.ts`**. Ex.: para "imagens em alta qualidade" virar 4K, trocar `imageHQ: 90` por `imageHQ: 190`. Os textos ficam nos `editor-plans.json` (`packages.perks.*`).

---

<a id="pendencias"></a>
## Pontos em aberto / a revisar numa próxima conversa

1. **Custos hardcoded (Tarefa 1):** `PACKAGE_PERK_COSTS` não sincroniza com o backend. Se quiser automático, expor os custos num endpoint da API e consumir no grid.
2. **"Preços" mantido:** decidir se o link no topo e o comando da palette devem sumir ou ser renomeados para "Comprar créditos".
3. **Microcopy "plano":** chips *"Acumulam com os créditos do plano"* nas telas de crédito ainda mencionam plano. Podem ser trocados por algo neutro (ex.: "Créditos não expiram").
4. **`viewPlans` no TikTok Shop:** o botão foi repontado para `/creditos`, mas o texto ainda é "Ver planos". Trocar o i18n se incomodar.
5. **⚠️ Lógica de negócio `isFreePlan`:** paywalls (ex.: TikTok Shop trending) continuam bloqueando "plano grátis". **Comprar um pacote de crédito NÃO muda o slug do plano (continua `free`)**, então esses gates não são levantados ao comprar créditos. Isso é regra de backend — precisa ser revisto se a intenção for liberar features via compra de crédito.
6. **Lint pré-existente:** `components/editor/UnlimitedUpgradeModal.tsx` tem erros `react-hooks/immutability` no `window.location.href =` (linhas ~93/99). **São pré-existentes, não introduzidos nesta sessão** (confirmado). Não bloquearam nada aqui, mas ficam registrados.

---

## Validação feita nesta sessão
- `npx tsc --noEmit` → sem erros.
- JSON dos 3 locales → válidos.
- ESLint nos 10 arquivos alterados → **zero problemas novos** (só warnings/erros pré-existentes).
- **Não** foi feito QA visual (dev server) — ficou como oferta em aberto.

## Lista rápida de arquivos tocados
```
lib/features.ts                                  (novo)
lib/plans.ts                                     (T1)
components/editor/CreditPackagesGrid.tsx         (T1)
messages/pt-BR/editor-plans.json                 (T1)
messages/en/editor-plans.json                    (T1)
messages/es/editor-plans.json                    (T1)
components/pricing/PricingView.tsx               (T2)
components/editor/PlansModal.tsx                 (T2)
app/creditos/page.tsx                            (T2)
components/editor/TopNavbar.tsx                  (T2)
components/profile/ProfileView.tsx               (T2)
components/editor/UnlimitedToggle.tsx            (T2)
components/editor/UnlimitedUpgradeModal.tsx      (T2)
components/app/GenerationCostEstimate.tsx        (T2)
components/tiktok-shop/TikTokShopView.tsx        (T2, redirect)
```
