'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import {
  FreeGenerationsModal,
  FREE_GEN_LABELS,
  type FreeGenItem,
} from '@/components/FreeGenerationsModal';

/**
 * Abre o modal de "gerações grátis" logo após o login, sempre que o usuário
 * ainda tiver gerações grátis restantes. Mostra uma vez por sessão do navegador
 * (sessionStorage), então um novo login volta a exibir.
 */
export function FreeGenerationsTrigger() {
  const { user, accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<FreeGenItem[]>([]);
  const [total, setTotal] = useState(0);
  const triggered = useRef(false);

  const { data: balance } = useQuery({
    queryKey: ['credits', 'balance'],
    queryFn: () => api.credits.balance(accessToken!),
    enabled: !!accessToken && !!user,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (triggered.current || !balance || !user) return;
    if (typeof window === 'undefined') return;

    const fg = balance.freeGenerations;
    const list: FreeGenItem[] = FREE_GEN_LABELS.map(([key, label]) => ({
      label,
      count: fg?.[key] ?? 0,
    })).filter((i) => i.count > 0);

    if (list.length === 0) return;

    const sessionKey = `theaimodelab-free-gens-shown-${user.id}`;
    if (sessionStorage.getItem(sessionKey) === '1') return;

    triggered.current = true;
    sessionStorage.setItem(sessionKey, '1');
    setItems(list);
    setTotal(list.reduce((sum, i) => sum + i.count, 0));
    setOpen(true);
  }, [balance, user]);

  const handleClose = () => setOpen(false);

  return (
    <FreeGenerationsModal
      open={open}
      onClose={handleClose}
      items={items}
      total={total}
    />
  );
}
