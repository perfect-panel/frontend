import { describe, expect, it } from "vitest";
import { protocols } from "./constants";
import { getProtocolDefaultConfig } from "./defaults";
import { formSchema } from "./schemas";
import { getProtocolFormValues, preserveUneditableProtocols } from "./values";

const nowhere = {
  type: "nowhere",
  enable: true,
  port: 443,
  ratio: 1,
  version: 3,
  security: "tls",
  alpn: ["nw3"],
  network: "mix",
  obfs: "none",
  sni: "nw.example",
  cert_mode: "self",
};
function parse(values: Record<string, unknown>[]) {
  return formSchema.parse({
    name: "Renamed server",
    address: "node.example",
    protocols: values,
  });
}

describe("NW3 server form", () => {
  it("offers Nowhere with fixed NW3 defaults and no legacy transport knobs", () => {
    expect(protocols).toContain("nowhere");
    const defaults = getProtocolDefaultConfig("nowhere");
    expect(defaults).toMatchObject({
      type: "nowhere",
      version: 3,
      security: "tls",
      alpn: ["nw3"],
      network: "mix",
      obfs: "morph",
      cert_mode: "self",
    });
    for (const key of [
      "transport",
      "multiplex",
      "server_key",
      "fingerprint",
      "ech_enable",
      "obfs_password",
    ])
      expect(defaults).not.toHaveProperty(key);
    expect(() => parse(getProtocolFormValues())).not.toThrow();
  });

  it.each([
    "morph",
    "none",
  ])("retains Nowhere and its %s setting across editing and submission", (obfs) => {
    const initial = [{ ...nowhere, obfs }];
    const values = getProtocolFormValues(initial);
    const edited = parse(values).protocols.filter(
      (protocol) => protocol.enable
    );
    expect(preserveUneditableProtocols(edited, initial)).toEqual([
      expect.objectContaining({ ...nowhere, obfs }),
    ]);
    expect(edited[0]).not.toHaveProperty("plugin");
    expect(edited[0]).not.toHaveProperty("multiplex");
  });

  it.each([
    0, 1,
  ])("upgrades stored version %s to NW3 while preserving disabled Morph", (version) => {
    const values = getProtocolFormValues([
      { ...nowhere, version, alpn: ["now/1"], network: "both", obfs: " NONE " },
    ]);
    expect(
      parse(values).protocols.find((p) => p.type === "nowhere")
    ).toMatchObject({
      ...nowhere,
      version: 3,
      alpn: ["nw3"],
      network: "mix",
      obfs: "none",
    });
  });

  it.each([
    { version: 1 },
    { alpn: ["now/1"] },
    { alpn: ["nw3", "h2"] },
    { security: "reality" },
    { network: "ws" },
    { obfs: "http" },
    { allow_insecure: true },
    { cert_mode: "none" },
    { sni: " " },
    { port: 0 },
  ])("rejects incompatible enabled settings: %j", (change) => {
    expect(() => parse([{ ...nowhere, ...change }])).toThrow();
  });

  it("preserves uneditable backend protocols while allowing explicit removal of an editable protocol", () => {
    const opaque = {
      type: "future-protocol",
      enable: true,
      port: 8443,
      settings: { custom: "keep" },
    };
    const initial = [nowhere, opaque];
    const edited = parse(getProtocolFormValues(initial)).protocols.filter(
      (p) => p.enable
    );
    const payload = preserveUneditableProtocols(edited, initial);
    expect(payload).toHaveLength(2);
    expect(payload[1]).toEqual(opaque);
    expect(preserveUneditableProtocols([], initial)).toEqual([opaque]);
    expect(initial).toEqual([nowhere, opaque]);
  });

  it("does not duplicate Hysteria aliases or rewrite REALITY transports", () => {
    const initial = [
      { type: "hysteria", enable: false },
      {
        type: "vless",
        enable: false,
        security: "reality",
        transport: "xhttp",
        path: "/existing",
      },
    ];
    const values = getProtocolFormValues(initial);
    expect(values.find((p) => p.type === "vless")).toMatchObject({
      security: "reality",
      transport: "xhttp",
      path: "/existing",
      cert_mode: "none",
    });
    expect(preserveUneditableProtocols([], initial)).toEqual([]);
  });
});
