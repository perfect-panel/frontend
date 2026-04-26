import request from "@workspace/ui/lib/request";

const PREFIX = `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/subscribe`;

// ────────── Types ──────────

export interface AddTrafficAddonRequest {
  addon_bytes: number;
}

export interface AddTrafficAddonResponse {
  addon_order_id: number;
  addon_bytes: number;
  amount: number;
  traffic_total: number;
}

// ────────── Endpoints ──────────

export async function addTrafficAddon(
  userSubscribeId: number,
  body: AddTrafficAddonRequest,
  options?: Record<string, any>
) {
  return request<API.Response & { data?: AddTrafficAddonResponse }>(
    `${PREFIX}/${userSubscribeId}/traffic/addon`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: body,
      ...(options || {}),
    }
  );
}
