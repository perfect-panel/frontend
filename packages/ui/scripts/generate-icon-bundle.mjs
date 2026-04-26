// Build a tiny icon bundle containing only the icons actually referenced in
// the codebase, instead of shipping the full ~12 MB of icon set JSON.
//
// How it works:
//   1. Recursively scan apps/* and packages/* for `icon="prefix:name"` and
//      `icon: "prefix:name"` patterns.
//   2. Group hits by prefix.
//   3. For each prefix, read node_modules/@iconify-json/<prefix>/icons.json,
//      build a subset IconifyJSON containing only the requested icons, and
//      write it to packages/ui/src/composed/icons-bundle.json.
//
// Run via `bun run icons:bundle` (in packages/ui) — invoked automatically
// before dev/build via a pre-script in apps/admin and apps/user.

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../../..");
const outFile = resolve(__dirname, "../src/composed/icons-bundle.json");

const SCAN_DIRS = [join(repoRoot, "apps"), join(repoRoot, "packages")];
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx"]);
const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  ".turbo",
  ".vitepress",
]);
const ICON_PATTERN =
  /["']([a-z][a-z0-9]+(?:-[a-z0-9]+)*):([a-z][a-z0-9-]+)["']/gi;

function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    let s;
    try {
      s = statSync(full);
    } catch {
      continue;
    }
    if (s.isDirectory()) {
      if (SKIP_DIRS.has(entry) || entry.startsWith(".")) continue;
      yield* walk(full);
    } else if (s.isFile()) {
      const dot = entry.lastIndexOf(".");
      if (dot >= 0 && EXTS.has(entry.slice(dot))) yield full;
    }
  }
}

function collectIcons() {
  const byPrefix = new Map();
  for (const dir of SCAN_DIRS) {
    for (const file of walk(dir)) {
      let text;
      try {
        text = readFileSync(file, "utf-8");
      } catch {
        continue;
      }
      // Cheap pre-filter to skip files that don't mention `icon`.
      if (!text.includes("icon")) continue;
      ICON_PATTERN.lastIndex = 0;
      for (
        let m = ICON_PATTERN.exec(text);
        m !== null;
        m = ICON_PATTERN.exec(text)
      ) {
        const [, prefix, name] = m;
        // Filter to known iconify prefixes only — the regex matches things
        // like "image/png" otherwise.
        if (!KNOWN_PREFIXES.has(prefix)) continue;
        if (!byPrefix.has(prefix)) byPrefix.set(prefix, new Set());
        byPrefix.get(prefix).add(name);
      }
    }
  }
  return byPrefix;
}

const KNOWN_PREFIXES = new Set([
  "mdi",
  "uil",
  "lucide",
  "tabler",
  "bi",
  "flat-color-icons",
  "simple-icons",
]);

function buildBundle(byPrefix) {
  const bundle = {};
  let total = 0;
  for (const [prefix, names] of byPrefix) {
    const jsonPath = resolve(
      repoRoot,
      "node_modules/@iconify-json",
      prefix,
      "icons.json"
    );
    if (!existsSync(jsonPath)) {
      console.warn(`[icons] missing package @iconify-json/${prefix}, skipping`);
      continue;
    }
    const json = JSON.parse(readFileSync(jsonPath, "utf-8"));
    const subset = { prefix, icons: {} };
    for (const k of ["width", "height", "left", "top"]) {
      if (json[k] !== undefined) subset[k] = json[k];
    }
    for (const name of names) {
      const data = json.icons[name];
      if (data) {
        subset.icons[name] = data;
        total += 1;
      } else {
        console.warn(`[icons] missing icon ${prefix}:${name}`);
      }
    }
    bundle[prefix] = subset;
  }
  return { bundle, total };
}

function main() {
  const byPrefix = collectIcons();
  if (byPrefix.size === 0) {
    console.warn("[icons] no icons discovered; writing empty bundle");
  }
  const { bundle, total } = buildBundle(byPrefix);
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, JSON.stringify(bundle));
  const sizeKb = (Buffer.byteLength(JSON.stringify(bundle)) / 1024).toFixed(1);
  console.log(
    `[icons] bundled ${total} icon(s) across ${Object.keys(bundle).length} set(s) -> ${outFile} (${sizeKb} KB)`
  );
}

main();
