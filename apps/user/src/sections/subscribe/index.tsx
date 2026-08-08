"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import Empty from "@workspace/ui/composed/empty";
import { Icon } from "@workspace/ui/composed/icon";
import { cn } from "@workspace/ui/lib/utils";
import { querySubscribeList } from "@workspace/ui/services/user/subscribe";
import { queryUserSubscribe } from "@workspace/ui/services/user/user";
import { differenceInDays, formatDate } from "@workspace/ui/utils/formatting";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Display } from "@/components/display";
import { isExpiredSubscription } from "@/utils/subscription";
import { SubscribeDetail } from "./detail";
import Purchase from "./purchase";
import Renewal from "./renewal";

export default function Subscribe() {
  const { t, i18n } = useTranslation("subscribe");
  const unitTimeMap: Record<string, string> = {
    Day: t("Day", "Day"),
    Hour: t("Hour", "Hour"),
    Minute: t("Minute", "Minute"),
    Month: t("Month", "Month"),
    NoLimit: t("NoLimit", "No Limit"),
    Year: t("Year", "Year"),
  };
  const locale = i18n.language;
  const [subscribe, setSubscribe] = useState<API.Subscribe>();

  const { data: subscribeList } = useQuery({
    queryKey: ["querySubscribeList", locale],
    queryFn: async () => {
      console.log("Fetching subscription list...");
      const { data } = await querySubscribeList({ language: locale });
      return data.data?.list || [];
    },
  });

  const { data: userSubscriptions } = useQuery({
    queryKey: ["queryUserSubscribe"],
    queryFn: async () => {
      const { data } = await queryUserSubscribe();
      return data.data?.list || [];
    },
  });

  // Get IDs of plans the user has already purchased
  const purchasedPlanIds = new Set(
    userSubscriptions?.map((sub) => sub.subscribe_id) || []
  );

  // Show plan if: (1) show is true, or (2) user has purchased it
  const filteredData = subscribeList?.filter(
    (item) => item.show || purchasedPlanIds.has(item.id)
  );

  const allRenewable = (
    userSubscriptions?.filter(
      (sub) => sub.expire_time !== 0 && sub.subscribe?.sell
    ) ?? []
  ).sort((a, b) => a.expire_time - b.expire_time);
  const RENEWAL_BANNER_LIMIT = 2;
  const renewableSubscriptions = allRenewable.slice(0, RENEWAL_BANNER_LIMIT);
  const hiddenRenewableCount =
    allRenewable.length - renewableSubscriptions.length;

  return (
    <>
      <div className="space-y-4">
        {renewableSubscriptions.length > 0 && (
          <div className="space-y-4">
            {renewableSubscriptions.map((sub) => {
              const daysLeft = differenceInDays(
                new Date(sub.expire_time),
                new Date()
              );
              const isExpired = isExpiredSubscription(sub);
              return (
                <Card
                  className={cn("relative border-primary bg-primary/5", {
                    "opacity-80": isExpired,
                  })}
                  key={sub.id}
                >
                  {isExpired && (
                    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden text-white mix-blend-difference brightness-150 contrast-200 invert-[0.2]">
                      {Array.from({ length: 8 }).map((_, i) => {
                        const row = Math.floor(i / 4);
                        const col = i % 4;
                        return (
                          <span
                            className="absolute rotate-[-30deg] whitespace-nowrap font-black text-lg opacity-40 shadow-[0px_0px_1px_rgba(255,255,255,0.5)]"
                            key={i}
                            style={{
                              top: `${15 + row * 45}%`,
                              left: `${5 + col * 25 + (row % 2 === 0 ? 0 : 10)}%`,
                            }}
                          >
                            {t("expired", "Expired")}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-muted-foreground text-sm">
                          {t("renewCurrent", "Renew your current subscription")}
                        </span>
                        {isExpired ? (
                          <Badge variant="destructive">
                            {t("expired", "Expired")}
                          </Badge>
                        ) : (
                          daysLeft >= 0 &&
                          daysLeft <= 30 && (
                            <Badge variant="destructive">
                              {t("expiresInDays", "{{days}} days left", {
                                days: daysLeft,
                              })}
                            </Badge>
                          )
                        )}
                      </div>
                      <p
                        className={cn("font-semibold text-xl", {
                          grayscale: isExpired,
                        })}
                      >
                        {sub.subscribe.name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {t("expireAt", "Expires At")}:{" "}
                        {formatDate(sub.expire_time)}
                      </p>
                    </div>
                    <Renewal
                      className="z-20 w-full sm:w-auto sm:min-w-40"
                      id={sub.id}
                      subscribe={sub.subscribe}
                    />
                  </CardContent>
                </Card>
              );
            })}
            {hiddenRenewableCount > 0 && (
              <p className="text-muted-foreground text-sm">
                {t(
                  "moreRenewable",
                  "{{total}} more subscriptions can be renewed from the dashboard",
                  { total: hiddenRenewableCount }
                )}
              </p>
            )}
            <div className="flex items-center gap-3 pt-2">
              <Separator className="flex-1" />
              <span className="text-muted-foreground text-sm">
                {t("orBrowsePlans", "Or browse other plans")}
              </span>
              <Separator className="flex-1" />
            </div>
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {filteredData?.map((item) => (
            <Card className="relative flex flex-col" key={item.id}>
              <CardHeader className="font-medium text-xl">
                {item.name}
              </CardHeader>
              <CardContent className="*:!text-sm flex flex-grow flex-col gap-3">
                {/* <div className='font-semibold'>{t('productDescription')}</div> */}
                <ul className="flex flex-grow flex-col gap-3">
                  {(() => {
                    let parsedDescription: {
                      description: string;
                      features: Array<{
                        icon: string;
                        label: string;
                        type: "default" | "success" | "destructive";
                      }>;
                    };
                    try {
                      parsedDescription = JSON.parse(item.description);
                    } catch {
                      parsedDescription = { description: "", features: [] };
                    }

                    const { description, features } = parsedDescription;
                    return (
                      <>
                        {description && (
                          <li className="text-muted-foreground">
                            {description}
                          </li>
                        )}
                        {features?.map(
                          (
                            feature: {
                              icon: string;
                              label: string;
                              type: "default" | "success" | "destructive";
                            },
                            index: number
                          ) => (
                            <li
                              className={cn("flex items-center gap-1", {
                                "text-muted-foreground line-through":
                                  feature.type === "destructive",
                              })}
                              key={index}
                            >
                              {feature.icon && (
                                <Icon
                                  className={cn("size-5 text-primary", {
                                    "text-green-500":
                                      feature.type === "success",
                                    "text-destructive":
                                      feature.type === "destructive",
                                  })}
                                  icon={feature.icon}
                                />
                              )}
                              {feature.label}
                            </li>
                          )
                        )}
                      </>
                    );
                  })()}
                </ul>
                <SubscribeDetail
                  subscribe={{
                    ...item,
                    name: undefined,
                  }}
                />
              </CardContent>
              <Separator />
              <CardFooter className="flex flex-col gap-2">
                {(() => {
                  const hasDiscount = item.discount && item.discount.length > 0;
                  const shouldShowOriginal = item.show_original_price !== false;

                  const displayPrice =
                    shouldShowOriginal || !hasDiscount
                      ? item.unit_price
                      : Math.round(
                          item.unit_price *
                            (item.discount?.[0]?.quantity ?? 1) *
                            ((item.discount?.[0]?.discount ?? 100) / 100)
                        );

                  const displayQuantity =
                    shouldShowOriginal || !hasDiscount
                      ? 1
                      : (item.discount?.[0]?.quantity ?? 1);

                  const unitTime =
                    unitTimeMap[item.unit_time!] ||
                    t(item.unit_time || "Month", item.unit_time || "Month");

                  return (
                    <h2 className="pb-8 font-semibold text-2xl sm:text-3xl">
                      <Display type="currency" value={displayPrice} />
                      <span className="font-medium text-base">
                        {displayQuantity === 1
                          ? `/${unitTime}`
                          : `/${displayQuantity} ${unitTime}`}
                      </span>
                    </h2>
                  );
                })()}
                <Button
                  className="absolute bottom-0 w-full rounded-t-none rounded-b-xl"
                  onClick={() => {
                    setSubscribe(item);
                  }}
                >
                  {t("buy", "Buy")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        {filteredData?.length === 0 && <Empty />}
      </div>
      <Purchase setSubscribe={setSubscribe} subscribe={subscribe} />
    </>
  );
}
