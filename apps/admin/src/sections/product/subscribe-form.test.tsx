// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SubscribeForm from "./subscribe-form";

const mocks = vi.hoisted(() => ({
  toastError: vi.fn(),
}));

const nodes = [
  {
    address: "10.0.0.3",
    id: 3,
    name: "Node Three",
    port: 443,
    protocol: "vless",
  },
  {
    address: "10.0.0.4",
    id: 4,
    name: "Node Four",
    port: 443,
    protocol: "vless",
  },
  {
    address: "10.0.0.5",
    id: 5,
    name: "Node Five",
    port: 443,
    protocol: "vless",
  },
  {
    address: "10.0.0.6",
    id: 6,
    name: "Tagged Node",
    port: 443,
    protocol: "vless",
    tags: ["hk"],
  },
];

vi.mock("@/stores/global", () => ({
  useGlobalStore: () => ({ common: { currency: { currency_unit: "USD" } } }),
}));

vi.mock("@/stores/node", () => ({
  useNode: () => ({
    getAllAvailableTags: () => ["hk", "us"],
    getNodesByTag: (tag: string) =>
      nodes.filter((node) => (node.tags || []).includes(tag)),
    getNodesWithoutTags: () => nodes.filter((node) => !node.tags),
  }),
}));

vi.mock("sonner", () => ({ toast: { error: mocks.toastError } }));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@workspace/ui/components/scroll-area", () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@workspace/ui/composed/editor/index", () => ({
  JSONEditor: () => <div>JSON editor</div>,
}));

// The shape the backend (v1.21.3) actually returns for an existing plan:
// node ids as numeric strings and an empty node group as [""].
function apiSubscription(overrides: Record<string, any> = {}) {
  return {
    id: 1,
    name: "Starter",
    unit_price: 1000,
    unit_time: "Month",
    nodes: ["3", "4"],
    node_tags: [""],
    ...overrides,
  };
}

function openNodesTab() {
  fireEvent.click(screen.getByRole("button", { name: "Edit" }));
  fireEvent.mouseDown(screen.getByRole("tab", { name: "form.nodes" }), {
    button: 0,
    ctrlKey: false,
  });
}

function nodeCheckbox(name: string) {
  const row = screen.getByText(name).closest(".gap-2") as HTMLElement;
  return within(row).getByRole("checkbox");
}

function tagCheckbox(tag: string) {
  const row = screen.getByText(tag, { selector: "label" }).parentElement;
  return within(row as HTMLElement).getByRole("checkbox");
}

async function submit(onSubmit: ReturnType<typeof vi.fn>) {
  fireEvent.click(screen.getByRole("button", { name: "form.confirm" }));
  await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  return onSubmit.mock.calls[0]?.[0] as Record<string, any>;
}

function renderForm(
  initialValues: Record<string, any>,
  onSubmit = vi.fn().mockResolvedValue(false)
) {
  const view = render(
    <SubscribeForm
      initialValues={initialValues}
      onSubmit={onSubmit}
      title="Edit subscription"
      trigger="Edit"
    />
  );
  return {
    ...view,
    onSubmit,
    rerenderWith: (values: Record<string, any>) =>
      view.rerender(
        <SubscribeForm
          initialValues={values}
          onSubmit={onSubmit}
          title="Edit subscription"
          trigger="Edit"
        />
      ),
  };
}

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
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

describe("subscribe form node normalization", () => {
  it("checks the nodes of an existing subscription whose ids are strings", () => {
    renderForm(apiSubscription());
    openNodesTab();

    expect(nodeCheckbox("Node Three").getAttribute("aria-checked")).toBe(
      "true"
    );
    expect(nodeCheckbox("Node Four").getAttribute("aria-checked")).toBe("true");
    expect(nodeCheckbox("Node Five").getAttribute("aria-checked")).toBe(
      "false"
    );
  });

  it("re-applies string node ids when the form is reopened or initialValues change", () => {
    const initial = apiSubscription();
    const { rerenderWith } = renderForm(initial);
    openNodesTab();
    expect(nodeCheckbox("Node Three").getAttribute("aria-checked")).toBe(
      "true"
    );

    // User edits the selection, then closes and reopens: back to saved state.
    fireEvent.click(nodeCheckbox("Node Three"));
    expect(nodeCheckbox("Node Three").getAttribute("aria-checked")).toBe(
      "false"
    );
    fireEvent.click(screen.getByRole("button", { name: "form.cancel" }));
    openNodesTab();
    expect(nodeCheckbox("Node Three").getAttribute("aria-checked")).toBe(
      "true"
    );
    expect(nodeCheckbox("Node Four").getAttribute("aria-checked")).toBe("true");

    // The parent refetches the subscription: the reset effect re-normalizes.
    rerenderWith(apiSubscription({ nodes: ["5"] }));
    expect(nodeCheckbox("Node Three").getAttribute("aria-checked")).toBe(
      "false"
    );
    expect(nodeCheckbox("Node Four").getAttribute("aria-checked")).toBe(
      "false"
    );
    expect(nodeCheckbox("Node Five").getAttribute("aria-checked")).toBe("true");
  });

  it("submits numeric node ids and no empty node tags for an untouched plan", async () => {
    const { onSubmit } = renderForm(apiSubscription());
    openNodesTab();

    const payload = await submit(onSubmit);

    expect(payload.nodes).toEqual([3, 4]);
    expect(payload.node_tags).toEqual([]);
    expect(mocks.toastError).not.toHaveBeenCalled();
  });

  it("keeps real tags while dropping empty and blank ones", async () => {
    const { onSubmit } = renderForm(
      apiSubscription({ nodes: [], node_tags: ["", "hk", " "] })
    );
    openNodesTab();

    expect(tagCheckbox("hk").getAttribute("aria-checked")).toBe("true");
    expect(tagCheckbox("us").getAttribute("aria-checked")).toBe("false");

    const payload = await submit(onSubmit);

    expect(payload.node_tags).toEqual(["hk"]);
    expect(payload.nodes).toEqual([]);
  });

  it('turns an empty node group [""] into no tags', async () => {
    const { onSubmit } = renderForm(
      apiSubscription({ nodes: [], node_tags: [""] })
    );
    openNodesTab();

    expect(tagCheckbox("hk").getAttribute("aria-checked")).toBe("false");
    const payload = await submit(onSubmit);

    expect(payload.node_tags).toEqual([]);
  });

  it("removes a node that arrived as a string when it is deselected", async () => {
    const { onSubmit } = renderForm(apiSubscription());
    openNodesTab();

    fireEvent.click(nodeCheckbox("Node Three"));
    expect(nodeCheckbox("Node Three").getAttribute("aria-checked")).toBe(
      "false"
    );
    expect(nodeCheckbox("Node Four").getAttribute("aria-checked")).toBe("true");

    const payload = await submit(onSubmit);

    expect(payload.nodes).toEqual([4]);
  });

  it("selects an additional node as a number and survives re-selecting a deselected one", async () => {
    const { onSubmit } = renderForm(apiSubscription());
    openNodesTab();

    fireEvent.click(nodeCheckbox("Node Five"));
    fireEvent.click(nodeCheckbox("Node Three"));
    fireEvent.click(nodeCheckbox("Node Three"));

    expect(nodeCheckbox("Node Three").getAttribute("aria-checked")).toBe(
      "true"
    );
    const payload = await submit(onSubmit);

    expect([...payload.nodes].sort()).toEqual([3, 4, 5]);
    expect(payload.nodes.every((id: unknown) => typeof id === "number")).toBe(
      true
    );
    expect(payload.node_tags).toEqual([]);
  });
});
