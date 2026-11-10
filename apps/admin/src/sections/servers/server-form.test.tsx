// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ServerForm from "./server-form";

vi.mock("@/stores/node", () => ({
  useNode: () => ({ isProtocolUsedInNodes: () => false }),
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
vi.mock("@workspace/ui/components/scroll-area", () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      disconnect = vi.fn();
      observe = vi.fn();
      unobserve = vi.fn();
    }
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("server editor protocol preservation", () => {
  it("keeps NW3 and an uneditable protocol when submitting a server edit", async () => {
    const submit = vi.fn().mockResolvedValue(true);
    const opaque = {
      type: "future-protocol",
      enable: true,
      port: 8443,
      settings: { custom: "preserved" },
    };
    render(
      <ServerForm
        initialValues={
          {
            id: 7,
            name: "Node",
            address: "node.example",
            protocols: [
              {
                type: "nowhere",
                enable: true,
                port: 443,
                version: 3,
                security: "tls",
                alpn: ["nw3"],
                network: "mix",
                obfs: "none",
                sni: "nw.example",
                cert_mode: "self",
              },
              opaque,
            ],
          } as unknown as API.Server
        }
        onSubmit={submit}
        title="Edit server"
        trigger="Edit server"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Edit server" }));
    await screen.findByText(/will be preserved when saving: future-protocol/);
    fireEvent.click(screen.getByRole("button", { name: /nowhere/i }));
    expect(await screen.findByText(/NW3 · TLS 1.3/)).toBeTruthy();
    expect(screen.queryByText("Allow Insecure")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    await waitFor(() => expect(submit).toHaveBeenCalledOnce());
    const payload = submit.mock.calls[0]?.[0];
    expect(payload.protocols).toEqual([
      expect.objectContaining({
        type: "nowhere",
        version: 3,
        security: "tls",
        alpn: ["nw3"],
        network: "mix",
        obfs: "none",
      }),
      opaque,
    ]);
  });
  it("creates an NW3 server with valid defaults after the required fields are filled", async () => {
    const submit = vi.fn().mockResolvedValue(true);
    render(
      <ServerForm onSubmit={submit} title="Add server" trigger="Add server" />
    );
    fireEvent.click(screen.getByRole("button", { name: "Add server" }));
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "NW3 node" },
    });
    fireEvent.change(screen.getByLabelText("Address"), {
      target: { value: "nw.example" },
    });
    fireEvent.click(screen.getByRole("switch", { name: "Enable nowhere" }));
    await screen.findByText(/NW3 · TLS 1.3/);
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    await screen.findByText("Nowhere requires a TLS server name.");
    expect(submit).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText(/^Port/), {
      target: { value: "443" },
    });
    fireEvent.change(screen.getByLabelText(/^SNI/), {
      target: { value: "nw.example" },
    });
    expect(
      screen.getByRole("combobox", { name: /^Network/ }).textContent
    ).toContain("TLS + QUIC");
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    await waitFor(() => expect(submit).toHaveBeenCalledOnce());
    expect(submit.mock.calls[0]?.[0].protocols).toEqual([
      expect.objectContaining({
        type: "nowhere",
        version: 3,
        security: "tls",
        alpn: ["nw3"],
        network: "mix",
        obfs: "morph",
        sni: "nw.example",
        port: 443,
      }),
    ]);
  });
});
