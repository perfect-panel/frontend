import {
  isApiPath,
  proxyApiRequest,
  type ProxyEnv,
} from "./cloudflare/api-proxy";

export interface Env extends ProxyEnv {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (isApiPath(pathname)) {
      return proxyApiRequest(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
