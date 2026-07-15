import { XHTTP_MODES } from "./constants";
import type { ProtocolType } from "./types";

const base = {
  enable: false,
  port: null,
  ratio: 1,
};

const certificate = {
  sni: null,
  cert_mode: "none",
  cert_dns_provider: null,
  cert_dns_env: null,
};

const stream = {
  host: null,
  transport: "tcp",
  path: null,
  service_name: null,
  xhttp_mode: XHTTP_MODES[0],
  xhttp_extra: null,
  alpn: [],
  multiplex: "none",
};

const reality = {
  reality_server_addr: null,
  reality_server_port: null,
  reality_private_key: null,
  reality_public_key: null,
  reality_short_id: null,
};

export function getProtocolDefaultConfig(proto: ProtocolType) {
  switch (proto) {
    case "shadowsocks":
      return {
        ...base,
        ...certificate,
        type: "shadowsocks",
        cipher: "chacha20-ietf-poly1305",
        server_key: null,
        plugin: "none",
        plugin_opts: null,
        multiplex: "none",
        uot: false,
        uot_version: null,
      } as any;
    case "vmess":
      return {
        ...base,
        ...stream,
        ...certificate,
        ...reality,
        type: "vmess",
        security: "none",
      } as any;
    case "vless":
      return {
        ...base,
        ...stream,
        ...certificate,
        ...reality,
        type: "vless",
        security: "none",
        flow: "none",
        encryption: "none",
        encryption_mode: null,
        encryption_rtt: null,
        encryption_ticket: null,
        encryption_server_padding: null,
        encryption_private_key: null,
        encryption_client_padding: null,
        encryption_password: null,
      } as any;
    case "trojan":
      return {
        ...base,
        ...stream,
        ...certificate,
        ...reality,
        type: "trojan",
        security: "tls",
        cert_mode: "self",
      } as any;
    case "hysteria2":
      return {
        ...base,
        ...certificate,
        type: "hysteria2",
        security: "tls",
        obfs: "none",
        obfs_password: null,
        up_mbps: null,
        down_mbps: null,
        cert_mode: "self",
      } as any;
    case "tuic":
      return {
        ...base,
        ...certificate,
        type: "tuic",
        version: 5,
        security: "tls",
        alpn: [],
        congestion_controller: "bbr",
        reduce_rtt: false,
        heartbeat: 10,
        multiplex: "none",
        cert_mode: "self",
      } as any;
    case "anytls":
      return {
        ...base,
        ...certificate,
        ...reality,
        type: "anytls",
        security: "tls",
        padding_scheme: null,
        multiplex: "none",
        cert_mode: "self",
      } as any;
    case "naive":
      return {
        ...base,
        ...certificate,
        type: "naive",
        security: "tls",
        network: "tcp,udp",
        quic_congestion_control: "bbr",
        cert_mode: "self",
      } as any;
    case "mieru":
      return {
        ...base,
        type: "mieru",
        transport: "tcp",
        traffic_pattern: null,
        user_hint_is_mandatory: false,
      } as any;
    case "shadowsocksr":
      return {
        ...base,
        type: "shadowsocksr",
        transport: "both",
        cipher: "aes-256-cfb",
        server_key: null,
        protocol: "auth_aes128_sha1",
        protocol_param: null,
        obfs: "plain",
        obfs_param: null,
      } as any;
    case "snell":
      return {
        ...base,
        type: "snell",
        version: 5,
        mode: "default",
        server_key: null,
        obfs: "none",
        multiplex: "none",
      } as any;
    default:
      return {} as any;
  }
}
