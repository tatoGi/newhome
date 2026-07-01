declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-TG66FPTB0Z';

export const isGaEnabled = (): boolean =>
  GA_MEASUREMENT_ID !== '' &&
  typeof window !== 'undefined' &&
  typeof window.gtag === 'function';

export const pageview = (url: string): void => {
  if (!isGaEnabled()) return;
  window.gtag!('config', GA_MEASUREMENT_ID, { page_path: url });
};
