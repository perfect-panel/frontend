// Vendor @scalar/api-reference into public/scalar/ so the embedded API viewer
// loads from the same origin instead of jsDelivr CDN.
// Run automatically before `docs:dev` and `docs:build`.

import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const docsRoot = resolve(__dirname, "..");
const targetDir = join(docsRoot, "public", "scalar", "vendor");
const targetFile = join(targetDir, "api-reference.js");

function findStandaloneBundle() {
  // @scalar/api-reference ships a browser-ready IIFE bundle. The exact path
  // can vary between minor versions, so we probe several known locations
  // before giving up.
  const candidates = [
    "@scalar/api-reference/dist/browser/standalone.js",
    "@scalar/api-reference/dist/standalone.js",
    "@scalar/api-reference/dist/browser/api-reference.js",
  ];
  for (const c of candidates) {
    try {
      return require.resolve(c, { paths: [docsRoot] });
    } catch {
      // try next
    }
  }
  // Fallback: scan dist directory for any *.js that looks like the standalone bundle.
  try {
    const pkgEntry = require.resolve("@scalar/api-reference/package.json", {
      paths: [docsRoot],
    });
    const distDir = join(dirname(pkgEntry), "dist");
    const stack = [distDir];
    while (stack.length) {
      const dir = stack.pop();
      if (!dir || !existsSync(dir)) continue;
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const s = statSync(full);
        if (s.isDirectory()) {
          stack.push(full);
        } else if (
          s.isFile() &&
          /standalone(\.min)?\.js$/.test(entry) &&
          !entry.endsWith(".map")
        ) {
          return full;
        }
      }
    }
  } catch {
    /* ignore */
  }
  return null;
}

function main() {
  const src = findStandaloneBundle();
  if (!src) {
    console.warn(
      "[vendor-scalar] @scalar/api-reference standalone bundle not found.\n" +
        "  Run `bun install` (or your package manager's install) at the repo root,\n" +
        "  then re-run this script. Skipping for now."
    );
    return;
  }
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }
  copyFileSync(src, targetFile);
  console.log(`[vendor-scalar] copied ${src} -> ${targetFile}`);
}

main();
