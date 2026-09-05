import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const swaggerDir = path.join(repoRoot, "docs", "public", "swagger");
test("Swagger assets satisfy the frontend documentation contract", async () => {
  const backendManifest = (
    await readFile(path.join(swaggerDir, ".backend-generated"), "utf8")
  )
    .split("\n")
    .filter(Boolean);
  const entries = await readdir(swaggerDir);
  const jsonFiles = entries.filter((entry) => entry.endsWith(".json")).sort();

  assert.ok(
    jsonFiles.includes("ppanel.json"),
    "docs/public/swagger must include ppanel.json as the aggregate API spec"
  );
  assert.ok(
    !jsonFiles.includes("gateway.json"),
    "the retired gateway spec must not be published"
  );

  for (const fileName of backendManifest) {
    assert.ok(
      jsonFiles.includes(fileName),
      `backend manifest entry ${fileName} must exist in docs/public/swagger`
    );
  }

  for (const fileName of jsonFiles) {
    const filePath = path.join(swaggerDir, fileName);
    let spec;
    try {
      spec = JSON.parse(await readFile(filePath, "utf8"));
    } catch (error) {
      throw new Error(`${fileName} must be valid JSON: ${error.message}`);
    }

    assert.ok(
      typeof spec === "object" && spec !== null && !Array.isArray(spec),
      `${fileName} must contain a JSON object`
    );
    assert.ok(
      spec.swagger || spec.openapi,
      `${fileName} must declare a swagger or openapi version`
    );
    assert.ok(
      spec.paths &&
        typeof spec.paths === "object" &&
        Object.keys(spec.paths).length > 0,
      `${fileName} must contain at least one API path`
    );
  }

  console.log(
    `Validated ${jsonFiles.length} Swagger JSON file(s): ${jsonFiles.join(", ")}`
  );
});
