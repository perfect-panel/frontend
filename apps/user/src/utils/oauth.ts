const OAUTH_CF_TOKEN_KEY = "oauth-cf-token";
const OAUTH_INVITE_KEY = "oauth-invite";

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

export function storeOAuthInvite(invite?: string): void {
  if (typeof window === "undefined") return;

  if (invite) {
    window.sessionStorage.setItem(OAUTH_INVITE_KEY, invite);
    return;
  }
  window.sessionStorage.removeItem(OAUTH_INVITE_KEY);
}

export function takeOAuthInvite(): string | undefined {
  if (typeof window === "undefined") return;

  const invite = window.sessionStorage.getItem(OAUTH_INVITE_KEY) || undefined;
  window.sessionStorage.removeItem(OAUTH_INVITE_KEY);
  return invite;
}
