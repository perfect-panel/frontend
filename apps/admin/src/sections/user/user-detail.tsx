"use client";

import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";
import {
  getUserDetail,
  getUserSubscribeDetail as getUserSubscribeById,
} from "@workspace/ui/services/admin/admin";
import { formatBytes } from "@workspace/ui/utils/formatting";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Display } from "@/components/display";
import { formatDate } from "@/utils/common";

export function UserSubscribeDetail({
  id,
  enabled,
  hoverCard = false,
}: {
  id: number;
  enabled: boolean;
  hoverCard?: boolean;
}) {
  const { t } = useTranslation("user");
  const [hoverOpen, setHoverOpen] = useState(false);

  const { data, isLoading } = useQuery({
    enabled: id !== 0 && enabled && (!hoverCard || hoverOpen),
    queryKey: ["getUserSubscribeById", id],
    queryFn: async () => {
      const { data } = await getUserSubscribeById({ id });
      return data.data;
    },
    staleTime: 60_000,
  });

  if (!id) return "--";

  const usedTraffic = data ? data.upload + data.download : 0;
  const totalTraffic = data?.traffic || 0;

  const subscribeContent = (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 font-medium text-sm">{t("subscriptionInfo")}</h3>
        <div className="rounded-lg bg-muted/30 p-3">
          <ul className="grid gap-3">
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">
                {t("subscriptionId")}
              </span>
              <span>{data?.id || "--"}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {t("subscriptionName")}
              </span>
              <span>{data?.subscribe?.name || "--"}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("token")}</span>
              <div className="font-mono text-xs" title={data?.token || ""}>
                {data?.token || "--"}
              </div>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("trafficUsage")}</span>
              <span>
                {data
                  ? totalTraffic === 0
                    ? `${formatBytes(usedTraffic)} / ${t("unlimited")}`
                    : `${formatBytes(usedTraffic)} / ${formatBytes(totalTraffic)}`
                  : "--"}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("startTime")}</span>
              <span>
                {data?.start_time ? formatDate(data.start_time) : "--"}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("expireTime")}</span>
              <span>
                {data?.expire_time ? formatDate(data.expire_time) : "--"}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {!hoverCard && (
        <div>
          <h3 className="mb-2 font-medium text-sm">
            {t("userInfo")}
            {/* Removed link to legacy user detail page */}
          </h3>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">{t("userId")}</span>
              <span>{data?.user_id}</span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">{t("balance")}</span>
              <span>
                <Display type="currency" value={data?.user.balance} />
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("giftAmount")}</span>
              <span>
                <Display type="currency" value={data?.user?.gift_amount} />
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("commission")}</span>
              <span>
                <Display type="currency" value={data?.user?.commission} />
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("createdAt")}</span>
              <span>
                {data?.user?.created_at && formatDate(data?.user?.created_at)}
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );

  if (hoverCard) {
    return (
      <HoverCard onOpenChange={setHoverOpen} open={hoverOpen}>
        <HoverCardTrigger asChild>
          <Button className="p-0" variant="link">
            {data?.subscribe?.name || `#${id}`}
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-96">
          {isLoading ? t("loading", "Loading...") : subscribeContent}
        </HoverCardContent>
      </HoverCard>
    );
  }

  return subscribeContent;
}

export function UserDetail({ id }: { id: number }) {
  const { t } = useTranslation("user");
  const [hoverOpen, setHoverOpen] = useState(false);

  const { data, isLoading } = useQuery({
    enabled: id !== 0 && hoverOpen,
    queryKey: ["getUserDetail", id],
    queryFn: async () => {
      const { data } = await getUserDetail({ id });
      return data.data;
    },
    staleTime: 60_000,
  });

  if (!id) return "--";

  const identifier =
    data?.auth_methods.find((m) => m.auth_type === "email")?.auth_identifier ||
    data?.auth_methods[0]?.auth_identifier;

  return (
    <HoverCard onOpenChange={setHoverOpen} open={hoverOpen}>
      <HoverCardTrigger asChild>
        <Button asChild className="p-0" variant="link">
          <Link search={{ user_id: id }} to="/dashboard/user">
            {identifier || `#${id}`}
          </Link>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        {isLoading ? (
          <div className="py-4 text-center text-muted-foreground text-sm">
            {t("loading", "Loading...")}
          </div>
        ) : (
          <div className="grid gap-3">
            <ul className="grid gap-3">
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">ID</span>
                <span>{data?.id}</span>
              </li>
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">
                  {t("balance", "Balance")}
                </span>
                <span>
                  <Display type="currency" value={data?.balance} />
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t("giftAmount", "Gift Amount")}
                </span>
                <span>
                  <Display type="currency" value={data?.gift_amount} />
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t("commission", "Commission")}
                </span>
                <span>
                  <Display type="currency" value={data?.commission} />
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t("createdAt", "Created At")}
                </span>
                <span>{data?.created_at && formatDate(data?.created_at)}</span>
              </li>
            </ul>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
