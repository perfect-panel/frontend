"use client";

import { useSearch } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { ProTable } from "@workspace/ui/composed/pro-table/pro-table";
import type { AuditLogItem } from "@workspace/ui/services/admin/audit";
import { queryAuditLog } from "@workspace/ui/services/admin/audit";
import { useTranslation } from "react-i18next";
import { DateCell } from "@/components/date-cell";
import { IpLink } from "@/components/ip-link";
import { UserDetail } from "@/sections/user/user-detail";

type Filter = {
  user_id?: number;
  actor?: string;
  action?: string;
};

// 操作行为中文映射
const ACTION_LABELS: Record<string, string> = {
  purchase: "购买套餐",
  renew: "续费套餐",
  add_device: "加购设备",
  addon_traffic: "加购流量",
  reset_device: "重置设备",
  reset_all_devices: "全部重置设备",
  disable_device: "停用设备",
  enable_device: "启用设备",
  rename_device: "重命名设备",
  throttle_start: "开始限速",
  throttle_cut_off: "断网处理",
  admin_login_remote: "管理员异地登录",
  update_direct_list: "更新直连白名单",
  cms_upsert: "编辑站内内容",
  notify_traffic_90: "流量预警(90%)",
  notify_throttle_12h: "限速12小时提醒",
};

// 操作行为颜色（按类别区分）
const ACTION_VARIANT: Record<
  string,
  "default" | "destructive" | "outline" | "secondary"
> = {
  purchase: "default",
  renew: "default",
  add_device: "default",
  addon_traffic: "default",
  reset_device: "secondary",
  reset_all_devices: "secondary",
  rename_device: "secondary",
  enable_device: "secondary",
  disable_device: "destructive",
  throttle_start: "destructive",
  throttle_cut_off: "destructive",
  admin_login_remote: "destructive",
  update_direct_list: "outline",
  cms_upsert: "outline",
  notify_traffic_90: "outline",
  notify_throttle_12h: "outline",
};

// 目标对象前缀中文映射
const TARGET_PREFIX_LABELS: Record<string, string> = {
  device: "设备",
  user_subscribe: "用户订阅",
  user: "用户",
  subscribe: "套餐",
  site_content: "站内内容",
  server: "节点",
  order: "订单",
  admin: "管理员",
};

function formatTarget(target: string): string {
  if (!target) return "—";
  const parts = target.split(":");
  if (parts.length < 2) return target;
  const [prefix, ...rest] = parts;
  const label = TARGET_PREFIX_LABELS[prefix!] || prefix!;
  // site_content:KEY:LANG => 站内内容 / KEY / LANG
  if (rest.length > 1) {
    return `${label} / ${rest.join(" / ")}`;
  }
  // device:1 => 设备 #1
  const id = rest[0]!;
  return /^\d+$/.test(id) ? `${label} #${id}` : `${label} / ${id}`;
}

// detail 字段中文键名映射（覆盖后端所有审计 detail 键）
const DETAIL_KEY_LABELS: Record<string, string> = {
  // 通用
  name: "名称",
  reason: "原因",
  ip: "IP地址",
  by_admin: "管理员操作",
  count: "数量",
  // 用户/订阅
  user_id: "用户ID",
  subscribe_id: "套餐ID",
  user_subscribe_id: "用户订阅ID",
  // 设备
  device_id: "设备ID",
  device_name: "设备名称",
  device_count: "设备数",
  old_name: "原名称",
  new_name: "新名称",
  reset_count: "重置设备数",
  reset_count_hour: "1小时内重置次数",
  reset_count_day: "1天内重置次数",
  // 加购/订单
  amount: "金额",
  unit_price: "单价",
  ratio_bp: "折算比例",
  addon_bytes: "加购流量",
  addon_order_id: "加购订单ID",
  throttled_reset: "已解除限速",
  // 流量/配额
  traffic: "流量",
  traffic_addon: "加购流量",
  used: "已用流量",
  quota: "配额",
  total: "总流量",
  online: "在线设备数",
  percent: "百分比",
  // 时间
  expire_time: "到期时间",
  start_time: "开始时间",
  end_time: "结束时间",
  // 站内内容
  title: "标题",
  version: "版本",
  // 节点
  hosts_count: "主机数量",
};

// 字节量字段：自动转 KB/MB/GB/TB
const BYTE_KEYS = new Set([
  "addon_bytes",
  "used",
  "quota",
  "total",
  "traffic",
  "traffic_addon",
]);
// 金额字段：分 → 元
const MONEY_KEYS = new Set(["amount", "unit_price"]);
// 万分比字段：bp → %
const BP_KEYS = new Set(["ratio_bp"]);
// 时间戳字段：毫秒/秒
const TIME_KEYS = new Set(["expire_time", "start_time", "end_time"]);

function formatBytes(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v >= 100 || i === 0 ? 0 : 2)} ${units[i]}`;
}

function formatTimestamp(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "-";
  // 自动判定 秒/毫秒
  const ms = n > 1e12 ? n : n * 1000;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return String(n);
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function formatDetailValue(key: string, v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "boolean") return v ? "是" : "否";
  if (typeof v === "number") {
    if (BYTE_KEYS.has(key)) return formatBytes(v);
    if (MONEY_KEYS.has(key)) return `¥${(v / 100).toFixed(2)}`;
    if (BP_KEYS.has(key)) return `${(v / 100).toFixed(2)}%`;
    if (TIME_KEYS.has(key)) return formatTimestamp(v);
    return String(v);
  }
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function formatDetail(detail: string): {
  short: string;
  full: string;
} {
  if (!detail) return { short: "—", full: "" };
  let parsed: unknown;
  try {
    parsed = JSON.parse(detail);
  } catch {
    return { short: detail, full: detail };
  }
  if (parsed === null || typeof parsed !== "object") {
    return { short: String(parsed), full: String(parsed) };
  }
  const entries = Object.entries(parsed as Record<string, unknown>);
  const lines = entries.map(([k, v]) => {
    const label = DETAIL_KEY_LABELS[k] || k;
    return `${label}: ${formatDetailValue(k, v)}`;
  });
  const short = lines.slice(0, 3).join(" · ");
  const full = lines.join("\n");
  return { short, full };
}

export default function AuditLogPage() {
  const { t } = useTranslation("log");
  const sp = useSearch({ strict: false }) as Record<string, string | undefined>;

  const initialFilters: Filter = {
    user_id: sp.user_id ? Number(sp.user_id) : undefined,
    actor: sp.actor,
    action: sp.action,
  };

  return (
    <ProTable<AuditLogItem, Filter>
      columns={[
        {
          accessorKey: "actor",
          header: t("column.actor", "操作者"),
          cell: ({ row }) => {
            const actor = row.original.actor || "system";
            const actorLabel =
              actor === "system"
                ? "系统"
                : actor === "admin"
                  ? "管理员"
                  : actor === "user"
                    ? "用户"
                    : actor;
            return (
              <Badge className="capitalize" variant="secondary">
                {actorLabel}
              </Badge>
            );
          },
        },
        {
          accessorKey: "user_id",
          header: t("column.user", "关联用户"),
          cell: ({ row }) =>
            row.original.user_id > 0 ? (
              <UserDetail id={Number(row.original.user_id)} />
            ) : (
              <span className="text-muted-foreground">—</span>
            ),
        },
        {
          accessorKey: "action",
          header: t("column.action", "操作行为"),
          cell: ({ row }) => {
            const code = row.original.action;
            const label = ACTION_LABELS[code] || code;
            const variant = ACTION_VARIANT[code] || "outline";
            return (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant={variant}>{label}</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="text-xs">{code}</span>
                </TooltipContent>
              </Tooltip>
            );
          },
        },
        {
          accessorKey: "target",
          header: t("column.target", "操作对象"),
          cell: ({ row }) => {
            const raw = row.original.target || "";
            if (!raw) {
              return <span className="text-muted-foreground">—</span>;
            }
            return (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs">{formatTarget(raw)}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <code className="text-xs">{raw}</code>
                </TooltipContent>
              </Tooltip>
            );
          },
        },
        {
          accessorKey: "detail",
          header: t("column.detail", "详细信息"),
          cell: ({ row }) => {
            const detail = row.original.detail || "";
            if (!detail) {
              return <span className="text-muted-foreground">—</span>;
            }
            const { short, full } = formatDetail(detail);
            return (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="max-w-72 cursor-help truncate text-xs">
                    {short}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <pre className="wrap-break-word max-w-md whitespace-pre-wrap text-xs">
                    {full}
                  </pre>
                </TooltipContent>
              </Tooltip>
            );
          },
        },
        {
          accessorKey: "client_ip",
          header: t("column.ip", "IP地址"),
          cell: ({ row }) =>
            row.original.client_ip ? (
              <IpLink ip={row.original.client_ip} />
            ) : (
              <span className="text-muted-foreground">—</span>
            ),
        },
        {
          accessorKey: "created_at",
          header: t("column.time", "操作时间"),
          cell: ({ row }) => <DateCell ts={row.original.created_at} />,
        },
      ]}
      header={{ title: t("title.audit", "操作日志") }}
      initialFilters={initialFilters}
      params={[
        { key: "user_id", placeholder: t("column.userId", "用户ID") },
        { key: "actor", placeholder: t("column.actor", "操作者") },
        { key: "action", placeholder: t("column.action", "操作行为") },
      ]}
      request={async (pagination, filter) => {
        const { data } = await queryAuditLog({
          page: pagination.page,
          size: pagination.size,
          user_id: (filter as Filter)?.user_id,
          actor: (filter as Filter)?.actor,
          action: (filter as Filter)?.action,
        });
        const list = (data?.data?.list || []) as AuditLogItem[];
        const total = Number(data?.data?.total || list.length);
        return { list, total };
      }}
    />
  );
}
