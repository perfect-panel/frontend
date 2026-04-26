import request from "@workspace/ui/lib/request";

const PREFIX = `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/sitecontent`;

// ────────── Types ──────────

export interface SiteContentItem {
  id: number;
  content_key: string;
  content_lang: string;
  title: string;
  body: string;
  version?: string;
  updated_at: number;
}

export interface GetSiteContentParams {
  lang?: string;
  prefix?: string;
}

export interface UpsertSiteContentRequest {
  content_key: string;
  content_lang: string;
  title: string;
  body: string;
  version?: string;
}

// ────────── Endpoints ──────────

export async function getSiteContent(
  params: GetSiteContentParams,
  options?: Record<string, any>
) {
  return request<API.Response & { data?: { list: SiteContentItem[] } }>(
    `${PREFIX}/list`,
    { method: "GET", params, ...(options || {}) }
  );
}

export async function upsertSiteContent(
  body: UpsertSiteContentRequest,
  options?: Record<string, any>
) {
  return request<API.Response & { data?: { id: number } }>(`${PREFIX}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: body,
    ...(options || {}),
  });
}
