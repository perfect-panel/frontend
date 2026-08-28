// @vitest-environment jsdom

import { cleanup, render, waitFor } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Certification from "./certification";

const mocks = vi.hoisted(() => ({
  exchangeToken: vi.fn(),
  getRedirectUrl: vi.fn(),
  getUserInfo: vi.fn(),
  navigate: vi.fn(),
  search: { code: "oauth-code", state: "oauth-state" },
  setAuthorization: vi.fn(),
  takeOAuthCfToken: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({ navigate: mocks.navigate }),
  useSearch: () => mocks.search,
}));

vi.mock("@workspace/ui/services/common/common", () => ({
  postAuthOauthLoginToken: mocks.exchangeToken,
}));

vi.mock("@/stores/global", () => ({
  useGlobalStore: (selector: (state: unknown) => unknown) =>
    selector({ getUserInfo: mocks.getUserInfo }),
}));

vi.mock("@/utils/common", () => ({
  getRedirectUrl: mocks.getRedirectUrl,
  setAuthorization: mocks.setAuthorization,
}));

vi.mock("@/utils/oauth", () => ({
  takeOAuthCfToken: mocks.takeOAuthCfToken,
}));

beforeEach(() => {
  mocks.exchangeToken.mockResolvedValue({ data: { data: { token: "jwt" } } });
  mocks.getRedirectUrl.mockReturnValue("/wallet");
  mocks.getUserInfo.mockResolvedValue(undefined);
  mocks.navigate.mockResolvedValue(undefined);
  mocks.takeOAuthCfToken.mockReturnValue("turnstile-token");
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("OAuth callback certification", () => {
  it("exchanges once, restores the user, and then navigates", async () => {
    render(
      <StrictMode>
        <Certification platform="google">
          <div>Authenticating</div>
        </Certification>
      </StrictMode>
    );

    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith({ to: "/wallet" });
    });

    expect(mocks.exchangeToken).toHaveBeenCalledTimes(1);
    expect(mocks.exchangeToken).toHaveBeenCalledWith({
      method: "google",
      callback: mocks.search,
      cf_token: "turnstile-token",
    });
    expect(mocks.setAuthorization).toHaveBeenCalledWith("jwt");
    expect(mocks.getUserInfo).toHaveBeenCalledTimes(1);
    expect(mocks.getUserInfo.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.navigate.mock.invocationCallOrder[0] ?? 0
    );
  });

  it("returns to authentication when token exchange fails", async () => {
    mocks.exchangeToken.mockRejectedValueOnce(new Error("invalid state"));

    render(
      <Certification platform="github">
        <div>Authenticating</div>
      </Certification>
    );

    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith({ to: "/auth" });
    });
    expect(mocks.getUserInfo).not.toHaveBeenCalled();
  });
});
