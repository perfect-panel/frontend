import request from "@workspace/ui/lib/request";

const PREFIX = `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/audit`;

// ────────── Types ──────────

export interface AuditLogItem {
  id: number;
  user_id: number;
  actor: string;
  actor_id: number;
  action: string;
  target: string;
  detail: string;
  client_ip: string;
  created_at: number;
  [key: string]: unknown;
}

export interface QueryAuditLogParams {
  user_id?: number;
  actor?: string;
  actor_id?: number;
  action?: string;
  since?: number;
  until?: number;
  page?: number;
  size?: number;
}

// ────────── Endpoints ──────────

export async function queryAuditLog(
  params: QueryAuditLogParams,
  options?: Record<string, any>
) {
  return request<
    API.Response & { data?: { list: AuditLogItem[]; total: number } }
  >(`${PREFIX}/list`, { method: "GET", params, ...(options || {}) });
}
