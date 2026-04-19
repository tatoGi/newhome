const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/web';

// Prefer an explicit NEXT_PUBLIC_BACKEND_URL; fall back to stripping /api/web from the API URL.
export const BACKEND_BASE_URL =
  (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '') ||
  API_BASE_URL.replace(/\/api\/web\/?$/, '');

export function toBackendAssetUrl(value: unknown): string {
  const path = String(value ?? '').trim();

  if (!path) {
    return '';
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (path.startsWith('/storage/')) {
    return `${BACKEND_BASE_URL}${path}`;
  }

  if (path.startsWith('/')) {
    return `${BACKEND_BASE_URL}${path}`;
  }

  return `${BACKEND_BASE_URL}/storage/${path.replace(/^storage\//, '')}`;
}

export function resolveImageOrFallback(value: unknown, fallback: string): string {
  const resolved = toBackendAssetUrl(value);
  return resolved || fallback || '/logo.png';
}

export function isBackendAssetUrl(value: unknown): boolean {
  const url = String(value ?? '').trim();
  if (!url) {
    return false;
  }

  if (url.startsWith(BACKEND_BASE_URL)) {
    return true;
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    const backendUrl = new URL(BACKEND_BASE_URL);
    return parsedUrl.host === backendUrl.host;
  } catch {
    return false;
  }
}
