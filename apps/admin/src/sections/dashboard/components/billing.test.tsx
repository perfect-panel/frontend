// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Billing from "./billing";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_key: string, fallback: string) => fallback,
  }),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("dashboard billing", () => {
  it("loads sponsors on first render when queries have a global stale time", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue([{ sha: "asset-version" }]),
        ok: true,
      })
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          dashboard: [
            {
              description: "Sponsor description",
              expiryDate: "2099-12-31",
              href: "https://example.com",
              logo: "https://example.com/logo.png",
              title: "Test Sponsor",
            },
          ],
          payment: [],
        }),
        ok: true,
      });
    vi.stubGlobal("fetch", fetchMock);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 30_000,
        },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Billing type="dashboard" />
      </QueryClientProvider>
    );

    expect((await screen.findAllByText("Test Sponsor")).length).toBeGreaterThan(
      0
    );
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });
});
