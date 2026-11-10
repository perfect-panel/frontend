import { protocols } from "./constants";
import { getProtocolDefaultConfig } from "./defaults";
import type { ProtocolType } from "./types";

type ProtocolValue = Record<string, any>;

function normalizeMultiplexValue(
  protocolType: ProtocolType,
  value: unknown,
  fallback: unknown
) {
  const raw = String(value || fallback || "").trim();
  if (protocolType !== "mieru") {
    return raw || "none";
  }

  switch (raw.toUpperCase()) {
    case "NONE":
    case "OFF":
    case "MULTIPLEXING_OFF":
      return "MULTIPLEXING_OFF";
    case "":
    case "LOW":
    case "MULTIPLEXING_LOW":
      return "MULTIPLEXING_LOW";
    case "MIDDLE":
    case "MEDIUM":
    case "MULTIPLEXING_MIDDLE":
      return "MULTIPLEXING_MIDDLE";
    case "HIGH":
    case "MULTIPLEXING_HIGH":
      return "MULTIPLEXING_HIGH";
    default:
      return raw;
  }
}

function normalizeNowhereNetwork(value: unknown) {
  const network = String(value || "mix")
    .trim()
    .toLowerCase()
    .replaceAll(" ", "");
  if (
    [
      "mix",
      "mixed",
      "both",
      "tcp,udp",
      "udp,tcp",
      "tcp+udp",
      "udp+tcp",
    ].includes(network)
  )
    return "mix";
  return network === "quic" ? "udp" : network;
}

export function getProtocolFormValues(
  initialProtocols: readonly ProtocolValue[] = []
) {
  return protocols.map((type) => {
    const existingProtocol = initialProtocols.find(
      (protocol) =>
        protocol.type === type ||
        (type === "hysteria2" && protocol.type === "hysteria")
    );
    const defaultConfig = getProtocolDefaultConfig(type);
    if (!existingProtocol) return defaultConfig;

    const merged = {
      ...defaultConfig,
      ...existingProtocol,
      type,
      transport:
        existingProtocol.transport === "websocket"
          ? "ws"
          : existingProtocol.transport,
      plugin: existingProtocol.plugin || "none",
      multiplex: normalizeMultiplexValue(
        type,
        existingProtocol.multiplex,
        defaultConfig.multiplex
      ),
    };
    if (type === "nowhere") {
      const version = Number(existingProtocol.version ?? 0);
      merged.version = version === 0 || version === 1 ? 3 : version;
      if (version === 0 || version === 1 || !existingProtocol.alpn?.length)
        merged.alpn = ["nw3"];
      merged.obfs =
        String(existingProtocol.obfs || "morph")
          .trim()
          .toLowerCase() || "morph";
      merged.network = normalizeNowhereNetwork(existingProtocol.network);
    }
    // Only TLS-only protocols are coerced. REALITY settings remain intact.
    if (["hysteria2", "tuic", "naive", "nowhere"].includes(type)) {
      merged.security = "tls";
      if (!merged.cert_mode || merged.cert_mode === "none") {
        merged.cert_mode = "self";
      }
    }
    if (
      ["anytls", "trojan"].includes(type) &&
      !["tls", "reality"].includes(String(merged.security))
    ) {
      merged.security = "tls";
      merged.cert_mode = "self";
    }
    if (merged.security === "reality") {
      // Never overwrite a stored transport: REALITY rides any stream
      // transport on vless, and rewriting it here made every edit — even
      // a rename — silently destroy an xhttp node's configuration.
      if (!merged.transport) {
        merged.transport = "tcp";
      }
      merged.cert_mode = "none";
    }
    return merged;
  });
}

// An older panel may not expose every protocol the backend already supports.
// Keep those stored entries out of the editable schema and retain them on save.
export function getUneditableProtocols(
  existing: readonly ProtocolValue[] = []
) {
  const editable = new Set<string>(protocols);
  return existing.filter(
    (protocol) =>
      !editable.has(protocol.type === "hysteria" ? "hysteria2" : protocol.type)
  );
}

export function preserveUneditableProtocols(
  edited: ProtocolValue[],
  existing: readonly ProtocolValue[] = []
) {
  return [...edited, ...getUneditableProtocols(existing)];
}
