/**
 * ACME Centralized API Client with Bearer Token & Cookie Support.
 * Ensures consistent authentication across browser iframes, local storage fallback,
 * and auto-session restoration for seamless preview & production use.
 */

const TOKEN_KEY = 'acme_auth_token';
const LOGGED_OUT_KEY = 'acme_explicit_logout';

/**
 * Validates whether a JWT token string has not expired.
 * Checks exp claim in token payload against current system time.
 */
export function isTokenValid(token: string | null): boolean {
  if (!token || typeof token !== 'string') return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    // Decode base64 payload
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonStr = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonStr);
    if (!payload.exp) return true;
    const nowSec = Math.floor(Date.now() / 1000);
    // Token is valid if expiration is at least 30 seconds in the future
    return payload.exp > nowSec + 30;
  } catch {
    return false;
  }
}

export function getStoredToken(): string | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    if (!isTokenValid(token)) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.removeItem(LOGGED_OUT_KEY);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Ignore localStorage errors in restricted environments
  }
}

export function setLoggedOutFlag(isLoggedOut: boolean): void {
  try {
    if (isLoggedOut) {
      localStorage.setItem(LOGGED_OUT_KEY, 'true');
      localStorage.removeItem(TOKEN_KEY);
    } else {
      localStorage.removeItem(LOGGED_OUT_KEY);
    }
  } catch {
    // Ignore
  }
}

export function isExplicitlyLoggedOut(): boolean {
  try {
    return localStorage.getItem(LOGGED_OUT_KEY) === 'true';
  } catch {
    return false;
  }
}

// In-flight promise to deduplicate concurrent login requests across components
let inflightAuthPromise: Promise<string | null> | null = null;

/**
 * Returns an active token if stored and valid.
 * Does NOT auto-synthesize logins behind the scenes so the app starts cleanly with the sign-in page.
 */
export async function ensureAuthToken(_forceRefresh = false): Promise<string | null> {
  const token = getStoredToken();
  if (token && isTokenValid(token)) {
    return token;
  }
  return null;
}

/**
 * Unified fetch wrapper that attaches Authorization header and session credentials.
 */
export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const token = getStoredToken();

  const headers = new Headers(init.headers || {});
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(input, {
    ...init,
    headers,
    credentials: init.credentials || 'include'
  });

  // If unauthorized, clear stored token
  if (response.status === 401) {
    setStoredToken(null);
  }

  return response;
}
