import { describe, expect, test } from "bun:test";
import type { AddressInfo } from "node:net";
import { serve } from "bun";
import { createServer } from "vite";
import { createApiDevProxy } from "../../scripts/api-dev-proxy";

describe("development API proxy", () => {
  for (const prefix of ["", "/api", "/team.api"]) {
    test(`forwards login and v2 requests with prefix ${prefix || "(empty)"}`, async () => {
      const upstream = serve({
        hostname: "127.0.0.1",
        port: 0,
        async fetch(request) {
          const url = new URL(request.url);
          return Response.json({
            path: url.pathname,
            search: url.search,
            method: request.method,
            authorization: request.headers.get("authorization"),
            body: await request.text(),
          });
        },
      });
      const server = await createServer({
        configFile: false,
        appType: "custom",
        logLevel: "silent",
        server: {
          host: "127.0.0.1",
          port: 0,
          proxy: createApiDevProxy({
            VITE_API_BASE_URL: upstream.url.origin,
            VITE_API_PREFIX: prefix,
          }),
        },
      });

      try {
        await server.listen();
        const { port } = server.httpServer!.address() as AddressInfo;
        const origin = `http://127.0.0.1:${port}`;
        const body = JSON.stringify({
          email: "test@example.com",
          password: "test-only",
        });
        const login = await fetch(`${origin}${prefix}/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
        expect(await login.json()).toEqual({
          path: "/v1/auth/login",
          search: "",
          method: "POST",
          authorization: null,
          body,
        });

        const order = await fetch(
          `${origin}${prefix}/v2/public/orders/example?expand=1`,
          { headers: { Authorization: "test-session" } }
        );
        expect(await order.json()).toEqual({
          path: "/v2/public/orders/example",
          search: "?expand=1",
          method: "GET",
          authorization: "test-session",
          body: "",
        });
        for (const path of [
          "/basic/check/version",
          "/assets/missing.json",
          `${prefix}/v10/auth/login`,
        ]) {
          expect((await fetch(`${origin}${path}`)).status).toBe(404);
        }
      } finally {
        await server.close();
        upstream.stop(true);
      }
    });
  }
});
