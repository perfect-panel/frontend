// @ts-nocheck
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Get subscribe list GET /v1/public/subscribe/list */
export async function querySubscribeList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.QuerySubscribeListParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.QuerySubscribeListResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/subscribe/list`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get user subscribe node info GET /v1/public/subscribe/node/list */
export async function queryUserSubscribeNodeList(options?: {
  [key: string]: any;
}) {
  return request<
    API.Response & { data?: API.QueryUserSubscribeNodeListResponse }
  >(`${import.meta.env.VITE_API_PREFIX || ""}/v1/public/subscribe/node/list`, {
    method: "GET",
    ...(options || {}),
  });
}

// ────────── My Subscribes (device-billing model) ──────────

export interface MySubscribeDevice {
  id: number;
  device_name: string;
  token: string;
  uuid: string;
  subscribe_url: string;
  /**
   * V4.3:配置了多个订阅域名(主线 + 备用 + CDN)时,这里返回完整列表;
   * 前端按顺序展示给用户选择,subscribe_url 仍是第一条以兼容老逻辑。
   */
  subscribe_urls?: string[];
  qr_code_url: string;
  last_seen_at: number;
  last_seen_ip: string;
  today_traffic: number;
  status: number;
  /** V4.3:true = 用户加购设备(可删除), false = 套餐基础设备(不可删) */
  is_addon?: boolean;
}

export type SubscribeStatus = "normal" | "throttled" | "cutoff";

export interface MySubscribeInfo {
  id: number;
  subscribe_id: number;
  subscribe_name: string;
  device_count: number;
  traffic_total: number;
  traffic_addon: number;
  traffic_used: number;
  traffic_remain_pct: number;
  start_time?: number;
  expire_time: number;
  status: SubscribeStatus;
  throttled_at?: number;
  cut_off_at?: number;
  devices: MySubscribeDevice[];
  /** V4.3 计价字段 — 用于「加购设备 / 加购流量」对话框预估金额 (单位:分) */
  unit_price_per_device?: number;
  max_device_count?: number;
  traffic_addon_unit_price?: number;
  /** 加购流量步长 (字节) */
  traffic_addon_unit_size?: number;
}

/** Get current user's subscribes (with devices) GET /v1/public/subscribe/my */
export async function queryMySubscribes(options?: { [key: string]: any }) {
  return request<API.Response & { data?: { list: MySubscribeInfo[] } }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/subscribe/my`,
    { method: "GET", ...(options || {}) }
  );
}
