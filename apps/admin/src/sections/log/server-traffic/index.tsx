"use client";

import { Link, useSearch } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { ProTable } from "@workspace/ui/composed/pro-table/pro-table";
import { getLogServerTrafficList as filterServerTrafficLog } from "@workspace/ui/services/admin/admin";
import { formatBytes } from "@workspace/ui/utils/formatting";
import { useTranslation } from "react-i18next";
import { useServer } from "@/stores/server";
import { useTableSearchParams } from "@/utils/use-table-search-params";

export default function ServerTrafficLogPage() {
  const { t } = useTranslation("log");
  const sp = useSearch({ strict: false }) as Record<string, string | undefined>;
  const syncFilters = useTableSearchParams(["date", "server_id"]);
  const { getServerName } = useServer();

  const today = new Date().toISOString().split("T")[0];

  const initialFilters = {
    date: sp.date || today,
    server_id: sp.server_id ? Number(sp.server_id) : undefined,
  };
  return (
    <ProTable<API.ServerTrafficLog, { date?: string; server_id?: number }>
      actions={{
        render: (row) => [
          <Button asChild key="detail">
            <Link
              search={{ date: row.date, server_id: row.server_id }}
              to="/dashboard/log/traffic-details"
            >
              {t("detail", "Detail")}
            </Link>
          </Button>,
        ],
      }}
      columns={[
        {
          accessorKey: "server_id",
          header: t("column.server", "Server"),
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              <Badge>{row.original.server_id}</Badge>
              <span>{getServerName(row.original.server_id)}</span>
            </div>
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
        { accessorKey: "date", header: t("column.date", "Date") },
      ]}
      header={{ title: t("title.serverTraffic", "Server Traffic Log") }}
      initialFilters={initialFilters}
      onFiltersChange={syncFilters}
      params={[
        { key: "date", type: "date" },
        { key: "server_id", placeholder: t("column.serverId", "Server ID") },
      ]}
      request={async (pagination, filter) => {
        const { data } = await filterServerTrafficLog({
          page: pagination.page,
          size: pagination.size,
          date: (filter as any)?.date,
          server_id: (filter as any)?.server_id,
        });
        const list = (data?.data?.list || []) as any[];
        const total = Number(data?.data?.total || list.length);
        return { list, total };
      }}
    />
  );
}
