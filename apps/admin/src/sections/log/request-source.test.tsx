// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { formatRequestLocation, RequestSource } from "./request-source";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_key: string, fallback: string) => fallback,
  }),
}));

vi.mock("@/sections/user/user-detail", () => ({
  UserDetail: ({ id }: { id: number }) => <span>Actor #{id}</span>,
}));

afterEach(cleanup);

describe("request source", () => {
  it("summarizes risk metadata and exposes the complete request details", () => {
    render(
      <RequestSource
        metadata={{
          actor_id: 42,
          client_ip: "203.0.113.10",
          ip_as_organization: "Example Network Pte. Ltd.",
          ip_asn: 64_500,
          ip_city: "Singapore",
          ip_country: "Singapore",
          ip_country_code: "sg",
          ip_region: "Central Singapore",
          user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        }}
      />
    );

    expect(screen.getByText("203.0.113.10")).toBeTruthy();
    expect(screen.getByText("Singapore · Central Singapore")).toBeTruthy();
    expect(screen.getByText("SG")).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", { name: "View request source details" })
    );

    expect(
      screen.getByRole("heading", { name: "Request source details" })
    ).toBeTruthy();
    expect(screen.getByText("AS64500")).toBeTruthy();
    expect(screen.getByText("Example Network Pte. Ltd.")).toBeTruthy();
    expect(screen.getByText("Actor #42")).toBeTruthy();
    expect(screen.getAllByText("User-Agent").length).toBe(1);
    expect(
      screen.getAllByText("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)")
        .length
    ).toBe(2);
    expect(
      screen.getByRole("link", { name: /203\.0\.113\.10/ }).getAttribute("href")
    ).toBe("https://ipinfo.io/203.0.113.10");
  });

  it("renders old log records without risk metadata safely", () => {
    render(<RequestSource metadata={{}} />);

    expect(screen.getByText("--")).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("deduplicates repeated location names", () => {
    expect(
      formatRequestLocation({
        ip_city: "Singapore",
        ip_country: "singapore",
        ip_region: "Central Singapore",
      })
    ).toBe("Singapore · Central Singapore");
  });
});
