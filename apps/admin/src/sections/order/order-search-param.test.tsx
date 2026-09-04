// @vitest-environment jsdom

import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const searchParams = vi.hoisted(() => ({
  current: {} as Record<string, unknown>,
}));
const captured = vi.hoisted(() => ({ initialFilters: undefined as unknown }));

vi.mock("@tanstack/react-router", () => ({
  useSearch: () => searchParams.current,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_key: string, fallback: string | { defaultValue?: string }) =>
      typeof fallback === "string" ? fallback : fallback?.defaultValue || "",
  }),
}));

vi.mock("@workspace/ui/composed/pro-table/pro-table", () => ({
  ProTable: ({
    initialFilters,
  }: {
    initialFilters?: Record<string, unknown>;
  }) => {
    captured.initialFilters = initialFilters;
    return <div />;
  },
}));

vi.mock("@workspace/ui/services/admin/admin", () => ({
  getOrderList: vi.fn(),
  putOrderStatus: vi.fn(),
}));

vi.mock("@/stores/subscribe", () => ({
  useSubscribe: () => ({ subscribes: [], getSubscribeName: () => "" }),
}));

import Order from "./index";

afterEach(() => {
  cleanup();
  captured.initialFilters = undefined;
  searchParams.current = {};
});

describe("order list search params", () => {
  it("seeds the search filter from the URL so order links filter the list", () => {
    searchParams.current = { search: "202601010000000000000000001" };

    render(<Order />);

    expect(captured.initialFilters).toMatchObject({
      search: "202601010000000000000000001",
    });
  });

  it("keeps seeding user_id as a number", () => {
    searchParams.current = { user_id: "42" };

    render(<Order />);

    expect(captured.initialFilters).toMatchObject({ user_id: 42 });
  });
});
