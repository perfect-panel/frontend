"use client";

import { useSearch } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";
import { Separator } from "@workspace/ui/components/separator";
import { ProTable } from "@workspace/ui/composed/pro-table/pro-table";
import { getLogOrderList as filterOrderLog } from "@workspace/ui/services/admin/admin";
import { useTranslation } from "react-i18next";
import { Display } from "@/components/display";
import { OrderLink } from "@/components/order-link";
import { RequestSource } from "@/sections/log/request-source";
import { UserDetail } from "@/sections/user/user-detail";
import { formatDate } from "@/utils/common";
import { useTableSearchParams } from "@/utils/use-table-search-params";

function PriceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-8">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>
        <Display type="currency" value={value} />
      </dd>
    </div>
  );
}

export default function OrderLogPage() {
  const { t } = useTranslation("log");
  const sp = useSearch({ strict: false }) as Record<string, string | undefined>;
  const syncFilters = useTableSearchParams(["date", "search", "user_id"]);
  const today = new Date().toISOString().split("T")[0];

  const initialFilters = {
    date: sp.date || today,
    search: sp.search || undefined,
    user_id: sp.user_id ? Number(sp.user_id) : undefined,
  };

  const getOrderTypeText = (type: number) => {
    const typeText = t(`orderType.${type}`, { defaultValue: "" });
    return typeText || `${t("unknown", "Unknown")} (${type})`;
  };

  return (
    <ProTable<
      API.OrderLog,
      { date?: string; search?: string; user_id?: number }
    >
      columns={[
        {
          accessorKey: "user_id",
          header: t("column.user", "User"),
          cell: ({ row }) => <UserDetail id={row.original.user_id} />,
        },
        {
          accessorKey: "order_no",
          header: t("column.orderNo", "Order No."),
          cell: ({ row }) => (
            <div className="grid justify-items-start gap-1">
              <OrderLink orderId={row.original.order_no} />
              <Badge variant="outline">
                {getOrderTypeText(row.original.order_type)}
              </Badge>
            </div>
          ),
        },
        {
          accessorKey: "subscribe_id",
          header: t("column.product", "Product"),
          cell: ({ row }) =>
            row.original.order_type === 4 ? (
              <Badge variant="secondary">{getOrderTypeText(4)}</Badge>
            ) : (
              <div className="grid gap-1 text-sm">
                <span className="font-mono">#{row.original.subscribe_id}</span>
                <span className="text-muted-foreground text-xs">
                  {t("column.quantity", "Quantity")} × {row.original.quantity}
                </span>
              </div>
            ),
        },
        {
          accessorKey: "method",
          header: t("column.payment", "Payment"),
          cell: ({ row }) => (
            <div className="grid justify-items-start gap-1">
              <Badge variant="secondary">{row.original.method || "--"}</Badge>
              <span className="text-muted-foreground text-xs">
                {row.original.source || "--"}
                {row.original.payment_id
                  ? ` · #${row.original.payment_id}`
                  : ""}
              </span>
            </div>
          ),
        },
        {
          accessorKey: "amount",
          header: t("column.amount", "Amount"),
          cell: ({ row }) => {
            const order = row.original;
            return (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="h-auto p-0" variant="link">
                    <Display type="currency" value={order.amount} />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="mb-3 font-medium text-sm">
                    {t("priceBreakdown", "Price breakdown")}
                  </div>
                  <dl className="grid gap-3 text-sm">
                    <PriceRow
                      label={t("column.price", "Unit price")}
                      value={order.price}
                    />
                    <PriceRow
                      label={t("column.discount", "Discount")}
                      value={order.discount}
                    />
                    <PriceRow
                      label={t("column.couponDiscount", "Coupon discount")}
                      value={order.coupon_discount}
                    />
                    <PriceRow
                      label={t("column.giftAmount", "Gift amount")}
                      value={order.gift_amount}
                    />
                    <PriceRow
                      label={t("column.feeAmount", "Fee amount")}
                      value={order.fee_amount}
                    />
                    <Separator />
                    <PriceRow
                      label={t("column.total", "Total")}
                      value={order.amount}
                    />
                  </dl>
                </HoverCardContent>
              </HoverCard>
            );
          },
        },
        {
          id: "request_source",
          header: t("column.requestSource", "Request source"),
          cell: ({ row }) => <RequestSource metadata={row.original} />,
        },
        {
          accessorKey: "timestamp",
          header: t("column.time", "Time"),
          cell: ({ row }) => formatDate(row.original.timestamp),
        },
      ]}
      header={{ title: t("title.order", "Order Creation Log") }}
      initialFilters={initialFilters}
      onFiltersChange={syncFilters}
      params={[
        { key: "date", type: "date" },
        {
          key: "search",
          label: t("column.queryOrder", "Order log search"),
          placeholder: t("column.queryOrderPlaceholder", "Search order logs"),
        },
        { key: "user_id", placeholder: t("column.userId", "User ID") },
      ]}
      request={async (pagination, filter) => {
        const { data } = await filterOrderLog({
          page: pagination.page,
          size: pagination.size,
          date: filter?.date,
          search: filter?.search,
          user_id: filter?.user_id,
        });
        const list = data?.data?.list || [];
        return { list, total: Number(data?.data?.total || list.length) };
      }}
    />
  );
}
