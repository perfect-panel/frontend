import { afterEach, describe, expect, it, vi } from "vitest";
import { storeOAuthCfToken, takeOAuthCfToken } from "./oauth";

function createSessionStorage(): Storage {
  const values = new Map<string, string>();
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

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("OAuth Turnstile token persistence", () => {
  it("survives the provider round trip and is consumed once", () => {
    const sessionStorage = createSessionStorage();
    vi.stubGlobal("window", { sessionStorage });

    storeOAuthCfToken("turnstile-token");

    expect(takeOAuthCfToken()).toBe("turnstile-token");
    expect(takeOAuthCfToken()).toBeUndefined();
  });
});
