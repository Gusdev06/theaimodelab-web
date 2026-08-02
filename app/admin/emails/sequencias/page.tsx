'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { ArrowLeft, ChevronDown, ChevronUp, Loader2, Send, Zap } from 'lucide-react';

const SEQUENCE_SECTION: Record<string, { title: string; description: string }> = {
  onboarding: {
    title: 'Conversão — cadastrou, ainda não assinou',
    description: '7 emails em 14 dias empurrando pra primeira assinatura.',
  },
  post_subscription: {
    title: 'Ativação — acabou de assinar',
    description: '2 emails levando à primeira geração e ao bom uso dos créditos.',
  },
  lifecycle: {
    title: 'Monetização — gatilhos por estado da conta',
    description:
      'Disparados por saldo/ciclo/cancelamento. Os números abaixo são de exemplo — no envio real vêm da conta do usuário.',
  },
};

type EmailLocale = 'pt-BR' | 'en' | 'es';

const LOCALE_LABEL: Record<EmailLocale, string> = {
  'pt-BR': 'Português',
  en: 'English',
  es: 'Español',
};

const LOCALES: EmailLocale[] = ['pt-BR', 'en', 'es'];

const PREVIEW_MERGE_VARS: Record<EmailLocale, Record<string, string>> = {
  'pt-BR': { firstName: 'Maria', name: 'Maria Silva', plan: 'Creator', email: 'maria@example.com' },
  en: { firstName: 'Emma', name: 'Emma Johnson', plan: 'Creator', email: 'emma@example.com' },
  es: { firstName: 'Lucía', name: 'Lucía García', plan: 'Creator', email: 'lucia@example.com' },
};

interface TemplateItem {
  key: string;
  sequence: string;
  trigger: string;
  sample: boolean;
  content: Record<EmailLocale, { subject: string; bodyMarkdown: string }>;
}

function TemplateRow({ item, locale }: { item: TemplateItem; locale: EmailLocale }) {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const content = item.content[locale];

  const preview = useQuery({
    queryKey: ['admin', 'emails', 'sequence-preview', item.key, locale],
    queryFn: () =>
      api.adminEmails.renderPreview(accessToken!, {
        bodyMarkdown: content.bodyMarkdown,
        subject: content.subject,
        mergeVars: PREVIEW_MERGE_VARS[locale],
      }),
    enabled: !!accessToken && open,
    staleTime: Infinity,
  });

  const test = useMutation({
    mutationFn: () =>
      api.adminEmails.sendTest(accessToken!, {
        subject: content.subject,
        bodyMarkdown: content.bodyMarkdown,
      }),
  });

  return (
    <div className="border-b border-[#f3f0ed]/4 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition-colors hover:bg-[#f3f0ed]/2"
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[#f3f0ed]/90">{content.subject}</p>
          <p className="mt-0.5 text-xs text-[#f3f0ed]/40">{item.trigger}</p>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-[#f3f0ed]/40" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-[#f3f0ed]/40" />
        )}
      </button>

      {open && (
        <div className="space-y-3 px-5 pb-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-[#f3f0ed]/40">
              Preview em {LOCALE_LABEL[locale]} com dados de exemplo (
              {PREVIEW_MERGE_VARS[locale].firstName}, plano {PREVIEW_MERGE_VARS[locale].plan}).
            </p>
            <button
              type="button"
              onClick={() => test.mutate()}
              disabled={test.isPending}
              className="app-btn inline-flex shrink-0 items-center gap-1.5 border border-[#f3f0ed]/10 px-3 py-1.5 text-xs font-medium text-[#f3f0ed]/80 transition-colors hover:border-[#e11d2a]/50 hover:text-[#f3f0ed] disabled:opacity-50"
            >
              {test.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              {test.isSuccess ? 'Enviado ✓' : 'Enviar teste pra mim'}
            </button>
          </div>
          {test.isError && (
            <p className="text-xs text-red-400">Falha ao enviar o teste. Tente de novo.</p>
          )}

          {preview.isLoading ? (
            <div className="flex items-center justify-center rounded-xl border border-[#f3f0ed]/6 bg-white/2 py-12">
              <Loader2 className="h-5 w-5 animate-spin text-[#e11d2a]" />
            </div>
          ) : preview.error ? (
            <p className="text-xs text-red-400">Erro ao renderizar o preview.</p>
          ) : preview.data ? (
            <iframe
              title={`Preview — ${content.subject}`}
              srcDoc={preview.data.html}
              sandbox=""
              className="h-[560px] w-full rounded-xl border border-[#f3f0ed]/6 bg-white"
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

export default function AdminEmailSequencesPage() {
  const { accessToken } = useAuth();
  const [locale, setLocale] = useState<EmailLocale>('pt-BR');

  const query = useQuery({
    queryKey: ['admin', 'emails', 'sequence-templates'],
    queryFn: () => api.adminEmails.sequenceTemplates(accessToken!),
    enabled: !!accessToken,
    staleTime: 60_000,
  });

  const items = query.data?.items ?? [];
  const sequences = Array.from(new Set(items.map((i) => i.sequence)));

  return (
    <div className="space-y-6">
      <div className="app-reveal">
        <Link
          href="/admin/emails"
          className="inline-flex items-center gap-1.5 text-xs text-[#f3f0ed]/50 transition-colors hover:text-[#f3f0ed]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Emails
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <Zap className="h-5 w-5 text-[#e11d2a]" />
          <h1 className="text-xl font-semibold text-[#f3f0ed]">Sequências automáticas</h1>
        </div>
        <p className="mt-1 text-sm text-[#f3f0ed]/50">
          Todos os emails que os crons disparam sozinhos. Clique num email pra ver como ele
          chega na caixa de entrada, ou envie um teste pro seu próprio email. Cada usuário
          recebe no idioma da conta dele (pt → português, es → espanhol, resto → inglês).
        </p>
      </div>

      <div className="flex items-center gap-1 rounded-xl border border-[#f3f0ed]/6 bg-[#0a0a0b] p-1 w-fit">
        {LOCALES.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              locale === l
                ? 'bg-[#e11d2a] text-[#111618]'
                : 'text-[#f3f0ed]/60 hover:text-[#f3f0ed]'
            }`}
          >
            {LOCALE_LABEL[l]}
          </button>
        ))}
      </div>

      {query.isLoading ? (
        <div className="flex items-center justify-center rounded-2xl border border-[#f3f0ed]/6 bg-[#0a0a0b] py-16">
          <Loader2 className="h-5 w-5 animate-spin text-[#e11d2a]" />
        </div>
      ) : query.error ? (
        <div className="rounded-2xl border border-[#f3f0ed]/6 bg-[#0a0a0b] px-6 py-12 text-center text-sm text-red-400">
          Erro ao carregar os templates.
        </div>
      ) : (
        sequences.map((seq) => {
          const section = SEQUENCE_SECTION[seq] ?? { title: seq, description: '' };
          return (
            <div key={seq} className="space-y-2">
              <div>
                <h2 className="text-sm font-semibold text-[#f3f0ed]">{section.title}</h2>
                {section.description && (
                  <p className="mt-0.5 text-xs text-[#f3f0ed]/40">{section.description}</p>
                )}
              </div>
              <div className="rounded-2xl border border-[#f3f0ed]/6 bg-[#0a0a0b]">
                {items
                  .filter((i) => i.sequence === seq)
                  .map((item) => (
                    <TemplateRow key={`${item.key}-${locale}`} item={item} locale={locale} />
                  ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
