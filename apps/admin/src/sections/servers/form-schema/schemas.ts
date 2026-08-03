import { z } from "zod";
import {
  ALPN_VALUES,
  CERT_MODES,
  ENCRYPTION_MODES,
  ENCRYPTION_RTT,
  ENCRYPTION_TYPES,
  FLOWS,
  MIERU_MULTIPLEX,
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

// TLS ECH: carried for the protocols whose inbound terminates TLS.
const ech = {
  ech_enable: nullableBool,
  ech_server_name: nullableString,
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
  ...ech,
  type: z.literal("vmess"),
  security: z.enum(SECURITY.vmess).nullish(),
});

const vless = z.object({
  ...common,
  ...stream,
  ...certificate,
  ...reality,
  ...ech,
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
  ...ech,
  type: z.literal("trojan"),
  security: z.enum(SECURITY.trojan).nullish(),
});

const hysteria2 = z.object({
  ...common,
  ...certificate,
  ...ech,
  type: z.literal("hysteria2"),
  security: z.enum(SECURITY.hysteria2).nullish(),
  allow_insecure: nullableBool,
  hop_ports: nullableString,
  hop_interval: nullableInteger,
  obfs_password: nullableString,
  obfs: z.enum(["none", "salamander"] as const).nullish(),
  up_mbps: nullableInteger,
  down_mbps: nullableInteger,
});

const tuic = z.object({
  ...common,
  ...certificate,
  ...ech,
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
  ...ech,
  type: z.literal("anytls"),
  security: z.enum(SECURITY.anytls).nullish(),
  padding_scheme: nullableString,
});

const naive = z.object({
  ...common,
  ...certificate,
  ...ech,
  type: z.literal("naive"),
  security: z.enum(SECURITY.naive).nullish(),
  network: z.enum(["tcp,udp", "tcp", "udp"] as const).nullish(),
  quic_congestion_control: z.enum(NAIVE_CONGESTION).nullish(),
});

const mieru = z.object({
  ...common,
  type: z.literal("mieru"),
  transport: z.enum(TRANSPORTS.mieru).nullish(),
  multiplex: z.enum(MIERU_MULTIPLEX).nullish(),
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
  obfs: z.enum(SNELL_OBFS).nullish(),
});

const MAX_PADDING_RANGES_PER_PACKET = 64;

// The node uses the raw key string as key material and base64-encodes it
// itself, so its character count — not its decoded length — must match.
function shadowsocks2022KeyLength(cipher: string) {
  return cipher === "2022-blake3-aes-128-gcm" ? 16 : 32;
}

function isJsonObject(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    return (
      typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
    );
  } catch {
    return false;
  }
}

// Mirrors sing-anytls padding.NewPaddingFactory: key=value lines with a
// mandatory non-negative stop, packet indexes below stop, at most 64 entries
// per packet, and "c" or min-max sizes within 1-65535.
function isValidPaddingScheme(value: string) {
  const entries = new Map<string, string>();
  for (const line of value.split("\n")) {
    const separator = line.indexOf("=");
    if (separator !== -1) {
      entries.set(line.slice(0, separator), line.slice(separator + 1));
    }
  }
  const stopText = entries.get("stop") ?? "";
  if (!/^[+-]?\d+$/.test(stopText)) return false;
  const stop = Number(stopText);
  if (stop < 0 || stop > 4_294_967_295) return false;
  for (const [key, ranges] of entries) {
    if (key === "stop") continue;
    if (!/^\d+$/.test(key) || Number(key) >= stop) return false;
    const parts = ranges.split(",");
    if (parts.length > MAX_PADDING_RANGES_PER_PACKET) return false;
    for (const part of parts) {
      if (part === "c") continue;
      const bounds = part.split("-");
      if (bounds.length !== 2) return false;
      for (const bound of bounds) {
        if (!/^[+-]?\d+$/.test(bound)) return false;
        const size = Number(bound);
        if (size <= 0 || size > 65_535) return false;
      }
    }
  }
  return true;
}

function lowered(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function trimmed(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseHopPorts(value: string): boolean {
  for (const token of value.split(",")) {
    const part = token.trim();
    if (!part) return false;

    const bounds = part.split("-").map((bound) => Number(bound.trim()));
    if (
      bounds.length > 2 ||
      bounds.some(
        (bound) => !Number.isInteger(bound) || bound < 1 || bound > 65_535
      )
    ) {
      return false;
    }

    const start = bounds[0] as number;
    const end = (bounds[1] ?? start) as number;
    if (start > end) return false;
  }

  return true;
}

// Rules the node enforces when it starts an inbound. Breaking one makes it
// reject the whole generation, so they are caught before the config is stored.
function refineProtocol(
  protocol: Record<string, unknown>,
  ctx: z.RefinementCtx
) {
  const type = String(protocol.type ?? "");
  const security = lowered(protocol.security);
  const transport = lowered(protocol.transport);

  if (type === "hysteria2") {
    const hopPorts = trimmed(protocol.hop_ports);
    const hopInterval = protocol.hop_interval;
    const hasHopPorts = hopPorts.length > 0;
    const hasHopInterval = typeof hopInterval === "number" && hopInterval > 0;

    if (hasHopPorts && !parseHopPorts(hopPorts)) {
      ctx.addIssue({
        code: "custom",
        message:
          "Hysteria2 hop ports must be comma-separated ports or ranges from 1 to 65535.",
        path: ["hop_ports"],
      });
    }

    if (hasHopPorts && !hasHopInterval) {
      ctx.addIssue({
        code: "custom",
        message: "Hysteria2 hop interval is required when hop ports are set.",
        path: ["hop_interval"],
      });
    }

    if (!hasHopPorts && hasHopInterval) {
      ctx.addIssue({
        code: "custom",
        message: "Hysteria2 hop ports are required when hop interval is set.",
        path: ["hop_ports"],
      });
    }

    if (typeof hopInterval === "number" && hopInterval < 0) {
      ctx.addIssue({
        code: "custom",
        message: "Hysteria2 hop interval cannot be negative.",
        path: ["hop_interval"],
      });
    }
  }

  if (type === "shadowsocks") {
    const cipher = lowered(protocol.cipher);
    const serverKey = trimmed(protocol.server_key);
    const want = shadowsocks2022KeyLength(cipher);
    if (cipher.startsWith("2022-") && serverKey && serverKey.length !== want) {
      ctx.addIssue({
        code: "custom",
        message: `Shadowsocks 2022 server key must be exactly ${want} characters.`,
        path: ["server_key"],
      });
    }
  }

  // Reality only rides native TCP on vmess and trojan; vless has no such limit.
  if (
    security === "reality" &&
    (type === "trojan" || type === "vmess") &&
    transport !== "" &&
    transport !== "tcp"
  ) {
    ctx.addIssue({
      code: "custom",
      message: "Reality only supports the TCP transport for this protocol.",
      path: ["transport"],
    });
  }

  const xhttpExtra = trimmed(protocol.xhttp_extra);
  if (transport === "xhttp" && xhttpExtra && !isJsonObject(xhttpExtra)) {
    ctx.addIssue({
      code: "custom",
      message: "XHTTP extra must be a JSON object.",
      path: ["xhttp_extra"],
    });
  }

  if (type === "anytls") {
    const scheme = trimmed(protocol.padding_scheme);
    if (scheme && !isValidPaddingScheme(scheme)) {
      ctx.addIssue({
        code: "custom",
        message:
          "Padding scheme must be key=value lines with a stop line, packet indexes below stop and 1-65535 sizes.",
        path: ["padding_scheme"],
      });
    }
  }

  // Obfs only wraps TCP, so a UDP-only listener has nothing to obfuscate.
  if (type === "shadowsocksr") {
    const obfs = lowered(protocol.obfs);
    if (transport === "udp" && obfs !== "" && obfs !== "plain") {
      ctx.addIssue({
        code: "custom",
        message: "A UDP-only ShadowsocksR transport requires plain obfs.",
        path: ["obfs"],
      });
    }
  }

  if (type === "vless") {
    const encryption = lowered(protocol.encryption);
    if (encryption !== "" && encryption !== "none") {
      const required = [
        ["encryption_mode", "encryption mode"],
        ["encryption_ticket", "encryption ticket"],
        ["encryption_private_key", "encryption private key"],
      ] as const;
      for (const [field, label] of required) {
        if (!trimmed(protocol[field])) {
          ctx.addIssue({
            code: "custom",
            message: `VLESS encryption requires the ${label}.`,
            path: [field],
          });
        }
      }
    }
  }
}

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
  protocols: z.array(
    protocolApiScheme.superRefine((protocol, ctx) => {
      refineProtocol(protocol as Record<string, unknown>, ctx);
    })
  ),
});
