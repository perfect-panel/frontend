import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { ConfirmButton } from "@workspace/ui/composed/confirm-button";
import { ProTable } from "@workspace/ui/composed/pro-table/pro-table";
import type { AdminUserDeviceItem } from "@workspace/ui/services/admin/device";
import {
  adminDisableDevice,
  adminEnableDevice,
  adminResetDevice,
  queryUserDevices,
} from "@workspace/ui/services/admin/device";
import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { IpLink } from "@/components/ip-link";
import { formatDate } from "@/utils/common";

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let v = bytes;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(2)} ${units[i]}`;
}

function DeviceSlots({
  userId,
  subscriptionId,
  refreshKey,
  bumpRefresh,
}: {
  userId: number;
  subscriptionId: number;
  refreshKey: number;
  bumpRefresh: () => void;
}) {
  const { t } = useTranslation("user");
  return (
    <ProTable<AdminUserDeviceItem, Record<string, unknown>>
      actions={{
        render: (row) => [
          <ConfirmButton
            cancelText={t("cancel", "Cancel")}
            confirmText={t("confirm", "Confirm")}
            description={t(
              "device.resetDesc",
              "Generate new token + UUID. Old subscribe URL stops working immediately."
            )}
            key="reset"
            onConfirm={async () => {
              await adminResetDevice(row.id);
              toast.success(t("device.resetSuccess", "Device reset"));
              bumpRefresh();
            }}
            title={t("device.resetTitle", "Reset this device?")}
            trigger={
              <Button variant="outline">{t("device.reset", "Reset")}</Button>
            }
          />,
          row.status === 1 ? (
            <ConfirmButton
              cancelText={t("cancel", "Cancel")}
              confirmText={t("confirm", "Confirm")}
              description={t(
                "device.disableDesc",
                "Disabled devices stop receiving traffic; slot is preserved."
              )}
              key="disable"
              onConfirm={async () => {
                await adminDisableDevice(row.id);
                toast.success(t("device.disabled", "Device disabled"));
                bumpRefresh();
              }}
              title={t("device.disableTitle", "Disable this device?")}
              trigger={
                <Button variant="destructive">
                  {t("device.disable", "Disable")}
                </Button>
              }
            />
          ) : (
            <Button
              key="enable"
              onClick={async () => {
                await adminEnableDevice(row.id);
                toast.success(t("device.enabled", "Device enabled"));
                bumpRefresh();
              }}
              variant="outline"
            >
              {t("device.enable", "Enable")}
            </Button>
          ),
        ],
      }}
      columns={[
        {
          accessorKey: "id",
          header: t("device.column.id", "Device ID"),
          cell: ({ row }) => <code className="text-xs">{row.original.id}</code>,
        },
        {
          accessorKey: "device_name",
          header: t("device.column.name", "Name"),
          cell: ({ row }) => row.original.device_name || "—",
        },
        {
          accessorKey: "is_addon",
          header: t("device.column.type", "类型"),
          cell: ({ row }) =>
            row.original.is_addon ? (
              <Badge className="bg-amber-500 text-white">
                {t("device.typeAddon", "加购")}
              </Badge>
            ) : (
              <Badge variant="secondary">
                {t("device.typeBase", "套餐基础")}
              </Badge>
            ),
        },
        {
          accessorKey: "uuid",
          header: t("device.column.uuid", "UUID"),
          cell: ({ row }) => (
            <code className="max-w-32 truncate text-muted-foreground text-xs">
              {row.original.uuid}
            </code>
          ),
        },
        {
          accessorKey: "last_seen_ip",
          header: t("device.column.ip", "Last IP"),
          cell: ({ row }) =>
            row.original.last_seen_ip ? (
              <IpLink ip={row.original.last_seen_ip} />
            ) : (
              <span className="text-muted-foreground">—</span>
            ),
        },
        {
          accessorKey: "last_seen_at",
          header: t("device.column.lastSeen", "Last Seen"),
          cell: ({ row }) =>
            row.original.last_seen_at
              ? formatDate(row.original.last_seen_at)
              : "—",
        },
        {
          accessorKey: "today_traffic",
          header: t("device.column.todayTraffic", "Today"),
          cell: ({ row }) => formatBytes(row.original.today_traffic || 0),
        },
        {
          accessorKey: "status",
          header: t("device.column.status", "Status"),
          cell: ({ row }) => (
            <Badge
              variant={row.original.status === 1 ? "default" : "destructive"}
            >
              {row.original.status === 1
                ? t("device.statusEnabled", "Enabled")
                : t("device.statusDisabled", "Disabled")}
            </Badge>
          ),
        },
      ]}
      key={refreshKey}
      request={async () => {
        const { data } = await queryUserDevices({
          user_id: userId,
          user_subscribe_id: subscriptionId,
        });
        const list = (data?.data?.list || []) as AdminUserDeviceItem[];
        return { list, total: list.length };
      }}
    />
  );
}

export function SubscriptionDetail({
  trigger,
  userId,
  subscriptionId,
}: {
  trigger: ReactNode;
  userId: number;
  subscriptionId: number;
}) {
  const { t } = useTranslation("user");
  const [open, setOpen] = useState(false);
  const [slotsRefresh, setSlotsRefresh] = useState(0);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        className="!w-[55vw] !max-w-[1400px] !min-w-[1100px]"
        side="right"
      >
        <SheetHeader>
          <SheetTitle>{t("onlineDevices", "在线设备")}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 max-h-[calc(100dvh-120px)] overflow-y-auto px-2">
          <DeviceSlots
            bumpRefresh={() => setSlotsRefresh((n) => n + 1)}
            refreshKey={slotsRefresh}
            subscriptionId={subscriptionId}
            userId={userId}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
