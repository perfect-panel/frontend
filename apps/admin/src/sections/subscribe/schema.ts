export const subscribeSchema = {
  SiteName: { type: "string", description: "Site name" },
  SubscribeName: { type: "string", description: "Subscribe name" },
  Proxies: {
    type: "array",
    description: "Array of proxy nodes",
    items: {
      type: "object",
      properties: {
        Name: { type: "string", description: "Node name" },
        Server: { type: "string", description: "Server host" },
        Port: { type: "number", description: "Server port" },
        Type: { type: "string", description: "Proxy type" },
        Version: {
          type: "number",
          description: "Protocol version; Nowhere uses NW3 (3)",
        },
        Network: {
          type: "string",
          description: "Listening network; Nowhere uses mix, tcp or udp",
        },
        ALPN: {
          type: "array",
          items: { type: "string" },
          description: "TLS ALPN; Nowhere uses [nw3]",
        },
        Obfs: {
          type: "string",
          description:
            "Obfuscation; Nowhere uses morph (morph=1) or none (morph=0)",
        },
        Tags: {
          type: "array",
          description: "Node tags",
          items: { type: "string" },
        },
        Sort: { type: "number", description: "Node sort order" },
        // Security Options
        Security: {
          type: "string",
          description: "Security protocol",
        },
        SNI: {
          type: "string",
          description: "Server Name Indication for TLS",
        },
        AllowInsecure: {
          type: "boolean",
          description:
            "Allow insecure connections (skip certificate verification)",
        },
        Fingerprint: {
          type: "string",
          description: "Client fingerprint for TLS connections",
        },
        RealityServerAddr: {
          type: "string",
          description: "Reality server address",
        },
        RealityServerPort: {
          type: "number",
          description: "Reality server port",
        },
        RealityPrivateKey: {
          type: "string",
          description: "Reality private key for authentication",
        },
        RealityPublicKey: {
          type: "string",
          description: "Reality public key for authentication",
        },
        RealityShortId: {
          type: "string",
          description: "Reality short ID for authentication",
        },
        // Transport Options
        Transport: {
          type: "string",
          description: "Transport protocol (e.g., ws, http, grpc)",
        },
        Host: {
          type: "string",
          description: "For WebSocket/HTTP/HTTPS",
        },
        Path: { type: "string", description: "For HTTP/HTTPS" },
        ServiceName: {
          type: "string",
          description: "For gRPC",
        },
        // Shadowsocks Options
        Method: { type: "string", description: "Encryption method" },
        ServerKey: {
          type: "string",
          description: "For Shadowsocks 2022",
        },
        // Vmess/Vless/Trojan Options
        Flow: {
          type: "string",
          description: "Flow for Vmess/Vless/Trojan",
        },
        // Hysteria2 Options
        HopPorts: {
          type: "string",
          description: "Comma-separated list of hop ports",
        },
        HopInterval: {
          type: "number",
          description: "Interval for hop ports in seconds",
        },
        ObfsPassword: {
          type: "string",
          description: "Obfuscation password for Hysteria2",
        },
        // Tuic Options
        DisableSNI: {
          type: "boolean",
          description: "Disable SNI",
        },
        ReduceRtt: {
          type: "boolean",
          description: "Reduce RTT",
        },
        UDPRelayMode: {
          type: "string",
          description: 'UDP relay mode (e.g., "full", "partial")',
        },
        CongestionController: {
          type: "string",
          description: 'Congestion controller (e.g., "cubic", "bbr")',
        },
        // Hysteria2 additional options
        UpMbps: {
          type: "number",
          description: "Upload bandwidth in Mbps",
        },
        DownMbps: {
          type: "number",
          description: "Download bandwidth in Mbps",
        },
        // VLESS encryption options
        Encryption: {
          type: "string",
          description: "Encryption type for VLESS",
        },
        EncryptionMode: {
          type: "string",
          description: 'Encryption mode (e.g., "native", "xorpub", "random")',
        },
        EncryptionRtt: {
          type: "string",
          description: 'Encryption RTT (e.g., "0rtt", "1rtt")',
        },
        EncryptionTicket: {
          type: "string",
          description: "Encryption ticket",
        },
        EncryptionServerPadding: {
          type: "string",
          description: "Server padding for encryption",
        },
        EncryptionClientPadding: {
          type: "string",
          description: "Client padding for encryption",
        },
        EncryptionPassword: {
          type: "string",
          description: "Encryption password",
        },
        EncryptionPrivateKey: {
          type: "string",
          description: "Private key for encryption",
        },
        // XHTTP options
        XhttpMode: {
          type: "string",
          description:
            'XHTTP mode (e.g., "auto", "packet-up", "stream-up", "stream-one")',
        },
        XhttpExtra: {
          type: "string",
          description: "XHTTP extra parameters",
        },
        // Shadowsocks obfs options (combined with Hysteria2 obfs)
        ObfsHost: {
          type: "string",
          description: "Obfuscation host",
        },
        ObfsPath: {
          type: "string",
          description: "Obfuscation path",
        },
        // Shadowsocks cipher
        Cipher: {
          type: "string",
          description: "Shadowsocks cipher method",
        },
        // AnyTLS options
        PaddingScheme: {
          type: "string",
          description: "Padding scheme for AnyTLS",
        },
        // Mieru options
        Multiplex: {
          type: "string",
          description:
            'Multiplex level (e.g., "none", "low", "middle", "high")',
        },
        // General protocol field
        Enable: {
          type: "boolean",
          description: "Whether this protocol is enabled",
        },
        // UUID for vmess/vless
        UUID: {
          type: "string",
          description: "User UUID for vmess/vless protocols",
        },
        // Alternative ID for vmess
        AlterId: {
          type: "number",
          description: "Alternative ID for vmess (deprecated)",
        },
        // Password for trojan/tuic
        Password: {
          type: "string",
          description: "Password for authentication",
        },
      },
    },
  },
  UserInfo: {
    type: "object",
    description: "User information",
    properties: {
      Password: {
        type: "string",
        description:
          "Original subscription password for protocols other than Nowhere",
      },
      NowhereKey: {
        type: "string",
        description:
          "NW3 shared key: 32 lowercase hexadecimal characters; use .UserInfo.NowhereKey for Nowhere only",
      },
      ExpiredAt: { type: "string", description: "Expiration date" },
      Download: { type: "number", description: "Downloaded bytes" },
      Upload: { type: "number", description: "Uploaded bytes" },
      Traffic: { type: "number", description: "Total traffic bytes" },
      SubscribeURL: {
        type: "string",
        description: "Subscription URL",
      },
    },
  },
};
