import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  generateMLKEM768KeyPair,
  generatePassword,
  generateRealityKeyPair,
  generateRealityShortId,
} from "../generate";
import {
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
  SNELL_VERSIONS,
  SS_CIPHERS,
  SSR_CIPHERS,
  SSR_OBFS,
  SSR_PROTOCOLS,
  TRANSPORTS,
  TUIC_CONGESTION,
  XHTTP_MODES,
} from "./constants";
import type { FieldConfig } from "./types";

type Condition = (protocol: Record<string, any>) => boolean;

function pluginOptions(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  if (typeof value !== "string" || value.trim() === "") return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

function shadowsocksPluginUsesTLS(protocol: Record<string, any>) {
  if (!["v2ray-plugin", "gost-plugin"].includes(protocol.plugin)) return false;
  if (typeof protocol.plugin_opts === "string") {
    return protocol.plugin_opts.split(";").some((item: string) => {
      const [key, value = "true"] = item.split("=", 2);
      return key.trim() === "tls" && value.trim() !== "false";
    });
  }
  const value = pluginOptions(protocol.plugin_opts).tls;
  return value === true || value === "true";
}

export function useProtocolFields() {
  const { t } = useTranslation("servers");

  return useMemo<Record<string, FieldConfig[]>>(() => {
    const ratio = (): FieldConfig => ({
      name: "ratio",
      type: "number",
      label: t("traffic_ratio", "Ratio"),
      min: 0,
      step: 0.01,
      defaultValue: 1,
      group: "basic",
    });
    const port = (): FieldConfig => ({
      name: "port",
      type: "number",
      label: t("port", "Port"),
      required: true,
      min: 1,
      max: 65_535,
      placeholder: "1-65535",
      group: "basic",
    });
    const multiplex = (): FieldConfig => ({
      name: "multiplex",
      type: "select",
      label: t("multiplex", "Multiplex"),
      options: multiplexLevels,
      defaultValue: "none",
      group: "transport",
    });
    const certificateFields = (condition: Condition): FieldConfig[] => [
      {
        name: "sni",
        type: "input",
        label: t("security_sni", "SNI"),
        required: true,
        placeholder: "node.example.com",
        group: "security",
        condition,
      },
      {
        name: "cert_mode",
        type: "select",
        label: t("cert_mode", "Certificate Mode"),
        required: true,
        options: CERT_MODES.filter((mode) => mode !== "none"),
        defaultValue: "self",
        group: "security",
        condition,
      },
      {
        name: "cert_dns_provider",
        type: "input",
        label: t("cert_dns_provider", "DNS Provider"),
        placeholder: "e.g. cloudflare, aliyun",
        group: "security",
        condition: (protocol) =>
          condition(protocol) && protocol.cert_mode === "dns",
      },
      {
        name: "cert_dns_env",
        type: "textarea",
        label: t("cert_dns_env", "DNS Environment Variables"),
        placeholder:
          "CF_DNS_API_TOKEN=token\nALI_ACCESS_KEY_ID=key\nALI_ACCESS_KEY_SECRET=secret",
        group: "security",
        condition: (protocol) =>
          condition(protocol) && protocol.cert_mode === "dns",
      },
    ];
    const streamFields = (
      transports: readonly string[]
    ): FieldConfig[] => [
      {
        name: "transport",
        type: "select",
        label: t("transport", "Transport"),
        required: true,
        options: transports,
        defaultValue: "tcp",
        group: "transport",
      },
      {
        name: "host",
        type: "input",
        label: t("host", "Host"),
        placeholder: "www.example.com",
        group: "transport",
        condition: (protocol) =>
          ["ws", "websocket", "httpupgrade", "xhttp"].includes(
            protocol.transport
          ),
      },
      {
        name: "path",
        type: "input",
        label: t("path", "Path"),
        placeholder: "/proxy",
        group: "transport",
        condition: (protocol) =>
          ["ws", "websocket", "httpupgrade", "xhttp"].includes(
            protocol.transport
          ),
      },
      {
        name: "service_name",
        type: "input",
        label: t("service_name", "Service Name"),
        required: true,
        group: "transport",
        condition: (protocol) => protocol.transport === "grpc",
      },
      {
        name: "xhttp_mode",
        type: "select",
        label: t("xhttp_mode", "XHTTP Mode"),
        options: XHTTP_MODES,
        defaultValue: "auto",
        group: "transport",
        condition: (protocol) => protocol.transport === "xhttp",
      },
      {
        name: "xhttp_extra",
        type: "textarea",
        label: t("xhttp_extra", "XHTTP Extra"),
        placeholder: "{}",
        group: "transport",
        condition: (protocol) => protocol.transport === "xhttp",
      },
      {
        name: "alpn",
        type: "string-list",
        label: t("alpn", "ALPN"),
        placeholder: "h2\nhttp/1.1",
        group: "transport",
        condition: (protocol) =>
          protocol.transport === "xhttp" && protocol.security === "tls",
      },
      multiplex(),
    ];
    const realityFields = (): FieldConfig[] => [
      {
        name: "sni",
        type: "input",
        label: t("security_sni", "SNI"),
        required: true,
        placeholder: "www.example.com",
        group: "reality",
        condition: (protocol) => protocol.security === "reality",
      },
      {
        name: "reality_server_addr",
        type: "input",
        label: t("security_server_address", "Reality Server Address"),
        required: true,
        placeholder: t(
          "security_server_address_placeholder",
          "e.g. 1.2.3.4 or domain"
        ),
        group: "reality",
        condition: (protocol) => protocol.security === "reality",
      },
      {
        name: "reality_server_port",
        type: "number",
        label: t("security_server_port", "Reality Server Port"),
        required: true,
        min: 1,
        max: 65_535,
        placeholder: "443",
        group: "reality",
        condition: (protocol) => protocol.security === "reality",
      },
      {
        name: "reality_private_key",
        type: "input",
        label: t("security_private_key", "Reality Private Key"),
        required: true,
        group: "reality",
        generate: {
          function: generateRealityKeyPair,
          updateFields: {
            reality_private_key: "privateKey",
            reality_public_key: "publicKey",
          },
        },
        condition: (protocol) => protocol.security === "reality",
      },
      {
        name: "reality_public_key",
        type: "input",
        label: t("security_public_key", "Reality Public Key"),
        required: true,
        group: "reality",
        condition: (protocol) => protocol.security === "reality",
      },
      {
        name: "reality_short_id",
        type: "input",
        label: t("security_short_id", "Reality Short ID"),
        required: true,
        group: "reality",
        generate: { function: generateRealityShortId },
        condition: (protocol) => protocol.security === "reality",
      },
    ];

    const streamSecurity = (values: readonly string[]): FieldConfig => ({
      name: "security",
      type: "select",
      label: t("security", "Security"),
      options: values,
      defaultValue: "none",
      group: "security",
    });

    return {
      shadowsocks: [
        ratio(),
        port(),
        {
          name: "cipher",
          type: "select",
          label: t("cipher", "Encryption Algorithm"),
          options: SS_CIPHERS,
          defaultValue: "chacha20-ietf-poly1305",
          required: true,
          group: "basic",
        },
        {
          name: "server_key",
          type: "input",
          label: t("server_key", "Server Key"),
          generate: { function: () => generatePassword(32) },
          group: "basic",
          condition: (protocol) => String(protocol.cipher).startsWith("2022-"),
        },
        {
          name: "uot",
          type: "switch",
          label: t("uot", "UDP over TCP (UoT)"),
          defaultValue: false,
          group: "basic",
        },
        {
          name: "uot_version",
          type: "select",
          label: t("uot_version", "UoT Version"),
          options: ["1", "2"],
          defaultValue: "2",
          group: "basic",
          condition: (protocol) => protocol.uot === true,
        },
        multiplex(),
        {
          name: "plugin",
          type: "select",
          label: t("plugin", "Plugin"),
          options: SHADOWSOCKS_PLUGINS,
          defaultValue: "none",
          group: "obfs",
        },
        {
          name: "plugin_opts",
          type: "json",
          label: t("plugin_opts", "Plugin Options"),
          required: true,
          placeholder: '{\n  "mode": "websocket",\n  "path": "/ws"\n}',
          group: "obfs",
          condition: (protocol) =>
            Boolean(protocol.plugin && protocol.plugin !== "none"),
        },
        ...certificateFields(shadowsocksPluginUsesTLS),
      ],
      vmess: [
        ratio(),
        port(),
        ...streamFields(TRANSPORTS.vmess),
        streamSecurity(SECURITY.vmess),
        ...certificateFields((protocol) => protocol.security === "tls"),
        ...realityFields(),
      ],
      vless: [
        ratio(),
        port(),
        ...streamFields(TRANSPORTS.vless),
        {
          name: "flow",
          type: "select",
          label: t("flow", "Flow"),
          options: FLOWS.vless,
          defaultValue: "none",
          group: "transport",
          condition: (protocol) =>
            protocol.transport === "tcp" &&
            ["tls", "reality"].includes(protocol.security),
        },
        streamSecurity(SECURITY.vless),
        ...certificateFields((protocol) => protocol.security === "tls"),
        ...realityFields(),
        {
          name: "encryption",
          type: "select",
          label: t("encryption", "Encryption"),
          options: ENCRYPTION_TYPES,
          defaultValue: "none",
          group: "encryption",
        },
        {
          name: "encryption_mode",
          type: "select",
          label: t("encryption_mode", "Mode"),
          options: ENCRYPTION_MODES,
          defaultValue: "native",
          required: true,
          group: "encryption",
          condition: (protocol) =>
            protocol.encryption === "mlkem768x25519plus",
        },
        {
          name: "encryption_ticket",
          type: "input",
          label: t("encryption_ticket", "Ticket Lifetime"),
          placeholder: "600s",
          required: true,
          group: "encryption",
          condition: (protocol) =>
            protocol.encryption === "mlkem768x25519plus",
        },
        {
          name: "encryption_server_padding",
          type: "input",
          label: t("encryption_server_padding", "Server Padding"),
          placeholder: "100-111-1111.75-0-111.50-0-3333",
          group: "encryption",
          condition: (protocol) =>
            protocol.encryption === "mlkem768x25519plus",
        },
        {
          name: "encryption_private_key",
          type: "input",
          label: t("encryption_private_key", "Private Key"),
          required: true,
          group: "encryption",
          generate: {
            functions: [
              {
                label: t(
                  "generate_standard_encryption_key",
                  "Generate Standard Key"
                ),
                function: generateRealityKeyPair,
              },
              {
                label: t(
                  "generate_quantum_resistant_key",
                  "Generate Quantum-Resistant Key"
                ),
                function: generateMLKEM768KeyPair,
              },
            ],
            updateFields: {
              encryption_private_key: "privateKey",
              encryption_password: "publicKey",
            },
          },
          condition: (protocol) =>
            protocol.encryption === "mlkem768x25519plus",
        },
        {
          name: "encryption_rtt",
          type: "select",
          label: t("encryption_rtt", "Client RTT"),
          options: ENCRYPTION_RTT,
          defaultValue: "0rtt",
          group: "encryption",
          condition: (protocol) =>
            protocol.encryption === "mlkem768x25519plus",
        },
        {
          name: "encryption_client_padding",
          type: "input",
          label: t("encryption_client_padding", "Client Padding"),
          group: "encryption",
          condition: (protocol) =>
            protocol.encryption === "mlkem768x25519plus",
        },
        {
          name: "encryption_password",
          type: "input",
          label: t("encryption_password", "Client Password"),
          group: "encryption",
          condition: (protocol) =>
            protocol.encryption === "mlkem768x25519plus",
        },
      ],
      trojan: [
        ratio(),
        port(),
        ...streamFields(TRANSPORTS.trojan),
        streamSecurity(SECURITY.trojan),
        ...certificateFields((protocol) => protocol.security === "tls"),
        ...realityFields(),
      ],
      hysteria2: [
        ratio(),
        port(),
        {
          name: "up_mbps",
          type: "number",
          label: t("up_mbps", "Upload Bandwidth"),
          min: 0,
          suffix: "Mbps",
          group: "basic",
        },
        {
          name: "down_mbps",
          type: "number",
          label: t("down_mbps", "Download Bandwidth"),
          min: 0,
          suffix: "Mbps",
          group: "basic",
        },
        {
          name: "obfs",
          type: "select",
          label: t("obfs", "Obfuscation"),
          options: ["none", "salamander"],
          defaultValue: "none",
          group: "obfs",
        },
        {
          name: "obfs_password",
          type: "input",
          label: t("obfs_password", "Obfuscation Password"),
          required: true,
          generate: { function: () => generatePassword(16) },
          group: "obfs",
          condition: (protocol) => protocol.obfs === "salamander",
        },
        streamSecurity(SECURITY.hysteria2),
        ...certificateFields(() => true),
      ],
      tuic: [
        ratio(),
        port(),
        {
          name: "version",
          type: "select",
          label: t("version", "Version"),
          options: ["5"],
          defaultValue: "5",
          group: "basic",
        },
        {
          name: "congestion_controller",
          type: "select",
          label: t("congestion_controller", "Congestion Controller"),
          options: TUIC_CONGESTION,
          defaultValue: "bbr",
          group: "basic",
        },
        {
          name: "reduce_rtt",
          type: "switch",
          label: t("reduce_rtt", "Enable 0-RTT"),
          group: "basic",
        },
        {
          name: "heartbeat",
          type: "number",
          label: t("heartbeat", "Heartbeat"),
          min: 0,
          suffix: "S",
          group: "basic",
        },
        {
          name: "alpn",
          type: "string-list",
          label: t("alpn", "ALPN"),
          placeholder: "h3",
          group: "transport",
        },
        multiplex(),
        streamSecurity(SECURITY.tuic),
        ...certificateFields(() => true),
      ],
      anytls: [
        ratio(),
        port(),
        {
          name: "padding_scheme",
          type: "textarea",
          label: t("padding_scheme", "Padding Scheme"),
          placeholder: t(
            "padding_scheme_placeholder",
            "One padding rule per line, format: stop=8, 0=30-30"
          ),
          group: "basic",
        },
        multiplex(),
        streamSecurity(SECURITY.anytls),
        ...certificateFields((protocol) => protocol.security === "tls"),
        ...realityFields(),
      ],
      naive: [
        ratio(),
        port(),
        {
          name: "network",
          type: "select",
          label: t("network", "Network"),
          options: ["tcp,udp", "tcp", "udp"],
          defaultValue: "tcp,udp",
          group: "basic",
        },
        {
          name: "quic_congestion_control",
          type: "select",
          label: t("quic_congestion_control", "QUIC Congestion Control"),
          options: NAIVE_CONGESTION,
          defaultValue: "bbr",
          group: "basic",
        },
        streamSecurity(SECURITY.naive),
        ...certificateFields(() => true),
      ],
      mieru: [
        ratio(),
        port(),
        {
          name: "transport",
          type: "select",
          label: t("transport", "Transport"),
          options: TRANSPORTS.mieru,
          defaultValue: "tcp",
          group: "transport",
        },
        {
          name: "traffic_pattern",
          type: "textarea",
          label: t("traffic_pattern", "Traffic Pattern"),
          placeholder: "default",
          group: "basic",
        },
        {
          name: "user_hint_is_mandatory",
          type: "switch",
          label: t("user_hint_is_mandatory", "Require User Hint"),
          group: "basic",
        },
      ],
      shadowsocksr: [
        ratio(),
        port(),
        {
          name: "transport",
          type: "select",
          label: t("network", "Network"),
          options: TRANSPORTS.shadowsocksr,
          defaultValue: "both",
          group: "basic",
        },
        {
          name: "cipher",
          type: "select",
          label: t("cipher", "Encryption Algorithm"),
          options: SSR_CIPHERS,
          defaultValue: "aes-256-cfb",
          required: true,
          group: "basic",
        },
        {
          name: "server_key",
          type: "input",
          label: t("server_key", "Server Key"),
          required: true,
          generate: { function: () => generatePassword(32) },
          group: "basic",
        },
        {
          name: "protocol",
          type: "select",
          label: t("ssr_protocol", "SSR Protocol"),
          options: SSR_PROTOCOLS,
          defaultValue: "auth_aes128_sha1",
          required: true,
          group: "basic",
        },
        {
          name: "protocol_param",
          type: "input",
          label: t("protocol_param", "Protocol Param"),
          group: "basic",
        },
        {
          name: "obfs",
          type: "select",
          label: t("obfs", "Obfuscation"),
          options: SSR_OBFS,
          defaultValue: "plain",
          required: true,
          group: "obfs",
        },
        {
          name: "obfs_param",
          type: "input",
          label: t("obfs_param", "Obfuscation Param"),
          group: "obfs",
        },
      ],
      snell: [
        ratio(),
        port(),
        {
          name: "version",
          type: "select",
          label: t("version", "Version"),
          options: SNELL_VERSIONS,
          defaultValue: "5",
          required: true,
          group: "basic",
        },
        {
          name: "server_key",
          type: "input",
          label: t("server_key", "Pre-shared Key"),
          required: true,
          generate: { function: () => generatePassword(24) },
          group: "basic",
        },
        {
          name: "obfs",
          type: "select",
          label: t("obfs", "Obfuscation"),
          options: SNELL_OBFS,
          defaultValue: "none",
          group: "obfs",
          condition: (protocol) => Number(protocol.version) === 5,
        },
        {
          name: "mode",
          type: "select",
          label: t("mode", "Mode"),
          options: SNELL_V6_MODES,
          defaultValue: "default",
          group: "basic",
          condition: (protocol) => Number(protocol.version) === 6,
        },
        multiplex(),
      ],
    };
  }, [t]);
}
