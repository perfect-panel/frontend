// Bootstrap Monaco Editor without CDN — but lazily.
//
// We previously did `import * as monaco from "monaco-editor"` at the top of
// this module. That worked, but Vite then pre-bundled the entire ~7 MB
// monaco-editor package into optimizeDeps at startup, blocking dev cold
// starts (the user reported a 10+ second blank page).
//
// Now this module exports `setupMonaco()`, which dynamic-imports
// monaco-editor + the five language workers ONLY when an editor is about to
// mount. Vite code-splits the dynamic chunk away from the initial bundle,
// so pages without an editor never pay the cost.
//
// Workers are imported with the `?worker` suffix so Vite emits them as
// hashed local assets (no CDN). MonacoEnvironment routes Monaco's worker
// requests to the locally-bundled instances.

import { loader } from "@monaco-editor/react";

// 不再 declare global MonacoEnvironment — monaco-editor 已经在自己的 .d.ts
// 里声明了,我们重复声明会导致 "Subsequent variable declarations must have
// the same type" 类型冲突。下面 self.MonacoEnvironment 赋值时直接用 monaco
// 自带的类型即可。

let setupPromise: Promise<void> | null = null;

export function setupMonaco(): Promise<void> {
  if (setupPromise) return setupPromise;
  setupPromise = (async () => {
    const [
      monaco,
      { default: EditorWorker },
      { default: CssWorker },
      { default: HtmlWorker },
      { default: JsonWorker },
      { default: TsWorker },
    ] = await Promise.all([
      import("monaco-editor"),
      import("monaco-editor/esm/vs/editor/editor.worker?worker"),
      import("monaco-editor/esm/vs/language/css/css.worker?worker"),
      import("monaco-editor/esm/vs/language/html/html.worker?worker"),
      import("monaco-editor/esm/vs/language/json/json.worker?worker"),
      import("monaco-editor/esm/vs/language/typescript/ts.worker?worker"),
    ]);

    self.MonacoEnvironment = {
      getWorker(_workerId, label) {
        switch (label) {
          case "json":
            return new JsonWorker();
          case "css":
          case "scss":
          case "less":
            return new CssWorker();
          case "html":
          case "handlebars":
          case "razor":
            return new HtmlWorker();
          case "typescript":
          case "javascript":
            return new TsWorker();
          default:
            return new EditorWorker();
        }
      },
    };

    loader.config({ monaco });
  })();
  return setupPromise;
}
