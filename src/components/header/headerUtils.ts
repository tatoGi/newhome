import type { MenuItem } from '@/lib/api/types';

export const flagEmoji = (countryCode?: string) => {
  const code = (countryCode || '').trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) {
    return null;
  }

  return String.fromCodePoint(...Array.from(code).map((char) => 127397 + char.charCodeAt(0)));
};

export const hasNestedChildren = (item: MenuItem) =>
  Array.isArray(item.children) && item.children.some((child) => Array.isArray(child.children) && child.children.length > 0);
