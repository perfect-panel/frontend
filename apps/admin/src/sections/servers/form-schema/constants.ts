export const protocols = [
  "shadowsocks",
  "vmess",
  "vless",
  "trojan",
  "hysteria",
  "tuic",
  "anytls",
  "socks",
  "naive",
  "http",
  "mieru",
] as const;

// Global label map for display; fallback to raw value if missing
export const LABELS = {
  // protocols (display names — "hysteria" is actually Hysteria 2)
  shadowsocks: "Shadowsocks",
  vmess: "VMess",
  vless: "VLESS",
  trojan: "Trojan",
  hysteria: "Hysteria 2",
  tuic: "TUIC",
  anytls: "AnyTLS",
  socks: "SOCKS",
  naive: "Naive",
  http: "HTTP",
  mieru: "Mieru",
  // transport
  tcp: "TCP",
  udp: "UDP",
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
} as const;

// Flat arrays for enum-like sets
export const SS_CIPHERS = [
  "aes-128-gcm",
  "aes-192-gcm",
  "aes-256-gcm",
  "chacha20-ietf-poly1305",
  "2022-blake3-aes-128-gcm",
  "2022-blake3-aes-256-gcm",
  "2022-blake3-chacha20-poly1305",
] as const;

export const TRANSPORTS = {
  vmess: ["tcp", "websocket", "grpc"] as const,
  vless: ["tcp", "websocket", "grpc", "mkcp", "httpupgrade", "xhttp"] as const,
  trojan: ["tcp", "websocket", "grpc"] as const,
  mieru: ["tcp", "udp"] as const,
} as const;

export const SECURITY = {
  shadowsocks: ["none", "http", "tls"] as const,
  vmess: ["none", "tls"] as const,
  vless: ["none", "tls", "reality"] as const,
  trojan: ["tls"] as const,
  hysteria: ["tls"] as const,
  tuic: ["tls"] as const,
  anytls: ["none", "tls", "reality"] as const,
  naive: ["none", "tls"] as const,
  http: ["none", "tls"] as const,
} as const;

export const FLOWS = {
  vless: ["none", "xtls-rprx-vision"] as const,
} as const;

export const TUIC_UDP_RELAY_MODES = ["native", "quic"] as const;
export const TUIC_CONGESTION = ["bbr", "cubic", "new_reno"] as const;
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

export const CERT_MODES = ["none", "http", "dns", "self"] as const;

export const multiplexLevels = ["none", "low", "middle", "high"] as const;

export function getLabel(value: string): string {
  const label = (LABELS as Record<string, string>)[value];
  return label ?? value.toUpperCase();
}
