export const AUTH_TOKEN_KEY = "qchat_access_token";
export const AUTH_PHONE_KEY = "qchat_phone";
export const DUMMY_PHONE_NUMBER = "+919999999999";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function saveSession(token: string, phone: string): void {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.localStorage.setItem(AUTH_PHONE_KEY, phone);
}

export function clearSession(): void {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_PHONE_KEY);
}

export function getStoredPhone(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(AUTH_PHONE_KEY);
}
