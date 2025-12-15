import { Link } from "@tanstack/react-router";
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
  updateUserSubscribe,
} from "@workspace/ui/services/admin/user";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Display } from "@/components/display";
import { useGlobalStore } from "@/stores/global";
import { formatDate } from "@/utils/common";
import { SubscriptionDetail } from "./subscription-detail";
import { SubscriptionForm } from "./subscription-form";

export default function UserSubscription({ userId }: { userId: number }) {
  const { t } = useTranslation("user");
  const [loading, setLoading] = useState(false);
  const ref = useRef<ProTableActions>(null);
  const { getUserSubscribe: getUserSubscribeUrls } = useGlobalStore();

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
          <Button
            key="copy"
            onClick={async () => {
              await navigator.clipboard.writeText(
                getUserSubscribeUrls(row.token)[0] || ""
              );
              toast.success(t("copySuccess", "Copied successfully"));
            }}
            variant="secondary"
          >
            {t("copySubscription", "Copy Subscription")}
          </Button>,
          <ConfirmButton
            cancelText={t("cancel", "Cancel")}
            confirmText={t("confirm", "Confirm")}
            description={t(
              "deleteSubscriptionDescription",
              "This action cannot be undone."
            )}
            key="delete"
            onConfirm={async () => {
              await deleteUserSubscribe({ user_subscribe_id: row.id });
              toast.success(t("deleteSuccess", "Deleted successfully"));
              ref.current?.refresh();
            }}
            title={t("confirmDelete", "Confirm Delete")}
            trigger={
              <Button variant="destructive">{t("delete", "Delete")}</Button>
            }
          />,
          <RowMoreActions key="more" subId={row.id} userId={userId} />,
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
          accessorKey: "upload",
          header: t("upload", "Upload"),
          cell: ({ row }) => (
            <Display type="traffic" value={row.getValue("upload")} />
          ),
        },
        {
          accessorKey: "download",
          header: t("download", "Download"),
          cell: ({ row }) => (
            <Display type="traffic" value={row.getValue("download")} />
          ),
        },
        {
          accessorKey: "traffic",
          header: t("totalTraffic", "Total Traffic"),
          cell: ({ row }) => (
            <Display type="traffic" unlimited value={row.getValue("traffic")} />
          ),
        },
        {
          accessorKey: "speed_limit",
          header: t("speedLimit", "Speed Limit"),
          cell: ({ row }) => {
            const speed = row.original?.subscribe?.speed_limit;
            return <Display type="trafficSpeed" value={speed} />;
          },
        },
        {
          accessorKey: "device_limit",
          header: t("deviceLimit", "Device Limit"),
          cell: ({ row }) => {
            const limit = row.original?.subscribe?.device_limit;
            return <Display type="number" unlimited value={limit} />;
          },
        },
        {
          accessorKey: "reset_time",
          header: t("resetTime", "Reset Time"),
          cell: ({ row }) => (
            <Display
              type="number"
              unlimited
              value={row.getValue("reset_time")}
            />
          ),
        },
        {
          accessorKey: "expire_time",
          header: t("expireTime", "Expire Time"),
          cell: ({ row }) =>
            row.getValue("expire_time")
              ? formatDate(row.getValue("expire_time"))
              : t("permanent", "Permanent"),
        },
        {
          accessorKey: "created_at",
          header: t("createdAt", "Created At"),
          cell: ({ row }) => formatDate(row.getValue("created_at")),
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

function RowMoreActions({ userId, subId }: { userId: number; subId: number }) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation("user");
  return (
    <div className="inline-flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{t("more", "More")}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link
              search={{ user_id: userId, user_subscribe_id: subId }}
              to="/dashboard/log/subscribe"
            >
              {t("subscriptionLogs", "Subscription Logs")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              search={{ user_id: userId, user_subscribe_id: subId }}
              to="/dashboard/log/reset-subscribe"
            >
              {t("resetLogs", "Reset Logs")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              search={{ user_id: userId, user_subscribe_id: subId }}
              to="/dashboard/log/subscribe-traffic"
            >
              {t("trafficStats", "Traffic Stats")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              search={{ user_id: userId, subscribe_id: subId }}
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

      <SubscriptionDetail
        subscriptionId={subId}
        trigger={<Button className="hidden" ref={triggerRef} />}
        userId={userId}
      />
    </div>
  );
}
