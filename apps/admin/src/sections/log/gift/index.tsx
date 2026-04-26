"use client";

import { useSearch } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/badge";
import { ProTable } from "@workspace/ui/composed/pro-table/pro-table";
import { filterGiftLog } from "@workspace/ui/services/admin/log";
import { useTranslation } from "react-i18next";
import { DateCell } from "@/components/date-cell";
import { Display } from "@/components/display";
import { OrderLink } from "@/components/order-link";
import { UserDetail, UserSubscribeDetail } from "@/sections/user/user-detail";

export default function GiftLogPage() {
  const { t } = useTranslation("log");
  const sp = useSearch({ strict: false }) as Record<string, string | undefined>;

  const today = new Date().toISOString().split("T")[0];

  const getGiftTypeText = (type: number) => {
    const typeText = t(`type.${type}`, { defaultValue: "" });
    if (!typeText) {
      return `${t("unknown", "Unknown")} (${type})`;
    }
    return typeText;
  };

  const initialFilters = {
    date: sp.date || today,
    user_id: sp.user_id ? Number(sp.user_id) : undefined,
  };
  return (
    <ProTable<API.GiftLog, { search?: string }>
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
          accessorKey: "order_no",
          header: t("column.orderNo", "Order No."),
          cell: ({ row }) => <OrderLink orderId={row.original.order_no} />,
        },
        {
          accessorKey: "amount",
          header: t("column.amount", "Amount"),
          cell: ({ row }) => (
            <Display type="currency" value={row.original.amount} />
          ),
        },
        {
          accessorKey: "balance",
          header: t("column.balance", "Balance"),
          cell: ({ row }) => (
            <Display type="currency" value={row.original.balance} />
          ),
        },
        {
          accessorKey: "type",
          header: t("column.type", "Type"),
          cell: ({ row }) => (
            <Badge>{getGiftTypeText(row.original.type)}</Badge>
          ),
        },
        { accessorKey: "remark", header: t("column.remark", "Remark") },
        {
          accessorKey: "timestamp",
          header: t("column.time", "Time"),
          cell: ({ row }) => <DateCell ts={row.original.timestamp} />,
        },
      ]}
      header={{ title: t("title.gift", "Gift Log") }}
      initialFilters={initialFilters}
      params={[
        { key: "date", type: "date" },
        { key: "user_id", placeholder: t("column.userId", "User ID") },
      ]}
      request={async (pagination, filter) => {
        const { data } = await filterGiftLog({
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
