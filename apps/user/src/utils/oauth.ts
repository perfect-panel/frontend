const OAUTH_CF_TOKEN_KEY = "oauth-cf-token";

export function storeOAuthCfToken(token?: string): void {
  if (typeof window === "undefined") return;

  if (token) {
    window.sessionStorage.setItem(OAUTH_CF_TOKEN_KEY, token);
    return;
  }
  window.sessionStorage.removeItem(OAUTH_CF_TOKEN_KEY);
}

export function takeOAuthCfToken(): string | undefined {
  if (typeof window === "undefined") return;

  const token = window.sessionStorage.getItem(OAUTH_CF_TOKEN_KEY) || undefined;
  window.sessionStorage.removeItem(OAUTH_CF_TOKEN_KEY);
  return token;
}
