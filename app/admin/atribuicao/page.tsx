'use client';

import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import type { AttributionBucket, AttributionStats } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Crosshair, RefreshCw, UserPlus, BadgeCheck, Megaphone, Clapperboard } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const PERIODS = [7, 30, 90] as const;

/* UTMs do Meta chegam como "nome|id" (template do gerenciador). Mostra o nome
   e mantém o id como sufixo discreto. */
function splitMetaValue(value: string): { name: string; id: string | null } {
  const idx = value.lastIndexOf('|');
  if (idx <= 0) return { name: value, id: null };
  return { name: value.slice(0, idx), id: value.slice(idx + 1) };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function conversionRate(bucket: AttributionBucket) {
  if (bucket.signups === 0) return '—';
  return `${((bucket.paid / bucket.signups) * 100).toFixed(1)}%`;
}

function UtmLabel({ value, fallback }: { value: string | null; fallback?: string }) {
  if (!value) {
    return <span className="text-[#f3f0ed]/30">{fallback ?? 'orgânico/direto'}</span>;
  }
  const { name, id } = splitMetaValue(value);
  return (
    <span className="text-[#f3f0ed]/85">
      {name}
      {id && <span className="ml-1.5 font-mono text-[10px] text-[#f3f0ed]/30">{id}</span>}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#f3f0ed]/6 bg-[#0a0a0b] p-4">
      <div className="flex items-center gap-2 text-[#f3f0ed]/40">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-[#f3f0ed]">{value}</p>
      {detail && <p className="mt-0.5 text-[11px] text-[#f3f0ed]/35">{detail}</p>}
    </div>
  );
}

function BucketTable({
  title,
  icon: Icon,
  buckets,
  keyLabel,
  emptyFallback,
}: {
  title: string;
  icon: React.ElementType;
  buckets: AttributionBucket[];
  keyLabel: string;
  emptyFallback: string;
}) {
  return (
    <section className="rounded-2xl border border-[#f3f0ed]/6 bg-[#0a0a0b] p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#e11d2a]" />
        <h2 className="text-sm font-semibold text-[#f3f0ed]">{title}</h2>
      </div>
      {buckets.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[#f3f0ed]/8 p-4 text-center text-xs text-[#f3f0ed]/30">
          Nenhum cadastro no período.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-[#f3f0ed]/6 hover:bg-transparent">
              <TableHead className="text-[#f3f0ed]/40">{keyLabel}</TableHead>
              <TableHead className="text-right text-[#f3f0ed]/40">Cadastros</TableHead>
              <TableHead className="text-right text-[#f3f0ed]/40">Assinantes</TableHead>
              <TableHead className="text-right text-[#f3f0ed]/40">Conversão</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buckets.map((bucket) => (
              <TableRow key={bucket.key || '(vazio)'} className="border-[#f3f0ed]/6 hover:bg-[#f3f0ed]/[0.02]">
                <TableCell className="max-w-[320px] truncate text-[13px]">
                  <UtmLabel value={bucket.key || null} fallback={emptyFallback} />
                </TableCell>
                <TableCell className="text-right text-[13px] font-semibold text-[#f3f0ed]">
                  {bucket.signups}
                </TableCell>
                <TableCell className="text-right text-[13px]">
                  <span className={bucket.paid > 0 ? 'font-semibold text-emerald-400' : 'text-[#f3f0ed]/30'}>
                    {bucket.paid}
                  </span>
                </TableCell>
                <TableCell className="text-right text-[13px] text-[#f3f0ed]/60">
                  {conversionRate(bucket)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}

export default function AtribuicaoPage() {
  const { accessToken } = useAuth();
  const [days, setDays] = useState<number>(30);

  const { data, isLoading, isFetching, refetch } = useQuery<AttributionStats>({
    queryKey: ['admin-attribution', days],
    queryFn: () => api.admin.attributionStats(accessToken!, days),
    enabled: !!accessToken,
  });

  const organic = data ? data.totalSignups - data.withAttribution : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e11d2a]/15">
            <Crosshair className="h-5 w-5 text-[#e11d2a]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#f3f0ed]">Atribuição de Cadastros</h1>
            <p className="mt-0.5 text-sm text-[#f3f0ed]/40">
              De qual campanha e criativo os usuários cadastrados estão vindo (UTMs capturados no cadastro).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setDays(p)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                days === p
                  ? 'bg-[#e11d2a] text-[#0a0d0e]'
                  : 'bg-[#f3f0ed]/5 text-[#f3f0ed]/50 hover:bg-[#f3f0ed]/10 hover:text-[#f3f0ed]/80'
              }`}
            >
              {p} dias
            </button>
          ))}
          <button
            type="button"
            onClick={() => refetch()}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f3f0ed]/5 text-[#f3f0ed]/50 transition-colors hover:bg-[#f3f0ed]/10 hover:text-[#f3f0ed]"
            aria-label="Atualizar"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {isLoading || !data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl border border-[#f3f0ed]/6 bg-[#0a0a0b]" />
          ))}
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={UserPlus}
              label="Cadastros"
              value={String(data.totalSignups)}
              detail={`últimos ${data.days} dias`}
            />
            <StatCard
              icon={Crosshair}
              label="Com atribuição"
              value={String(data.withAttribution)}
              detail={
                data.totalSignups > 0
                  ? `${((data.withAttribution / data.totalSignups) * 100).toFixed(0)}% rastreados · ${organic} orgânico/direto`
                  : 'sem cadastros'
              }
            />
            <StatCard
              icon={BadgeCheck}
              label="Viraram assinantes"
              value={String(data.paidTotal)}
              detail={
                data.totalSignups > 0
                  ? `${((data.paidTotal / data.totalSignups) * 100).toFixed(1)}% dos cadastros do período`
                  : undefined
              }
            />
            <StatCard
              icon={Megaphone}
              label="Campanhas ativas"
              value={String(data.byCampaign.filter((b) => b.key).length)}
              detail={`${data.byContent.filter((b) => b.key).length} criativos distintos`}
            />
          </div>

          {/* Campanhas + Criativos */}
          <div className="grid gap-6 xl:grid-cols-2">
            <BucketTable
              title="Por Campanha (utm_campaign)"
              icon={Megaphone}
              buckets={data.byCampaign}
              keyLabel="Campanha"
              emptyFallback="orgânico/direto"
            />
            <BucketTable
              title="Por Criativo (utm_content)"
              icon={Clapperboard}
              buckets={data.byContent}
              keyLabel="Criativo (anúncio)"
              emptyFallback="sem criativo"
            />
          </div>

          {/* Origem / Conjunto */}
          <div className="grid gap-6 xl:grid-cols-2">
            <BucketTable
              title="Por Origem (utm_source)"
              icon={Crosshair}
              buckets={data.bySource}
              keyLabel="Origem"
              emptyFallback="orgânico/direto"
            />
            <BucketTable
              title="Por Conjunto (utm_medium)"
              icon={Crosshair}
              buckets={data.byMedium}
              keyLabel="Conjunto (adset)"
              emptyFallback="sem conjunto"
            />
          </div>

          {/* Últimos cadastros */}
          <section className="rounded-2xl border border-[#f3f0ed]/6 bg-[#0a0a0b] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-[#e11d2a]" />
                <h2 className="text-sm font-semibold text-[#f3f0ed]">Últimos cadastros</h2>
              </div>
              <span className="text-[11px] text-[#f3f0ed]/40">{data.recent.length} mais recentes</span>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#f3f0ed]/6 hover:bg-transparent">
                    <TableHead className="text-[#f3f0ed]/40">Usuário</TableHead>
                    <TableHead className="text-[#f3f0ed]/40">Origem</TableHead>
                    <TableHead className="text-[#f3f0ed]/40">Campanha</TableHead>
                    <TableHead className="text-[#f3f0ed]/40">Criativo</TableHead>
                    <TableHead className="text-[#f3f0ed]/40">Quando</TableHead>
                    <TableHead className="text-right text-[#f3f0ed]/40">Assinante</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recent.map((user) => (
                    <TableRow key={user.id} className="border-[#f3f0ed]/6 hover:bg-[#f3f0ed]/[0.02]">
                      <TableCell className="max-w-[220px]">
                        <p className="truncate text-[13px] text-[#f3f0ed]/85">{user.name || '—'}</p>
                        <p className="truncate text-[11px] text-[#f3f0ed]/35">{user.email}</p>
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate text-[12px]">
                        <UtmLabel value={user.utmSource} />
                      </TableCell>
                      <TableCell className="max-w-[220px] truncate text-[12px]">
                        <UtmLabel value={user.utmCampaign} fallback="—" />
                      </TableCell>
                      <TableCell className="max-w-[220px] truncate text-[12px]">
                        <UtmLabel value={user.utmContent} fallback="—" />
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-[12px] text-[#f3f0ed]/50">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        {user.paid ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                            <BadgeCheck className="h-3 w-3" />
                            Sim
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#f3f0ed]/25">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
