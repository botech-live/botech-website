import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// The Google tag is injected statically in index.html (one tag per page).
// This hook only sends a GA4 `config` (page_view) on client-side route
// changes so SPA navigations are tracked without adding a second tag.
const GA4_MEASUREMENT_ID = 'G-E5FC17M9RR';

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== 'function') return;

    window.gtag('config', GA4_MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
      page_title: document.title,
      anonymize_ip: true,
    });
  }, [location.pathname, location.search]);
}