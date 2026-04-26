import { Link } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { ConfirmButton } from "@workspace/ui/composed/confirm-button";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/pro-table";
import {
  createUserSubscribe,
  deleteUserSubscribe,
  getUserSubscribe,
  resetUserSubscribeToken,
  toggleUserSubscribeStatus,
  updateUserSubscribe,
} from "@workspace/ui/services/admin/user";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DateCell } from "@/components/date-cell";
import { Display } from "@/components/display";
import { useGlobalStore } from "@/stores/global";
import { SubscriptionDetail } from "./subscription-detail";
import { SubscriptionForm } from "./subscription-form";

export default function UserSubscription({ userId }: { userId: number }) {
  const { t } = useTranslation("user");
  const [loading, setLoading] = useState(false);
  const ref = useRef<ProTableActions>(null);

  return (
    <ProTable<API.UserSubscribe, Record<string, unknown>>
      action={ref}
      actions={{
        render: (row) => [
          <SubscriptionForm
            initialData={row}
            key="edit"
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              await updateUserSubscribe({
                user_id: Number(userId),
                user_subscribe_id: row.id,
                ...values,
              });
              toast.success(t("updateSuccess", "Updated successfully"));
              ref.current?.refresh();
              setLoading(false);
              return true;
            }}
            title={t("editSubscription", "Edit Subscription")}
            trigger={t("edit", "Edit")}
          />,
          <RowMoreActions
            key="more"
            refresh={() => ref.current?.refresh()}
            row={row}
            token={row.token}
            userId={userId}
          />,
        ],
      }}
      columns={[
        {
          accessorKey: "id",
          header: "ID",
        },
        {
          accessorKey: "name",
          header: t("subscriptionName", "Subscription Name"),
          cell: ({ row }) => row.original.subscribe.name,
        },
        {
          accessorKey: "status",
          header: t("status", "Status"),
          cell: ({ row }) => {
            const status = row.getValue("status") as number;
            const expireTime = row.original.expire_time;

            // 如果过期时间为0，说明是永久订阅，应该显示为激活状态
            const displayStatus = status === 3 && expireTime === 0 ? 1 : status;

            const statusMap: Record<
              number,
              {
                label: string;
                variant: "default" | "secondary" | "destructive" | "outline";
              }
            > = {
              0: { label: t("statusPending", "Pending"), variant: "outline" },
              1: { label: t("statusActive", "Active"), variant: "default" },
              2: {
                label: t("statusFinished", "Finished"),
                variant: "secondary",
              },
              3: {
                label: t("statusExpired", "Expired"),
                variant: "destructive",
              },
              4: {
                label: t("statusDeducted", "Deducted"),
                variant: "secondary",
              },
              5: {
                label: t("statusStopped", "Stopped"),
                variant: "destructive",
              },
            };
            const statusInfo = statusMap[displayStatus] || {
              label: "Unknown",
              variant: "outline",
            };
            return (
              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            );
          },
        },
        {
          accessorKey: "used_traffic",
          header: t("usedTraffic", "已用流量"),
          cell: ({ row }) => {
            const upload = (row.original.upload as number) || 0;
            const download = (row.original.download as number) || 0;
            return <Display type="traffic" value={upload + download} />;
          },
        },
        {
          accessorKey: "traffic",
          header: t("totalTraffic", "总流量"),
          cell: ({ row }) => (
            <Display type="traffic" unlimited value={row.getValue("traffic")} />
          ),
        },
        {
          accessorKey: "traffic_addon",
          header: t("trafficAddon", "加购流量包"),
          cell: ({ row }) => {
            const addon = (row.original.traffic_addon as number) || 0;
            return addon > 0 ? (
              <Display type="traffic" value={addon} />
            ) : (
              <span className="text-muted-foreground">--</span>
            );
          },
        },
        {
          accessorKey: "speed_limit",
          header: t("speedLimit", "速度限制"),
          cell: ({ row }) => {
            const speed = row.original?.subscribe?.speed_limit;
            return <Display type="trafficSpeed" value={speed} />;
          },
        },
        {
          accessorKey: "device_limit",
          header: t("useDevice", "使用设备"),
          cell: ({ row }) => {
            const limit = row.original?.subscribe?.device_limit;
            return limit && limit > 0 ? (
              `${limit} 台`
            ) : (
              <span className="text-muted-foreground">--</span>
            );
          },
        },
        {
          accessorKey: "device_count",
          header: t("addonDevice", "加购设备"),
          cell: ({ row }) => {
            const planLimit =
              (row.original?.subscribe?.device_limit as number) || 0;
            const userCount = (row.original.device_count as number) || 0;
            const addon = userCount - planLimit;
            return addon > 0 ? (
              `+${addon} 台`
            ) : (
              <span className="text-muted-foreground">--</span>
            );
          },
        },
        {
          accessorKey: "reset_time",
          header: t("resetTime", "下次重置"),
          cell: ({ row }) => {
            const ts = row.getValue("reset_time") as number;
            return ts && ts > 0 ? (
              <DateCell ts={ts} />
            ) : (
              <span className="text-muted-foreground">
                {t("noReset", "不重置")}
              </span>
            );
          },
        },
        {
          accessorKey: "expire_time",
          header: t("expireTime", "Expire Time"),
          cell: ({ row }) => {
            const ts = row.getValue("expire_time") as number;
            return ts && ts !== 0 ? (
              <DateCell ts={ts} />
            ) : (
              t("permanent", "Permanent")
            );
          },
        },
        {
          accessorKey: "created_at",
          header: t("createdAt", "Created At"),
          cell: ({ row }) => (
            <DateCell ts={row.getValue("created_at") as number} />
          ),
        },
      ]}
      header={{
        title: t("subscriptionList", "Subscription List"),
        toolbar: (
          <SubscriptionForm
            key="create"
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              await createUserSubscribe({
                user_id: Number(userId),
                ...values,
              });
              toast.success(t("createSuccess", "Created successfully"));
              ref.current?.refresh();
              setLoading(false);
              return true;
            }}
            title={t("createSubscription", "Create Subscription")}
            trigger={t("add", "Add")}
          />
        ),
      }}
      request={async (pagination) => {
        const { data } = await getUserSubscribe({
          user_id: userId,
          ...pagination,
        });
        return {
          list: data.data?.list || [],
          total: data.data?.total || 0,
        };
      }}
    />
  );
}

function RowMoreActions({
  userId,
  row,
  token,
  refresh,
}: {
  userId: number;
  row: API.UserSubscribe;
  token: string;
  refresh: () => void;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const resetTokenRef = useRef<HTMLButtonElement>(null);
  const toggleStatusRef = useRef<HTMLButtonElement>(null);
  const deleteRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation("user");
  const { getUserSubscribe: getUserSubscribeUrls } = useGlobalStore();

  return (
    <div className="inline-flex">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{t("more", "More")}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={async (e) => {
              e.preventDefault();
              await navigator.clipboard.writeText(
                getUserSubscribeUrls(row.short, token)[0] || ""
              );
              toast.success(t("copySuccess", "Copied successfully"));
            }}
          >
            {t("copySubscription", "Copy Subscription")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              resetTokenRef.current?.click();
            }}
          >
            {t("resetToken", "Reset Subscription Address")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              toggleStatusRef.current?.click();
            }}
          >
            {row.status === 5
              ? t("resumeSubscribe", "Resume Subscription")
              : t("stopSubscribe", "Stop Subscription")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onSelect={(e) => {
              e.preventDefault();
              deleteRef.current?.click();
            }}
          >
            {t("delete", "Delete")}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              search={{ user_id: userId, user_subscribe_id: row.id }}
              to="/dashboard/log/subscribe"
            >
              {t("subscriptionLogs", "Subscription Logs")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              search={{ user_id: userId, user_subscribe_id: row.id }}
              to="/dashboard/log/reset-subscribe"
            >
              {t("resetLogs", "Reset Logs")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              search={{ user_id: userId, user_subscribe_id: row.id }}
              to="/dashboard/log/subscribe-traffic"
            >
              {t("trafficStats", "Traffic Stats")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              search={{ user_id: userId, subscribe_id: row.id }}
              to="/dashboard/log/traffic-details"
            >
              {t("trafficDetails", "Traffic Details")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              triggerRef.current?.click();
            }}
          >
            {t("onlineDevices", "Online Devices")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hidden triggers for confirm dialogs */}
      <ConfirmButton
        cancelText={t("cancel", "Cancel")}
        confirmText={t("confirm", "Confirm")}
        description={t(
          "resetTokenDescription",
          "This will reset the subscription address and regenerate a new token."
        )}
        onConfirm={async () => {
          await resetUserSubscribeToken({
            user_subscribe_id: row.id,
          });
          toast.success(
            t("resetTokenSuccess", "Subscription address reset successfully")
          );
          refresh();
        }}
        title={t("confirmResetToken", "Confirm Reset Subscription Address")}
        trigger={<Button className="hidden" ref={resetTokenRef} />}
      />

      <ConfirmButton
        cancelText={t("cancel", "Cancel")}
        confirmText={t("confirm", "Confirm")}
        description={
          row.status === 5
            ? t(
                "resumeSubscribeDescription",
                "This will resume the subscription and allow the user to use it."
              )
            : t(
                "stopSubscribeDescription",
                "This will stop the subscription temporarily. User will not be able to use it."
              )
        }
        onConfirm={async () => {
          await toggleUserSubscribeStatus({
            user_subscribe_id: row.id,
          });
          toast.success(
            row.status === 5
              ? t("resumeSubscribeSuccess", "Subscription resumed successfully")
              : t("stopSubscribeSuccess", "Subscription stopped successfully")
          );
          refresh();
        }}
        title={
          row.status === 5
            ? t("confirmResumeSubscribe", "Confirm Resume Subscription")
            : t("confirmStopSubscribe", "Confirm Stop Subscription")
        }
        trigger={<Button className="hidden" ref={toggleStatusRef} />}
      />

      <ConfirmButton
        cancelText={t("cancel", "Cancel")}
        confirmText={t("confirm", "Confirm")}
        description={t(
          "deleteSubscriptionDescription",
          "This action cannot be undone."
        )}
        onConfirm={async () => {
          await deleteUserSubscribe({ user_subscribe_id: row.id });
          toast.success(t("deleteSuccess", "Deleted successfully"));
          refresh();
        }}
        title={t("confirmDelete", "Confirm Delete")}
        trigger={<Button className="hidden" ref={deleteRef} />}
      />

      <SubscriptionDetail
        subscriptionId={row.id}
        trigger={<Button className="hidden" ref={triggerRef} />}
        userId={userId}
      />
    </div>
  );
}
