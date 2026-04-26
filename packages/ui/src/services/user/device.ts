import request from "@workspace/ui/lib/request";

const PREFIX = `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/subscribe`;

// ────────── Types ──────────

export interface AddSubscribeDeviceResponse {
  device_id: number;
  amount: number;
  ratio: number; // 万分比 (e.g., 6700 = 67%)
  subscribe_url: string;
  /** V4.3 批量加购:实际加购数量 */
  quantity?: number;
  /** V4.3 批量加购:所有新设备 id 列表 */
  device_ids?: number[];
}

export interface DeviceResetResponse {
  device_id: number;
  token: string;
  uuid: string;
  subscribe_url: string;
  reset_count_hour: number;
  reset_count_day: number;
}

export interface DeviceStatusResponse {
  device_id: number;
  status: number;
}

// ────────── Device add (按比例计费) ──────────

export async function addSubscribeDevice(
  userSubscribeId: number,
  /** V4.3:加购数量,默认 1 台。后端按 unit_price × qty × 剩余比例计费。 */
  body?: { quantity?: number },
  options?: Record<string, any>
) {
  return request<API.Response & { data?: AddSubscribeDeviceResponse }>(
    `${PREFIX}/${userSubscribeId}/device/add`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: body || {},
      ...(options || {}),
    }
  );
}

// ────────── Device CRUD ──────────

export async function resetDevice(
  deviceId: number,
  options?: Record<string, any>
) {
  return request<API.Response & { data?: DeviceResetResponse }>(
    `${PREFIX}/device/${deviceId}/reset`,
    { method: "POST", ...(options || {}) }
  );
}

export async function disableDevice(
  deviceId: number,
  options?: Record<string, any>
) {
  return request<API.Response & { data?: DeviceStatusResponse }>(
    `${PREFIX}/device/${deviceId}/disable`,
    { method: "POST", ...(options || {}) }
  );
}

export async function enableDevice(
  deviceId: number,
  options?: Record<string, any>
) {
  return request<API.Response & { data?: DeviceStatusResponse }>(
    `${PREFIX}/device/${deviceId}/enable`,
    { method: "POST", ...(options || {}) }
  );
}

/**
 * V4.3:删除加购设备(只对 is_addon=true 的设备生效;基础设备会被后端拒绝)。
 * 删除后 user_subscribe.device_count 同步 -1,不退款。
 */
export async function deleteAddonDevice(
  deviceId: number,
  options?: Record<string, any>
) {
  return request<API.Response & { data?: DeviceStatusResponse }>(
    `${PREFIX}/device/${deviceId}`,
    { method: "DELETE", ...(options || {}) }
  );
}

export async function renameDevice(
  deviceId: number,
  body: { name: string },
  options?: Record<string, any>
) {
  return request<API.Response & { data?: { device_id: number; name: string } }>(
    `${PREFIX}/device/${deviceId}/name`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      data: body,
      ...(options || {}),
    }
  );
}

export async function resetAllDevices(
  userSubscribeId: number,
  options?: Record<string, any>
) {
  return request<API.Response & { data?: { reset_count: number } }>(
    `${PREFIX}/${userSubscribeId}/devices/reset_all`,
    { method: "POST", ...(options || {}) }
  );
}
