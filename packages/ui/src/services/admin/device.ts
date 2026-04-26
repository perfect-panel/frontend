import request from "@workspace/ui/lib/request";

const PREFIX = `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/device`;

// ────────── Types ──────────

export interface AdminUserDeviceItem {
  id: number;
  user_subscribe_id: number;
  user_id: number;
  device_name: string;
  token: string;
  uuid: string;
  last_seen_ip: string;
  last_seen_at: number;
  today_traffic: number;
  status: number;
  /** V4.3:1 = 用户加购设备(可删可改) / 0 = 套餐基础设备(不可删) */
  is_addon?: boolean;
  [key: string]: unknown;
}

export interface QueryUserDevicesParams {
  user_id: number;
  user_subscribe_id?: number;
}

// ────────── Endpoints ──────────

export async function queryUserDevices(
  params: QueryUserDevicesParams,
  options?: Record<string, any>
) {
  return request<API.Response & { data?: { list: AdminUserDeviceItem[] } }>(
    `${PREFIX}/list`,
    { method: "GET", params, ...(options || {}) }
  );
}

export async function adminDisableDevice(
  deviceId: number,
  options?: Record<string, any>
) {
  return request<
    API.Response & { data?: { device_id: number; status: number } }
  >(`${PREFIX}/${deviceId}/disable`, {
    method: "POST",
    ...(options || {}),
  });
}

export async function adminEnableDevice(
  deviceId: number,
  options?: Record<string, any>
) {
  return request<
    API.Response & { data?: { device_id: number; status: number } }
  >(`${PREFIX}/${deviceId}/enable`, {
    method: "POST",
    ...(options || {}),
  });
}

export async function adminResetDevice(
  deviceId: number,
  options?: Record<string, any>
) {
  return request<
    API.Response & { data?: { device_id: number; token: string; uuid: string } }
  >(`${PREFIX}/${deviceId}/reset`, {
    method: "POST",
    ...(options || {}),
  });
}

export async function adminRenameDevice(
  deviceId: number,
  body: { name: string },
  options?: Record<string, any>
) {
  return request<API.Response & { data?: { device_id: number; name: string } }>(
    `${PREFIX}/${deviceId}/name`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      data: body,
      ...(options || {}),
    }
  );
}
