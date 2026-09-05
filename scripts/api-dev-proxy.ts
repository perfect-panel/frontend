/** Forward versioned API routes to the backend during local development. */
export function createApiDevProxy(env: Record<string, string>) {
  const prefix = (env.VITE_API_PREFIX || "").replace(/\/+$/, "");
  const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return {
    [`^${escapedPrefix}/v[12](?:/|$)`]: {
      target: env.VITE_API_BASE_URL || "http://127.0.0.1:8080",
      changeOrigin: true,
      rewrite: (path: string) => path.slice(prefix.length),
    },
  };
}
