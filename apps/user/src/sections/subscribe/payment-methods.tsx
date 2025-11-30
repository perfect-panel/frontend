"use client";

import { useQuery } from "@tanstack/react-query";
import { Label } from "@workspace/ui/components/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { cn } from "@workspace/ui/lib/utils";
import { getAvailablePaymentMethods } from "@workspace/ui/services/user/portal";
import type React from "react";
import { memo } from "react";
import { useTranslation } from "react-i18next";

interface PaymentMethodsProps {
  value: number;
  onChange: (value: number) => void;
  balance?: boolean;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  value,
  onChange,
  balance = true,
}) => {
  const { t } = useTranslation("subscribe");

  const { data } = useQuery({
    queryKey: ["getAvailablePaymentMethods", { balance }],
    queryFn: async () => {
      const { data } = await getAvailablePaymentMethods();
      const list = data.data?.list || [];
      const methods = balance ? list : list.filter((item) => item.id !== -1);
      const defaultMethod = methods.find((item) => item.id)?.id;
      if (defaultMethod) onChange(defaultMethod);
      return methods;
    },
  });
  return (
    <>
      <div className="font-semibold">
        {t("paymentMethod", "Payment Method")}
      </div>
      <RadioGroup
        className="grid grid-cols-2 gap-2 md:grid-cols-5"
        onValueChange={(val) => {
          console.log(val);
          onChange(Number(val));
        }}
        value={String(value)}
      >
        {data?.map((item) => (
          <div className="relative" key={item.id}>
            <RadioGroupItem
              className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
              id={String(item.id)}
              value={String(item.id)}
            />
            <Label
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover py-2 hover:bg-accent hover:text-accent-foreground",
                String(value) === String(item.id) ? "border-primary" : ""
              )}
              htmlFor={String(item.id)}
            >
              <div className="flex size-12 items-center justify-center">
                <img
                  alt={item.name}
                  height={48}
                  src={item.icon || "./assets/payment/balance.svg"}
                  width={48}
                />
              </div>
              <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center">
                {item.name}
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </>
  );
};

export default memo(PaymentMethods);
