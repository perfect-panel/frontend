"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Separator } from "@workspace/ui/components/separator";
import { preCreateOrder, purchase } from "@workspace/ui/services/user/order";
import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import CouponInput from "@/sections/subscribe/coupon-input";
import DurationSelector from "@/sections/subscribe/duration-selector";
import PaymentMethods from "@/sections/subscribe/payment-methods";
import { useGlobalStore } from "@/stores/global";
import { SubscribeBilling } from "./billing";
import { SubscribeDetail } from "./detail";

interface PurchaseProps {
  subscribe?: API.Subscribe;
  setSubscribe: (subscribe?: API.Subscribe) => void;
}

export default function Purchase({
  subscribe,
  setSubscribe,
}: Readonly<PurchaseProps>) {
  const { t } = useTranslation("subscribe");
  const { getUserInfo } = useGlobalStore();
  const router = useRouter();
  const [params, setParams] = useState<Partial<API.PurchaseOrderRequest>>({
    quantity: 1,
    subscribe_id: 0,
    payment: -1,
    coupon: "",
  });
  const [loading, startTransition] = useTransition();
  const lastSuccessOrderRef = useRef<any>(null);

  const { data: order } = useQuery({
    enabled: !!subscribe?.id,
    queryKey: [
      "preCreateOrder",
      subscribe?.id,
      params.quantity,
      params.payment,
      params.coupon,
    ],
    queryFn: async () => {
      try {
        const { data } = await preCreateOrder({
          ...params,
          subscribe_id: subscribe?.id as number,
        } as API.PurchaseOrderRequest);
        const result = data.data;
        if (result) {
          lastSuccessOrderRef.current = result;
        }
        return result;
      } catch (error) {
        if (lastSuccessOrderRef.current) {
          return lastSuccessOrderRef.current;
        }
        throw error;
      }
    },
  });

  useEffect(() => {
    if (subscribe) {
      const defaultQuantity =
        subscribe.show_original_price === false && subscribe.discount?.[0]
          ? subscribe.discount[0].quantity
          : 1;
      setParams((prev) => ({
        ...prev,
        quantity: defaultQuantity,
        subscribe_id: subscribe?.id,
      }));
    }
  }, [subscribe]);

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
        const response = await purchase(params as API.PurchaseOrderRequest);
        const orderNo = response.data.data?.order_no;
        if (orderNo) {
          getUserInfo();
          router.navigate({ to: "/payment", search: { order_no: orderNo } });
        }
      } catch (_error) {
        /* empty */
      }
    });
  }, [params, router, getUserInfo]);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) setSubscribe(undefined);
      }}
      open={!!subscribe?.id}
    >
      <DialogContent className="flex h-full flex-col overflow-hidden border-none p-0 md:h-auto md:max-w-screen-lg">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{t("buySubscription", "Buy Subscription")}</DialogTitle>
        </DialogHeader>
        <div className="grid w-full flex-grow gap-3 overflow-auto p-6 pt-0 lg:grid-cols-2">
          <Card className="border-transparent shadow-none md:border-inherit md:shadow">
            <CardContent className="grid gap-3 text-sm">
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
                quantity={params.quantity as number}
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
