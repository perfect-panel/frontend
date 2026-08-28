import { afterEach, describe, expect, it, vi } from "vitest";
import { getRedirectUrl, setRedirectUrl } from "./common";

function createSessionStorage(initial?: Record<string, string>): Storage {
  const values = new Map(Object.entries(initial || {}));
  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  };
}

function stubWindow({
  hash = "#/auth",
  search = "",
  storedRedirect,
}: {
  hash?: string;
  search?: string;
  storedRedirect?: string;
} = {}) {
  const sessionStorage = createSessionStorage(
    storedRedirect ? { "redirect-url": storedRedirect } : undefined
  );
  vi.stubGlobal("window", {
    location: { hash, search },
    sessionStorage,
  });
  return sessionStorage;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("login redirect persistence", () => {
  it("restores and consumes a redirect saved before authentication", () => {
    const sessionStorage = stubWindow({ storedRedirect: "/wallet?tab=log" });

    expect(getRedirectUrl()).toBe("/wallet?tab=log");
    expect(sessionStorage.getItem("redirect-url")).toBeNull();
  });

  it("reads redirect parameters from the hash router", () => {
    stubWindow({
      hash: "#/auth?redirect=%2Forder%3Fstatus%3Dpending",
      storedRedirect: "/dashboard",
    });

    expect(getRedirectUrl()).toBe("/order?status=pending");
  });

  it("can preserve the stored redirect across an OAuth round trip", () => {
    const sessionStorage = stubWindow({ storedRedirect: "/profile" });

    expect(getRedirectUrl({ consumeStored: false })).toBe("/profile");
    expect(sessionStorage.getItem("redirect-url")).toBe("/profile");
  });

  it("rejects redirects outside the current site", () => {
    const sessionStorage = stubWindow({
      hash: "#/auth?redirect=%2F%2Fevil.example",
    });

    setRedirectUrl("https://evil.example");
    expect(getRedirectUrl()).toBe("/dashboard");
    expect(sessionStorage.getItem("redirect-url")).toBeNull();
  });
});
