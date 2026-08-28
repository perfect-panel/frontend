"use client";

import { useNavigate } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { postV1PublicOrderReset as resetTraffic } from "@workspace/ui/services/user/user";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { Display } from "@/components/display";
import { useGlobalStore } from "@/stores/global";
import PaymentMethods from "./payment-methods";

interface ResetTrafficProps {
  id: number;
  replacement?: number;
}
export default function ResetTraffic({
  id,
  replacement,
}: Readonly<ResetTrafficProps>) {
  const { t } = useTranslation("subscribe");
  const { getUserInfo } = useGlobalStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [params, setParams] = useState<API.ResetTrafficOrderRequest>({
    payment: -1,
    user_subscribe_id: id,
  });
  const [loading, startTransition] = useTransition();

  useEffect(() => {
    if (id) {
      setParams((prev) => ({
        ...prev,
        quantity: 1,
        user_subscribe_id: id,
      }));
    }
  }, [id]);

  if (!replacement) return;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          {t("resetTraffic", "Reset Traffic")}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-full flex-col overflow-hidden md:h-auto">
        <DialogHeader>
          <DialogTitle>{t("resetTrafficTitle", "Reset Traffic")}</DialogTitle>
          <DialogDescription>
            {t("resetTrafficDescription", "Reset your subscription traffic")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col justify-between text-sm">
          <div className="grid gap-3">
            <div className="flex justify-between font-semibold">
              <span>{t("resetPrice", "Reset Price")}</span>
              <span>
                <Display type="currency" value={replacement} />
              </span>
            </div>
            <PaymentMethods
              onChange={(value) => {
                setParams({
                  ...params,
                  payment: value,
                });
              }}
              value={params.payment ?? -1}
            />
          </div>
          <Button
            className="fixed bottom-0 left-0 w-full rounded-none md:relative md:mt-6"
            disabled={loading}
            onClick={async () => {
              startTransition(async () => {
                try {
                  const response = await resetTraffic(params);
                  const orderNo = response.data.data?.order_no;
                  if (orderNo) {
                    getUserInfo();
                    navigate({
                      to: "/payment",
                      search: { order_no: String(orderNo) },
                    });
                  }
                } catch (error) {
                  console.log(error);
                }
              });
            }}
          >
            {loading && <LoaderCircle className="mr-2 animate-spin" />}
            {t("buyNow", "Buy Now")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
