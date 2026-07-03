'use client';

import { useTranslations } from 'next-intl';
import { Plus, Search } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useShell } from '@/components/app/shell-context';
import { useTypewriter } from '@/components/app/use-typewriter';
import { CreateMenu } from '@/components/app/CreateMenu';
import { QuickActions } from '@/components/home/QuickActions';
import { ContinueSection } from '@/components/home/ContinueSection';
import { HomePanels } from '@/components/home/HomePanels';
import { NewsSection } from '@/components/home/NewsSection';

export default function InicioPage() {
  const t = useTranslations('home');
  const { user } = useAuth();
  const { openPalette } = useShell();
  const searchTyped = useTypewriter(t('hero.searchPlaceholder'));

  const firstName = user?.name?.trim().split(/\s+/)[0] ?? '';

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 pb-16 pt-8 lg:px-11">
      {/* saudação + Criar */}
      <div className="mb-7 flex items-end justify-between gap-4">
        <h1 className="app-reveal text-[28px] font-bold leading-tight tracking-[-0.4px] text-app-text md:text-[38px]">
          {firstName ? t('hero.greetingNamed', { name: firstName }) : t('hero.greeting')}
        </h1>
        <CreateMenu align="end">
          <button
            type="button"
            className="app-btn flex h-10 shrink-0 items-center gap-2 bg-app-lime px-4 text-[14.5px] font-semibold text-app-lime-ink"
          >
            <Plus className="size-[17px]" strokeWidth={2.2} />
            {t('shell.create')}
          </button>
        </CreateMenu>
      </div>

      {/* busca global */}
      <button
        type="button"
        onClick={openPalette}
        className="app-press mb-7 flex w-full items-center gap-3 rounded-[14px] border border-app-hairline bg-app-surface px-4 py-3.5 text-left transition-colors duration-200 ease-app hover:border-[rgba(225,29,42,0.4)]"
      >
        <Search className="size-[18px] text-app-muted" strokeWidth={1.8} />
        <span className="flex-1 truncate text-[14.5px] text-app-muted">{searchTyped}</span>
        <kbd className="rounded-md border border-app-hairline-2 px-2 py-1 font-mono text-[11px] text-app-muted">
          Ctrl K
        </kbd>
      </button>

      <div className="flex flex-col gap-10">
        <QuickActions />
        <ContinueSection />
        <HomePanels />
        <NewsSection />
      </div>
    </div>
  );
}
