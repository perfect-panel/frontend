export interface Env {
  API_BASE_URL: string;
}

const UNTRUSTED_IP_HEADERS = [
  "cf-connecting-ip",
  "cf-connecting-ipv6",
  "forwarded",
  "true-client-ip",
  "x-client-ip",
  "x-forwarded-for",
  "x-real-ip",
];

function isIPv4(value: string) {
  const parts = value.split(".");
  return (
    parts.length === 4 &&
    parts.every(
      (part) =>
        /^\d{1,3}$/.test(part) && Number(part) >= 0 && Number(part) <= 255
    )
  );
}

function isIPv6(value: string) {
  if (!(value.includes(":") && /^[0-9a-f:.]+$/i.test(value))) {
    return false;
  }
  try {
    return new URL(`http://[${value}]/`).hostname.length > 2;
  } catch {
    return false;
  }
}

function getCloudflareClientIp(headers: Headers) {
  const ipv6 = headers.get("cf-connecting-ipv6")?.trim();
  if (ipv6 && ipv6.length <= 45 && isIPv6(ipv6)) {
    return ipv6;
  }

  const value = headers.get("cf-connecting-ip")?.trim();
  if (!value || value.length > 45 || !(isIPv4(value) || isIPv6(value))) {
    return;
  }
  return value;
}

export function buildUpstreamHeaders(
  requestHeaders: Headers,
  upstreamHost: string
) {
  const clientIp = getCloudflareClientIp(requestHeaders);
  const headers = new Headers(requestHeaders);

  for (const header of UNTRUSTED_IP_HEADERS) {
    headers.delete(header);
  }

  if (clientIp) {
    // Hertz reads X-Forwarded-For before X-Real-IP. Replace both values so a
    // caller cannot prepend a spoofed address to the forwarding chain.
    headers.set("x-forwarded-for", clientIp);
    headers.set("x-real-ip", clientIp);
  }

  headers.set("Host", upstreamHost);
  headers.delete("cf-ipcountry");
  headers.delete("cf-ray");
  headers.delete("cf-visitor");

  return headers;
}

export async function proxyRequest(
  request: Request,
  env: Env,
  upstreamFetch: typeof fetch = fetch
) {
  const apiBase = (env.API_BASE_URL || "https://api.ppanel.dev").replace(
    /\/$/,
    ""
  );

  const url = new URL(request.url);
  const targetUrl = `${apiBase}${url.pathname}${url.search}`;

  const headers = buildUpstreamHeaders(request.headers, new URL(apiBase).host);

  const init: RequestInit = {
    method: request.method,
    headers,
    // Apple Sign-In posts to the backend callback, which responds with a 302
    // to the frontend callback page. That redirect must reach the browser;
    // following it inside the proxy loses both the Location and navigation.
    redirect: "manual",
  };

  if (
    request.method !== "GET" &&
    request.method !== "HEAD" &&
    request.body !== null
  ) {
    init.body = request.body;
  }

  const response = await upstreamFetch(targetUrl, init);

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("set-cookie");
  responseHeaders.set("Access-Control-Allow-Origin", url.origin);
  responseHeaders.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  responseHeaders.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: responseHeaders,
    });
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) =>
  proxyRequest(request, env);
