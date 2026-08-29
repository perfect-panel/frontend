// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import BalanceLogPage from "./balance";
import CommissionLogPage from "./commission";
import EmailLogPage from "./email";
import GiftLogPage from "./gift";
import LoginLogPage from "./login";
import MobileLogPage from "./mobile";
import RegisterLogPage from "./register";
import ResetSubscribeLogPage from "./reset-subscribe";
import SubscribeLogPage from "./subscribe";

vi.mock("@tanstack/react-router", () => ({
  useSearch: () => ({}),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_key: string, fallback: string | { defaultValue?: string }) =>
      typeof fallback === "string" ? fallback : fallback?.defaultValue || "",
  }),
}));

vi.mock("@/utils/use-table-search-params", () => ({
  useTableSearchParams: () => vi.fn(),
}));

vi.mock("@workspace/ui/composed/pro-table/pro-table", () => ({
  ProTable: ({
    columns,
  }: {
    columns: Array<{ header?: ReactNode; id?: string }>;
  }) => (
    <div>
      {columns.map((column, index) => (
        <span key={column.id || index}>{column.header}</span>
      ))}
    </div>
  ),
}));

afterEach(cleanup);

describe("log request source columns", () => {
  it.each([
    ["login", LoginLogPage],
    ["registration", RegisterLogPage],
    ["subscription", SubscribeLogPage],
    ["subscription reset", ResetSubscribeLogPage],
    ["email", EmailLogPage],
    ["SMS", MobileLogPage],
    ["balance", BalanceLogPage],
    ["commission", CommissionLogPage],
    ["gift", GiftLogPage],
  ])("shows the request source entry on the %s log", (_name, Page) => {
    render(<Page />);

    expect(screen.getByText("Request source")).toBeTruthy();
  });
});
