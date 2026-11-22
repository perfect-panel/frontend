// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import EmailSettingsForm from "./email-settings-form";

const { save } = vi.hoisted(() => ({ save: vi.fn() }));
vi.mock("@workspace/ui/services/admin/admin", () => ({
  getAuthMethodConfig: async () => ({
    data: {
      data: {
        id: 1,
        method: "email",
        enabled: true,
        config: {
          platform: "smtp",
          platform_config: {
            host: "smtp.example.com",
            pass: "old-password",
            ssl: true,
            from: "sender@example.com",
            reply_to: "reply@example.com",
          },
          verify_email_subject: "Verification",
          enable_verify: true,
          enable_domain_suffix: false,
        },
      },
    },
  }),
  getAuthMethodEmailPlatform: async () => ({
    data: {
      data: {
        list: ["smtp", "resend", "cloudflare"].map((platform) => ({
          platform,
        })),
      },
    },
  }),
  putAuthMethodConfig: save,
  postAuthMethodTestEmailSend: vi.fn(),
}));
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (_key: string, fallback: string) => fallback }),
}));
vi.mock("@workspace/ui/composed/editor/html", () => ({
  HTMLEditor: () => null,
}));
vi.mock("@workspace/ui/composed/icon", () => ({ Icon: () => null }));
vi.mock("@workspace/ui/components/scroll-area", () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
  );
  HTMLElement.prototype.scrollIntoView ??= vi.fn();
});

afterEach(() => {
  vi.unstubAllGlobals();
  cleanup();
  vi.clearAllMocks();
});

it.each([
  {
    name: "Resend",
    id: "resend",
    credentials: { "Resend API Key": "new-key" },
    settings: { api_key: "new-key" },
  },
  {
    name: "Cloudflare Email Service",
    id: "cloudflare",
    credentials: {
      "Cloudflare Account ID": "abc123",
      "Cloudflare API Token": "new-token",
    },
    settings: { account_id: "abc123", api_token: "new-token" },
  },
])("saves $name without the previous provider's credentials", async ({
  name,
  id,
  credentials,
  settings,
}) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <EmailSettingsForm />
    </QueryClientProvider>
  );
  fireEvent.click(screen.getByText("Email Settings"));
  fireEvent.mouseDown(
    await screen.findByRole("tab", { name: "Email delivery" }),
    { button: 0 }
  );
  await screen.findByDisplayValue("smtp.example.com");
  fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" });
  fireEvent.click(await screen.findByRole("option", { name }));
  for (const [label, value] of Object.entries(credentials)) {
    fireEvent.change(await screen.findByLabelText(label), {
      target: { value },
    });
  }
  fireEvent.change(screen.getByPlaceholderText("test@example.com"), {
    target: { value: "test@example.com" },
  });
  expect(
    (
      screen.getByRole("button", {
        name: "Send Test Email",
      }) as HTMLButtonElement
    ).disabled
  ).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  await waitFor(() => expect(save).toHaveBeenCalledOnce());
  const config = save.mock.calls[0]?.[0]?.config;
  expect(config?.verify_email_subject).toBe("Verification");
  expect(config?.platform).toBe(id);
  expect(config?.platform_config).toEqual({
    from: "sender@example.com",
    reply_to: "reply@example.com",
    ...settings,
  });
  client.clear();
});
