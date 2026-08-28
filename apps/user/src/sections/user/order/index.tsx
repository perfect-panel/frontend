"use client";

import { Link } from "@tanstack/react-router";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  ProList,
  type ProListActions,
} from "@workspace/ui/composed/pro-list/pro-list";
import {
  postV1PublicOrderClose as closeOrder,
  getV1PublicOrderList as queryOrderList,
} from "@workspace/ui/services/user/user";
import { formatDate } from "@workspace/ui/utils/formatting";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Display } from "@/components/display";

export default function Order() {
  const { t } = useTranslation("order");
  const statusMap: Record<number, string> = {
    0: t("status.0", "Status"),
    1: t("status.1", "Pending"),
    2: t("status.2", "Paid"),
    3: t("status.3", "Cancelled"),
    4: t("status.4", "Closed"),
    5: t("status.5", "Completed"),
  };
  const typeMap: Record<number, string> = {
    0: t("type.0", "Type"),
    1: t("type.1", "New Purchase"),
    2: t("type.2", "Renewal"),
    3: t("type.3", "Reset Traffic"),
    4: t("type.4", "Recharge"),
  };

  const ref = useRef<ProListActions>(null);
  return (
    <ProList<API.OrderDetail, Record<string, unknown>>
      action={ref}
      renderItem={(item) => (
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle>
              {t("orderNo", "Order No")}
              <p className="text-sm">{item.order_no}</p>
            </CardTitle>
            <CardDescription className="flex gap-2">
              {item.status === 1 ? (
                <>
                  <Link
                    className={buttonVariants({ size: "sm" })}
                    key="payment"
                    search={{ order_no: item.order_no }}
                    to="/payment"
                  >
                    {t("payment", "Payment")}
                  </Link>
                  <Button
                    key="cancel"
                    onClick={async () => {
                      await closeOrder({ orderNo: item.order_no });
                      ref.current?.refresh();
                    }}
                    size="sm"
                    variant="destructive"
                  >
                    {t("cancel", "Cancel")}
                  </Button>
                </>
              ) : (
                <Link
                  className={buttonVariants({ size: "sm" })}
                  key="detail"
                  search={{ order_no: item.order_no }}
                  to="/payment"
                >
                  {t("detail", "Detail")}
                </Link>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="grid grid-cols-2 gap-3 *:flex *:flex-col lg:grid-cols-4">
              <li>
                <span className="text-muted-foreground">
                  {t("name", "Product Name")}
                </span>
                <span>
                  {item.subscribe.name ||
                    typeMap[item.type] ||
                    t(`type.${item.type}`, "Unknown Type")}
                </span>
              </li>
              <li className="font-semibold">
                <span className="text-muted-foreground">
                  {t("paymentAmount", "Amount")}
                </span>
                <span>
                  <Display type="currency" value={item.amount} />
                </span>
              </li>
              <li className="font-semibold">
                <span className="text-muted-foreground">
                  {t("status.0", "Status")}
                </span>
                <span>
                  {statusMap[item.status] ||
                    t(`status.${item.status}`, "Unknown Status")}
                </span>
              </li>
              <li className="font-semibold">
                <span className="text-muted-foreground">
                  {t("createdAt", "Created At")}
                </span>
                <time>{formatDate(item.created_at)}</time>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
      request={async (pagination, filter) => {
        const response = await queryOrderList({ ...pagination, ...filter });
        return {
          list: response.data.data?.list || [],
          total: response.data.data?.total || 0,
        };
      }}
    />
  );
}
