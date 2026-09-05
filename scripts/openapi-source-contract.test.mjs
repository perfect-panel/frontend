import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("openapi2ts reads frontend main Swagger assets", async () => {
  const config = await readFile(
    new URL("../packages/ui/openapi2ts.config.ts", import.meta.url),
    "utf8"
  );

  for (const spec of ["common", "user", "admin"]) {
    assert.ok(
      config.includes(
        `https://raw.githubusercontent.com/perfect-panel/frontend/refs/heads/main/docs/public/swagger/${spec}.json`
      ),
      `openapi2ts must read ${spec}.json from frontend main`
    );
  }

  assert.doesNotMatch(
    config,
    /gateway/,
    "the retired gateway client must not be generated"
  );

  console.log("OpenAPI source contract OK");
});
