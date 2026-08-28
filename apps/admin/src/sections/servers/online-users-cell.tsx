"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@workspace/ui/components/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { ProTable } from "@workspace/ui/composed/pro-table/pro-table";
import { getUserSubscribeDetail as getUserSubscribeById } from "@workspace/ui/services/admin/admin";
import { formatBytes } from "@workspace/ui/utils/formatting";
import { Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IpLink } from "@/components/ip-link";
import { UserDetail } from "@/sections/user/user-detail";
import { formatDate } from "@/utils/common";

function UserSubscribeInfo({
  subscribeId,
  open,
  type,
  expiredText,
  unlimitedText,
}: {
  subscribeId: number;
  open: boolean;
  type:
    | "account"
    | "subscribeName"
    | "subscribeId"
    | "trafficUsage"
    | "expireTime";
  expiredText: string;
  unlimitedText: string;
}) {
  const { data } = useQuery({
    enabled: subscribeId !== 0 && open,
    queryKey: ["getUserSubscribeById", subscribeId],
    queryFn: async () => {
      const { data } = await getUserSubscribeById({ id: subscribeId });
      return data.data;
    },
  });

  if (!data) return <span className="text-muted-foreground">--</span>;

  switch (type) {
    case "account":
      if (!data.user_id)
        return <span className="text-muted-foreground">--</span>;
      return <UserDetail id={data.user_id} />;

    case "subscribeName":
      if (!data.subscribe?.name)
        return <span className="text-muted-foreground">--</span>;
      return <span className="text-sm">{data.subscribe.name}</span>;

    case "subscribeId":
      if (!data.id) return <span className="text-muted-foreground">--</span>;
      return <span className="font-mono text-sm">{data.id}</span>;

    case "trafficUsage": {
      const usedTraffic = data.upload + data.download;
      const totalTraffic = data.traffic || 0;
      return (
        <div className="min-w-0 text-sm">
          <div className="wrap-break-word">
            {formatBytes(usedTraffic)} /{" "}
            {totalTraffic > 0 ? formatBytes(totalTraffic) : unlimitedText}
          </div>
        </div>
      );
    }

    case "expireTime": {
      if (!data.expire_time)
        return <span className="text-muted-foreground">--</span>;
      const isExpired = data.expire_time < Date.now() / 1000;
      return (
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
          <span className="text-sm">{formatDate(data.expire_time)}</span>
          {isExpired && (
            <Badge className="w-fit px-1 py-0 text-xs" variant="destructive">
              {expiredText}
            </Badge>
          )}
        </div>
      );
    }

    default:
      return <span className="text-muted-foreground">--</span>;
  }
}

export default function OnlineUsersCell({
  status,
}: {
  status?: API.ServerStatus;
}) {
  const { t } = useTranslation("servers");
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <button
          className="flex items-center gap-2 bg-transparent p-0 text-muted-foreground text-sm hover:text-foreground"
          type="button"
        >
          <Users className="h-4 w-4" /> {status?.online.length}
        </button>
      </SheetTrigger>
      <SheetContent className="h-screen w-screen max-w-none sm:h-auto sm:w-[900px] sm:max-w-[90vw]">
        <SheetHeader>
          <SheetTitle>{t("onlineUsers", "Online Users")}</SheetTitle>
        </SheetHeader>
        <div className="h-[calc(100vh-48px-16px)] overflow-y-auto px-6 py-4 sm:h-[calc(100dvh-48px-16px-env(safe-area-inset-top))]">
          <ProTable<API.ServerOnlineUser, Record<string, unknown>>
            columns={[
              {
                accessorKey: "ip",
                header: t("ipAddresses", "IP Addresses"),
                cell: ({ row }) => {
                  const ips = row.original.ip;
                  return (
                    <div className="flex min-w-0 flex-col gap-1">
                      {ips.map((item) => (
                        <div
                          className="whitespace-nowrap text-sm"
                          key={`${item.protocol}-${item.ip}`}
                        >
                          <Badge>{item.protocol}</Badge>
                          <IpLink className="ml-1 font-medium" ip={item.ip} />
                        </div>
                      ))}
                    </div>
                  );
                },
              },
              {
                accessorKey: "user",
                header: t("user", "User"),
                cell: ({ row }) => (
                  <UserSubscribeInfo
                    expiredText={t("expired", "Expired")}
                    open={open}
                    subscribeId={Number(row.original.subscribe_id)}
                    type="account"
                    unlimitedText={t("unlimited", "Unlimited")}
                  />
                ),
              },
              {
                accessorKey: "subscription",
                header: t("subscription", "Subscription"),
                cell: ({ row }) => (
                  <UserSubscribeInfo
                    expiredText={t("expired", "Expired")}
                    open={open}
                    subscribeId={Number(row.original.subscribe_id)}
                    type="subscribeName"
                    unlimitedText={t("unlimited", "Unlimited")}
                  />
                ),
              },
              {
                accessorKey: "subscribeId",
                header: t("subscribeId", "Subscribe ID"),
                cell: ({ row }) => (
                  <UserSubscribeInfo
                    expiredText={t("expired", "Expired")}
                    open={open}
                    subscribeId={Number(row.original.subscribe_id)}
                    type="subscribeId"
                    unlimitedText={t("unlimited", "Unlimited")}
                  />
                ),
              },
              {
                accessorKey: "traffic",
                header: t("traffic", "Traffic"),
                cell: ({ row }) => (
                  <UserSubscribeInfo
                    expiredText={t("expired", "Expired")}
                    open={open}
                    subscribeId={Number(row.original.subscribe_id)}
                    type="trafficUsage"
                    unlimitedText={t("unlimited", "Unlimited")}
                  />
                ),
              },
              {
                accessorKey: "expireTime",
                header: t("expireTime", "Expire Time"),
                cell: ({ row }) => (
                  <UserSubscribeInfo
                    expiredText={t("expired", "Expired")}
                    open={open}
                    subscribeId={Number(row.original.subscribe_id)}
                    type="expireTime"
                    unlimitedText={t("unlimited", "Unlimited")}
                  />
                ),
              },
            ]}
            header={{ hidden: true }}
            request={async () => ({
              list: status?.online || [],
              total: status?.online?.length || 0,
            })}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
