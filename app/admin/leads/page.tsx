'use client';

import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import type { AdminMarketingLead } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Mail, RefreshCw, Search, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const PAGE_SIZE = 20;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function resultLabel(value: string | null) {
  const labels: Record<string, string> = {
    identity: 'Identity',
    volume: 'Content engine',
    margin: 'Margin',
    agency: 'Agency',
  };
  return value ? labels[value] ?? value : 'No result';
}

function campaignLine(lead: AdminMarketingLead) {
  return [lead.utmSource, lead.utmMedium, lead.utmCampaign, lead.utmContent]
    .filter(Boolean)
    .join(' / ') || 'No UTM';
}

function answerLine(lead: AdminMarketingLead) {
  if (!lead.quizAnswers) return 'No answers';
  return Object.entries(lead.quizAnswers)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(' · ');
}

export default function AdminLeadsPage() {
  const { accessToken } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['admin', 'marketing-leads', page, PAGE_SIZE, debouncedSearch, source],
    queryFn: () =>
      api.admin.marketingLeads(
        accessToken!,
        page,
        PAGE_SIZE,
        debouncedSearch || undefined,
        source || undefined,
      ),
    enabled: !!accessToken,
  });

  const leads = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = data?.meta.totalPages ?? 1;
  const sources = useMemo(() => data?.stats.sources ?? [], [data]);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#f3f0ed] md:text-2xl">Marketing leads</h1>
          <p className="mt-0.5 text-sm text-[#f3f0ed]/40">
            {total.toLocaleString('pt-BR')} captured leads from sales funnels
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="app-press app-ease flex h-9 w-9 items-center justify-center rounded-xl border border-[#f3f0ed]/8 text-[#f3f0ed]/40 transition-colors hover:bg-[#f3f0ed]/5 hover:text-[#f3f0ed]/70 disabled:opacity-40"
          aria-label="Refresh leads"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_220px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#f3f0ed]/30" />
          <Input
            placeholder="Search name or email..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className="h-10 w-full border-[#f3f0ed]/8 bg-[#f3f0ed]/3 pl-9 text-sm text-[#f3f0ed] placeholder:text-[#f3f0ed]/25 focus-visible:border-[#e11d2a]/30 focus-visible:ring-[#e11d2a]/10"
          />
        </div>

        <select
          value={source}
          onChange={(event) => {
            setSource(event.target.value);
            setPage(1);
          }}
          className="h-10 rounded-lg border border-[#f3f0ed]/8 bg-[#0a0a0b] px-3 text-sm text-[#f3f0ed]/80 outline-none transition-colors focus:border-[#e11d2a]/40"
        >
          <option value="">All sources</option>
          {sources.map((item) => (
            <option key={item.source} value={item.source}>
              {item.source} ({item.count})
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <RefreshCw className="h-5 w-5 animate-spin text-[#e11d2a]" />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 md:hidden">
            {leads.length === 0 ? (
              <p className="py-10 text-center text-sm text-[#f3f0ed]/30">No leads found.</p>
            ) : (
              leads.map((lead) => (
                <a
                  key={lead.id}
                  href={`mailto:${lead.email}`}
                  className="rounded-xl border border-[#f3f0ed]/8 bg-[#f3f0ed]/3 p-3 active:bg-[#f3f0ed]/6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#f3f0ed]">
                        {lead.name || lead.email}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[#f3f0ed]/40">{lead.email}</p>
                    </div>
                    <Badge variant="outline" className="border-[#e11d2a]/30 bg-[#e11d2a]/10 text-[#e11d2a]">
                      {resultLabel(lead.quizResult)}
                    </Badge>
                  </div>
                  <p className="mt-3 line-clamp-2 text-xs text-[#f3f0ed]/50">{answerLine(lead)}</p>
                  <p className="mt-2 truncate text-[11px] text-[#f3f0ed]/30">{campaignLine(lead)}</p>
                </a>
              ))
            )}
          </div>

          <div className="hidden rounded-2xl border border-[#f3f0ed]/6 bg-[#f3f0ed]/2 md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-[#f3f0ed]/6 hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#f3f0ed]/30">Lead</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#f3f0ed]/30">Quiz result</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#f3f0ed]/30">Campaign</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#f3f0ed]/30">Answers</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#f3f0ed]/30">Captured</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id} className="border-[#f3f0ed]/4 hover:bg-[#f3f0ed]/3">
                    <TableCell>
                      <a href={`mailto:${lead.email}`} className="flex min-w-0 items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e11d2a]/10 text-[#e11d2a]">
                          <Mail className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-[#f3f0ed]">
                            {lead.name || 'Unnamed lead'}
                          </span>
                          <span className="block truncate text-xs text-[#f3f0ed]/40">{lead.email}</span>
                        </span>
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-[#e11d2a]/30 bg-[#e11d2a]/10 text-[#e11d2a]">
                        {resultLabel(lead.quizResult)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="block max-w-[220px] truncate text-xs text-[#f3f0ed]/50">
                        {campaignLine(lead)}
                      </span>
                      <span className="mt-1 block text-[11px] text-[#f3f0ed]/25">{lead.source}</span>
                    </TableCell>
                    <TableCell>
                      <span className="line-clamp-2 max-w-[260px] text-xs text-[#f3f0ed]/50">
                        {answerLine(lead)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs tabular-nums text-[#f3f0ed]/40">
                        {formatDate(lead.createdAt)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {leads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-sm text-[#f3f0ed]/30">
                      No leads found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#f3f0ed]/30">
          <Target className="h-3.5 w-3.5" />
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#f3f0ed]/8 text-[#f3f0ed]/50 transition-colors hover:bg-[#f3f0ed]/5 disabled:opacity-30"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((current) => current + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#f3f0ed]/8 text-[#f3f0ed]/50 transition-colors hover:bg-[#f3f0ed]/5 disabled:opacity-30"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
