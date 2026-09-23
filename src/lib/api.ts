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
 * Ensure an active token exists. In preview/demo environments where third-party
 * cookies may be partitioned or blocked in iframes, automatically acquires a demo
 * HR Manager token unless the user explicitly clicked Sign Out.
 *
 * @param forceRefresh If true, discards existing token and fetches a brand new token from the server.
 */
export async function ensureAuthToken(forceRefresh = false): Promise<string | null> {
  if (!forceRefresh) {
    const existing = getStoredToken();
    if (existing && isTokenValid(existing)) {
      return existing;
    }
  }

  // Clear stale token if forceRefresh requested
  if (forceRefresh) {
    setStoredToken(null);
  }

  if (isExplicitlyLoggedOut()) return null;

  // Deduplicate concurrent requests
  if (inflightAuthPromise) {
    return inflightAuthPromise;
  }

  inflightAuthPromise = (async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: 'hrmanager@acme.org',
          password: 'AcmeHR@2026!'
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          setStoredToken(data.token);
          setLoggedOutFlag(false);
          return data.token;
        }
      } else {
        // If login failed, clear stored token
        setStoredToken(null);
      }
    } catch (err) {
      console.warn('Auto-session restoration error:', err);
    } finally {
      inflightAuthPromise = null;
    }
    return null;
  })();

  return inflightAuthPromise;
}

/**
 * Unified fetch wrapper that attaches Authorization header and session credentials.
 * Automatically recovers from 401 errors by acquiring a fresh token and retrying.
 */
export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as Request).url;
  const isAuthEndpoint = urlStr.includes('/api/auth/login') || urlStr.includes('/api/auth/logout');

  let token = getStoredToken();
  if (!token && !isAuthEndpoint && !isExplicitlyLoggedOut()) {
    token = await ensureAuthToken();
  }

  const headers = new Headers(init.headers || {});
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(input, {
    ...init,
    headers,
    credentials: init.credentials || 'include'
  });

  // If response is 401 and not an explicit logout or login attempt, force refresh token and retry once
  if (response.status === 401 && !isAuthEndpoint && !isExplicitlyLoggedOut()) {
    const freshToken = await ensureAuthToken(true);
    if (freshToken) {
      const retryHeaders = new Headers(init.headers || {});
      retryHeaders.set('Authorization', `Bearer ${freshToken}`);
      return fetch(input, {
        ...init,
        headers: retryHeaders,
        credentials: init.credentials || 'include'
      });
    }
  }

  return response;
}
