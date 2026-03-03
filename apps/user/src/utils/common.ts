import { removeCookie, setCookie } from "@workspace/ui/lib/cookies";
import { isBrowser } from "@workspace/ui/utils/index";

export function getPlatform(): string {
  if (typeof window === "undefined") return "unknown";

  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes("win")) return "windows";
  if (userAgent.includes("mac")) return "macos";
  if (userAgent.includes("linux")) return "linux";
  if (userAgent.includes("android")) return "android";
  if (userAgent.includes("iphone") || userAgent.includes("ipad")) return "ios";

  return "unknown";
}

export function differenceInDays(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date1.getTime() - date2.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function formatDate(timestamp: number): string {
  if (!timestamp) return "";
  return new Date(timestamp * 1000).toLocaleDateString();
}

export function setAuthorization(token: string): void {
  setCookie("Authorization", token);
}

export function getRedirectUrl(): string {
  if (typeof window === "undefined") return "/dashboard";

  // With hash-based routing, query params may live after the `#`.
  // Examples:
  //   /#/auth/?redirect=%2Fdashboard
  //   /#/auth?redirect=%2Fdashboard
  const hash = window.location.hash || "";
  const queryIndex = hash.indexOf("?");
  const hashQuery = queryIndex >= 0 ? hash.slice(queryIndex + 1) : "";

  const params = new URLSearchParams(hashQuery || window.location.search);
  const redirect = params.get("redirect");

  if (redirect?.startsWith("/")) return redirect;

  // Fallback: session storage redirect set by Logout()
  const stored = sessionStorage.getItem("redirect-url") || "";
  if (stored.startsWith("/")) {
    sessionStorage.removeItem("redirect-url");
    return stored;
  }

  return "/dashboard";
}

export function setRedirectUrl(value?: string) {
  if (value) {
    sessionStorage.setItem("redirect-url", value);
  }
}

export function Logout() {
  if (!isBrowser()) return;
  removeCookie("Authorization");

  const pathname = location.pathname;
  const hash = location.hash.slice(1); // 移除 '#'

  if (
    !(
      ["", "/", "/auth", "/tos", "/privacy-policy"].includes(pathname) ||
      pathname.startsWith("/purchasing") ||
      pathname.startsWith("/oauth/")
    )
  ) {
    setRedirectUrl(pathname);
    location.href = "/#/auth";
    return;
  }

  if (
    hash &&
    !(
      ["", "/", "/auth", "/tos", "/privacy-policy"].includes(hash) ||
      hash.startsWith("/purchasing") ||
      hash.startsWith("/oauth/")
    )
  ) {
    setRedirectUrl(hash);
    location.href = "/#/auth";
  }
}
