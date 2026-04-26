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
    // Don't auto-retry: if the order status flips from pending → paid
    // (e.g. third-party webhook arrives between our enabled check and the
    // actual request), the backend correctly returns OrderStatusError. We
    // don't want to spam the user with a useless error toast in that race.
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      // Re-check status before firing — `enabled` may have read a stale
      // cache; suppress the request if the order is no longer pending.
      if (data?.status !== 1) return;
      const { data: resp } = await purchaseCheckout(
        {
          orderNo: order_no!,
          returnUrl: window.location.href,
        },
        // Suppress the global error toast; this endpoint races with the
        // payment webhook and the only "real" error is shown elsewhere
        // (status badge / order page).
        { skipErrorHandler: true }
      );
      if (resp.data?.type === "url" && resp.data.checkout_url) {
        window.open(resp.data.checkout_url, "_blank");
      }
      return resp?.data;
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

  // 订单类型标题:让用户一眼知道在做什么(余额充值 / 订阅 / 续订 / 重置流量)
  const pageTitle = (() => {
    switch (data?.type) {
      case 1:
        return t("orderTypeSubscribe", "订阅支付");
      case 2:
        return t("orderTypeRenewal", "续订支付");
      case 3:
        return t("orderTypeResetTraffic", "重置流量支付");
      case 4:
        return t("orderTypeRecharge", "余额充值");
      default:
        return t("orderTypeGeneric", "订单支付");
    }
  })();

  return (
    <div className="container pt-8">
      {/* V4.3:页面顶部加订单类型标题,避免「余额充值」和「订阅支付」混淆 */}
      <h1 className="mb-4 font-bold text-2xl">{pageTitle}</h1>
      <div className="grid gap-4 xl:grid-cols-2">
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
                  {/* 余额充值订单 (type=4) 用专门的成功文案;其它(订阅/续订/重置)走通用文案 */}
                  {data.type === 4
                    ? t("rechargeSuccess", "Recharge Success")
                    : t("paymentSuccess", "Payment Success")}
                </h3>
                <Icon
                  className="text-7xl text-green-500"
                  icon="mdi:success-circle-outline"
                />
                {data.type === 4 && (
                  <p className="text-muted-foreground text-sm">
                    {t(
                      "rechargeSuccessHint",
                      "{{amount}} 已添加到您的账户余额",
                      {
                        amount: `$${((data.amount ?? 0) / 100).toFixed(2)}`,
                      }
                    )}
                  </p>
                )}
                <div className="flex gap-4">
                  {data.type === 4 ? (
                    <>
                      {/* 充值成功:回仪表盘 / 继续购买 */}
                      <Button asChild>
                        <Link to="/dashboard">
                          {t("backToDashboard", "Back to Dashboard")}
                        </Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link to="/subscribe">
                          {t("productList", "Product List")}
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild>
                        <Link to="/dashboard">
                          {t("subscribeNow", "Subscribe Now")}
                        </Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link to="/">{t("home", "首页")}</Link>
                      </Button>
                    </>
                  )}
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
    </div>
  );
}
