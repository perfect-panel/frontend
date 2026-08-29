"use client";

import { useSearch } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/badge";
import { ProTable } from "@workspace/ui/composed/pro-table/pro-table";
import { getLogRegisterList as filterRegisterLog } from "@workspace/ui/services/admin/admin";
import { useTranslation } from "react-i18next";
import { RequestSource } from "@/sections/log/request-source";
import { UserDetail } from "@/sections/user/user-detail";
import { formatDate } from "@/utils/common";
import { useTableSearchParams } from "@/utils/use-table-search-params";

export default function RegisterLogPage() {
  const { t } = useTranslation("log");
  const sp = useSearch({ strict: false }) as Record<string, string | undefined>;
  const syncFilters = useTableSearchParams(["date", "user_id"]);

  const today = new Date().toISOString().split("T")[0];

  const initialFilters = {
    date: sp.date || today,
    user_id: sp.user_id ? Number(sp.user_id) : undefined,
  };
  return (
    <ProTable<API.RegisterLog, { date?: string; user_id?: number }>
      columns={[
        {
          accessorKey: "user",
          header: t("column.user", "User"),
          cell: ({ row }) => <UserDetail id={Number(row.original.user_id)} />,
        },
        {
          accessorKey: "auth_method",
          header: t("column.identifier", "Identifier"),
          cell: ({ row }) => (
            <div className="flex items-center">
              <Badge className="capitalize">{row.original.auth_method}</Badge>
              <span className="ml-1 text-sm">{row.original.identifier}</span>
            </div>
          ),
        },
        {
          id: "request_source",
          header: t("column.requestSource", "Request source"),
          cell: ({ row }) => (
            <RequestSource
              ip={row.original.register_ip}
              metadata={row.original}
            />
          ),
        },
        {
          accessorKey: "timestamp",
          header: t("column.time", "Time"),
          cell: ({ row }) => formatDate(row.original.timestamp),
        },
      ]}
      header={{ title: t("title.register", "Register Log") }}
      initialFilters={initialFilters}
      onFiltersChange={syncFilters}
      params={[
        { key: "date", type: "date" },
        { key: "user_id", placeholder: t("column.userId", "User ID") },
      ]}
      request={async (pagination, filter) => {
        const { data } = await filterRegisterLog({
          page: pagination.page,
          size: pagination.size,
          date: (filter as any)?.date,
          user_id: (filter as any)?.user_id,
        });
        const list = (data?.data?.list || []) as any[];
        const total = Number(data?.data?.total || list.length);
        return { list, total };
      }}
    />
  );
}
