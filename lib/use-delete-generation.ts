'use client';

import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { api, type GalleryItem, type PaginatedResponse } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

type GalleryInfinite = InfiniteData<PaginatedResponse<GalleryItem>>;

/** caches afetados: criações (['image-creations', filter, favOnly]) e galeria (['gallery', ...]) */
const isGalleryCache = (queryKey: readonly unknown[]) =>
  queryKey[0] === 'image-creations' || queryKey[0] === 'gallery';

/** Remove o item de um cache de lista infinita, ajustando o total. */
function dropItem(data: GalleryInfinite | undefined, id: string): GalleryInfinite | undefined {
  if (!data?.pages) return data;
  const has = data.pages.some((page) => page.data.some((it) => it.id === id));
  if (!has) return data;
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      data: page.data.filter((it) => it.id !== id),
      meta: { ...page.meta, total: Math.max(0, page.meta.total - 1) },
    })),
  };
}

/**
 * Exclui uma geração (soft delete na API) com update otimista no cache —
 * o item some na hora das criações e da galeria; em erro, restaura tudo.
 */
export function useDeleteGeneration() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const t = useTranslations('home.gallery');

  return useMutation({
    mutationFn: (item: Pick<GalleryItem, 'id'>) => api.gallery.remove(accessToken!, item.id),
    onMutate: async (item) => {
      const queries = queryClient
        .getQueryCache()
        .findAll()
        .filter((q) => isGalleryCache(q.queryKey));
      const snapshot = queries.map((q) => [q.queryKey, q.state.data] as const);
      await queryClient.cancelQueries({ predicate: (q) => isGalleryCache(q.queryKey) });
      for (const q of queries) {
        queryClient.setQueryData<GalleryInfinite>(q.queryKey, (data) => dropItem(data, item.id));
      }
      return { snapshot };
    },
    onError: (_err, _item, ctx) => {
      ctx?.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data));
      toast.error(t('deleteError'));
    },
    onSuccess: () => {
      toast.success(t('deleted'));
    },
  });
}
