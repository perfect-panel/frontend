import { z } from "zod";
import {
  ENCRYPTION_MODES,
  ENCRYPTION_RTT,
  ENCRYPTION_TYPES,
  FINGERPRINTS,
  getLabel,
  multiplexLevels,
  SS_CIPHERS,
  TUIC_CONGESTION,
  XHTTP_MODES,
} from "./form-schema";

export const OUTBOUND_PROTOCOLS = [
  { label: "HTTP", value: "http" },
  { label: "SOCKS", value: "socks" },
  { label: "Shadowsocks", value: "shadowsocks" },
  { label: "VMess", value: "vmess" },
  { label: "VLESS", value: "vless" },
  { label: "Trojan", value: "trojan" },
  { label: "Hysteria2", value: "hysteria2" },
  { label: "TUIC", value: "tuic" },
  { label: "AnyTLS", value: "anytls" },
  { label: "Direct", value: "direct" },
  { label: "Reject", value: "reject" },
];

const OUTBOUND_TRANSPORTS = ["tcp", "ws", "grpc", "httpupgrade", "xhttp"];
const OUTBOUND_SECURITY = {
  vmess: ["none", "tls"],
  vless: ["none", "tls"],
  trojan: ["none", "tls", "reality"],
  hysteria2: ["tls"],
  tuic: ["tls"],
  anytls: ["tls", "reality"],
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
  alpn: z.array(z.string()).optional(),
  allow_insecure: z.boolean().optional(),
  fingerprint: text,
  reality_public_key: text,
  reality_short_id: text,
  transport: text,
  host: text,
  path: text,
  service_name: text,
  xhttp_mode: text,
  xhttp_extra: text,
  flow: text,
  encryption: text,
  encryption_mode: text,
  encryption_rtt: text,
  encryption_client_padding: text,
  encryption_password: text,
  multiplex: text,
  uot: z.boolean().optional(),
  uot_version: z.number().optional(),
  congestion_controller: text,
  udp_stream: z.boolean().optional(),
  reduce_rtt: z.boolean().optional(),
  heartbeat: z.number().optional(),
  settings: text,
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
  type:
    | "text"
    | "number"
    | "select"
    | "boolean"
    | "textarea"
    | "string-list";
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

const UOT_PROTOCOLS = ["shadowsocks", "vmess", "vless", "trojan", "anytls"];
const MUX_PROTOCOLS = ["vmess", "vless", "trojan"];

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function numberOrZero(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function numberOrUndefined(value: unknown) {
  if (value === undefined || value === null || value === "") return;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function stringOrDefault(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() !== "" ? value : fallback;
}

function defaultSecurityForProtocol(protocol: string) {
  if (["trojan", "hysteria2", "tuic", "anytls"].includes(protocol)) {
    return "tls";
  }
  if (["vmess", "vless"].includes(protocol)) return "none";
  return "";
}

function defaultTransportForProtocol(protocol: string) {
  if (["vmess", "vless", "trojan", "anytls"].includes(protocol)) {
    return "tcp";
  }
  if (protocol === "tuic") return "tuic";
  return "";
}

function defaultCipherForProtocol(protocol: string) {
  if (protocol === "shadowsocks") return "chacha20-ietf-poly1305";
  if (protocol === "vmess") return "auto";
  return "";
}

export function normalizeOutboundConfig(
  item: Record<string, any>
): OutboundConfigFormData {
  const rawProtocol = stringOrDefault(item.protocol, "http");
  const protocol = rawProtocol === "hysteria" ? "hysteria2" : rawProtocol;
  let security = stringOrDefault(
    item.security,
    defaultSecurityForProtocol(protocol)
  );
  if (["hysteria2", "tuic"].includes(protocol)) security = "tls";
  if (
    protocol === "anytls" &&
    !["tls", "reality"].includes(security)
  ) {
    security = "tls";
  }
  const reality = security === "reality";
  const rawTransport = stringOrDefault(
    item.transport,
    defaultTransportForProtocol(protocol)
  );
  const transport =
    reality || protocol === "anytls"
      ? "tcp"
      : rawTransport === "websocket"
        ? "ws"
        : rawTransport;
  const uot = UOT_PROTOCOLS.includes(protocol) && Boolean(item.uot);
  const multiplex = MUX_PROTOCOLS.includes(protocol)
    ? stringOrDefault(item.multiplex, "none")
    : "none";

  return {
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
    alpn: Array.isArray(item.alpn) ? item.alpn : [],
    allow_insecure: security === "tls" && Boolean(item.allow_insecure),
    fingerprint: reality ? stringOrDefault(item.fingerprint, "chrome") : "",
    reality_public_key: reality ? item.reality_public_key || "" : "",
    reality_short_id: reality ? item.reality_short_id || "" : "",
    transport,
    host: item.host || "",
    path: item.path || "",
    service_name: item.service_name || "",
    xhttp_mode: item.xhttp_mode || "auto",
    xhttp_extra: item.xhttp_extra || "",
    flow:
      protocol === "vless" && transport === "tcp" && security === "tls"
        ? stringOrDefault(item.flow, "none")
        : "none",
    encryption:
      protocol === "vless" ? stringOrDefault(item.encryption, "none") : "",
    encryption_mode: protocol === "vless" ? item.encryption_mode || "" : "",
    encryption_rtt: protocol === "vless" ? item.encryption_rtt || "" : "",
    encryption_client_padding:
      protocol === "vless" ? item.encryption_client_padding || "" : "",
    encryption_password:
      protocol === "vless" ? item.encryption_password || "" : "",
    multiplex,
    uot,
    uot_version: uot ? numberOrUndefined(item.uot_version) || 2 : undefined,
    congestion_controller:
      protocol === "tuic"
        ? stringOrDefault(item.congestion_controller, "bbr")
        : "",
    udp_stream: protocol === "tuic" && Boolean(item.udp_stream),
    reduce_rtt: protocol === "tuic" && Boolean(item.reduce_rtt),
    heartbeat:
      protocol === "tuic" ? numberOrUndefined(item.heartbeat) : undefined,
    settings: protocol === "hysteria2" ? item.settings || "" : "",
    rules:
      typeof item.rules === "string"
        ? splitLines(item.rules)
        : Array.isArray(item.rules)
          ? item.rules
          : [],
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
    alpn: Array.isArray(item.alpn) ? item.alpn.join("\n") : "",
    rules: Array.isArray(item.rules) ? item.rules.join("\n") : "",
  };
}

export function getOutboundSecurityOptions(protocol: string) {
  const values =
    OUTBOUND_SECURITY[protocol as keyof typeof OUTBOUND_SECURITY] || [];
  return values.map((value) => ({ label: getLabel(value), value }));
}

export function getOutboundProtocolLabel(protocol: string) {
  return (
    OUTBOUND_PROTOCOLS.find((item) => item.value === protocol)?.label ||
    protocol.toUpperCase()
  );
}

function selected(value: string, t: any) {
  return { label: t(value, getLabel(value)), value };
}

export function getOutboundFields(t: any): OutboundFieldConfig[] {
  const protocolIs =
    (...protocols: string[]) =>
    (item: Record<string, unknown>) =>
      protocols.includes(String(item.protocol || ""));
  const securityIs =
    (...values: string[]) =>
    (item: Record<string, unknown>) =>
      values.includes(String(item.security || ""));
  const encryptionEnabled = (item: Record<string, unknown>) =>
    item.protocol === "vless" && item.encryption === "mlkem768x25519plus";

  return [
    {
      name: "name",
      type: "text",
      label: t("name", "Name"),
      group: "basic",
      required: true,
      placeholder: t("server_config.fields.outbound_name_placeholder", "Configuration name"),
    },
    {
      name: "protocol",
      type: "select",
      label: t("protocol", "Protocol"),
      group: "basic",
      required: true,
      options: OUTBOUND_PROTOCOLS,
    },
    {
      name: "address",
      type: "text",
      label: t("address", "Address"),
      group: "basic",
      placeholder: t("server_config.fields.outbound_address_placeholder", "Server address"),
      visible: (item) => !["direct", "reject"].includes(String(item.protocol || "")),
    },
    {
      name: "port",
      type: "number",
      label: t("port", "Port"),
      group: "basic",
      min: 1,
      max: 65_535,
      visible: (item) => !["direct", "reject"].includes(String(item.protocol || "")),
    },
    {
      name: "user",
      type: "text",
      label: t("server_config.fields.outbound_user", "Username"),
      group: "auth",
      visible: protocolIs("http", "socks"),
    },
    {
      name: "password",
      type: "text",
      label: t("server_config.fields.outbound_password_placeholder", "Password / secret"),
      group: "auth",
      visible: protocolIs("http", "socks", "shadowsocks", "trojan", "anytls", "tuic", "hysteria2"),
    },
    {
      name: "uuid",
      type: "text",
      label: "UUID",
      group: "auth",
      visible: protocolIs("vmess", "vless", "tuic"),
    },
    {
      name: "cipher",
      type: "select",
      label: t("cipher", "Cipher"),
      group: "auth",
      options: [
        ...SS_CIPHERS.map((cipher) => ({ label: cipher, value: cipher })),
        { label: "2022-blake3-chacha20-poly1305", value: "2022-blake3-chacha20-poly1305" },
        { label: "auto", value: "auto" },
      ],
      visible: protocolIs("shadowsocks", "vmess"),
    },
    {
      name: "security",
      type: "select",
      label: t("security", "Security"),
      group: "security",
      options: [],
      visible: (item) => getOutboundSecurityOptions(String(item.protocol || "")).length > 1,
    },
    {
      name: "sni",
      type: "text",
      label: t("security_sni", "SNI"),
      group: "security",
      visible: securityIs("tls", "reality"),
    },
    {
      name: "allow_insecure",
      type: "boolean",
      label: t("security_allow_insecure", "Allow Insecure"),
      group: "security",
      visible: securityIs("tls"),
    },
    {
      name: "fingerprint",
      type: "select",
      label: t("security_fingerprint", "Fingerprint"),
      group: "reality",
      options: FINGERPRINTS.map((value) => selected(value, t)),
      visible: securityIs("reality"),
    },
    {
      name: "reality_public_key",
      type: "text",
      label: t("security_public_key", "Reality Public Key"),
      group: "reality",
      required: true,
      visible: securityIs("reality"),
    },
    {
      name: "reality_short_id",
      type: "text",
      label: t("security_short_id", "Reality Short ID"),
      group: "reality",
      required: true,
      visible: securityIs("reality"),
    },
    {
      name: "transport",
      type: "select",
      label: t("transport", "Transport"),
      group: "transport",
      options: OUTBOUND_TRANSPORTS.map((value) => selected(value, t)),
      visible: (item) =>
        ["vmess", "vless", "trojan"].includes(String(item.protocol || "")) &&
        item.security !== "reality",
    },
    {
      name: "host",
      type: "text",
      label: t("host", "Host"),
      group: "transport",
      visible: (item) => ["ws", "httpupgrade", "xhttp", "grpc"].includes(String(item.transport || "")),
    },
    {
      name: "path",
      type: "text",
      label: t("path", "Path"),
      group: "transport",
      visible: (item) => ["ws", "httpupgrade", "xhttp"].includes(String(item.transport || "")),
    },
    {
      name: "service_name",
      type: "text",
      label: t("service_name", "Service Name"),
      group: "transport",
      visible: (item) => item.transport === "grpc",
    },
    {
      name: "xhttp_mode",
      type: "select",
      label: t("xhttp_mode", "XHTTP Mode"),
      group: "transport",
      options: XHTTP_MODES.map((value) => selected(value, t)),
      visible: (item) => item.transport === "xhttp",
    },
    {
      name: "xhttp_extra",
      type: "textarea",
      label: t("xhttp_extra", "XHTTP Extra"),
      group: "transport",
      className: "col-span-2",
      placeholder: "{}",
      visible: (item) => item.transport === "xhttp",
    },
    {
      name: "alpn",
      type: "string-list",
      label: t("alpn", "ALPN"),
      group: "security",
      className: "col-span-2",
      placeholder: "h2\nhttp/1.1",
      visible: (item) =>
        ["anytls", "tuic"].includes(String(item.protocol || "")) ||
        (item.security === "tls" && item.transport === "xhttp"),
    },
    {
      name: "flow",
      type: "select",
      label: t("flow", "Flow"),
      group: "auth",
      options: [selected("none", t), selected("xtls-rprx-vision", t)],
      visible: (item) => item.protocol === "vless" && item.transport === "tcp" && item.security === "tls",
    },
    {
      name: "multiplex",
      type: "select",
      label: t("multiplex", "Multiplex"),
      group: "protocol",
      options: multiplexLevels.map((value) => selected(value, t)),
      visible: (item) => MUX_PROTOCOLS.includes(String(item.protocol || "")),
    },
    {
      name: "uot",
      type: "boolean",
      label: t("uot", "UDP over TCP"),
      group: "protocol",
      visible: (item) => UOT_PROTOCOLS.includes(String(item.protocol || "")),
    },
    {
      name: "uot_version",
      type: "number",
      label: t("uot_version", "UoT Version"),
      group: "protocol",
      min: 1,
      max: 2,
      visible: (item) => UOT_PROTOCOLS.includes(String(item.protocol || "")) && item.uot === true,
    },
    {
      name: "encryption",
      type: "select",
      label: t("encryption", "Encryption"),
      group: "protocol",
      options: ENCRYPTION_TYPES.map((value) => selected(value, t)),
      visible: protocolIs("vless"),
    },
    {
      name: "encryption_mode",
      type: "select",
      label: t("encryption_mode", "Encryption Mode"),
      group: "protocol",
      options: ENCRYPTION_MODES.map((value) => selected(value, t)),
      visible: encryptionEnabled,
    },
    {
      name: "encryption_rtt",
      type: "select",
      label: t("encryption_rtt", "Encryption RTT"),
      group: "protocol",
      options: ENCRYPTION_RTT.map((value) => selected(value, t)),
      visible: encryptionEnabled,
    },
    {
      name: "encryption_client_padding",
      type: "text",
      label: t("encryption_client_padding", "Client Padding"),
      group: "protocol",
      visible: encryptionEnabled,
    },
    {
      name: "encryption_password",
      type: "text",
      label: t("encryption_password", "Encryption Password"),
      group: "protocol",
      visible: encryptionEnabled,
    },
    {
      name: "congestion_controller",
      type: "select",
      label: t("congestion_controller", "Congestion Controller"),
      group: "protocol",
      options: TUIC_CONGESTION.map((value) => selected(value, t)),
      visible: protocolIs("tuic"),
    },
    {
      name: "udp_stream",
      type: "boolean",
      label: t("udp_stream", "UDP Stream"),
      group: "protocol",
      visible: protocolIs("tuic"),
    },
    {
      name: "reduce_rtt",
      type: "boolean",
      label: t("reduce_rtt", "Reduce RTT"),
      group: "protocol",
      visible: protocolIs("tuic"),
    },
    {
      name: "heartbeat",
      type: "number",
      label: t("heartbeat", "Heartbeat"),
      group: "protocol",
      min: 0,
      suffix: "S",
      visible: protocolIs("tuic"),
    },
    {
      name: "settings",
      type: "textarea",
      label: t("settings", "Hysteria2 Settings"),
      group: "protocol",
      className: "col-span-2",
      placeholder: '{"up_mbps":100,"down_mbps":100}',
      visible: protocolIs("hysteria2"),
    },
    {
      name: "rules",
      type: "textarea",
      label: t("server_config.tabs.outbound", "Outbound Rules"),
      group: "routing",
      className: "col-span-2",
      placeholder: t("server_config.fields.outbound_rules_placeholder", "One rule per line"),
    },
  ];
}
