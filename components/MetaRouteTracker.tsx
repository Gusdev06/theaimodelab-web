'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { captureAttribution, flushPendingMetaLead, trackPageView, trackViewContent } from '@/lib/tracking';

function viewContentData(pathname: string): Record<string, unknown> | null {
  if (pathname === '/') {
    return {
      content_name: 'landing_page',
      content_category: 'public_site',
    };
  }

  if (pathname === '/creditos' || pathname === '/pricing') {
    return {
      content_name: 'pricing',
      content_category: 'monetization',
    };
  }

  if (pathname === '/prompts' || pathname.startsWith('/p/')) {
    return {
      content_name: 'prompt_library',
      content_category: 'content',
    };
  }

  return null;
}

export function MetaRouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;

    captureAttribution();
    flushPendingMetaLead();
    trackPageView();

    const contentData = viewContentData(pathname);
    if (contentData) {
      trackViewContent({
        ...contentData,
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
}
