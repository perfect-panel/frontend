"use client";

import { useSearch } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { ProTable } from "@workspace/ui/composed/pro-table/pro-table";
import { filterRegisterLog } from "@workspace/ui/services/admin/log";
import { useTranslation } from "react-i18next";
import { DateCell } from "@/components/date-cell";
import { IpLink } from "@/components/ip-link";
import { UserDetail } from "@/sections/user/user-detail";

export default function RegisterLogPage() {
  const { t } = useTranslation("log");
  const sp = useSearch({ strict: false }) as Record<string, string | undefined>;

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
          accessorKey: "register_ip",
          header: t("column.ip", "IP"),
          cell: ({ row }) => (
            <IpLink ip={String((row.original as any).register_ip || "")} />
          ),
        },
        {
          accessorKey: "user_agent",
          header: t("column.userAgent", "User Agent"),
          cell: ({ row }) => {
            const userAgent = String(row.original.user_agent || "");
            return (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="max-w-48 cursor-help truncate">
                      {userAgent}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="wrap-break-word max-w-md">{userAgent}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          },
        },
        {
          accessorKey: "timestamp",
          header: t("column.time", "Time"),
          cell: ({ row }) => <DateCell ts={row.original.timestamp} />,
        },
      ]}
      header={{ title: t("title.register", "Register Log") }}
      initialFilters={initialFilters}
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
