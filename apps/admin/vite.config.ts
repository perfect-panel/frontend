import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { resolveWebVersion } from "../../src/build/resolve-web-version";

// Plugin to generate version metadata after build
function versionMetadataPlugin(): Plugin {
  return {
    name: "version-metadata",
    apply: "build",
    closeBundle() {
      const distDir = fileURLToPath(new URL("./dist", import.meta.url));
      const version = resolveWebVersion();

      mkdirSync(distDir, { recursive: true });
      writeFileSync(
        `${distDir}/version.json`,
        JSON.stringify(version, null, 2)
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const webVersion = resolveWebVersion();
  const allowedHosts = env.VITE_ALLOWED_HOSTS
    ? env.VITE_ALLOWED_HOSTS.split(",")
        .map((host) => host.trim())
        .filter(Boolean)
    : undefined;

  return {
    base: "./",
    define: {
      __APP_GIT_VERSION__: JSON.stringify(webVersion),
    },
    plugins: [
      devtools({ eventBusConfig: { port: 42_070 } }),
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
      }),
      viteReact(),
      tailwindcss(),
      versionMetadataPlugin(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      allowedHosts,
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL || "https://api.ppanel.dev",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      assetsDir: "static",
    },
  };
});
