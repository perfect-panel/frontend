import { z } from "zod";
import {
  FINGERPRINTS,
  getLabel,
  SS_CIPHERS,
  TUIC_CONGESTION,
} from "./form-schema";

export const OUTBOUND_PROTOCOLS = [
  { label: "HTTP", value: "http" },
  { label: "SOCKS", value: "socks" },
  { label: "Shadowsocks", value: "shadowsocks" },
  { label: "VMess", value: "vmess" },
  { label: "VLESS", value: "vless" },
  { label: "Trojan", value: "trojan" },
  { label: "Hysteria2", value: "hysteria" },
  { label: "TUIC", value: "tuic" },
  { label: "AnyTLS", value: "anytls" },
  { label: "Direct", value: "direct" },
  { label: "Reject", value: "reject" },
];

const OUTBOUND_TRANSPORTS = [
  "tcp",
  "websocket",
  "grpc",
  "httpupgrade",
  "xhttp",
];
const OUTBOUND_SECURITY = {
  vmess: ["none", "tls"],
  vless: ["none", "tls", "reality"],
  trojan: ["tls"],
  hysteria: ["tls"],
  tuic: ["tls"],
  anytls: ["none", "tls", "reality"],
} as const;

const text = z.string().optional();

export const outboundConfigSchema = z.object({
  name: z.string(),
  protocol: z.string(),
  address: z.string(),
  port: z.number(),
  user: text,
  password: z.string(),
  uuid: text,
  cipher: text,
  security: text,
  sni: text,
  allow_insecure: z.boolean().optional(),
  fingerprint: text,
  transport: text,
  host: text,
  path: text,
  service_name: text,
  flow: text,
  uot: z.boolean().optional(),
  uot_version: z.number().optional(),
  congestion_controller: text,
  udp_stream: z.boolean().optional(),
  reduce_rtt: z.boolean().optional(),
  heartbeat: z.number().optional(),
  reality_public_key: text,
  reality_short_id: text,
  spider_x: text,
  settings: text,
  stream_settings: text,
  rules: z.array(z.string()),
});

export type OutboundConfigFormData = z.infer<typeof outboundConfigSchema>;
export type OutboundFieldGroup =
  | "basic"
  | "auth"
  | "transport"
  | "security"
  | "reality"
  | "protocol"
  | "routing";
export type OutboundFieldConfig = {
  name: keyof OutboundConfigFormData;
  type: "text" | "number" | "select" | "boolean" | "textarea";
  label: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  group: OutboundFieldGroup;
  required?: boolean;
  visible?: (item: Record<string, unknown>) => boolean;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  className?: string;
};

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function numberOrZero(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function numberOrUndefined(value: unknown) {
  if (value === undefined || value === null || value === "") return;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function stringOrDefault(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() !== "" ? value : fallback;
}

function defaultSecurityForProtocol(protocol: string) {
  switch (protocol) {
    case "trojan":
    case "hysteria":
    case "tuic":
    case "anytls":
      return "tls";
    case "vmess":
    case "vless":
      return "none";
    default:
      return "";
  }
}

function defaultTransportForProtocol(protocol: string) {
  switch (protocol) {
    case "vmess":
    case "vless":
    case "trojan":
    case "anytls":
      return "tcp";
    case "tuic":
      return "tuic";
    case "hysteria":
      return "hysteria";
    default:
      return "";
  }
}

function defaultCipherForProtocol(protocol: string) {
  switch (protocol) {
    case "shadowsocks":
      return "chacha20-ietf-poly1305";
    case "vmess":
      return "auto";
    default:
      return "";
  }
}

export function normalizeOutboundConfig(
  item: Record<string, any>
): OutboundConfigFormData {
  const protocol = stringOrDefault(item.protocol, "http");
  const security = stringOrDefault(
    item.security,
    defaultSecurityForProtocol(protocol)
  );
  return {
    ...item,
    name: item.name || "",
    protocol,
    address: item.address || "",
    port: numberOrZero(item.port),
    user: item.user || "",
    password: item.password || "",
    uuid: item.uuid || "",
    cipher: stringOrDefault(item.cipher, defaultCipherForProtocol(protocol)),
    security,
    sni: item.sni || "",
    allow_insecure: Boolean(item.allow_insecure),
    fingerprint: stringOrDefault(
      item.fingerprint,
      ["tls", "reality"].includes(security) ? "chrome" : ""
    ),
    transport: stringOrDefault(
      item.transport,
      defaultTransportForProtocol(protocol)
    ),
    host: item.host || "",
    path: item.path || "",
    service_name: item.service_name || "",
    flow: protocol === "vless" ? stringOrDefault(item.flow, "none") : "",
    uot: Boolean(item.uot),
    uot_version:
      protocol === "shadowsocks"
        ? numberOrUndefined(item.uot_version) || 2
        : numberOrUndefined(item.uot_version),
    congestion_controller:
      protocol === "tuic"
        ? stringOrDefault(item.congestion_controller, "bbr")
        : item.congestion_controller || "",
    udp_stream: Boolean(item.udp_stream),
    reduce_rtt: Boolean(item.reduce_rtt),
    heartbeat: numberOrUndefined(item.heartbeat),
    reality_public_key: item.reality_public_key || "",
    reality_short_id: item.reality_short_id || "",
    spider_x: item.spider_x || "",
    settings: "",
    stream_settings: "",
    rules:
      typeof item.rules === "string"
        ? splitLines(item.rules)
        : item.rules || [],
  };
}

export function createOutboundConfig(
  protocol = "http"
): OutboundConfigFormData {
  return normalizeOutboundConfig({
    name: "",
    protocol,
    address: "",
    port: 0,
    password: "",
    rules: [],
  });
}

export function outboundValueForInput(item: OutboundConfigFormData) {
  return {
    ...item,
    rules: Array.isArray(item.rules) ? item.rules.join("\n") : "",
  };
}

export function getOutboundSecurityOptions(protocol: string) {
  const values =
    OUTBOUND_SECURITY[protocol as keyof typeof OUTBOUND_SECURITY] || [];
  return values.map((value) => ({
    label: getLabel(value),
    value,
  }));
}

export function getOutboundProtocolLabel(protocol: string) {
  return (
    OUTBOUND_PROTOCOLS.find((item) => item.value === protocol)?.label ||
    protocol.toUpperCase()
  );
}

export function getOutboundFields(t: any): OutboundFieldConfig[] {
  return [
    {
      name: "name",
      type: "text",
      label: t("name", "Name"),
      group: "basic",
      required: true,
      placeholder: t(
        "server_config.fields.outbound_name_placeholder",
        "Configuration name"
      ),
    },
    {
      name: "protocol",
      type: "select",
      label: t("protocol", "Protocol"),
      group: "basic",
      required: true,
      placeholder: t(
        "server_config.fields.outbound_protocol_placeholder",
        "Select protocol"
      ),
      options: OUTBOUND_PROTOCOLS,
    },
    {
      name: "address",
      type: "text",
      label: t("address", "Address"),
      group: "basic",
      placeholder: t(
        "server_config.fields.outbound_address_placeholder",
        "Server address"
      ),
      visible: (item: Record<string, unknown>) =>
        !["direct", "reject"].includes(String(item.protocol || "")),
    },
    {
      name: "port",
      type: "number",
      label: t("port", "Port"),
      group: "basic",
      min: 1,
      max: 65_535,
      placeholder: t("server_config.fields.outbound_port_placeholder", "Port"),
      visible: (item: Record<string, unknown>) =>
        !["direct", "reject"].includes(String(item.protocol || "")),
    },
    {
      name: "user",
      type: "text",
      label: t("server_config.fields.outbound_user", "Username"),
      group: "auth",
      placeholder: t("server_config.fields.outbound_user", "Username"),
      visible: (item: Record<string, unknown>) =>
        ["http", "socks"].includes(String(item.protocol || "")),
    },
    {
      name: "password",
      type: "text",
      label: t(
        "server_config.fields.outbound_password_placeholder",
        "Password / secret"
      ),
      group: "auth",
      placeholder: t(
        "server_config.fields.outbound_password_placeholder",
        "Password / secret"
      ),
      visible: (item: Record<string, unknown>) =>
        ["http", "socks", "shadowsocks", "trojan", "anytls", "tuic"].includes(
          String(item.protocol || "")
        ),
    },
    {
      name: "uuid",
      type: "text",
      label: "UUID",
      group: "auth",
      placeholder: "UUID",
      visible: (item: Record<string, unknown>) =>
        ["vmess", "vless", "tuic"].includes(String(item.protocol || "")),
    },
    {
      name: "cipher",
      type: "select",
      label: t("cipher", "Cipher"),
      group: "auth",
      placeholder: t("cipher", "Cipher"),
      options: [
        ...SS_CIPHERS.map((cipher) => ({ label: cipher, value: cipher })),
        { label: "auto", value: "auto" },
      ],
      visible: (item: Record<string, unknown>) =>
        ["shadowsocks", "vmess"].includes(String(item.protocol || "")),
    },
    {
      name: "security",
      type: "select",
      label: t("security", "Security"),
      group: "security",
      placeholder: t("security", "Security"),
      options: [],
      visible: (item: Record<string, unknown>) =>
        getOutboundSecurityOptions(String(item.protocol || "")).length > 1 &&
        ["vmess", "vless", "trojan", "anytls", "tuic", "hysteria"].includes(
          String(item.protocol || "")
        ),
    },
    {
      name: "transport",
      type: "select",
      label: t("transport", "Transport"),
      group: "transport",
      placeholder: t("transport", "Transport"),
      options: OUTBOUND_TRANSPORTS.map((value) => ({
        label: getLabel(value),
        value,
      })),
      visible: (item: Record<string, unknown>) =>
        ["vmess", "vless", "trojan", "anytls"].includes(
          String(item.protocol || "")
        ),
    },
    {
      name: "flow",
      type: "select",
      label: t("flow", "Flow"),
      group: "auth",
      placeholder: "Flow",
      options: [
        { label: "none", value: "none" },
        { label: "xtls-rprx-vision", value: "xtls-rprx-vision" },
      ],
      visible: (item: Record<string, unknown>) => item.protocol === "vless",
    },
    {
      name: "sni",
      type: "text",
      label: t("security_sni", "SNI"),
      group: "security",
      placeholder: "SNI / Server Name",
      visible: (item: Record<string, unknown>) =>
        ["tls", "reality"].includes(String(item.security || "")),
    },
    {
      name: "fingerprint",
      type: "select",
      label: t("security_fingerprint", "Fingerprint"),
      group: "security",
      placeholder: t("fingerprint", "Fingerprint"),
      options: FINGERPRINTS.map((value) => ({ label: getLabel(value), value })),
      visible: (item: Record<string, unknown>) =>
        ["tls", "reality"].includes(String(item.security || "")),
    },
    {
      name: "allow_insecure",
      type: "boolean",
      label: t("security_allow_insecure", "Allow Insecure"),
      group: "security",
      placeholder: t("allow_insecure", "Allow insecure"),
      visible: (item: Record<string, unknown>) => item.security === "tls",
    },
    {
      name: "host",
      type: "text",
      label: t("host", "Host"),
      group: "transport",
      placeholder: "Host / Authority",
      visible: (item: Record<string, unknown>) =>
        ["websocket", "httpupgrade", "xhttp", "grpc"].includes(
          String(item.transport || "")
        ),
    },
    {
      name: "path",
      type: "text",
      label: t("path", "Path"),
      group: "transport",
      placeholder: "Path",
      visible: (item: Record<string, unknown>) =>
        ["websocket", "httpupgrade", "xhttp"].includes(
          String(item.transport || "")
        ),
    },
    {
      name: "service_name",
      type: "text",
      label: t("service_name", "Service Name"),
      group: "transport",
      placeholder: "gRPC Service Name",
      visible: (item: Record<string, unknown>) => item.transport === "grpc",
    },
    {
      name: "uot",
      type: "boolean",
      label: "UDP over TCP",
      group: "protocol",
      placeholder: "UDP over TCP",
      visible: (item: Record<string, unknown>) =>
        item.protocol === "shadowsocks",
    },
    {
      name: "uot_version",
      type: "number",
      label: "UoT Version",
      group: "protocol",
      placeholder: "UoT Version",
      min: 1,
      visible: (item: Record<string, unknown>) =>
        item.protocol === "shadowsocks",
    },
    {
      name: "congestion_controller",
      type: "select",
      label: t("congestion_controller", "Congestion Controller"),
      group: "protocol",
      placeholder: "Congestion",
      options: TUIC_CONGESTION.map((value) => ({ label: value, value })),
      visible: (item: Record<string, unknown>) => item.protocol === "tuic",
    },
    {
      name: "udp_stream",
      type: "boolean",
      label: "UDP stream",
      group: "protocol",
      placeholder: "UDP stream",
      visible: (item: Record<string, unknown>) => item.protocol === "tuic",
    },
    {
      name: "reduce_rtt",
      type: "boolean",
      label: t("reduce_rtt", "Reduce RTT"),
      group: "protocol",
      placeholder: "0-RTT handshake",
      visible: (item: Record<string, unknown>) => item.protocol === "tuic",
    },
    {
      name: "heartbeat",
      type: "number",
      label: "Heartbeat",
      group: "protocol",
      placeholder: "Heartbeat",
      min: 1,
      suffix: "S",
      visible: (item: Record<string, unknown>) => item.protocol === "tuic",
    },
    {
      name: "reality_public_key",
      type: "text",
      label: t("security_public_key", "Reality Public Key"),
      group: "reality",
      placeholder: "Reality Public Key",
      visible: (item: Record<string, unknown>) => item.security === "reality",
    },
    {
      name: "reality_short_id",
      type: "text",
      label: t("security_short_id", "Reality Short ID"),
      group: "reality",
      placeholder: "Reality Short ID",
      visible: (item: Record<string, unknown>) => item.security === "reality",
    },
    {
      name: "spider_x",
      type: "text",
      label: "SpiderX",
      group: "reality",
      placeholder: "SpiderX",
      visible: (item: Record<string, unknown>) => item.security === "reality",
    },
    {
      name: "rules",
      type: "textarea",
      label: t("server_config.tabs.outbound", "Outbound Rules"),
      group: "routing",
      className: "col-span-2",
      placeholder: t(
        "server_config.fields.outbound_rules_placeholder",
        "One rule per line"
      ),
    },
  ];
}
