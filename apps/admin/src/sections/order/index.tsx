import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";
import { Separator } from "@workspace/ui/components/separator";
import { Combobox } from "@workspace/ui/composed/combobox";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/pro-table";
import { cn } from "@workspace/ui/lib/utils";
import {
  getOrderList,
  updateOrderStatus,
} from "@workspace/ui/services/admin/order";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { DateCell } from "@/components/date-cell";
import { Display } from "@/components/display";
import { useSubscribe } from "@/stores/subscribe";
import { UserDetail } from "../user/user-detail";

export default function Order() {
  const { t } = useTranslation("order");

  const statusOptions = [
    {
      value: 1,
      label: t("status.1", "Pending"),
      className: "bg-orange-500",
    },
    { value: 2, label: t("status.2", "Paid"), className: "bg-green-500" },
    {
      value: 3,
      label: t("status.3", "Cancelled"),
      className: "bg-gray-500",
    },
    { value: 4, label: t("status.4", "Closed"), className: "bg-red-500" },
    {
      value: 5,
      label: t("status.5", "Completed"),
      className: "bg-green-500",
    },
  ];

  const typeOptions = [
    { value: 1, label: t("type.1", "New Purchase") },
    { value: 2, label: t("type.2", "Renewal") },
    { value: 3, label: t("type.3", "Reset Traffic") },
    { value: 4, label: t("type.4", "Recharge") },
  ];

  const ref = useRef<ProTableActions>(null);

  const { subscribes, getSubscribeName } = useSubscribe();

  return (
    <ProTable<API.Order, any>
      action={ref}
      columns={[
        {
          accessorKey: "order_no",
          header: t("orderNumber", "Order Number"),
        },
        {
          accessorKey: "type",
          header: t("type.0", "Type"),
          cell: ({ row }) => {
            const type = row.getValue("type") as number;
            return (
              typeOptions.find((opt) => opt.value === type)?.label ||
              t(`type.${type}`)
            );
          },
        },
        {
          accessorKey: "subscribe_id",
          header: t("subscribe", "Subscribe"),
          cell: ({ row }) => {
            const order = row.original as API.Order;
            if (order.type === 4) {
              const type = row.getValue("type") as number;
              return (
                typeOptions.find((opt) => opt.value === type)?.label ||
                t(`type.${type}`)
              );
            }
            const name = getSubscribeName(order.subscribe_id);
            const quantity = order.quantity;
            return name ? `${name} × ${quantity}` : "";
          },
        },
        {
          accessorKey: "amount",
          header: t("amount", "Amount"),
          cell: ({ row }) => {
            const order = row.original as API.Order;
            return (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="p-0" variant="link">
                    <Display type="currency" value={order.amount} />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="grid gap-3">
                    {order.trade_no && (
                      <>
                        <div className="font-semibold">
                          {t("tradeNo", "Transaction Number")}
                        </div>
                        <span className="text-muted-foreground">
                          {order.trade_no}
                        </span>
                        <Separator className="my-2" />
                      </>
                    )}
                    <ul className="grid gap-3">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          {t("subscribePrice", "Subscription Price")}
                        </span>
                        <span>
                          <Display type="currency" value={order.price} />
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          {t("discount", "Discount Amount")}
                        </span>
                        <span>
                          <Display type="currency" value={order.discount} />
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          {t("couponDiscount", "Coupon Discount")}
                        </span>
                        <span>
                          <Display
                            type="currency"
                            value={order.coupon_discount}
                          />
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          {t("feeAmount", "Fee Amount")}
                        </span>
                        <span>
                          <Display type="currency" value={order.fee_amount} />
                        </span>
                      </li>
                      <li className="flex items-center justify-between font-semibold">
                        <span className="text-muted-foreground">
                          {t("total", "Total")}
                        </span>
                        <span>
                          <Display type="currency" value={order.amount} />
                        </span>
                      </li>
                    </ul>
                  </div>
                  <Separator className="my-4" />
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {t("method", "Payment Method")}
                      </span>
                      <span>
                        {order.payment?.name || order.payment?.platform}
                      </span>
                    </li>
                  </ul>
                </HoverCardContent>
              </HoverCard>
            );
          },
        },
        {
          accessorKey: "user_id",
          header: t("user", "User"),
          cell: ({ row }) => {
            const order = row.original as API.Order;
            return <UserDetail id={order.user_id} />;
          },
        },
        {
          accessorKey: "updated_at",
          header: t("updateTime", "Update Time"),
          cell: ({ row }) => {
            const order = row.original as API.Order;
            return <DateCell ts={order.updated_at} />;
          },
        },
        {
          accessorKey: "status",
          header: t("status.0", "Status"),
          cell: ({ row }) => {
            const order = row.original as API.Order;
            const option = statusOptions.find(
              (opt) => opt.value === order.status
            );
            if ([1, 3, 4].includes(row.getValue("status"))) {
              return (
                <Combobox<number, false>
                  className={cn(option?.className)}
                  onChange={async (value) => {
                    await updateOrderStatus({
                      id: order.id,
                      status: value,
                    });
                    ref.current?.refresh();
                  }}
                  options={statusOptions}
                  placeholder={t("status.0", "Status")}
                  value={order.status}
                />
              );
            }
            return (
              <Badge>
                {option?.label || t(`status.${row.getValue("status")}`)}
              </Badge>
            );
          },
        },
      ]}
      params={[
        {
          key: "status",
          placeholder: t("status.0", "Status"),
          options: statusOptions.map((item) => ({
            label: item.label,
            value: String(item.value),
          })),
        },
        {
          key: "subscribe_id",
          placeholder: `${t("subscribe", "Subscribe")}`,
          options: subscribes?.map((item) => ({
            label: item.name!,
            value: String(item.id),
          })),
        },
        { key: "search" },
        {
          key: "user_id",
          placeholder: `${t("user", "User")} ID`,
          options: undefined,
        },
      ]}
      request={async (pagination, filter) => {
        const { data } = await getOrderList({ ...pagination, ...filter });
        return {
          list: data.data?.list || [],
          total: data.data?.total || 0,
        };
      }}
    />
  );
}
