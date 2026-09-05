import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { createApiDevProxy } from "../../scripts/api-dev-proxy";
import {
  exactRouteI18nNamespaces,
  fallbackLng,
  routeI18nNamespaces,
  sharedI18nNamespaces,
  supportedLngs,
} from "./src/config/i18n";

// Pre-paint i18n bootstrap injected into index.html. Corrects the document
// lang before first paint (the static lang="en-US" otherwise invites browser
// page translation for non-English users, which rewrites DOM text nodes and
// crashes React — issue #139) and preloads translation files in parallel with
// the JS bundle: i18next only starts fetching them after the entry chunk has
// executed, and first render blocks on them, so warming the fetch cache from
// index.html removes a full network waterfall from the critical path.
function localePreloadPlugin(): Plugin {
  const script = `(() => {
  try {
    const supported = ${JSON.stringify(supportedLngs)};
    const fallback = ${JSON.stringify(fallbackLng)};
    const sharedNamespaces = ${JSON.stringify(sharedI18nNamespaces)};
    const routeNamespaces = ${JSON.stringify(routeI18nNamespaces)};
    const exactRouteNamespaces = ${JSON.stringify(exactRouteI18nNamespaces)};
    let lng = localStorage.getItem("language");
    if (!(lng && supported.includes(lng))) {
      const candidates = navigator.languages || [navigator.language];
      lng = candidates.find((l) => supported.includes(l)) || fallback;
    }
    document.documentElement.lang = lng;
    const pathname = location.hash.slice(1).split("?")[0] || "/";
    const namespaces = [...new Set([
      ...sharedNamespaces,
      ...Object.entries(routeNamespaces).flatMap(([route, values]) => {
        const matches = route === "/"
          ? pathname === route
          : pathname === route || pathname.startsWith(route + "/");
        return matches ? values : [];
      }),
      ...(exactRouteNamespaces[pathname] || []),
    ])];
    const langs = lng === fallback ? [lng] : [lng, fallback];
    for (const lang of langs) {
      for (const ns of namespaces) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "fetch";
        link.crossOrigin = "anonymous";
        link.href = "assets/locales/" + lang + "/" + ns + ".json";
        document.head.appendChild(link);
      }
    }
  } catch {
    /* noop */
  }
})();`;

  return {
    name: "locale-preload",
    transformIndexHtml() {
      return [{ tag: "script", injectTo: "head", children: script }];
    },
  };
}

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

  return {
    base: "./",
    plugins: [
      devtools({ eventBusConfig: { port: 42_069 } }),
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
      }),
      viteReact(),
      tailwindcss(),
      localePreloadPlugin(),
      versionLockPlugin(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: createApiDevProxy(env),
    },
    build: {
      assetsDir: "static",
      rollupOptions: {
        output: {
          // Keep the always-loaded vendors in their own chunks so app-code
          // releases don't invalidate them in the browser cache. Only list
          // packages the entry imports eagerly — grouping lazily-used
          // @tanstack packages (table, form, ...) here would bloat first load.
          manualChunks(id: string) {
            if (!id.includes("node_modules")) return;
            if (
              /node_modules\/@tanstack\/(?:react-router|router-[^/]+|history|react-query|query-[^/]+|react-store|store)\//.test(
                id
              )
            ) {
              return "tanstack";
            }
            if (/node_modules\/(?:i18next[^/]*|react-i18next)\//.test(id)) {
              return "i18n";
            }
            return;
          },
        },
      },
    },
  };
});
