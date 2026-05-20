import { z } from "zod";
import {
  FINGERPRINTS,
  getLabel,
  SS_CIPHERS,
  TUIC_CONGESTION,
} from "./form-schema";

const OUTBOUND_PROTOCOLS = [
  { label: "HTTP", value: "http" },
  { label: "SOCKS", value: "socks" },
  { label: "Shadowsocks", value: "shadowsocks" },
  { label: "VMess", value: "vmess" },
  { label: "VLESS", value: "vless" },
  { label: "Trojan", value: "trojan" },
  { label: "Hysteria2", value: "hysteria" },
  { label: "TUIC", value: "tuic" },
  { label: "AnyTLS", value: "anytls" },
  { label: "WireGuard", value: "wireguard" },
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
const OUTBOUND_SECURITY = ["none", "tls", "reality"];

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

export function normalizeOutboundConfig(
  item: Record<string, any>
): OutboundConfigFormData {
  return {
    ...item,
    name: item.name || "",
    protocol: item.protocol || "",
    address: item.address || "",
    port: numberOrZero(item.port),
    user: item.user || "",
    password: item.password || "",
    uuid: item.uuid || "",
    cipher: item.cipher || "",
    security: item.security || "",
    sni: item.sni || "",
    allow_insecure: Boolean(item.allow_insecure),
    fingerprint: item.fingerprint || "",
    transport: item.transport || "",
    host: item.host || "",
    path: item.path || "",
    service_name: item.service_name || "",
    flow: item.flow || "",
    uot: Boolean(item.uot),
    uot_version: numberOrUndefined(item.uot_version),
    congestion_controller: item.congestion_controller || "",
    udp_stream: Boolean(item.udp_stream),
    reduce_rtt: Boolean(item.reduce_rtt),
    heartbeat: numberOrUndefined(item.heartbeat),
    reality_public_key: item.reality_public_key || "",
    reality_short_id: item.reality_short_id || "",
    spider_x: item.spider_x || "",
    settings: item.settings || "",
    stream_settings: item.stream_settings || "",
    rules:
      typeof item.rules === "string"
        ? splitLines(item.rules)
        : item.rules || [],
  };
}

export function outboundValueForInput(item: OutboundConfigFormData) {
  return {
    ...item,
    rules: Array.isArray(item.rules) ? item.rules.join("\n") : "",
  };
}

export function getOutboundFields(t: any): any[] {
  return [
    {
      name: "name",
      type: "text",
      className: "col-span-2",
      placeholder: t(
        "server_config.fields.outbound_name_placeholder",
        "Configuration name"
      ),
    },
    {
      name: "protocol",
      type: "select",
      placeholder: t(
        "server_config.fields.outbound_protocol_placeholder",
        "Select protocol"
      ),
      options: OUTBOUND_PROTOCOLS,
    },
    {
      name: "address",
      type: "text",
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
      placeholder: t("server_config.fields.outbound_port_placeholder", "Port"),
      visible: (item: Record<string, unknown>) =>
        !["direct", "reject", "wireguard"].includes(
          String(item.protocol || "")
        ),
    },
    {
      name: "user",
      type: "text",
      placeholder: t("server_config.fields.outbound_user", "Username"),
      visible: (item: Record<string, unknown>) =>
        ["http", "socks"].includes(String(item.protocol || "")),
    },
    {
      name: "password",
      type: "text",
      placeholder: t(
        "server_config.fields.outbound_password_placeholder",
        "Password / secret"
      ),
      visible: (item: Record<string, unknown>) =>
        !["direct", "reject", "wireguard", "hysteria"].includes(
          String(item.protocol || "")
        ),
    },
    {
      name: "uuid",
      type: "text",
      placeholder: "UUID",
      visible: (item: Record<string, unknown>) =>
        ["vmess", "vless", "tuic"].includes(String(item.protocol || "")),
    },
    {
      name: "cipher",
      type: "select",
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
      placeholder: t("security", "Security"),
      options: OUTBOUND_SECURITY.map((value) => ({
        label: getLabel(value),
        value,
      })),
      visible: (item: Record<string, unknown>) =>
        ["vmess", "vless", "trojan", "anytls"].includes(
          String(item.protocol || "")
        ),
    },
    {
      name: "transport",
      type: "select",
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
      placeholder: "SNI / Server Name",
      visible: (item: Record<string, unknown>) =>
        ["tls", "reality"].includes(String(item.security || "")),
    },
    {
      name: "fingerprint",
      type: "select",
      placeholder: t("fingerprint", "Fingerprint"),
      options: FINGERPRINTS.map((value) => ({ label: getLabel(value), value })),
      visible: (item: Record<string, unknown>) =>
        ["tls", "reality"].includes(String(item.security || "")),
    },
    {
      name: "allow_insecure",
      type: "boolean",
      placeholder: t("allow_insecure", "Allow insecure"),
      visible: (item: Record<string, unknown>) => item.security === "tls",
    },
    {
      name: "host",
      type: "text",
      placeholder: "Host / Authority",
      visible: (item: Record<string, unknown>) =>
        ["websocket", "httpupgrade", "xhttp", "grpc"].includes(
          String(item.transport || "")
        ),
    },
    {
      name: "path",
      type: "text",
      placeholder: "Path",
      visible: (item: Record<string, unknown>) =>
        ["websocket", "httpupgrade", "xhttp"].includes(
          String(item.transport || "")
        ),
    },
    {
      name: "service_name",
      type: "text",
      placeholder: "gRPC Service Name",
      visible: (item: Record<string, unknown>) => item.transport === "grpc",
    },
    {
      name: "uot",
      type: "boolean",
      placeholder: "UDP over TCP",
      visible: (item: Record<string, unknown>) =>
        item.protocol === "shadowsocks",
    },
    {
      name: "uot_version",
      type: "number",
      placeholder: "UoT Version",
      visible: (item: Record<string, unknown>) =>
        item.protocol === "shadowsocks",
    },
    {
      name: "congestion_controller",
      type: "select",
      placeholder: "Congestion",
      options: TUIC_CONGESTION.map((value) => ({ label: value, value })),
      visible: (item: Record<string, unknown>) => item.protocol === "tuic",
    },
    {
      name: "udp_stream",
      type: "boolean",
      placeholder: "UDP stream",
      visible: (item: Record<string, unknown>) => item.protocol === "tuic",
    },
    {
      name: "reduce_rtt",
      type: "boolean",
      placeholder: "0-RTT handshake",
      visible: (item: Record<string, unknown>) => item.protocol === "tuic",
    },
    {
      name: "heartbeat",
      type: "number",
      placeholder: "Heartbeat",
      visible: (item: Record<string, unknown>) => item.protocol === "tuic",
    },
    {
      name: "reality_public_key",
      type: "text",
      placeholder: "Reality Public Key",
      visible: (item: Record<string, unknown>) => item.security === "reality",
    },
    {
      name: "reality_short_id",
      type: "text",
      placeholder: "Reality Short ID",
      visible: (item: Record<string, unknown>) => item.security === "reality",
    },
    {
      name: "spider_x",
      type: "text",
      placeholder: "SpiderX",
      visible: (item: Record<string, unknown>) => item.security === "reality",
    },
    {
      name: "settings",
      type: "textarea",
      className: "col-span-2",
      prefix: t("server_config.fields.outbound_settings", "Raw settings JSON"),
      placeholder: '{"address":"example.com","port":443}',
    },
    {
      name: "stream_settings",
      type: "textarea",
      className: "col-span-2",
      prefix: t(
        "server_config.fields.outbound_stream_settings",
        "Raw streamSettings JSON"
      ),
      placeholder: '{"network":"tcp","security":"tls"}',
    },
    {
      name: "rules",
      type: "textarea",
      className: "col-span-2",
      placeholder: t(
        "server_config.fields.outbound_rules_placeholder",
        "One rule per line"
      ),
    },
  ];
}
