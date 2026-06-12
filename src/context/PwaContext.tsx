'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Platform = 'android' | 'ios' | 'desktop' | 'other';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: ReadonlyArray<string>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

interface PwaContextValue {
  canInstall: boolean;
  isInstalled: boolean;
  platform: Platform;
  isIos: boolean;
  showIosInstructions: boolean;
  showAlreadyInstalled: boolean;
  promptInstall: () => Promise<void>;
  openIosInstructions: () => void;
  closeIosInstructions: () => void;
  closeAlreadyInstalled: () => void;
}

const PwaContext = createContext<PwaContextValue | null>(null);

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  // iPadOS 13+ identifies as Mac with touch
  if (/macintosh/.test(ua) && 'ontouchend' in document) return 'ios';
  if (/android/.test(ua)) return 'android';
  if (/windows|mac|linux|cros/.test(ua)) return 'desktop';
  return 'other';
}

function detectInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  const standalone = window.matchMedia?.('(display-mode: standalone)').matches;
  const iosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return Boolean(standalone || iosStandalone);
}

export const PwaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<Platform>('other');
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const [showAlreadyInstalled, setShowAlreadyInstalled] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
    setIsInstalled(detectInstalled());

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    const displayModeQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);
    displayModeQuery.addEventListener?.('change', handleDisplayChange);

    if ('serviceWorker' in navigator) {
      if (process.env.NODE_ENV === 'production') {
        const registerSw = () => {
          navigator.serviceWorker
            .register('/sw.js', { scope: '/' })
            .catch((err) => console.warn('SW registration failed:', err));
        };
        if (document.readyState === 'complete') registerSw();
        else window.addEventListener('load', registerSw, { once: true });
      } else {
        // dev: ნებისმიერი ადრე დარეგისტრირებული SW და მისი ქეში სტატიკურ
        // chunk-ებს აჭედებს (cacheFirst) და ძველ bundle-ს ემსახურება — ვშლით,
        // რომ HMR-მა და ახალმა კოდმა იმუშაოს.
        navigator.serviceWorker
          .getRegistrations()
          .then((regs) => regs.forEach((reg) => reg.unregister()))
          .catch(() => {});
        if (typeof caches !== 'undefined') {
          caches.keys().then((keys) => keys.forEach((key) => caches.delete(key))).catch(() => {});
        }
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      displayModeQuery.removeEventListener?.('change', handleDisplayChange);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (isInstalled) {
      setShowAlreadyInstalled(true);
      return;
    }
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      return;
    }
    if (platform === 'ios') {
      setShowIosInstructions(true);
      return;
    }
    setShowAlreadyInstalled(true);
  }, [deferredPrompt, isInstalled, platform]);

  const value = useMemo<PwaContextValue>(
    () => ({
      canInstall: !isInstalled && (Boolean(deferredPrompt) || platform === 'ios'),
      isInstalled,
      platform,
      isIos: platform === 'ios',
      showIosInstructions,
      showAlreadyInstalled,
      promptInstall,
      openIosInstructions: () => setShowIosInstructions(true),
      closeIosInstructions: () => setShowIosInstructions(false),
      closeAlreadyInstalled: () => setShowAlreadyInstalled(false),
    }),
    [deferredPrompt, isInstalled, platform, showIosInstructions, showAlreadyInstalled, promptInstall]
  );

  return <PwaContext.Provider value={value}>{children}</PwaContext.Provider>;
};

export function usePwa(): PwaContextValue {
  const ctx = useContext(PwaContext);
  if (!ctx) {
    return {
      canInstall: false,
      isInstalled: false,
      platform: 'other',
      isIos: false,
      showIosInstructions: false,
      showAlreadyInstalled: false,
      promptInstall: async () => {},
      openIosInstructions: () => {},
      closeIosInstructions: () => {},
      closeAlreadyInstalled: () => {},
    };
  }
  return ctx;
}
