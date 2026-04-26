"use client";

import { useSearch } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/badge";
import { ProTable } from "@workspace/ui/composed/pro-table/pro-table";
import { filterMobileLog } from "@workspace/ui/services/admin/log";
import { useTranslation } from "react-i18next";
import { DateCell } from "@/components/date-cell";

export default function MobileLogPage() {
  const { t } = useTranslation("log");
  const sp = useSearch({ strict: false }) as Record<string, string | undefined>;

  const today = new Date().toISOString().split("T")[0];

  const initialFilters = {
    search: sp.search || undefined,
    date: sp.date || today,
  };
  return (
    <ProTable<API.MessageLog, { search?: string }>
      columns={[
        {
          accessorKey: "platform",
          header: t("column.platform", "Platform"),
          cell: ({ row }) => <Badge>{row.getValue("platform")}</Badge>,
        },
        { accessorKey: "to", header: t("column.to", "To") },
        { accessorKey: "subject", header: t("column.subject", "Subject") },
        {
          accessorKey: "content",
          header: t("column.content", "Content"),
          cell: ({ row }) => (
            <pre className="wrap-break-word max-w-[480px] overflow-auto whitespace-pre-wrap text-xs">
              {JSON.stringify(row.original.content || {}, null, 2)}
            </pre>
          ),
        },
        {
          accessorKey: "status",
          header: t("column.status", "Status"),
          cell: ({ row }) => {
            const status = row.original.status;
            const getStatusVariant = (status: any) => {
              if (status === 1) {
                return "default";
              }
              if (status === 0) {
                return "destructive";
              }
              return "outline";
            };

            const getStatusText = (status: any) => {
              if (status === 1) return t("sent", "Sent");
              if (status === 0) return t("failed", "Failed");
              return t("unknown", "Unknown");
            };

            return (
              <Badge variant={getStatusVariant(status)}>
                {getStatusText(status)}
              </Badge>
            );
          },
        },
        {
          accessorKey: "created_at",
          header: t("column.time", "Time"),
          cell: ({ row }) => <DateCell ts={row.original.created_at} />,
        },
      ]}
      header={{ title: t("title.mobile", "SMS Log") }}
      initialFilters={initialFilters}
      params={[{ key: "search" }, { key: "date", type: "date" }]}
      request={async (pagination, filter) => {
        const { data } = await filterMobileLog({
          page: pagination.page,
          size: pagination.size,
          search: filter?.search,
          date: (filter as any)?.date,
        });
        const list = ((data?.data?.list || []) as API.MessageLog[]) || [];
        const total = Number(data?.data?.total || list.length);
        return { list, total };
      }}
    />
  );
}
