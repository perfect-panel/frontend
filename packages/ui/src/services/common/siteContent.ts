// Public site_content reader (V4.3 决策 25).
// Used by both user app and admin app to fetch a single CMS row by key + lang.
// Backend endpoint falls back to zh-CN when the requested language is missing.

import request from "@workspace/ui/lib/request";

const PREFIX = `${import.meta.env.VITE_API_PREFIX || ""}/v1/common`;

export interface SiteContentItem {
  content_key: string;
  content_lang: string;
  title: string;
  body: string;
  version?: string;
  updated_at: number;
}

export interface GetSiteContentItemParams {
  key: string;
  lang?: string;
}

export async function getSiteContentItem(
  params: GetSiteContentItemParams,
  options?: Record<string, any>
) {
  return request<API.Response & { data?: SiteContentItem }>(
    `${PREFIX}/site_content`,
    { method: "GET", params, ...(options || {}) }
  );
}
