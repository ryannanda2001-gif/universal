'use client';

import { useEffect, useState } from 'react';

import { DEFAULT_SITE_CONTENT, type SiteContent } from '@/lib/site-content';

export const useSiteContent = () => {
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [isLoadingSiteContent, setIsLoadingSiteContent] = useState(true);
  const [siteContentError, setSiteContentError] = useState('');

  useEffect(() => {
    const loadSiteContent = async () => {
      try {
        const response = await fetch('/api/site-content', { cache: 'no-store' });
        if (!response.ok) {
          const errorData = (await response.json()) as { message?: string };
          throw new Error(errorData.message || 'Gagal memuat konten landing page');
        }

        const data = (await response.json()) as SiteContent;
        setSiteContent({ ...DEFAULT_SITE_CONTENT, ...data });
        setSiteContentError('');
      } catch (error) {
        console.error(error);
        setSiteContent(DEFAULT_SITE_CONTENT);
        setSiteContentError(error instanceof Error ? error.message : 'Gagal memuat konten landing page.');
      } finally {
        setIsLoadingSiteContent(false);
      }
    };

    loadSiteContent();
  }, []);

  return {
    siteContent,
    isLoadingSiteContent,
    siteContentError,
    setSiteContent,
  };
};
