// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ServerNodeConfig from "./server-node-config";

const mocks = vi.hoisted(() => ({
  refetch: vi.fn(),
  updateConfig: vi.fn(),
  useQuery: vi.fn(),
}));

const config: API.GetServerNodeConfigResponse = {
  effective: {
    block: ["ads.example.com"],
    dns: [],
    ip_strategy: "prefer_ipv6",
    outbound: [],
  },
  global: {
    block: ["ads.example.com"],
    dns: [],
    ip_strategy: "prefer_ipv6",
    outbound: [],
  },
  override: {
    block: [],
    dns: [],
    inherit_block: true,
    inherit_dns: true,
    inherit_ip_strategy: true,
    inherit_outbound: true,
    ip_strategy: "prefer_ipv4",
    outbound: [],
  },
};

vi.mock("@tanstack/react-query", () => ({
  useQuery: mocks.useQuery,
}));

vi.mock("@workspace/ui/services/admin/admin", () => ({
  getServerNodeConfig: vi.fn(),
  postServerNodeConfigUpdate: mocks.updateConfig,
}));

vi.mock("@workspace/ui/components/scroll-area", () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@workspace/ui/composed/dynamic-Inputs", () => ({
  ArrayInput: () => <div>DNS editor</div>,
}));

vi.mock("./outbound-config-input", () => ({
  OutboundConfigInput: () => <div>Outbound editor</div>,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (
      _key: string,
      fallback: string,
      values?: Record<string, string | number>
    ) =>
      Object.entries(values || {}).reduce(
        (text, [key, value]) => text.replaceAll(`{{${key}}}`, String(value)),
        fallback
      ),
  }),
}));

const server = {
  address: "203.0.113.10",
  id: 7,
  name: "Singapore 01",
  protocols: [],
} as unknown as API.Server;

beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      disconnect = vi.fn();
      observe = vi.fn();
      unobserve = vi.fn();
    }
  );
  mocks.refetch.mockResolvedValue({ data: config });
  mocks.updateConfig.mockResolvedValue({ data: { data: true } });
  mocks.useQuery.mockReturnValue({
    data: config,
    isError: false,
    isLoading: false,
    refetch: mocks.refetch,
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

describe("server node configuration", () => {
  it("shows inherited values and only enables save after an override changes", async () => {
    render(<ServerNodeConfig server={server} />);

    fireEvent.click(screen.getByRole("button", { name: "Node Config" }));

    expect(
      screen.getByRole("heading", { name: "Node configuration overrides" })
    ).toBeTruthy();
    expect(screen.getAllByText("Using global configuration").length).toBe(2);
    expect(screen.getByText("Current global value: Prefer IPv6")).toBeTruthy();

    const save = screen.getByRole("button", { name: "Save" });
    expect((save as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(
      screen.getByRole("switch", { name: "Use global IP strategy" })
    );
    expect((save as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(save);

    await waitFor(() => {
      expect(mocks.updateConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          inherit_ip_strategy: false,
          ip_strategy: "prefer_ipv6",
          server_id: 7,
        })
      );
    });
  });

  it("blocks editing and offers a retry when loading fails", () => {
    mocks.useQuery.mockReturnValue({
      data: undefined,
      isError: true,
      isLoading: false,
      refetch: mocks.refetch,
    });

    render(<ServerNodeConfig server={server} />);
    fireEvent.click(screen.getByRole("button", { name: "Node Config" }));

    expect(screen.getByText("Unable to load configuration")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Retry" })).toBeTruthy();
    expect(
      (screen.getByRole("button", { name: "Save" }) as HTMLButtonElement)
        .disabled
    ).toBe(true);
  });
});
