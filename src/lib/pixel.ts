type FbqArgs = unknown[];

declare global {
  interface Window {
    fbq?: ((...args: FbqArgs) => void) & {
      callMethod?: (...args: FbqArgs) => void;
      queue?: FbqArgs[];
      loaded?: boolean;
      version?: string;
      push?: (...args: FbqArgs) => void;
    };
    _fbq?: Window['fbq'];
  }
}

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '';

export const isPixelEnabled = (): boolean =>
  FB_PIXEL_ID !== '' && typeof window !== 'undefined' && typeof window.fbq === 'function';

export const pageview = (): void => {
  if (!isPixelEnabled()) return;
  window.fbq!('track', 'PageView');
};

export const trackEvent = (
  event: 'Lead' | 'Contact' | 'ViewContent' | 'AddToCart' | 'Purchase' | 'Search' | 'CompleteRegistration',
  params?: Record<string, unknown>,
): void => {
  if (!isPixelEnabled()) return;
  if (params) {
    window.fbq!('track', event, params);
  } else {
    window.fbq!('track', event);
  }
};

export const trackCustom = (name: string, params?: Record<string, unknown>): void => {
  if (!isPixelEnabled()) return;
  if (params) {
    window.fbq!('trackCustom', name, params);
  } else {
    window.fbq!('trackCustom', name);
  }
};
