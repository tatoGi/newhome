'use client';

import React, { createContext, useContext } from 'react';

const MediaAltsContext = createContext<Record<string, string>>({});

export function MediaAltsProvider({
  alts,
  children,
}: {
  alts: Record<string, string>;
  children: React.ReactNode;
}) {
  return <MediaAltsContext.Provider value={alts}>{children}</MediaAltsContext.Provider>;
}

/**
 * Returns the media-manager alt text for a given image src.
 * src may be either a raw storage path ("media/images/foo.jpg")
 * or a full URL ("http://…/storage/media/images/foo.jpg").
 * Falls back to `fallback` when no alt is recorded.
 */
export function useMediaAlt(src: string | null | undefined, fallback = ''): string {
  const alts = useContext(MediaAltsContext);
  if (!src) return fallback;

  // Direct lookup (raw path stored in block data)
  if (alts[src]) return alts[src];

  // Extract path after /storage/ for full-URL lookups
  const match = src.match(/\/storage\/(.+)/);
  if (match?.[1] && alts[match[1]]) return alts[match[1]];

  return fallback;
}
