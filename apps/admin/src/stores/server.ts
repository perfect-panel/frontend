import { filterServerList } from "@workspace/ui/services/admin/server";
import { create } from "zustand";
import { fetchAllPaginated } from "./pagination";

interface ServerState {
  // Data
  servers: API.Server[];

  // Loading states
  loading: boolean;
  loaded: boolean;

  // Actions
  fetchServers: () => Promise<void>;

  // Getters
  getServerById: (serverId: number) => API.Server | undefined;
  getServerName: (serverId?: number) => string;
  getServerAddress: (serverId?: number) => string;
  getServerEnabledProtocols: (serverId: number) => API.Protocol[];
  getProtocolPort: (serverId?: number, protocol?: string) => string;
  getAvailableProtocols: (
    serverId?: number
  ) => Array<{ protocol: string; port: number }>;
}

export const useServerStore = create<ServerState>((set, get) => ({
  // Initial state
  servers: [],
  loading: false,
  loaded: false,

  // Actions
  fetchServers: async () => {
    if (get().loading) return;

    set({ loading: true });
    try {
      const servers = await fetchAllPaginated(filterServerList);
      set({
        servers,
        loaded: true,
      });
    } catch (_error) {
      // Handle error silently
      set({ loaded: true });
    } finally {
      set({ loading: false });
    }
  },

  // Getters
  getServerById: (serverId: number) =>
    get().servers.find((s) => s.id === serverId),

  getServerName: (serverId?: number) => {
    if (!serverId) return "—";
    const server = get().servers.find((s) => s.id === serverId);
    return server?.name ?? `#${serverId}`;
  },

  getServerAddress: (serverId?: number) => {
    if (!serverId) return "—";
    const server = get().servers.find((s) => s.id === serverId);
    return server?.address ?? "—";
  },

  getServerEnabledProtocols: (serverId: number) => {
    const server = get().servers.find((s) => s.id === serverId);
    return server?.protocols?.filter((p) => p.enable) || [];
  },

  getProtocolPort: (serverId?: number, protocol?: string) => {
    if (!(serverId && protocol)) return "—";
    const enabledProtocols = get().getServerEnabledProtocols(serverId);
    const protocolConfig = enabledProtocols.find((p) => p.type === protocol);
    return protocolConfig?.port ? String(protocolConfig.port) : "—";
  },

  getAvailableProtocols: (serverId?: number) => {
    if (!serverId) return [];
    return get()
      .getServerEnabledProtocols(serverId)
      .map((p) => ({
        protocol: p.type,
        port: p.port,
      }));
  },
}));

export const useServer = () => {
  const store = useServerStore();

  // Auto-fetch servers
  if (!(store.loaded || store.loading)) {
    store.fetchServers();
  }

  return {
    servers: store.servers,
    loading: store.loading,
    loaded: store.loaded,
    fetchServers: store.fetchServers,
    getServerById: store.getServerById,
    getServerName: store.getServerName,
    getServerAddress: store.getServerAddress,
    getServerEnabledProtocols: store.getServerEnabledProtocols,
    getProtocolPort: store.getProtocolPort,
    getAvailableProtocols: store.getAvailableProtocols,
  };
};

export default useServerStore;
