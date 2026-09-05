// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SystemVersionCard from "./system-version-card";

const { request } = vi.hoisted(() => ({ request: vi.fn() }));

vi.mock("@workspace/ui/lib/request", () => ({ default: request }));
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (_key: string, fallback: string) => fallback }),
}));
vi.mock("@workspace/ui/composed/icon", () => ({ Icon: () => null }));

let client: QueryClient;

beforeEach(() => {
  request.mockReset();
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
});

afterEach(() => {
  cleanup();
  client.clear();
});

function renderCard() {
  render(
    <QueryClientProvider client={client}>
      <SystemVersionCard />
    </QueryClientProvider>
  );
}

describe("system version card", () => {
  it("loads the backend version without module credentials or gateway calls", async () => {
    request.mockResolvedValue({
      data: { code: 200, data: { version: "1.20.2" } },
    });
    renderCard();

    expect(await screen.findByText("V1.20.2")).toBeTruthy();
    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith(
      "/v1/admin/tool/version",
      expect.objectContaining({ method: "GET" })
    );
    expect(screen.getByRole("button", { name: "System Reboot" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /update/i })).toBeNull();
  });

  it("does not display an invented server version when the response has no version", async () => {
    request.mockResolvedValue({ data: { code: 200, data: {} } });
    renderCard();

    await waitFor(() => expect(request).toHaveBeenCalledTimes(1));
    expect(screen.getByText("—")).toBeTruthy();
    expect(screen.queryByText("V1.0.0")).toBeNull();
  });

  it("keeps restart available for retry after the backend rejects the request", async () => {
    request.mockResolvedValueOnce({
      data: { code: 200, data: { version: "1.20.2" } },
    });
    renderCard();
    await screen.findByText("V1.20.2");
    request.mockRejectedValueOnce(new Error("restart failed"));

    fireEvent.click(screen.getByRole("button", { name: "System Reboot" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm Reboot" }));

    await waitFor(() => {
      const confirm = screen.getByRole("button", {
        name: "Confirm Reboot",
      }) as HTMLButtonElement;
      expect(confirm.disabled).toBe(false);
    });
    expect(request).toHaveBeenLastCalledWith(
      "/v1/admin/tool/restart",
      expect.objectContaining({ method: "GET" })
    );
  });
});
