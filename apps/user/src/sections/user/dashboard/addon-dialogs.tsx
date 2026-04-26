"use client";

// V4.3:加购设备 / 加购流量 — 仿「续订」弹窗的购买确认对话框。
//
// 之前直接 fire API 没有任何确认 UI,余额不足时只能从 toast 才知道价格。
// 现在弹窗里清楚展示「数量 / 单价 / 总价 / 余额」,用户确认才扣款。
//
// 价格在前端按 MySubscribeInfo 的 unit_price_per_device + start/expire_time
// 比例计算出来(与后端 proRatedDevicePrice 一致),不再依赖额外 preview 接口。

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { Icon } from "@workspace/ui/composed/icon";
import { addSubscribeDevice } from "@workspace/ui/services/user/device";
import type { MySubscribeInfo } from "@workspace/ui/services/user/subscribe";
import { addTrafficAddon } from "@workspace/ui/services/user/trafficAddon";
import { formatBytes } from "@workspace/ui/utils/formatting";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useGlobalStore } from "@/stores/global";

const cents = (n: number | undefined) => (n ?? 0) / 100;
const fmtMoney = (n: number | undefined) => `¥${cents(n).toFixed(2)}`;

// 与后端 proRatedDevicePrice 同步:按剩余天数比例计费,不足 1 天按 1 天。
function calcDevicePrice(sub: MySubscribeInfo, now = Date.now()) {
  const unit = sub.unit_price_per_device || 0;
  if (unit <= 0) return { amount: 0, ratio: 0, supported: false };
  if (!sub.expire_time || sub.expire_time <= now) {
    return { amount: 0, ratio: 0, supported: true };
  }
  const start = sub.start_time || now;
  const totalDays = Math.max(1, (sub.expire_time - start) / 86_400_000);
  const remainDays = Math.max(0, (sub.expire_time - now) / 86_400_000);
  const ratio = Math.min(1, remainDays / totalDays);
  return {
    amount: Math.round(unit * ratio),
    ratio,
    supported: true,
  };
}

export function AddDeviceDialog({
  sub,
  trigger,
  onSuccess,
}: {
  sub: MySubscribeInfo;
  trigger: React.ReactNode;
  onSuccess: () => void;
}) {
  const { t } = useTranslation("dashboard");
  const { user } = useGlobalStore();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [qty, setQty] = useState(1);

  const balance = user?.balance ?? 0;
  const { amount: perDevice, ratio, supported } = calcDevicePrice(sub);
  // 加购数量上限:不能让 device_count + qty 超过套餐 MaxDeviceCount。
  // 没有 max_device_count 时给个安全上限 100。
  const remainingSlots = sub.max_device_count
    ? Math.max(0, sub.max_device_count - sub.device_count)
    : 100;
  const reachedMax = remainingSlots <= 0;
  const safeQty = Math.max(1, Math.min(qty, remainingSlots || 1));
  const amount = perDevice * safeQty;
  const insufficient = amount > balance;
  const disabled = !supported || reachedMax || submitting;

  // Reset qty when dialog reopens / sub changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (open) setQty(1);
  }, [open]);

  const handleConfirm = async () => {
    if (insufficient) {
      toast.error(
        t("addon.insufficient", "余额不足,需 {{need}},当前 {{have}}", {
          need: fmtMoney(amount),
          have: fmtMoney(balance),
        })
      );
      return;
    }
    setSubmitting(true);
    try {
      await addSubscribeDevice(sub.id, { quantity: safeQty });
      toast.success(
        t("addon.deviceAddedN", "已加购 {{n}} 台设备", { n: safeQty })
      );
      setOpen(false);
      onSuccess();
    } catch {
      // request layer toasts the friendly backend message
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("addon.addDeviceTitle", "加购设备")}</DialogTitle>
          <DialogDescription>
            {t(
              "addon.addDeviceDescN",
              "选择本次要加购的设备数量,费用按订阅剩余时长按比例从账户余额扣除。"
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <Row label={t("addon.plan", "套餐")} value={sub.subscribe_name} />
          <Row
            label={t("addon.deviceCurrent", "当前设备数")}
            value={`${sub.device_count}${
              sub.max_device_count ? ` / ${sub.max_device_count}` : ""
            }`}
          />
          {/* 加购数量:可调,带 +/- 按钮 + 直接输入 */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {t("addon.quantity", "加购数量")}
              {sub.max_device_count ? (
                <span className="ml-2 text-xs">
                  (
                  {t("addon.remainingSlots", "剩余 {{n}} 个槽位", {
                    n: remainingSlots,
                  })}
                  )
                </span>
              ) : null}
            </span>
            <div className="flex items-center gap-2">
              <Button
                disabled={safeQty <= 1 || disabled}
                onClick={() => setQty(Math.max(1, safeQty - 1))}
                size="icon"
                type="button"
                variant="outline"
              >
                <Icon className="size-3" icon="uil:minus" />
              </Button>
              <Input
                className="h-8 w-16 text-center"
                disabled={disabled}
                max={remainingSlots || undefined}
                min={1}
                onChange={(e) => {
                  const n = Number.parseInt(e.target.value || "1", 10);
                  if (!Number.isNaN(n)) {
                    setQty(Math.max(1, Math.min(remainingSlots || 100, n)));
                  }
                }}
                type="number"
                value={safeQty}
              />
              <Button
                disabled={safeQty >= (remainingSlots || 100) || disabled}
                onClick={() =>
                  setQty(Math.min(remainingSlots || 100, safeQty + 1))
                }
                size="icon"
                type="button"
                variant="outline"
              >
                <Icon className="size-3" icon="uil:plus" />
              </Button>
            </div>
          </div>
          {supported && (
            <>
              <Row
                label={t("addon.unitPrice", "套餐单价")}
                value={fmtMoney(sub.unit_price_per_device)}
              />
              <Row
                label={t("addon.proratedRatio", "剩余比例")}
                value={`${(ratio * 100).toFixed(1)}%`}
              />
              <Row
                label={t("addon.perDeviceCharge", "每台应付")}
                value={fmtMoney(perDevice)}
              />
            </>
          )}
          <Separator />
          {supported ? (
            <Row
              bold
              label={t("addon.total", "应付")}
              value={fmtMoney(amount)}
            />
          ) : (
            <p className="text-destructive">
              {t(
                "addon.unsupportedDevice",
                "当前套餐未配置「每设备单价」,联系管理员开通。"
              )}
            </p>
          )}
          <Row
            label={t("addon.balance", "账户余额")}
            value={fmtMoney(balance)}
            valueClassName={insufficient ? "text-destructive" : ""}
          />
          {reachedMax && (
            <p className="text-destructive">
              {t(
                "addon.deviceMaxed",
                "已达套餐最大设备数 {{max}},无法继续加购",
                { max: sub.max_device_count }
              )}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="outline">
            {t("cancel", "取消")}
          </Button>
          <Button disabled={disabled} onClick={handleConfirm}>
            {submitting && (
              <Icon className="mr-1 animate-spin" icon="mdi:loading" />
            )}
            {t("addon.confirmPay", "立即购买")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const GiB = 1024 * 1024 * 1024;

export function AddTrafficDialog({
  sub,
  trigger,
  onSuccess,
}: {
  sub: MySubscribeInfo;
  trigger: React.ReactNode;
  onSuccess: () => void;
}) {
  const { t } = useTranslation("dashboard");
  const { user } = useGlobalStore();
  const [open, setOpen] = useState(false);
  const [gb, setGb] = useState(50);
  const [submitting, setSubmitting] = useState(false);

  const balance = user?.balance ?? 0;
  const unitPrice = sub.traffic_addon_unit_price || 0;
  const unitSize = sub.traffic_addon_unit_size || GiB;
  const supported = unitPrice > 0 && unitSize > 0;

  const bytes = Math.max(0, Math.floor(gb)) * GiB;
  const units = unitSize > 0 ? Math.floor(bytes / unitSize) : 0;
  const amount = unitPrice * units;
  const insufficient = amount > balance;
  const invalid =
    !supported || units <= 0 || bytes % unitSize !== 0 || submitting;

  const handleConfirm = async () => {
    if (insufficient) {
      toast.error(
        t("addon.insufficient", "余额不足,需 {{need}},当前 {{have}}", {
          need: fmtMoney(amount),
          have: fmtMoney(balance),
        })
      );
      return;
    }
    setSubmitting(true);
    try {
      await addTrafficAddon(sub.id, { addon_bytes: bytes });
      toast.success(t("addon.trafficAdded", "已加购 {{gb}} GB", { gb }));
      setOpen(false);
      onSuccess();
    } catch {
      // request layer toasts
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("addon.addTrafficTitle", "加购流量")}</DialogTitle>
          <DialogDescription>
            {t(
              "addon.addTrafficDesc",
              "为当前订阅一次性增加流量额度,费用从账户余额扣除。"
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <Row label={t("addon.plan", "套餐")} value={sub.subscribe_name} />
          <Row
            label={t("addon.trafficUsed", "已用 / 总额")}
            value={`${formatBytes(sub.traffic_used)} / ${formatBytes(
              sub.traffic_total
            )}`}
          />

          <div className="space-y-2">
            <Label htmlFor="addon-gb">
              {t("addon.quantityGB", "加购数量 (GB)")}
            </Label>
            <Input
              id="addon-gb"
              min={1}
              onChange={(e) => setGb(Number(e.target.value) || 0)}
              step={1}
              type="number"
              value={gb}
            />
          </div>

          {supported && (
            <Row
              label={t("addon.unitPrice", "套餐单价")}
              value={`${fmtMoney(unitPrice)} / ${formatBytes(unitSize)}`}
            />
          )}
          <Separator />
          {supported ? (
            <Row
              bold
              label={t("addon.total", "应付")}
              value={fmtMoney(amount)}
            />
          ) : (
            <p className="text-destructive">
              {t(
                "addon.unsupportedTraffic",
                "当前套餐未配置「流量包单价」,联系管理员开通。"
              )}
            </p>
          )}
          <Row
            label={t("addon.balance", "账户余额")}
            value={fmtMoney(balance)}
            valueClassName={insufficient ? "text-destructive" : ""}
          />
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="outline">
            {t("cancel", "取消")}
          </Button>
          <Button disabled={invalid} onClick={handleConfirm}>
            {submitting && (
              <Icon className="mr-1 animate-spin" icon="mdi:loading" />
            )}
            {t("addon.confirmPay", "立即购买")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Row({
  label,
  value,
  bold,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  bold?: boolean;
  valueClassName?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between ${
        bold ? "font-semibold text-base" : "text-muted-foreground"
      }`}
    >
      <span>{label}</span>
      <span className={`text-foreground ${valueClassName || ""}`}>{value}</span>
    </div>
  );
}
