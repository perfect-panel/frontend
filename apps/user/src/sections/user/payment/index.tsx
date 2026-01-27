"use client";

import { useQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Icon } from "@workspace/ui/composed/icon";
import { queryOrderDetail } from "@workspace/ui/services/user/order";
import { purchaseCheckout } from "@workspace/ui/services/user/portal";
import { formatDate } from "@workspace/ui/utils/formatting";
import { useCountDown } from "ahooks";
import { addMinutes, format } from "date-fns";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Display } from "@/components/display";
import { SubscribeBilling } from "@/sections/subscribe/billing";
import { SubscribeDetail } from "@/sections/subscribe/detail";
import { useGlobalStore } from "@/stores/global";
import StripePayment from "./stripe";

const routeApi = getRouteApi("/(main)/payment");

export default function Page() {
  const { t } = useTranslation("order");
  const { getUserInfo } = useGlobalStore();
  const { order_no } = routeApi.useSearch() as { order_no?: string };
  const [enabled, setEnabled] = useState<boolean>(!!order_no);

  useEffect(() => {
    if (order_no) {
      setEnabled(true);
    }
  }, [order_no]);

  const { data } = useQuery({
    enabled: enabled && !!order_no,
    queryKey: ["queryOrderDetail", order_no],
    queryFn: async () => {
      const { data } = await queryOrderDetail({ order_no: order_no! });
      if (data?.data?.status !== 1) {
        getUserInfo();
        setEnabled(false);
      }
      return data?.data;
    },
    refetchInterval: 3000,
  });

  const { data: payment } = useQuery({
    enabled: !!order_no && data?.status === 1,
    queryKey: ["purchaseCheckout", order_no],
    queryFn: async () => {
      const { data } = await purchaseCheckout({
        orderNo: order_no!,
        returnUrl: window.location.href,
      });
      if (data.data?.type === "url" && data.data.checkout_url) {
        window.open(data.data.checkout_url, "_blank");
      }
      return data?.data;
    },
  });

  const [countDown, formattedRes] = useCountDown({
    targetDate:
      data &&
      format(addMinutes(data?.created_at, 15), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
  });

  const { hours, minutes, seconds } = formattedRes;

  const countdownDisplay =
    countDown > 0 ? (
      <>
        {hours.toString().length === 1 ? `0${hours}` : hours} :{" "}
        {minutes.toString().length === 1 ? `0${minutes}` : minutes} :{" "}
        {seconds.toString().length === 1 ? `0${seconds}` : seconds}
      </>
    ) : (
      t("timeExpired", "Time Expired")
    );

  return (
    <div className="container grid gap-4 pt-16 xl:grid-cols-2">
      <Card className="order-2 gap-0 xl:order-1">
        <CardHeader className="flex flex-row items-start">
          <div className="grid gap-0.5">
            <CardTitle className="flex flex-col text-lg">
              {t("orderNumber", "Order Number")}
              <span>{data?.orderNo}</span>
            </CardTitle>
            <CardDescription>
              {t("createdAt", "Created At")}: {formatDate(data?.created_at)}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 p-6 text-sm">
          <div className="font-semibold">
            {t("paymentMethod", "Payment Method")}
          </div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">
                <Badge>{data?.payment.name || data?.payment.platform}</Badge>
              </dt>
            </div>
          </dl>
          <Separator />

          {data?.type && [1, 2].includes(data.type) && (
            <SubscribeDetail
              subscribe={{
                ...data?.subscribe,
                quantity: data?.quantity,
              }}
            />
          )}
          {data?.type === 3 && (
            <>
              <div className="font-semibold">
                {t("resetTraffic", "Reset Traffic")}
              </div>
              <ul className="grid grid-cols-2 gap-3 *:flex *:items-center *:justify-between lg:grid-cols-1">
                <li className="flex items-center justify-between">
                  <span className="line-clamp-2 flex-1 text-muted-foreground">
                    {t("resetPrice", "Reset Price")}
                  </span>
                  <span>
                    <Display type="currency" value={data.amount} />
                  </span>
                </li>
              </ul>
            </>
          )}

          {data?.type === 4 && (
            <>
              <div className="font-semibold">
                {t("balanceRecharge", "Balance Recharge")}
              </div>
              <ul className="grid grid-cols-2 gap-3 *:flex *:items-center *:justify-between lg:grid-cols-1">
                <li className="flex items-center justify-between">
                  <span className="line-clamp-2 flex-1 text-muted-foreground">
                    {t("rechargeAmount", "Recharge Amount")}
                  </span>
                  <span>
                    <Display type="currency" value={data.amount} />
                  </span>
                </li>
              </ul>
            </>
          )}
          <Separator />
          <SubscribeBilling
            order={{
              ...data,
              unit_price: data?.subscribe?.unit_price,
              show_original_price: data?.subscribe?.show_original_price,
            }}
          />
        </CardContent>
      </Card>
      <Card className="order-1 flex flex-auto items-center justify-center xl:order-2">
        <CardContent className="py-16">
          {data?.status && [2, 5].includes(data?.status) && (
            <div className="flex flex-col items-center gap-8 text-center">
              <h3 className="font-bold text-2xl tracking-tight">
                {t("paymentSuccess", "Payment Success")}
              </h3>
              <Icon
                className="text-7xl text-green-500"
                icon="mdi:success-circle-outline"
              />
              <div className="flex gap-4">
                <Button asChild>
                  <Link to="/dashboard">
                    {t("subscribeNow", "Subscribe Now")}
                  </Link>
                </Button>
                <Button variant="outline">
                  <Link to="/document">
                    {t("viewDocument", "View Document")}
                  </Link>
                </Button>
              </div>
            </div>
          )}
          {data?.status === 1 && payment?.type === "url" && (
            <div className="flex flex-col items-center gap-8 text-center">
              <h3 className="font-bold text-2xl tracking-tight">
                {t("waitingForPayment", "Waiting For Payment")}
              </h3>
              <p className="flex items-center font-bold text-3xl">
                {countdownDisplay}
              </p>
              <Icon
                className="text-7xl text-muted-foreground"
                icon="mdi:access-time"
              />
              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    if (payment?.checkout_url) {
                      window.location.href = payment?.checkout_url;
                    }
                  }}
                >
                  {t("goToPayment", "Go To Payment")}
                </Button>
                <Button variant="outline">
                  <Link to="/subscribe">
                    {t("productList", "Product List")}
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {data?.status === 1 && payment?.type === "qr" && (
            <div className="flex flex-col items-center gap-8 text-center">
              <h3 className="font-bold text-2xl tracking-tight">
                {t("scanToPay", "Scan To Pay")}
              </h3>
              <p className="flex items-center font-bold text-3xl">
                {countdownDisplay}
              </p>
              <QRCodeCanvas
                imageSettings={{
                  src: "./assets/payment/alipay_f2f.svg",
                  width: 24,
                  height: 24,
                  excavate: true,
                }}
                size={208}
                value={payment?.checkout_url || ""}
              />
              <div className="flex gap-4">
                <Button asChild>
                  <Link to="/subscribe">
                    {t("productList", "Product List")}
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/order">{t("orderList", "Order List")}</Link>
                </Button>
              </div>
            </div>
          )}

          {data?.status === 1 && payment?.type === "stripe" && (
            <div className="flex flex-col items-center gap-8 text-center">
              <h3 className="font-bold text-2xl tracking-tight">
                {t("waitingForPayment", "Waiting For Payment")}
              </h3>
              <p className="flex items-center font-bold text-3xl">
                {countdownDisplay}
              </p>
              {payment.stripe && <StripePayment {...payment.stripe} />}
              {/* <div className='flex gap-4'>
                <Button asChild>
                  <Link to='/subscribe'>{t('productList', 'Product List')}</Link>
                </Button>
                <Button asChild variant='outline'>
                  <Link to='/order'>{t('orderList', 'Order List')}</Link>
                </Button>
              </div> */}
            </div>
          )}

          {data?.status && [3, 4].includes(data?.status) && (
            <div className="flex flex-col items-center gap-8 text-center">
              <h3 className="font-bold text-2xl tracking-tight">
                {t("orderClosed", "Order Closed")}
              </h3>
              <Icon className="text-7xl text-red-500" icon="mdi:cancel" />
              <div className="flex gap-4">
                <Button asChild>
                  <Link to="/subscribe">
                    {t("productList", "Product List")}
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/order">{t("orderList", "Order List")}</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
