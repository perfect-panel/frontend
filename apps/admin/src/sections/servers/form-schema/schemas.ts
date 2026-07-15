import { z } from "zod";
import {
  ALPN_VALUES,
  CERT_MODES,
  ENCRYPTION_MODES,
  ENCRYPTION_RTT,
  ENCRYPTION_TYPES,
  FLOWS,
  multiplexLevels,
  NAIVE_CONGESTION,
  SECURITY,
  SHADOWSOCKS_PLUGINS,
  SNELL_OBFS,
  SNELL_V6_MODES,
  SS_CIPHERS,
  SSR_CIPHERS,
  SSR_OBFS,
  SSR_PROTOCOLS,
  TRANSPORTS,
  TUIC_CONGESTION,
  XHTTP_MODES,
} from "./constants";

const nullableString = z.string().nullish();
const nullableBool = z.boolean().nullish();
const nullablePort = z.number().int().min(0).max(65_535).nullish();
const nullableRatio = z.number().min(0).nullish();
const nullableInteger = z.preprocess(
  (value) =>
    value === "" || value === null || value === undefined
      ? undefined
      : Number(value),
  z.number().int().optional()
);
const nullableALPN = z.array(z.enum(ALPN_VALUES)).nullish();

const pluginOptions = z
  .union([
    z.record(z.string(), z.unknown()),
    z.string().transform((value) => {
      try {
        const parsed = JSON.parse(value);
        return parsed !== null &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
          ? (parsed as Record<string, unknown>)
          : value;
      } catch {
        return value;
      }
    }),
  ])
  .nullish();

const common = {
  ratio: nullableRatio,
  enable: nullableBool,
  port: nullablePort,
};

const certificate = {
  sni: nullableString,
  cert_mode: z.enum(CERT_MODES).nullish(),
  cert_dns_provider: nullableString,
  cert_dns_env: nullableString,
};

const stream = {
  host: nullableString,
  transport: nullableString,
  path: nullableString,
  service_name: nullableString,
  xhttp_mode: z.enum(XHTTP_MODES).nullish(),
  xhttp_extra: nullableString,
  alpn: nullableALPN,
  multiplex: z.enum(multiplexLevels).nullish(),
};

const reality = {
  reality_server_addr: nullableString,
  reality_server_port: nullablePort,
  reality_private_key: nullableString,
  reality_public_key: nullableString,
  reality_short_id: nullableString,
};

const shadowsocks = z.object({
  ...common,
  type: z.literal("shadowsocks"),
  cipher: z.enum(SS_CIPHERS).nullish(),
  server_key: nullableString,
  plugin: z.enum(SHADOWSOCKS_PLUGINS).nullish(),
  plugin_opts: pluginOptions,
  multiplex: z.enum(multiplexLevels).nullish(),
  uot: nullableBool,
  uot_version: nullableInteger,
  ...certificate,
});

const vmess = z.object({
  ...common,
  ...stream,
  ...certificate,
  ...reality,
  type: z.literal("vmess"),
  security: z.enum(SECURITY.vmess).nullish(),
});

const vless = z.object({
  ...common,
  ...stream,
  ...certificate,
  ...reality,
  type: z.literal("vless"),
  security: z.enum(SECURITY.vless).nullish(),
  flow: z.enum(FLOWS.vless).nullish(),
  encryption: z.enum(ENCRYPTION_TYPES).nullish(),
  encryption_mode: z.enum(ENCRYPTION_MODES).nullish(),
  encryption_rtt: z.enum(ENCRYPTION_RTT).nullish(),
  encryption_ticket: nullableString,
  encryption_server_padding: nullableString,
  encryption_private_key: nullableString,
  encryption_client_padding: nullableString,
  encryption_password: nullableString,
});

const trojan = z.object({
  ...common,
  ...stream,
  ...certificate,
  ...reality,
  type: z.literal("trojan"),
  security: z.enum(SECURITY.trojan).nullish(),
});

const hysteria2 = z.object({
  ...common,
  ...certificate,
  type: z.literal("hysteria2"),
  security: z.enum(SECURITY.hysteria2).nullish(),
  obfs_password: nullableString,
  obfs: z.enum(["none", "salamander"] as const).nullish(),
  up_mbps: nullableInteger,
  down_mbps: nullableInteger,
});

const tuic = z.object({
  ...common,
  ...certificate,
  type: z.literal("tuic"),
  version: nullableInteger,
  security: z.enum(SECURITY.tuic).nullish(),
  alpn: nullableALPN,
  reduce_rtt: nullableBool,
  heartbeat: nullableInteger,
  congestion_controller: z.enum(TUIC_CONGESTION).nullish(),
  multiplex: z.enum(multiplexLevels).nullish(),
});

const anytls = z.object({
  ...common,
  ...certificate,
  ...reality,
  type: z.literal("anytls"),
  security: z.enum(SECURITY.anytls).nullish(),
  padding_scheme: nullableString,
  multiplex: z.enum(multiplexLevels).nullish(),
});

const naive = z.object({
  ...common,
  ...certificate,
  type: z.literal("naive"),
  security: z.enum(SECURITY.naive).nullish(),
  network: z.enum(["tcp,udp", "tcp", "udp"] as const).nullish(),
  quic_congestion_control: z.enum(NAIVE_CONGESTION).nullish(),
});

const mieru = z.object({
  ...common,
  type: z.literal("mieru"),
  transport: z.enum(TRANSPORTS.mieru).nullish(),
  traffic_pattern: nullableString,
  user_hint_is_mandatory: nullableBool,
});

const shadowsocksr = z.object({
  ...common,
  type: z.literal("shadowsocksr"),
  transport: z.enum(TRANSPORTS.shadowsocksr).nullish(),
  cipher: z.enum(SSR_CIPHERS).nullish(),
  server_key: nullableString,
  protocol: z.enum(SSR_PROTOCOLS).nullish(),
  protocol_param: nullableString,
  obfs: z.enum(SSR_OBFS).nullish(),
  obfs_param: nullableString,
});

const snell = z.object({
  ...common,
  type: z.literal("snell"),
  version: nullableInteger,
  mode: z.enum(SNELL_V6_MODES).nullish(),
  server_key: nullableString,
  obfs: z.enum(SNELL_OBFS).nullish(),
  multiplex: z.enum(multiplexLevels).nullish(),
});

export const protocolApiScheme = z.discriminatedUnion("type", [
  shadowsocks,
  vmess,
  vless,
  trojan,
  hysteria2,
  tuic,
  anytls,
  naive,
  mieru,
  shadowsocksr,
  snell,
]);

export const formSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  country: z.string().optional(),
  city: z.string().optional(),
  protocols: z.array(protocolApiScheme),
});
