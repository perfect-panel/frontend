import { XHTTP_MODES } from "./constants";
import type { ProtocolType } from "./types";

export function getProtocolDefaultConfig(proto: ProtocolType) {
  switch (proto) {
    case "shadowsocks":
      return {
        type: "shadowsocks",
        enable: false,
        port: null,
        cipher: "chacha20-ietf-poly1305",
        server_key: null,
        obfs: "none",
        obfs_host: null,
        obfs_path: null,
        sni: null,
        allow_insecure: null,
        cert_mode: "none",
        cert_dns_provider: null,
        cert_dns_env: null,
        ratio: 1,
      } as any;
    case "vmess":
      return {
        type: "vmess",
        enable: false,
        host: null,
        port: null,
        transport: "tcp",
        security: "none",
        path: null,
        service_name: null,
        sni: null,
        ech_enable: null,
        ech_server_name: null,
        allow_insecure: null,
        fingerprint: "chrome",
        cert_mode: "none",
        cert_dns_provider: null,
        cert_dns_env: null,
        ratio: 1,
      } as any;
    case "vless":
      return {
        type: "vless",
        enable: false,
        host: null,
        port: null,
        transport: "tcp",
        security: "none",
        flow: "none",
        path: null,
        service_name: null,
        sni: null,
        ech_enable: null,
        ech_server_name: null,
        allow_insecure: null,
        fingerprint: "chrome",
        reality_server_addr: null,
        reality_server_port: null,
        reality_private_key: null,
        reality_public_key: null,
        reality_short_id: null,
        xhttp_mode: XHTTP_MODES[0], // 'auto'
        xhttp_extra: null,
        encryption: "none",
        encryption_mode: null,
        encryption_rtt: null,
        encryption_ticket: null,
        encryption_server_padding: null,
        encryption_private_key: null,
        encryption_client_padding: null,
        encryption_password: null,
        cert_mode: "none",
        cert_dns_provider: null,
        cert_dns_env: null,
        ratio: 1,
      } as any;
    case "trojan":
      return {
        type: "trojan",
        enable: false,
        host: null,
        port: null,
        transport: "tcp",
        security: "tls",
        path: null,
        service_name: null,
        sni: null,
        ech_enable: null,
        ech_server_name: null,
        allow_insecure: null,
        fingerprint: "chrome",
        cert_mode: "none",
        cert_dns_provider: null,
        cert_dns_env: null,
        ratio: 1,
      } as any;
    case "hysteria":
      return {
        type: "hysteria",
        enable: false,
        port: null,
        hop_ports: null,
        hop_interval: null,
        obfs: "none",
        obfs_password: null,
        security: "tls",
        up_mbps: null,
        down_mbps: null,
        sni: null,
        ech_enable: null,
        ech_server_name: null,
        allow_insecure: null,
        fingerprint: "chrome",
        cert_mode: "none",
        cert_dns_provider: null,
        cert_dns_env: null,
        ratio: 1,
      } as any;
    case "tuic":
      return {
        type: "tuic",
        enable: false,
        port: null,
        disable_sni: false,
        reduce_rtt: false,
        udp_relay_mode: "native",
        congestion_controller: "bbr",
        security: "tls",
        sni: null,
        ech_enable: null,
        ech_server_name: null,
        allow_insecure: false,
        fingerprint: "chrome",
        cert_mode: "none",
        cert_dns_provider: null,
        cert_dns_env: null,
        ratio: 1,
      } as any;
    case "socks":
      return {
        type: "socks",
        enable: false,
        port: null,
        ratio: 1,
      } as any;
    case "naive":
      return {
        type: "naive",
        enable: false,
        port: null,
        security: "none",
        sni: null,
        ech_enable: null,
        ech_server_name: null,
        allow_insecure: null,
        fingerprint: "chrome",
        cert_mode: "none",
        cert_dns_provider: null,
        cert_dns_env: null,
        ratio: 1,
      } as any;
    case "http":
      return {
        type: "http",
        enable: false,
        port: null,
        security: "none",
        sni: null,
        ech_enable: null,
        ech_server_name: null,
        allow_insecure: null,
        fingerprint: "chrome",
        cert_mode: "none",
        cert_dns_provider: null,
        cert_dns_env: null,
        ratio: 1,
      } as any;
    case "mieru":
      return {
        type: "mieru",
        enable: false,
        port: null,
        multiplex: "none",
        transport: "tcp",
      } as any;
    case "anytls":
      return {
        type: "anytls",
        enable: false,
        port: null,
        security: "tls",
        padding_scheme: null,
        sni: null,
        ech_enable: null,
        ech_server_name: null,
        allow_insecure: false,
        fingerprint: "chrome",
        cert_mode: "none",
        cert_dns_provider: null,
        cert_dns_env: null,
        reality_server_addr: null,
        reality_server_port: null,
        reality_private_key: null,
        reality_public_key: null,
        reality_short_id: null,
        ratio: 1,
      } as any;
    default:
      return {} as any;
  }
}
