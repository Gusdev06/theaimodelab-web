export const meta = {
  name: 'apple-refine-app',
  description: 'Apply Apple-inspired UI polish across the whole app (keeping dark+red brand), one agent per feature area',
  phases: [
    { title: 'Refine', detail: 'one agent per area applies the conservative Apple spec' },
    { title: 'Verify', detail: 'each area is self-reviewed for breakage' },
  ],
}

// Shared, conservative, className-ONLY spec every agent must follow.
const SPEC = `
You are applying an Apple-inspired UI polish to a Next.js + Tailwind v4 project WHILE KEEPING the existing dark + red brand (brand red is #e11d2a, exposed as the token \`app-lime\` / bg-app-lime and text-app-lime — the name says "lime" but it is RED, keep it). This is the PRODUCT/APP surface, which uses the \`app-*\` design tokens (app-bg, app-surface, app-card, app-card-hover, app-text, app-text-2, app-muted, app-hairline, app-hairline-2, app-lime, app-lime-ink, app-violet, ease-app).

STRICT RULES — do not violate:
- Change ONLY Tailwind classNames and inline \`style\` for geometry, motion, spacing, and depth. NEVER change copy/text, translation keys, imports, component structure, props, hooks, state, data fetching, or any logic.
- NEVER change brand colors or swap tokens for different colors. No new color values that aren't already in the file/brand.
- Do NOT touch table layouts, grid column counts, form field logic, or anything that could break functional screens. Admin/data screens get a LIGHT touch.
- If a file is server-only markup with no interactive elements, a light reveal on the top heading is enough.
- Keep every edit reversible and minimal. When unsure, skip the change.

USE these globally-defined CSS utility classes (already in globals.css — just add them, never redefine):
- \`app-btn\` — Apple PILL button (border-radius 980px + hover scale(1.02)/brightness + active scale(0.98) + smooth easing). Apply ONLY to PROMINENT PRIMARY CTAs that use \`bg-app-lime\` (e.g. "Criar", "Assinar", "Salvar", primary submit). When you add it, REMOVE any \`rounded-*\` on that same element and remove conflicting \`transition-*\`/hover-transform/\`hover:bg-*\` brightness hacks on it. Keep px/py/text/font/color. Do NOT pill-ify small icon-only buttons, table row actions, tabs, or dense toolbar buttons.
- \`app-press\` — subtle press feedback (active scale 0.97) for buttons that STAY rectangular. Add to secondary/ghost/icon buttons that already have a transition, to give tactile feedback. Keep their existing rounded-* radius.
- \`app-ease\` — Apple easing timing function. Add to interactive elements that already use \`transition\`/\`transition-all\`/\`transition-colors\` but that you are not converting.
- \`app-glass-hover\` — smooth translateY(-3px) lift + border/shadow on hover. Add ONLY to hoverable CARD containers that do NOT already animate their own \`transform\` (no existing float/scroll-reveal transform, no \`animate-card-in\`). Good for clickable list/grid cards. Never add to table rows, sidebar items, or anything already transforming.
- \`app-reveal\` — one-shot fade-up entrance. Add to a PAGE's main heading / hero block (the top \`<h1>\`/\`<h2>\` or its wrapper). Optionally stagger ONE sibling (subtitle) with inline \`style={{ animationDelay: '0.08s' }}\`. Do NOT put reveal on many repeated list/grid items or on data tables.

TASTE:
- Prefer smoothing what's there over adding new things. A few high-quality touches per file beats blanketing every element.
- Prominent primary CTA → pill. Secondary/icon buttons → app-press + app-ease. Clickable cards → app-glass-hover. Page heading → app-reveal. That's the core playbook.

After editing, return a SHORT plain-text bullet list: for each file you changed, one line naming the file and what you did. If you changed nothing in a file, say so. Do NOT run builds or tsc.
`

// Feature-area buckets. Each agent gets its pages + the matching component dir(s),
// so a feature is refined coherently. Landing is intentionally excluded (already done).
const AREAS = [
  { key: 'app-shell', label: 'App shell & home', targets: [
    'app/(app)/layout.tsx', 'app/(app)/home/page.tsx', 'components/app/', 'components/home/',
  ]},
  { key: 'workspace', label: 'Workspace', targets: [
    'app/workspace/page.tsx', 'app/(app)/workspaces/page.tsx', 'components/workspaces/',
  ]},
  { key: 'image', label: 'Image generation', targets: [
    'app/(app)/image/page.tsx', 'components/image/',
  ]},
  { key: 'video-voice', label: 'Video & voice', targets: [
    'app/(app)/video/page.tsx', 'app/(app)/voice/page.tsx', 'components/video/', 'components/voice/',
  ]},
  { key: 'avatar-tools', label: 'Avatar, tools, tiktok, clone-prompt', targets: [
    'app/(app)/avatar/page.tsx', 'app/(app)/tools/page.tsx', 'app/(app)/tiktok-shop/page.tsx',
    'app/(app)/clone-prompt/page.tsx', 'components/avatar/', 'components/tools/',
    'components/tiktok-shop/', 'components/clone-prompt/',
  ]},
  { key: 'community-gallery', label: 'Community, gallery, posts, profile', targets: [
    'app/(app)/community/page.tsx', 'app/(app)/gallery/page.tsx', 'app/(app)/post/[id]/page.tsx',
    'app/(app)/u/[id]/page.tsx', 'app/(app)/perfil/page.tsx', 'app/p/[slug]/page.tsx',
    'app/p/[slug]/PostInteractive.tsx',
    'components/community/', 'components/gallery/', 'components/profile/',
  ]},
  { key: 'prompt-library', label: 'Prompt library & prompts', targets: [
    'app/(app)/prompt-library/page.tsx', 'app/prompts/page.tsx', 'app/prompts/PromptsClient.tsx',
    'components/prompt-library/',
  ]},
  { key: 'pricing-billing', label: 'Pricing, credits, checkout, payment', targets: [
    'app/(app)/pricing/page.tsx', 'app/creditos/page.tsx', 'app/checkout/page.tsx',
    'app/payment/success/page.tsx', 'app/payment/cancel/page.tsx', 'app/uso/page.tsx',
    'components/pricing/',
  ]},
  { key: 'auth', label: 'Auth & misc pages', targets: [
    'app/login/page.tsx', 'app/forgot-password/page.tsx', 'app/reset-password/page.tsx',
    'app/verify-email/page.tsx', 'app/feedback/page.tsx', 'app/painel-afiliado/page.tsx',
    'app/not-found.tsx',
    'components/LoginModal.tsx', 'components/FeedbackRewardModal.tsx',
  ]},
  { key: 'legal', label: 'Legal pages (light touch)', targets: [
    'app/politica-de-privacidade/page.tsx', 'app/termos-de-uso/page.tsx',
  ]},
  { key: 'editor-a', label: 'Editor components (batch A)', targets: [
    'components/editor/ — refine ONLY the most user-facing pieces: toolbars, panels, buttons, modals/dialogs, side panels. Read the dir, pick the ~15 highest-impact interactive files, apply the spec. Skip pure-logic/util files.',
    'components/canvas/',
  ]},
  { key: 'admin-core', label: 'Admin core (LIGHT touch)', targets: [
    'app/admin/layout.tsx', 'app/admin/page.tsx', 'components/admin/',
    'app/admin/feedback/page.tsx', 'app/admin/feedback/dashboard.tsx',
    'app/admin/usuarios/page.tsx', 'app/admin/usuarios/[id]/page.tsx',
    'app/admin/geracoes/page.tsx', 'app/admin/modelos/page.tsx', 'app/admin/avisos/page.tsx',
    'app/admin/comunidade/page.tsx', 'app/admin/crons/page.tsx', 'app/admin/prompts/page.tsx',
    'app/admin/prompt-posts/page.tsx', 'app/admin/precificacao/page.tsx',
    'app/admin/afiliados/page.tsx', 'app/admin/assinaturas/page.tsx',
    'app/admin/filas-ilimitado/page.tsx', 'app/admin/uploads/page.tsx',
    'app/admin/utm/page.tsx', 'app/admin/vertex/page.tsx',
    'app/admin/emails/page.tsx', 'app/admin/emails/novo/page.tsx', 'app/admin/emails/[id]/page.tsx',
  ]},
  { key: 'admin-stripe', label: 'Admin Stripe (LIGHT touch)', targets: [
    'app/admin/stripe/layout.tsx', 'app/admin/stripe/page.tsx',
    'app/admin/stripe/assinaturas/page.tsx', 'app/admin/stripe/clientes/page.tsx',
    'app/admin/stripe/clientes/[id]/page.tsx', 'app/admin/stripe/cupons/page.tsx',
    'app/admin/stripe/precos/page.tsx', 'app/admin/stripe/produtos/page.tsx',
    'app/admin/stripe/transacoes/page.tsx',
  ]},
  { key: 'ui-primitives', label: 'shadcn ui primitives (careful)', targets: [
    'components/ui/ — VERY carefully refine ONLY: button.tsx (add app-ease + active press feel to existing variants without changing variant names/APIs), card.tsx (smoother radius/shadow if it already has one), dialog/sheet/popover (easing on transitions). Do NOT change any component API, variant names, or exported props. If a change risks the API, skip it. These cascade app-wide so err on minimal.',
  ]},
]

phase('Refine')

const results = await pipeline(
  AREAS,
  (area) => agent(
    `${SPEC}\n\nAREA: ${area.label}\nEdit the following targets (paths are relative to the repo root ${'/Users/gustavogomes/projects/pessoais/theaimodelab/theaimodelab-web'}). For any target ending in "/" it is a directory — read it and apply the spec to its relevant interactive files:\n${area.targets.map((t) => '- ' + t).join('\n')}`,
    { label: `refine:${area.key}`, phase: 'Refine' }
  ).then((report) => ({ area: area.key, label: area.label, report })),
  // Self-verify each area right after it's refined (no barrier): catch obvious breakage.
  (refined, area) => agent(
    `You are a careful reviewer. An agent just applied Apple-style className-only polish to the "${area.label}" area of a Next.js + Tailwind v4 app. Verify it did NOT break anything.\n\nCheck ONLY these files/dirs for problems:\n${area.targets.map((t) => '- ' + t).join('\n')}\n\nLook for: (1) JSX/syntax errors, unbalanced className strings or braces; (2) duplicate/conflicting Tailwind radius classes on the same element (e.g. \`app-btn\` together with \`rounded-xl\`); (3) any change to text/copy, imports, props, or logic (there should be NONE); (4) \`app-glass-hover\` added onto elements that already animate transform; (5) color/token swaps away from brand.\n\nIf you find a real problem, FIX it directly (minimal, className-only) and report what you fixed. If everything is fine, say "OK — no issues". Report concisely. Do NOT run builds.\n\nThe refine agent's own report was:\n${refined.report}`,
    { label: `verify:${area.key}`, phase: 'Verify' }
  ).then((verdict) => ({ area: area.key, label: area.label, verdict }))
)

const done = results.filter(Boolean)
log(`Refined + verified ${done.length}/${AREAS.length} areas`)

return {
  areas: done.map((d) => ({ area: d.area, label: d.label, verdict: (d.verdict || '').slice(0, 400) })),
}
