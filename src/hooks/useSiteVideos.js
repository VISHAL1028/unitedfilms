import { useState, useEffect } from 'react';
import { clips as defaultClips } from '@/lib/site-media';
import { getVideoConfig } from '@/lib/db';

/**
 * Hook to provide site video configuration.
 * Merges Firestore dynamic videos with default archive clips fallback.
 */
export function useSiteVideos() {
  const [siteClips, setSiteClips] = useState(defaultClips);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadVideos() {
      try {
        const config = await getVideoConfig();
        if (config && isMounted) {
          setSiteClips({
            hero: {
              src: config.hero?.src || defaultClips.hero.src,
              poster: config.hero?.poster || defaultClips.hero.poster,
              label: config.hero?.label !== undefined ? config.hero.label : defaultClips.hero.label,
              portrait: !!config.hero?.portrait,
            },
            showcase: (config.showcase && config.showcase.length > 0)
              ? config.showcase.map((item, idx) => ({
                  src: item.src || (defaultClips.showcase[idx]?.src || ''),
                  poster: item.poster || (defaultClips.showcase[idx]?.poster || ''),
                  label: item.label !== undefined ? item.label : (defaultClips.showcase[idx]?.label || ''),
                  portrait: !!item.portrait,
                }))
              : defaultClips.showcase,
            relighting: {
              src: config.relighting?.src || defaultClips.relighting.src,
              poster: config.relighting?.poster || defaultClips.relighting.poster,
              label: config.relighting?.label !== undefined ? config.relighting.label : defaultClips.relighting.label,
              portrait: !!config.relighting?.portrait,
            },
            restoration: {
              src: config.restoration?.src || defaultClips.restoration.src,
              poster: config.restoration?.poster || defaultClips.restoration.poster,
              label: config.restoration?.label !== undefined ? config.restoration.label : defaultClips.restoration.label,
              portrait: !!config.restoration?.portrait,
            },
          });
        }
      } catch (err) {
        console.warn('Failed to load dynamic site videos, using defaults:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  return { clips: siteClips, loading };
}
