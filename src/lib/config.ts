/** Strip trailing slashes so URL concatenation and OAuth matching stay consistent. */
function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
);

export const FRONTEND_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_FRONTEND_BASE_URL ??
    (typeof window !== 'undefined' ? window.location.origin : ''),
);

/** Must match a Discord Developer Portal redirect URI and backend allowlist. */
export const DISCORD_REDIRECT_URL = normalizeBaseUrl(
  import.meta.env.VITE_DISCORD_OAUTH_REDIRECT ??
    `${FRONTEND_BASE_URL}/auth/callback`,
);

export const TOKEN_STORAGE_KEY = 'cyron_token';

