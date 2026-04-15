import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";

// Plugin to generate version.lock file after build
function versionLockPlugin(): Plugin {
  return {
    name: "version-lock",
    apply: "build",
    closeBundle() {
      const distDir = fileURLToPath(new URL("./dist", import.meta.url));
      const rootPkgPath = fileURLToPath(
        new URL("../../package.json", import.meta.url)
      );
      const rootPkg = JSON.parse(readFileSync(rootPkgPath, "utf-8"));
      const version = rootPkg.version || "0.0.0";
      writeFileSync(`${distDir}/version.lock`, version);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Dev server only: allow custom local domains such as Telepresence routes.
  // Keep this env-driven so each developer can opt in without baking machine-specific hosts into source.
  const allowedHosts = env.VITE_ALLOWED_HOSTS
    ? env.VITE_ALLOWED_HOSTS.split(",")
        .map((host) => host.trim())
        .filter(Boolean)
    : undefined;
  const devtoolsPort = Number(env.VITE_DEVTOOLS_PORT || "42069");

  return {
    base: "./",
    plugins: [
      devtools({ eventBusConfig: { port: devtoolsPort } }),
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
      }),
      viteReact(),
      tailwindcss(),
      versionLockPlugin(),
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
