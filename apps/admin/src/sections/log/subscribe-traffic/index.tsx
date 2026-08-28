"use client";

import { Link, useSearch } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { ProTable } from "@workspace/ui/composed/pro-table/pro-table";
import { getLogSubscribeTrafficList as filterUserSubscribeTrafficLog } from "@workspace/ui/services/admin/admin";
import { formatBytes } from "@workspace/ui/utils/formatting";
import { useTranslation } from "react-i18next";
import { UserDetail, UserSubscribeDetail } from "@/sections/user/user-detail";
import { useTableSearchParams } from "@/utils/use-table-search-params";

export default function SubscribeTrafficLogPage() {
  const { t } = useTranslation("log");
  const sp = useSearch({ strict: false }) as Record<string, string | undefined>;
  const syncFilters = useTableSearchParams([
    "date",
    "user_id",
    "user_subscribe_id",
  ]);

  const today = new Date().toISOString().split("T")[0];

  const initialFilters = {
    date: sp.date || today,
    user_id: sp.user_id ? Number(sp.user_id) : undefined,
    user_subscribe_id: sp.user_subscribe_id
      ? Number(sp.user_subscribe_id)
      : undefined,
  };
  return (
    <ProTable<
      API.UserSubscribeTrafficLog,
      { date?: string; user_id?: number; user_subscribe_id?: number }
    >
      actions={{
        render: (row) => [
          <Button asChild key="detail">
            <Link
              search={{
                date: row.date,
                user_id: row.user_id,
                subscribe_id: row.subscribe_id,
              }}
              to="/dashboard/log/traffic-details"
            >
              {t("detail", "Detail")}
            </Link>
          </Button>,
        ],
      }}
      columns={[
        {
          accessorKey: "user",
          header: t("column.user", "User"),
          cell: ({ row }) => <UserDetail id={Number(row.original.user_id)} />,
        },
        {
          accessorKey: "subscribe_id",
          header: t("column.subscribe", "Subscribe"),
          cell: ({ row }) => (
            <UserSubscribeDetail
              enabled
              hoverCard
              id={Number(row.original.subscribe_id)}
            />
          ),
        },
        {
          accessorKey: "upload",
          header: t("column.upload", "Upload"),
          cell: ({ row }) => formatBytes(row.original.upload),
        },
        {
          accessorKey: "download",
          header: t("column.download", "Download"),
          cell: ({ row }) => formatBytes(row.original.download),
        },
        {
          accessorKey: "total",
          header: t("column.total", "Total"),
          cell: ({ row }) => formatBytes(row.original.total),
        },
        {
          accessorKey: "date",
          header: t("column.date", "Date"),
        },
      ]}
      header={{ title: t("title.subscribeTraffic", "Subscribe Traffic Log") }}
      initialFilters={initialFilters}
      onFiltersChange={syncFilters}
      params={[
        { key: "date", type: "date" },
        { key: "user_id", placeholder: t("column.userId", "User ID") },
        {
          key: "user_subscribe_id",
          placeholder: t("column.userSubscribeId", "User subscription ID"),
        },
      ]}
      request={async (pagination, filter) => {
        const { data } = await filterUserSubscribeTrafficLog({
          page: pagination.page,
          size: pagination.size,
          date: (filter as any)?.date,
          user_id: (filter as any)?.user_id,
          user_subscribe_id: (filter as any)?.user_subscribe_id,
        });
        const list =
          ((data?.data?.list || []) as API.UserSubscribeTrafficLog[]) || [];
        const total = Number(data?.data?.total || list.length);
        return { list, total };
      }}
    />
  );
}
