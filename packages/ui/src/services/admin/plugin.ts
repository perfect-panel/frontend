import request from "@workspace/ui/lib/request";

export type PluginStatus =
  | "unloaded"
  | "loaded"
  | "initialized"
  | "running"
  | "stopped"
  | "error";

export interface PluginInfo extends Record<string, unknown> {
  name: string;
  version: string;
  description: string;
  author: string;
  status: PluginStatus;
  permissions: string[];
  routes: string[];
  error?: string;
}

export interface PluginListResponse {
  list: PluginInfo[];
  total: number;
}

export interface PluginManifest {
  name: string;
  version: string;
  description?: string;
  author?: string;
  main: string;
  permissions?: string[];
  config?: Record<string, unknown>;
}

export interface PluginRoute {
  PluginName: string;
  Method: string;
  Path: string;
  Handler: string;
  Middleware?: string[];
}

export interface PluginMiddleware {
  PluginName: string;
  Name: string;
  Handler: string;
}

export interface PluginEventSubscription {
  PluginName: string;
  Event: string;
  Handler: string;
}

export interface PluginHealth {
  name: string;
  status: PluginStatus;
  ready: boolean;
  pool_size: number;
  async_in_flight: number;
  async_limit: number;
  registered_route: number;
  error?: string;
}

export interface PluginActionResponse {
  name: string;
  action: string;
  status: PluginStatus;
  message: string;
}

export interface PluginValidationCheck {
  name: string;
  ok: boolean;
  message?: string;
}

export interface PluginValidation {
  name: string;
  valid: boolean;
  manifest?: PluginManifest;
  checks: PluginValidationCheck[];
  error?: string;
}

export interface GetPluginListParams {
  page?: number;
  size?: number;
  status?: string;
  q?: string;
}

const prefix = `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/plugins`;

export async function getPluginList(
  params: GetPluginListParams,
  options?: { [key: string]: unknown }
) {
  return request<API.Response & { data?: PluginListResponse }>(prefix, {
    method: "GET",
    params,
    ...(options || {}),
  });
}

export async function getPluginDetail(
  name: string,
  options?: { [key: string]: unknown }
) {
  return request<API.Response & { data?: PluginInfo }>(
    `${prefix}/${encodeURIComponent(name)}`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

export async function getPluginManifest(
  name: string,
  options?: { [key: string]: unknown }
) {
  return request<API.Response & { data?: PluginManifest }>(
    `${prefix}/${encodeURIComponent(name)}/manifest`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

export async function getPluginRoutes(
  name: string,
  options?: { [key: string]: unknown }
) {
  return request<API.Response & { data?: PluginRoute[] }>(
    `${prefix}/${encodeURIComponent(name)}/routes`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

export async function getPluginMiddlewares(
  name: string,
  options?: { [key: string]: unknown }
) {
  return request<API.Response & { data?: PluginMiddleware[] }>(
    `${prefix}/${encodeURIComponent(name)}/middlewares`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

export async function getPluginEvents(
  name: string,
  options?: { [key: string]: unknown }
) {
  return request<API.Response & { data?: PluginEventSubscription[] }>(
    `${prefix}/${encodeURIComponent(name)}/events`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

export async function getPluginHealth(
  name: string,
  options?: { [key: string]: unknown }
) {
  return request<API.Response & { data?: PluginHealth }>(
    `${prefix}/${encodeURIComponent(name)}/health`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

export async function enablePlugin(
  name: string,
  options?: { [key: string]: unknown }
) {
  return pluginAction(name, "enable", options);
}

export async function disablePlugin(
  name: string,
  options?: { [key: string]: unknown }
) {
  return pluginAction(name, "disable", options);
}

export async function reloadPlugin(
  name: string,
  options?: { [key: string]: unknown }
) {
  return pluginAction(name, "reload", options);
}

export async function restartPlugin(
  name: string,
  options?: { [key: string]: unknown }
) {
  return pluginAction(name, "restart", options);
}

export async function validatePlugin(
  name: string,
  options?: { [key: string]: unknown }
) {
  return request<API.Response & { data?: PluginValidation }>(
    `${prefix}/${encodeURIComponent(name)}/validate`,
    {
      method: "POST",
      ...(options || {}),
    }
  );
}

export async function reloadAllPlugins(options?: { [key: string]: unknown }) {
  return request<API.Response & { data?: PluginListResponse }>(
    `${prefix}/reload-all`,
    {
      method: "POST",
      ...(options || {}),
    }
  );
}

function pluginAction(
  name: string,
  action: "enable" | "disable" | "reload" | "restart",
  options?: { [key: string]: unknown }
) {
  return request<API.Response & { data?: PluginActionResponse }>(
    `${prefix}/${encodeURIComponent(name)}/${action}`,
    {
      method: "POST",
      ...(options || {}),
    }
  );
}
