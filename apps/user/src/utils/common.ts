import { removeCookie, setCookie } from "@workspace/ui/lib/cookies";
import { isBrowser } from "@workspace/ui/utils/index";

export function getPlatform(): string {
  if (typeof window === "undefined") return "unknown";

  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes("android")) return "android";

  // Detect iOS, including iPad/iPhone requesting desktop site
  // iOS devices have maxTouchPoints > 1, macOS typically has 0
  const isIOS =
    userAgent.includes("iphone") ||
    userAgent.includes("ipad") ||
    (userAgent.includes("mac") && navigator.maxTouchPoints > 1);
  if (isIOS) return "ios";

  if (userAgent.includes("win")) return "windows";
  if (userAgent.includes("mac")) return "macos";
  if (userAgent.includes("linux")) return "linux";

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

function normalizeRedirectUrl(value?: string | null): string | undefined {
  if (
    !value?.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/\\")
  ) {
    return;
  }
  return value;
}

function getLocationRedirectUrl(): string | undefined {
  const hashQueryIndex = window.location.hash.indexOf("?");
  const hashSearch =
    hashQueryIndex >= 0 ? window.location.hash.slice(hashQueryIndex + 1) : "";
  const hashRedirect = new URLSearchParams(hashSearch).get("redirect");
  const searchRedirect = new URLSearchParams(window.location.search).get(
    "redirect"
  );

  return normalizeRedirectUrl(hashRedirect ?? searchRedirect);
}

export function getRedirectUrl(options?: { consumeStored?: boolean }): string {
  if (typeof window === "undefined") return "/dashboard";

  const storedRedirect = normalizeRedirectUrl(
    window.sessionStorage.getItem("redirect-url")
  );
  if (options?.consumeStored !== false) {
    window.sessionStorage.removeItem("redirect-url");
  }

  return getLocationRedirectUrl() ?? storedRedirect ?? "/dashboard";
}

export function setRedirectUrl(value?: string) {
  const redirect = normalizeRedirectUrl(value);
  if (redirect) {
    window.sessionStorage.setItem("redirect-url", redirect);
  }
}

export function Logout() {
  if (!isBrowser()) return;
  removeCookie("Authorization");

  const pathname = location.pathname;
  const hash = location.hash.slice(1); // 移除 '#'
  const hashPathname = hash.split("?", 1)[0] || "";

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
    hashPathname &&
    !(
      ["", "/", "/auth", "/tos", "/privacy-policy"].includes(hashPathname) ||
      hashPathname.startsWith("/purchasing") ||
      hashPathname.startsWith("/oauth/")
    )
  ) {
    setRedirectUrl(hash);
    location.href = "/#/auth";
  }
}
