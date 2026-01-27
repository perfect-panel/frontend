"use client";

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Separator } from "@workspace/ui/components/separator";
import { preCreateOrder, renewal } from "@workspace/ui/services/user/order";
import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import CouponInput from "@/sections/subscribe/coupon-input";
import DurationSelector from "@/sections/subscribe/duration-selector";
import PaymentMethods from "@/sections/subscribe/payment-methods";
import { useGlobalStore } from "@/stores/global";
import { SubscribeBilling } from "./billing";
import { SubscribeDetail } from "./detail";

interface RenewalProps {
  id: number;
  subscribe: API.Subscribe;
}

export default function Renewal({ id, subscribe }: Readonly<RenewalProps>) {
  const { t } = useTranslation("subscribe");
  const { getUserInfo } = useGlobalStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [params, setParams] = useState<Partial<API.RenewalOrderRequest>>({
    quantity: 1,
    payment: -1,
    coupon: "",
    user_subscribe_id: id,
  });
  const [loading, startTransition] = useTransition();
  const lastSuccessOrderRef = useRef<any>(null);

  const { data: order } = useQuery({
    enabled: !!subscribe.id && open,
    queryKey: [
      "preCreateOrder",
      subscribe.id,
      params.quantity,
      params.payment,
      params.coupon,
    ],
    queryFn: async () => {
      try {
        const { data } = await preCreateOrder({
          ...params,
          subscribe_id: subscribe.id,
        } as API.PurchaseOrderRequest);
        const result = data.data;
        if (result) {
          lastSuccessOrderRef.current = result;
        }
        return result;
      } catch (_error) {
        if (lastSuccessOrderRef.current) {
          return lastSuccessOrderRef.current;
        }
      }
    },
  });

  useEffect(() => {
    if (subscribe.id && id) {
      const defaultQuantity =
        subscribe.show_original_price === false && subscribe.discount?.[0]
          ? subscribe.discount[0].quantity
          : 1;
      setParams((prev) => ({
        ...prev,
        quantity: defaultQuantity,
        subscribe_id: subscribe.id,
        user_subscribe_id: id,
      }));
    }
  }, [subscribe.id, id]);

  const handleChange = useCallback(
    (field: keyof typeof params, value: string | number) => {
      setParams((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    startTransition(async () => {
      try {
        const response = await renewal(params as API.RenewalOrderRequest);
        const orderNo = response.data.data?.order_no;
        if (orderNo) {
          getUserInfo();
          navigate({ to: "/payment", search: { order_no: String(orderNo) } });
        }
      } catch (_error) {
        /* empty */
      }
    });
  }, [params, getUserInfo, navigate]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm">{t("renew", "Renew")}</Button>
      </DialogTrigger>
      <DialogContent className="flex h-full flex-col overflow-hidden md:h-auto md:max-w-screen-lg">
        <DialogHeader>
          <DialogTitle>
            {t("renewSubscription", "Renew Subscription")}
          </DialogTitle>
        </DialogHeader>
        <div className="grid w-full gap-3 lg:grid-cols-2">
          <Card className="border-transparent shadow-none md:border-inherit md:shadow">
            <CardContent className="grid gap-3 p-0 text-sm md:p-6">
              <SubscribeDetail
                subscribe={{
                  ...subscribe,
                  quantity: params.quantity,
                }}
              />
              <Separator />
              <SubscribeBilling
                order={{
                  ...order,
                  quantity: params.quantity,
                  unit_price: subscribe?.unit_price,
                  show_original_price: subscribe?.show_original_price,
                }}
              />
            </CardContent>
          </Card>
          <div className="flex flex-col justify-between text-sm">
            <div className="mb-6 grid gap-3">
              <DurationSelector
                discounts={subscribe?.discount}
                onChange={(value) => {
                  handleChange("quantity", value);
                }}
                quantity={params.quantity!}
                showOriginalPrice={subscribe?.show_original_price}
                unitTime={subscribe?.unit_time}
              />
              <CouponInput
                coupon={params.coupon}
                onChange={(value) => handleChange("coupon", value)}
              />
              <PaymentMethods
                onChange={(value) => {
                  handleChange("payment", value);
                }}
                value={params.payment as number}
              />
            </div>
            <Button
              className="fixed bottom-0 left-0 w-full md:relative md:mt-6"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading && <LoaderCircle className="mr-2 animate-spin" />}
              {t("buyNow", "Buy Now")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
