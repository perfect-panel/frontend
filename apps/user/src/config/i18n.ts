// Pure constants only: this module is also imported by vite.config.ts (to
// generate locale preload hints), which cannot evaluate import.meta.env.
export const fallbackLng = "en-US";
export const supportedLngs = ["en-US", "zh-CN"];

// Shared translations needed by the application shell. Route-specific
// namespaces are loaded only for the initial route (and on demand after
// navigation), keeping startup request fan-out small.
export const sharedI18nNamespaces = ["components"];

export const routeI18nNamespaces: Record<string, string[]> = {
  "/": ["main"],
  "/affiliate": ["layout", "affiliate"],
  "/announcement": ["layout", "dashboard"],
  "/auth": ["auth"],
  "/bind": ["auth"],
  "/dashboard": ["layout", "dashboard"],
  "/document": ["layout", "document"],
  "/oauth": ["auth"],
  "/order": ["layout", "order"],
  "/payment": ["payment", "order"],
  "/profile": ["layout", "profile"],
  "/purchasing": ["subscribe"],
  "/purchasing/order": ["subscribe", "order"],
  "/subscribe": ["layout", "subscribe"],
  "/ticket": ["layout", "ticket"],
  "/wallet": ["layout", "wallet"],
};

export const exactRouteI18nNamespaces: Record<string, string[]> = {};

export function getInitialI18nNamespaces(pathname: string) {
  const routeNamespaces = Object.entries(routeI18nNamespaces).flatMap(
    ([route, namespaces]) => {
      const matches =
        route === "/"
          ? pathname === route
          : pathname === route || pathname.startsWith(`${route}/`);
      return matches ? namespaces : [];
    }
  );

  return [
    ...new Set([
      ...sharedI18nNamespaces,
      ...routeNamespaces,
      ...(exactRouteI18nNamespaces[pathname] ?? []),
    ]),
  ];
}
