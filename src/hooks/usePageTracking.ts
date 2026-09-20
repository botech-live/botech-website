import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA4_MEASUREMENT_ID: string | undefined = import.meta.env.VITE_GA4_MEASUREMENT_ID;

function loadGtag(id: string) {
  const marker = `gtag-${id}`;
  if (document.querySelector(`script[data-gtag="${marker}"]`)) return;

  const inline = document.createElement('script');
  inline.setAttribute('data-gtag', marker);
  inline.innerHTML =
    "window.dataLayer = window.dataLayer || [];" +
    "window.gtag = function(){dataLayer.push(arguments);};";
  document.head.appendChild(inline);

  const loader = document.createElement('script');
  loader.async = true;
  loader.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  loader.setAttribute('data-gtag', marker);
  document.head.appendChild(loader);
}

/**
 * GA4 page-view tracking, gated behind the `VITE_GA4_MEASUREMENT_ID` env var.
 * Does nothing (no external requests) unless the env var is set at build time.
 */
export function usePageTracking() {
  const location = useLocation();
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!GA4_MEASUREMENT_ID) return;

    if (!loadedRef.current) {
      loadedRef.current = true;
      loadGtag(GA4_MEASUREMENT_ID);
    }

    window.gtag?.('config', GA4_MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
      page_title: document.title,
      anonymize_ip: true,
    });
  }, [location.pathname, location.search]);
}