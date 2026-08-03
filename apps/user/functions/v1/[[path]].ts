import { proxyApiRequest, type ProxyEnv } from "../../cloudflare/api-proxy";

/**
 * Cloudflare Pages Function: proxy same-origin `/v1/*` to the backend.
 * Used when the Pages project root is this app directory.
 */
export const onRequest: PagesFunction<ProxyEnv> = async (context) => {
  return proxyApiRequest(context.request, context.env);
};
