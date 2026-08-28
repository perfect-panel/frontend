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
import { EnhancedInput } from "@workspace/ui/composed/enhanced-input";
import { postV1PublicOrderRecharge as recharge } from "@workspace/ui/services/user/user";
import { unitConversion } from "@workspace/ui/utils/unit-conversions";
import { LoaderCircle } from "lucide-react";
import type React from "react";
import { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { useGlobalStore } from "@/stores/global";
import PaymentMethods from "./payment-methods";

export default function Recharge(
  props: Readonly<React.ComponentProps<typeof Button>>
) {
  const { t } = useTranslation("subscribe");
  const { common } = useGlobalStore();
  const navigate = useNavigate();
  const { currency } = common;

  const [open, setOpen] = useState<boolean>(false);
  const [loading, startTransition] = useTransition();
  const [availableMethodsCount, setAvailableMethodsCount] = useState<number>(0);

  const [params, setParams] = useState<API.RechargeOrderRequest>({
    amount: 0,
    payment: 1,
  });

  const hasNoPaymentMethods = availableMethodsCount === 0;
  const isButtonDisabled = loading || !params.amount || hasNoPaymentMethods;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button {...props}>{t("recharge", "Recharge")}</Button>
      </DialogTrigger>
      <DialogContent className="flex h-full flex-col overflow-hidden md:h-auto">
        <DialogHeader>
          <DialogTitle>{t("balanceRecharge", "Balance Recharge")}</DialogTitle>
          <DialogDescription>
            {t("rechargeDescription", "Recharge your account balance")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col justify-between text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">
              {t("rechargeAmount", "Recharge Amount")}
            </div>
            <div className="flex">
              <EnhancedInput
                formatInput={(value) => unitConversion("centsToDollars", value)}
                formatOutput={(value) =>
                  unitConversion("dollarsToCents", value)
                }
                min={0}
                onValueChange={(value) => {
                  setParams((prev) => ({
                    ...prev,
                    amount: value as number,
                  }));
                }}
                placeholder={t("enterAmount", "Enter Amount")}
                prefix={currency.currency_symbol}
                suffix={currency.currency_unit}
                type="number"
                value={params.amount}
              />
            </div>
            <PaymentMethods
              balance={false}
              onAvailableMethodsChange={setAvailableMethodsCount}
              onChange={(value) => setParams({ ...params, payment: value })}
              value={params.payment ?? -1}
            />
            {hasNoPaymentMethods && (
              <div className="text-muted-foreground text-sm">
                {t(
                  "noPaymentMethodsAvailable",
                  "No payment methods available for recharge"
                )}
              </div>
            )}
          </div>
          <Button
            className="fixed bottom-0 left-0 w-full rounded-none md:relative md:mt-6"
            disabled={isButtonDisabled}
            onClick={() => {
              startTransition(async () => {
                try {
                  const response = await recharge(params);
                  const orderNo = response.data.data?.order_no;
                  if (orderNo) {
                    navigate({
                      to: "/payment",
                      search: { order_no: String(orderNo) },
                    });
                    setOpen(false);
                  }
                } catch (_error) {
                  /* empty */
                }
              });
            }}
          >
            {loading && <LoaderCircle className="mr-2 animate-spin" />}
            {t("rechargeNow", "Recharge Now")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
