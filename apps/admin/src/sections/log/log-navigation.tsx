"use client";

import { Link, useLocation, useSearch } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Check, ChevronDown, ListFilter } from "lucide-react";
import { useTranslation } from "react-i18next";

const logGroups = [
  {
    key: "account",
    routes: [
      { key: "login", url: "/dashboard/log/login" },
      { key: "register", url: "/dashboard/log/register" },
      { key: "subscribe", url: "/dashboard/log/subscribe" },
      { key: "resetSubscribe", url: "/dashboard/log/reset-subscribe" },
    ],
  },
  {
    key: "communication",
    routes: [
      { key: "email", url: "/dashboard/log/email" },
      { key: "mobile", url: "/dashboard/log/mobile" },
    ],
  },
  {
    key: "traffic",
    routes: [
      { key: "serverTraffic", url: "/dashboard/log/server-traffic" },
      { key: "subscribeTraffic", url: "/dashboard/log/subscribe-traffic" },
      { key: "trafficDetails", url: "/dashboard/log/traffic-details" },
    ],
  },
  {
    key: "finance",
    routes: [
      { key: "order", url: "/dashboard/log/order" },
      { key: "balance", url: "/dashboard/log/balance" },
      { key: "commission", url: "/dashboard/log/commission" },
      { key: "gift", url: "/dashboard/log/gift" },
    ],
  },
] as const;

export function LogNavigation() {
  const { t } = useTranslation("log");
  const pathname = useLocation({ select: (location) => location.pathname });
  const search = useSearch({ strict: false });

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-3 shadow-xs">
      <div className="flex items-center gap-2">
        <ListFilter className="size-4 text-muted-foreground" />
        <div>
          <div className="font-medium text-sm">
            {t("navigation.title", "Log explorer")}
          </div>
          <div className="text-muted-foreground text-xs">
            {t(
              "navigation.description",
              "Switch log sources without leaving the current investigation."
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {logGroups.map((group) => {
          const activeRoute = group.routes.find(
            (route) => route.url === pathname
          );
          const groupLabel = t(`navigation.group.${group.key}`, group.key);

          return (
            <DropdownMenu key={group.key}>
              <DropdownMenuTrigger asChild>
                <Button variant={activeRoute ? "secondary" : "outline"}>
                  <span>
                    {activeRoute
                      ? `${groupLabel} · ${t(`navigation.item.${activeRoute.key}`, activeRoute.key)}`
                      : groupLabel}
                  </span>
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-52">
                <DropdownMenuLabel>{groupLabel}</DropdownMenuLabel>
                {group.routes.map((route) => (
                  <DropdownMenuItem asChild key={route.key}>
                    <Link
                      className="flex justify-between"
                      search={search}
                      to={route.url}
                    >
                      <span>
                        {t(`navigation.item.${route.key}`, route.key)}
                      </span>
                      {route.url === pathname && <Check className="size-4" />}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}
      </div>
    </div>
  );
}
