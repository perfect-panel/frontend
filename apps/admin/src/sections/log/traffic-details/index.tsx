"use client";

import { useSearch } from "@tanstack/react-router";
import { ProTable } from "@workspace/ui/composed/pro-table/pro-table";
import { filterTrafficLogDetails } from "@workspace/ui/services/admin/log";
import { formatBytes } from "@workspace/ui/utils/formatting";
import { useTranslation } from "react-i18next";
import { DateCell } from "@/components/date-cell";
import { UserDetail, UserSubscribeDetail } from "@/sections/user/user-detail";
import { useServer } from "@/stores/server";

export default function TrafficDetailsPage() {
  const { t } = useTranslation("log");
  const sp = useSearch({ strict: false }) as Record<string, string | undefined>;
  const { getServerName } = useServer();

  const today = new Date().toISOString().split("T")[0];

  const initialFilters = {
    date: sp.date || today,
    server_id: sp.server_id ? Number(sp.server_id) : undefined,
    user_id: sp.user_id ? Number(sp.user_id) : undefined,
    subscribe_id: sp.subscribe_id ? Number(sp.subscribe_id) : undefined,
  };
  return (
    <ProTable<API.TrafficLogDetails, { search?: string }>
      columns={[
        {
          accessorKey: "server_id",
          header: t("column.server", "Server"),
          cell: ({ row }) => (
            <span>
              {getServerName(row.original.server_id)} ({row.original.server_id})
            </span>
          ),
        },
        {
          accessorKey: "user_id",
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
          accessorKey: "timestamp",
          header: t("column.time", "Time"),
          cell: ({ row }) => <DateCell ts={row.original.timestamp} />,
        },
      ]}
      header={{ title: t("title.trafficDetails", "Traffic Details") }}
      initialFilters={initialFilters}
      params={[
        { key: "date", type: "date" },
        { key: "server_id", placeholder: t("column.serverId", "Server ID") },
        { key: "user_id", placeholder: t("column.userId", "User ID") },
        {
          key: "subscribe_id",
          placeholder: t("column.subscribeId", "Subscribe ID"),
        },
      ]}
      request={async (pagination, filter) => {
        const { data } = await filterTrafficLogDetails({
          page: pagination.page,
          size: pagination.size,
          date: (filter as any)?.date,
          server_id: (filter as any)?.server_id,
          user_id: (filter as any)?.user_id,
          subscribe_id: (filter as any)?.subscribe_id,
        });
        const list = (data?.data?.list || []) as any[];
        const total = Number(data?.data?.total || list.length);
        return { list, total };
      }}
    />
  );
}
