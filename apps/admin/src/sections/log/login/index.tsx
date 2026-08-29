"use client";

import { useSearch } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/badge";
import { ProTable } from "@workspace/ui/composed/pro-table/pro-table";
import { getLogLoginList as filterLoginLog } from "@workspace/ui/services/admin/admin";
import { useTranslation } from "react-i18next";
import { RequestSource } from "@/sections/log/request-source";
import { UserDetail } from "@/sections/user/user-detail";
import { formatDate } from "@/utils/common";
import { useTableSearchParams } from "@/utils/use-table-search-params";

export default function LoginLogPage() {
  const { t } = useTranslation("log");
  const sp = useSearch({ strict: false }) as Record<string, string | undefined>;
  const syncFilters = useTableSearchParams(["date", "user_id"]);

  const today = new Date().toISOString().split("T")[0];

  const initialFilters = {
    date: sp.date || today,
    user_id: sp.user_id ? Number(sp.user_id) : undefined,
  };
  return (
    <ProTable<API.LoginLog, { date?: string; user_id?: number }>
      columns={[
        {
          accessorKey: "user",
          header: t("column.user", "User"),
          cell: ({ row }) => (
            <div>
              <Badge className="capitalize">{row.original.method}</Badge>{" "}
              <UserDetail id={Number(row.original.user_id)} />
            </div>
          ),
        },

        {
          id: "request_source",
          header: t("column.requestSource", "Request source"),
          cell: ({ row }) => (
            <RequestSource ip={row.original.login_ip} metadata={row.original} />
          ),
        },
        {
          accessorKey: "success",
          header: t("column.success", "Success"),
          cell: ({ row }) => (
            <Badge variant={row.original.success ? "default" : "destructive"}>
              {row.original.success
                ? t("success", "Success")
                : t("failed", "Failed")}
            </Badge>
          ),
        },
        {
          accessorKey: "timestamp",
          header: t("column.time", "Time"),
          cell: ({ row }) => formatDate(row.original.timestamp),
        },
      ]}
      header={{ title: t("title.login", "Login Log") }}
      initialFilters={initialFilters}
      onFiltersChange={syncFilters}
      params={[
        { key: "date", type: "date" },
        { key: "user_id", placeholder: t("column.userId", "User ID") },
      ]}
      request={async (pagination, filter) => {
        const { data } = await filterLoginLog({
          page: pagination.page,
          size: pagination.size,
          date: (filter as any)?.date,
          user_id: (filter as any)?.user_id,
        });
        const list = ((data?.data?.list || []) as API.LoginLog[]) || [];
        const total = Number(data?.data?.total || list.length);
        return { list, total };
      }}
    />
  );
}
