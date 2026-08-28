import { describe, expect, test } from "bun:test";
import {
  buildUpstreamHeaders,
  proxyRequest,
} from "../../functions/v1/[[path]]";

describe("Pages API proxy forwarding headers", () => {
  test("replaces spoofable forwarding headers with the Cloudflare client IP", () => {
    const headers = new Headers({
      authorization: "Bearer token",
      "cf-connecting-ip": "203.0.113.8",
      forwarded: "for=198.51.100.1",
      "true-client-ip": "198.51.100.2",
      "x-client-ip": "198.51.100.3",
      "x-forwarded-for": "198.51.100.4, 203.0.113.8",
      "x-real-ip": "198.51.100.5",
    });

    const upstream = buildUpstreamHeaders(headers, "api.example.com");

    expect(upstream.get("host")).toBe("api.example.com");
    expect(upstream.get("authorization")).toBe("Bearer token");
    expect(upstream.get("x-forwarded-for")).toBe("203.0.113.8");
    expect(upstream.get("x-real-ip")).toBe("203.0.113.8");
    expect(upstream.has("cf-connecting-ip")).toBe(false);
    expect(upstream.has("forwarded")).toBe(false);
    expect(upstream.has("true-client-ip")).toBe(false);
    expect(upstream.has("x-client-ip")).toBe(false);
  });

  test("preserves a trusted IPv6 client address", () => {
    const headers = new Headers({
      "cf-connecting-ip": "2001:db8::8",
      "x-forwarded-for": "198.51.100.4",
    });

    const upstream = buildUpstreamHeaders(headers, "api.example.com");

    expect(upstream.get("x-forwarded-for")).toBe("2001:db8::8");
    expect(upstream.get("x-real-ip")).toBe("2001:db8::8");
  });

  test("prefers the original IPv6 address over a Cloudflare pseudo IPv4", () => {
    const headers = new Headers({
      "cf-connecting-ip": "240.0.0.8",
      "cf-connecting-ipv6": "2001:db8::9",
    });

    const upstream = buildUpstreamHeaders(headers, "api.example.com");

    expect(upstream.get("x-forwarded-for")).toBe("2001:db8::9");
    expect(upstream.get("x-real-ip")).toBe("2001:db8::9");
    expect(upstream.has("cf-connecting-ipv6")).toBe(false);
  });

  test("drops forwarding headers when Cloudflare provides no valid address", () => {
    const headers = new Headers({
      "cf-connecting-ip": "not-an-ip",
      forwarded: "for=198.51.100.1",
      "x-forwarded-for": "198.51.100.2",
      "x-real-ip": "198.51.100.3",
    });

    const upstream = buildUpstreamHeaders(headers, "api.example.com");

    expect(upstream.has("cf-connecting-ip")).toBe(false);
    expect(upstream.has("forwarded")).toBe(false);
    expect(upstream.has("x-forwarded-for")).toBe(false);
    expect(upstream.has("x-real-ip")).toBe(false);
  });

  test("preserves upstream redirects for browser-handled OAuth callbacks", async () => {
    let redirectMode: RequestRedirect | undefined;
    const upstreamFetch = (async (_url: string | URL | Request, init) => {
      redirectMode = init?.redirect;
      return Response.redirect(
        "https://panel.example.com/oauth/apple/?code=code&state=state",
        302
      );
    }) as typeof fetch;

    const response = await proxyRequest(
      new Request("https://panel.example.com/v1/auth/oauth/callback/apple", {
        method: "POST",
        body: "code=code&state=state",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }),
      { API_BASE_URL: "https://api.example.com" },
      upstreamFetch
    );

    expect(redirectMode).toBe("manual");
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe(
      "https://panel.example.com/oauth/apple/?code=code&state=state"
    );
  });
});
