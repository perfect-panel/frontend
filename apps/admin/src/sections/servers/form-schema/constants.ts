export const protocols = [
  "shadowsocks",
  "vmess",
  "vless",
  "trojan",
  "hysteria2",
  "tuic",
  "anytls",
  "naive",
  "mieru",
  "shadowsocksr",
  "snell",
] as const;

// Global label map for display; fallback to raw value if missing
export const LABELS = {
  // transport
  tcp: "TCP",
  udp: "UDP",
  both: "TCP + UDP",
  "tcp,udp": "TCP + UDP",
  ws: "WebSocket",
  websocket: "WebSocket",
  grpc: "gRPC",
  mkcp: "mKCP",
  httpupgrade: "HTTP Upgrade",
  xhttp: "XHTTP",
  // security
  none: "NONE",
  tls: "TLS",
  reality: "Reality",
  // fingerprint
  chrome: "Chrome",
  firefox: "Firefox",
  safari: "Safari",
  ios: "IOS",
  android: "Android",
  edge: "edge",
  "360": "360",
  qq: "QQ",
  // multiplex
  low: "Low",
  middle: "Middle",
  high: "High",
  h2mux: "H2Mux",
  smux: "SMux",
  yamux: "YAMux",
  default: "Default",
  unshaped: "Unshaped",
  "unsafe-raw": "Unsafe Raw",
} as const;

// Flat arrays for enum-like sets
export const SS_CIPHERS = [
  "aes-128-gcm",
  "aes-256-gcm",
  "chacha20-ietf-poly1305",
  "2022-blake3-aes-128-gcm",
  "2022-blake3-aes-256-gcm",
] as const;

export const SHADOWSOCKS_PLUGINS = [
  "none",
  "obfs",
  "v2ray-plugin",
  "gost-plugin",
  "shadow-tls",
  "restls",
  "kcptun",
] as const;

export const SSR_CIPHERS = [
  "none",
  "aes-128-ctr",
  "aes-192-ctr",
  "aes-256-ctr",
  "aes-128-cfb",
  "aes-192-cfb",
  "aes-256-cfb",
  "rc4-md5",
  "chacha20",
  "chacha20-ietf",
] as const;

export const SSR_PROTOCOLS = [
  "auth_aes128_md5",
  "auth_aes128_sha1",
  "auth_chain_a",
] as const;

export const SSR_OBFS = [
  "plain",
  "http_simple",
  "http_post",
  "tls1.2_ticket_auth",
  "tls1.2_ticket_fastauth",
] as const;

export const TRANSPORTS = {
  vmess: ["tcp", "ws", "httpupgrade", "grpc", "xhttp"] as const,
  vless: ["tcp", "ws", "httpupgrade", "grpc", "xhttp"] as const,
  trojan: ["tcp", "ws", "httpupgrade", "grpc", "xhttp"] as const,
  mieru: ["tcp", "udp"] as const,
  shadowsocksr: ["both", "tcp", "udp"] as const,
} as const;

export const SECURITY = {
  vmess: ["none", "tls", "reality"] as const,
  vless: ["none", "tls", "reality"] as const,
  trojan: ["none", "tls", "reality"] as const,
  hysteria2: ["tls"] as const,
  tuic: ["tls"] as const,
  anytls: ["tls", "reality"] as const,
  naive: ["tls"] as const,
} as const;

export const FLOWS = {
  vless: ["none", "xtls-rprx-vision"] as const,
} as const;

export const TUIC_UDP_RELAY_MODES = ["native", "quic"] as const;
export const TUIC_CONGESTION = ["bbr", "cubic", "new_reno"] as const;
export const NAIVE_CONGESTION = [
  "bbr",
  "bbr_standard",
  "bbr2",
  "bbr2_variant",
  "cubic",
  "reno",
] as const;
export const ALPN_VALUES = ["h2", "http/1.1", "h3"] as const;
export const XHTTP_MODES = [
  "auto",
  "packet-up",
  "stream-up",
  "stream-one",
] as const;
export const ENCRYPTION_TYPES = ["none", "mlkem768x25519plus"] as const;
export const ENCRYPTION_MODES = ["native", "xorpub", "random"] as const;
export const ENCRYPTION_RTT = ["0rtt", "1rtt"] as const;
export const FINGERPRINTS = [
  "chrome",
  "firefox",
  "safari",
  "ios",
  "android",
  "edge",
  "360",
  "qq",
] as const;

export const CERT_MODES = ["none", "file", "self", "http", "dns"] as const;

export const multiplexLevels = ["none", "h2mux", "smux", "yamux"] as const;

export const SNELL_VERSIONS = ["5", "6"] as const;
export const SNELL_OBFS = ["none", "http", "tls"] as const;
export const SNELL_V6_MODES = ["default", "unshaped", "unsafe-raw"] as const;

export function getLabel(value: string): string {
  const label = (LABELS as Record<string, string>)[value];
  return label ?? value.toUpperCase();
}
