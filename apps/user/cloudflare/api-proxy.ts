/**
 * Shared Cloudflare API proxy for PPanel frontend.
 *
 * Used by Worker Static Assets and Cloudflare Pages Functions in this app.
 * When VITE_API_BASE_URL is empty, the SPA calls same-origin `/v1/*`.
 */

export interface ProxyEnv {
  API_BASE_URL?: string;
}

const DEFAULT_API_BASE_URL = "https://api.ppanel.dev";

function resolveApiBase(env: ProxyEnv): string {
  return (env.API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");
}

function buildTargetUrl(request: Request, apiBase: string): string {
  const url = new URL(request.url);
  return `${apiBase}${url.pathname}${url.search}`;
}

function forwardHeaders(request: Request, apiBase: string): Headers {
  const headers = new Headers(request.headers);
  headers.set("Host", new URL(apiBase).host);
  headers.delete("cf-connecting-ip");
  headers.delete("cf-ipcountry");
  headers.delete("cf-ray");
  headers.delete("cf-visitor");
  return headers;
}

function corsHeaders(origin: string): Headers {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Access-Control-Max-Age", "86400");
  return headers;
}

export async function proxyApiRequest(
  request: Request,
  env: ProxyEnv
): Promise<Response> {
  const url = new URL(request.url);
  const origin = url.origin;
  const apiBase = resolveApiBase(env);

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(origin),
    });
  }

  const targetUrl = buildTargetUrl(request, apiBase);
  const headers = forwardHeaders(request, apiBase);

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "follow",
  };

  if (
    request.method !== "GET" &&
    request.method !== "HEAD" &&
    request.body !== null
  ) {
    init.body = request.body;
  }

  const upstream = await fetch(targetUrl, init);
  const responseHeaders = new Headers(upstream.headers);

  // Frontend stores auth in a client cookie from the JSON body.
  // Avoid leaking backend Set-Cookie onto the frontend origin.
  responseHeaders.delete("set-cookie");

  const cors = corsHeaders(origin);
  cors.forEach((value, key) => {
    responseHeaders.set(key, value);
  });

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export function isApiPath(pathname: string): boolean {
  return pathname === "/v1" || pathname.startsWith("/v1/");
}
