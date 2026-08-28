// @vitest-environment jsdom

import { cleanup, render, waitFor } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Certification from "./certification";

const mocks = vi.hoisted(() => ({
  bindOAuthCallback: vi.fn(),
  getUserInfo: vi.fn(),
  navigate: vi.fn(),
  search: { code: "oauth-code", state: "oauth-state" },
}));

vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({ navigate: mocks.navigate }),
  useSearch: () => mocks.search,
}));

vi.mock("@workspace/ui/services/user/user", () => ({
  postV1PublicUserBindOauthCallback: mocks.bindOAuthCallback,
}));

vi.mock("@/stores/global", () => ({
  useGlobalStore: (selector: (state: unknown) => unknown) =>
    selector({ getUserInfo: mocks.getUserInfo }),
}));

beforeEach(() => {
  mocks.bindOAuthCallback.mockResolvedValue(undefined);
  mocks.getUserInfo.mockResolvedValue(undefined);
  mocks.navigate.mockResolvedValue(undefined);
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("OAuth binding callback certification", () => {
  it("binds once, refreshes the user, and returns to the profile", async () => {
    render(
      <StrictMode>
        <Certification platform="apple">
          <div>Binding</div>
        </Certification>
      </StrictMode>
    );

    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith({ to: "/profile" });
    });

    expect(mocks.bindOAuthCallback).toHaveBeenCalledTimes(1);
    expect(mocks.bindOAuthCallback).toHaveBeenCalledWith({
      method: "apple",
      callback: mocks.search,
    });
    expect(mocks.getUserInfo).toHaveBeenCalledTimes(1);
  });

  it("keeps the existing session when binding fails", async () => {
    mocks.bindOAuthCallback.mockRejectedValueOnce(new Error("already bound"));

    render(
      <Certification platform="google">
        <div>Binding</div>
      </Certification>
    );

    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith({ to: "/profile" });
    });
    expect(mocks.getUserInfo).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalledWith({ to: "/auth" });
  });
});
