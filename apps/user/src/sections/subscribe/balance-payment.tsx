"use client";

// Balance-only payment display.
//
// 业务约定:购买订阅 / 续订 / 加购等"消费"类操作只接受账户余额支付;
// 第三方支付(支付宝、Stripe 等)只用于「充值」入口给余额加钱。
//
// 这个组件代替原来的 <PaymentMethods>:
//   - 显示当前余额
//   - 余额不足时给出红色提示 + 「去充值」按钮
//   - 自动把 payment id 锁定为 -1 (Balance)

import { cn } from "@workspace/ui/lib/utils";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Display } from "@/components/display";
import { useGlobalStore } from "@/stores/global";
import Recharge from "./recharge";

interface BalancePaymentProps {
  /** Total cost in cents — used to check sufficiency. */
  amount?: number;
  /** Setter from parent form; we always force value = -1 (Balance). */
  onChange: (value: number) => void;
  /** Whether to render the "Recharge" link when balance is insufficient. */
  showRechargeLink?: boolean;
}

export function BalancePayment({
  amount,
  onChange,
  showRechargeLink = true,
}: BalancePaymentProps) {
  const { t } = useTranslation("subscribe");
  const { user } = useGlobalStore();

  const balance = user?.balance ?? 0;
  const insufficient = (amount ?? 0) > balance;

  // Lock payment to Balance (id = -1) — only fire once on mount.
  // The parent typically inlines a fresh `onChange` closure each render, so
  // depending on it triggers infinite setState loops. Guarding via ref keeps
  // the side-effect strictly idempotent.
  const lockedRef = useRef(false);
  // Always read the latest onChange via ref so we don't miss updates while
  // still firing only once.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  useEffect(() => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    onChangeRef.current(-1);
  }, []);

  return (
    <div className="space-y-2">
      <div className="font-semibold">{t("paymentMethod", "支付方式")}</div>
      <div
        className={cn(
          "flex items-center justify-between rounded-md border-2 p-3",
          insufficient
            ? "border-destructive/40 bg-destructive/5"
            : "border-primary bg-primary/5"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center">
            <img
              alt="balance"
              height={36}
              src="./assets/payment/balance.svg"
              width={36}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{t("balance", "账户余额")}</span>
            <span
              className={cn(
                "text-xs",
                insufficient ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {t("currentBalance", "当前")}:{" "}
              <Display type="currency" value={balance} />
            </span>
          </div>
        </div>
        {insufficient && showRechargeLink && (
          <Recharge size="sm" type="button" variant="destructive" />
        )}
      </div>
      {insufficient && (
        <p className="text-destructive text-xs">
          {t(
            "balanceInsufficientHint",
            "账户余额不足,请先充值;充值支持第三方支付。"
          )}
        </p>
      )}
    </div>
  );
}
