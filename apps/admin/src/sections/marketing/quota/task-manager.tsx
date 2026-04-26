import { Badge } from "@workspace/ui/components/badge";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Icon } from "@workspace/ui/composed/icon";
import { ProTable } from "@workspace/ui/composed/pro-table/pro-table";
import { queryQuotaTaskList } from "@workspace/ui/services/admin/marketing";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DateCell } from "@/components/date-cell";
import { Display } from "@/components/display";
import { useSubscribe } from "@/stores/subscribe";
import { formatDate } from "@/utils/common";

export default function QuotaTaskManager() {
  const { t } = useTranslation("marketing");
  const [open, setOpen] = useState(false);

  const { subscribes } = useSubscribe();
  const subscribeMap =
    subscribes?.reduce(
      (acc, subscribe) => {
        acc[subscribe.id!] = subscribe.name!;
        return acc;
      },
      {} as Record<number, string>
    ) || {};

  const getStatusBadge = (status: number) => {
    const statusConfig = {
      0: {
        label: t("notStarted", "Not Started"),
        variant: "secondary" as const,
      },
      1: { label: t("inProgress", "In Progress"), variant: "default" as const },
      2: { label: t("completed", "Completed"), variant: "default" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: `${t("status", "Status")} ${status}`,
      variant: "secondary" as const,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <div className="flex cursor-pointer items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" icon="mdi:database-plus" />
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {t("quotaTaskManager", "Quota Task Manager")}
              </p>
              <p className="text-muted-foreground text-sm">
                {t("viewAndManageQuotaTasks", "View and manage quota tasks")}
              </p>
            </div>
          </div>
          <Icon className="size-6" icon="mdi:chevron-right" />
        </div>
      </SheetTrigger>
      <SheetContent className="w-[1000px] max-w-full md:max-w-screen-lg">
        <SheetHeader>
          <SheetTitle>{t("quotaTasks", "Quota Tasks")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-48px-36px-env(safe-area-inset-top))] px-6">
          <div className="mt-4 space-y-4">
            {open && (
              <ProTable<API.QuotaTask, API.QueryQuotaTaskListParams>
                columns={[
                  {
                    accessorKey: "subscribers",
                    header: t("subscribers", "Packages"),
                    size: 200,
                    cell: ({ row }) => {
                      const subscribers = row.getValue(
                        "subscribers"
                      ) as number[];
                      const subscriptionNames =
                        subscribers
                          ?.map((id) => subscribeMap[id])
                          .filter(Boolean) || [];

                      if (subscriptionNames.length === 0) {
                        return (
                          <span className="text-muted-foreground text-sm">
                            {t("noSubscriptions", "No Subscriptions")}
                          </span>
                        );
                      }

                      return (
                        <div className="flex flex-wrap gap-1">
                          {subscriptionNames.map((name, index) => (
                            <span
                              className="rounded bg-muted px-2 py-1 text-xs"
                              key={index}
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      );
                    },
                  },
                  {
                    accessorKey: "is_active",
                    header: t("validOnly", "Valid Only"),
                    size: 120,
                    cell: ({ row }) => {
                      const isActive = row.getValue("is_active") as boolean;
                      return (
                        <span className="text-sm">
                          {isActive ? t("yes", "Yes") : t("no", "No")}
                        </span>
                      );
                    },
                  },
                  {
                    accessorKey: "reset_traffic",
                    header: t("resetTraffic", "Reset Traffic"),
                    size: 120,
                    cell: ({ row }) => {
                      const resetTraffic = row.getValue(
                        "reset_traffic"
                      ) as boolean;
                      return (
                        <span className="text-sm">
                          {resetTraffic ? t("yes", "Yes") : t("no", "No")}
                        </span>
                      );
                    },
                  },
                  {
                    accessorKey: "gift_value",
                    header: t("giftAmount", "Gift Amount"),
                    size: 120,
                    cell: ({ row }) => {
                      const giftValue = row.getValue("gift_value") as number;
                      const task = row.original as API.QuotaTask;
                      const giftType = task.gift_type;

                      return (
                        <div className="font-medium text-sm">
                          {giftType === 1 ? (
                            <Display type="currency" value={giftValue} />
                          ) : (
                            `${giftValue}%`
                          )}
                        </div>
                      );
                    },
                  },
                  {
                    accessorKey: "days",
                    header: t("quotaDays", "Extend Expiration Days"),
                    size: 100,
                    cell: ({ row }) => {
                      const days = row.getValue("days") as number;
                      return (
                        <span className="font-medium">
                          {days} {t("days", "Days")}
                        </span>
                      );
                    },
                  },
                  {
                    accessorKey: "time_range",
                    header: t("timeRange", "Time Range"),
                    size: 180,
                    cell: ({ row }) => {
                      const task = row.original as API.QuotaTask;
                      const startTime = task.start_time;
                      const endTime = task.end_time;

                      if (!(startTime || endTime)) {
                        return (
                          <span className="text-muted-foreground text-sm">
                            {t("noTimeLimit", "No Time Limit")}
                          </span>
                        );
                      }

                      return (
                        <div className="space-y-1 text-xs">
                          {startTime && (
                            <div>
                              {t("startTime", "Start Time")}:{" "}
                              {formatDate(startTime)}
                            </div>
                          )}
                          {endTime && (
                            <div>
                              {t("endTime", "End Time")}: {formatDate(endTime)}
                            </div>
                          )}
                        </div>
                      );
                    },
                  },
                  {
                    accessorKey: "status",
                    header: t("status", "Status"),
                    size: 100,
                    cell: ({ row }) =>
                      getStatusBadge(row.getValue("status") as number),
                  },
                  {
                    accessorKey: "created_at",
                    header: t("createdAt", "Created At"),
                    size: 150,
                    cell: ({ row }) => {
                      const createdAt = row.getValue("created_at") as number;
                      return <DateCell ts={createdAt} />;
                    },
                  },
                ]}
                params={[
                  {
                    key: "status",
                    placeholder: t("status", "Status"),
                    options: [
                      { label: t("notStarted", "Not Started"), value: "0" },
                      { label: t("inProgress", "In Progress"), value: "1" },
                      { label: t("completed", "Completed"), value: "2" },
                    ],
                  },
                ]}
                request={async (pagination, filters) => {
                  const response = await queryQuotaTaskList({
                    ...filters,
                    page: pagination.page,
                    size: pagination.size,
                  });
                  return {
                    list: response.data?.data?.list || [],
                    total: response.data?.data?.total || 0,
                  };
                }}
              />
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
