import { useRouter } from "@tanstack/react-router";
import { useCallback } from "react";

export function useTableSearchParams(filterKeys: readonly string[]) {
  const router = useRouter();
  const filterKeysSnapshot = filterKeys.join("|");

  return useCallback(
    (filters: Record<string, unknown>) => {
      const keys = filterKeysSnapshot.split("|").filter(Boolean);
      const location = router.history.location;
      const search = new URLSearchParams(location.search);

      for (const key of keys) {
        const value = filters[key];
        if (value === null || value === undefined || value === "") {
          search.delete(key);
        } else {
          search.set(key, String(value));
        }
      }

      const query = search.toString();
      const nextHref = `${location.pathname}${query ? `?${query}` : ""}${location.hash}`;
      if (nextHref !== location.href) {
        router.history.replace(nextHref, location.state);
      }
    },
    [filterKeysSnapshot, router]
  );
}
