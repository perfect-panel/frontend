"use client";

// Offline icon registry — only the icons actually referenced in the codebase
// are pre-bundled into icons-bundle.json by scripts/generate-icon-bundle.mjs.
// Total payload is ~50–80 KB instead of the ~12 MB you would get from
// shipping every full @iconify-json/* set.
//
// To add a new icon, just write `<Icon icon="prefix:name" />` somewhere — the
// bundler script auto-discovers the reference on the next dev/build run
// (invoked via the prebuild / predev hooks).

import {
  addCollection,
  Icon as Iconify,
  type IconifyJSON,
  type IconProps,
} from "@iconify/react";
import bundle from "./icons-bundle.json" with { type: "json" };

let registered = false;
function registerCollections() {
  if (registered) return;
  registered = true;
  for (const set of Object.values(bundle as Record<string, IconifyJSON>)) {
    addCollection(set);
  }
}

// Register at module load (runs once on first import).
registerCollections();

export function Icon(props: IconProps) {
  return <Iconify {...props} />;
}
