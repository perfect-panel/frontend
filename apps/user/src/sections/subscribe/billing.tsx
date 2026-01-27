"use client";

import { Separator } from "@workspace/ui/components/separator";
import { useTranslation } from "react-i18next";
import { Display } from "@/components/display";

interface SubscribeBillingProps {
  order?: Partial<
    API.OrderDetail & {
      unit_price: number;
      unit_time: string;
      subscribe_discount: number;
      show_original_price?: boolean;
    }
  >;
}

export function SubscribeBilling({ order }: Readonly<SubscribeBillingProps>) {
  const { t } = useTranslation("subscribe");

  return (
    <>
      <div className="font-semibold">
        {t("billing.billingTitle", "Billing Detail")}
      </div>
      <ul className="grid grid-cols-2 gap-3 *:flex *:items-center *:justify-between lg:grid-cols-1">
        {order?.type && [1, 2].includes(order?.type) && (
          <li>
            <span className="text-muted-foreground">
              {t("billing.duration", "Duration")}
            </span>
            <span>
              {order?.quantity || 1}{" "}
              {t(order?.unit_time || "Month", order?.unit_time || "Month")}
            </span>
          </li>
        )}{" "}
        {order?.show_original_price !== false &&
          order?.type &&
          [1, 2].includes(order?.type) && (
            <li>
              <span className="text-muted-foreground">
                {t("billing.originalPrice", "Original Price (Monthly)")}
              </span>
              <span>
                <Display type="currency" value={order?.unit_price} />
              </span>
            </li>
          )}{" "}
        <li>
          <span className="text-muted-foreground">
            {t("billing.price", "Price")}
          </span>
          <span>
            <Display
              type="currency"
              value={order?.price || order?.unit_price}
            />
          </span>
        </li>
        <li>
          <span className="text-muted-foreground">
            {t("billing.productDiscount", "Product Discount")}
          </span>
          <span>
            <Display type="currency" value={order?.discount} />
          </span>
        </li>
        <li>
          <span className="text-muted-foreground">
            {t("billing.couponDiscount", "Coupon Discount")}
          </span>
          <span>
            <Display type="currency" value={order?.coupon_discount} />
          </span>
        </li>
        <li>
          <span className="text-muted-foreground">
            {t("billing.fee", "Fee")}
          </span>
          <span>
            <Display type="currency" value={order?.fee_amount} />
          </span>
        </li>
        <li>
          <span className="text-muted-foreground">
            {t("billing.gift", "Gift")}
          </span>
          <span>
            <Display type="currency" value={order?.gift_amount} />
          </span>
        </li>
      </ul>
      <Separator />
      <div className="flex items-center justify-between font-semibold">
        <span className="text-muted-foreground">
          {t("billing.total", "Total")}
        </span>
        <span>
          <Display type="currency" value={order?.amount} />
        </span>
      </div>
    </>
  );
}
