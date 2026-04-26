"use client";

// Device-billing My Subscribes view (plan section 6.1).
// Renders alongside the legacy dashboard content; shows only subscriptions
// that actually have device slots (device_count > 0).

import { useQuery } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Progress } from "@workspace/ui/components/progress";
import { Separator } from "@workspace/ui/components/separator";
import { Icon } from "@workspace/ui/composed/icon";
import { cn } from "@workspace/ui/lib/utils";
import {
  deleteAddonDevice,
  disableDevice,
  enableDevice,
  renameDevice,
  resetAllDevices,
  resetDevice,
} from "@workspace/ui/services/user/device";
import type {
  MySubscribeDevice,
  MySubscribeInfo,
} from "@workspace/ui/services/user/subscribe";
import { queryMySubscribes } from "@workspace/ui/services/user/subscribe";
import { queryUserSubscribe } from "@workspace/ui/services/user/user";
import { formatBytes } from "@workspace/ui/utils/formatting";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useGlobalStore } from "@/stores/global";
import { getPlatform } from "@/utils/common";
import Renewal from "../../subscribe/renewal";
import Unsubscribe from "../../subscribe/unsubscribe";
import { AddDeviceDialog, AddTrafficDialog } from "./addon-dialogs";
import {
  AppDownloadGrid,
  PlatformTabs,
  useApplications,
} from "./app-download-grid";

function StatusBadge({ status }: { status: MySubscribeInfo["status"] }) {
  const { t } = useTranslation("dashboard");
  const variants: Record<typeof status, { label: string; color: string }> = {
    normal: {
      label: t("subscribe.status.normal", "Normal"),
      color: "bg-green-500 hover:bg-green-500",
    },
    throttled: {
      label: t("subscribe.status.throttled", "Throttled"),
      color: "bg-orange-500 hover:bg-orange-500",
    },
    cutoff: {
      label: t("subscribe.status.cutoff", "Cut-off"),
      color: "bg-destructive hover:bg-destructive",
    },
  };
  const v = variants[status] || variants.normal;
  return <Badge className={cn("text-white", v.color)}>{v.label}</Badge>;
}

function ThrottleBanner({ sub }: { sub: MySubscribeInfo }) {
  const { t } = useTranslation("dashboard");
  if (sub.status !== "throttled" || !sub.cut_off_at) return null;
  const remainMs = sub.cut_off_at - Date.now();
  if (remainMs <= 0) return null;
  const hours = Math.floor(remainMs / 3_600_000);
  const minutes = Math.floor((remainMs % 3_600_000) / 60_000);
  return (
    <div className="flex flex-col gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2">
        <Icon
          className="size-5 text-destructive"
          icon="uil:exclamation-triangle"
        />
        <div>
          <p className="font-medium text-destructive">
            {t("banner.throttled", "Throttled to 1 Mbps")}
          </p>
          <p className="text-muted-foreground text-sm">
            {t("banner.cutOffIn", "Will cut off in {{hours}}h {{minutes}}m", {
              hours,
              minutes,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

function DeviceCard({
  device,
  onChanged,
  isSelected,
  onSelect,
  lineIdx,
  onLineChange,
  showNameHint,
}: {
  device: MySubscribeDevice;
  onChanged: () => void;
  /** V4.3 第一档改造:这台设备是否被选为"客户端导入目标"。
   *  套餐只渲染一次客户端区域,会用被选中设备的 URL 导入。 */
  isSelected: boolean;
  /** 点击卡片选中此设备 */
  onSelect: () => void;
  /** 此设备当前选中的线路索引(由 SubscribeBlock 集中管理) */
  lineIdx: number;
  /** 用户切换此设备的线路 */
  onLineChange: (idx: number) => void;
  /** 命名提示去重:套餐内只在第一张默认名设备显示,其它静默 */
  showNameHint: boolean;
}) {
  const { t } = useTranslation("dashboard");
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(device.device_name);
  const todayHuman = formatBytes(device.today_traffic || 0);

  // V4.3:相对时间(刚刚 / X 分钟前 / X 小时前 / 日期),让用户一眼看到"多久没用了"
  const lastSeenAbs = device.last_seen_at
    ? new Date(device.last_seen_at).toLocaleString()
    : t("device.never", "从未上线");
  const lastSeenRel = (() => {
    if (!device.last_seen_at) return t("device.never", "从未上线");
    const ms = Date.now() - device.last_seen_at;
    if (ms < 60_000) return t("device.justNow", "刚刚");
    if (ms < 3_600_000)
      return t("device.minutesAgo", "{{n}} 分钟前", {
        n: Math.floor(ms / 60_000),
      });
    if (ms < 86_400_000)
      return t("device.hoursAgo", "{{n}} 小时前", {
        n: Math.floor(ms / 3_600_000),
      });
    return t("device.daysAgo", "{{n}} 天前", {
      n: Math.floor(ms / 86_400_000),
    });
  })();

  // 在线状态:5 分钟内有上报视为在线 / 1 小时内为最近活跃 / 否则离线
  const onlineState: "online" | "recent" | "offline" = (() => {
    if (!device.last_seen_at) return "offline";
    const ms = Date.now() - device.last_seen_at;
    if (ms < 5 * 60_000) return "online";
    if (ms < 60 * 60_000) return "recent";
    return "offline";
  })();
  const isDisabled = device.status === 0;

  // 按设备名智能选图标(含关键词时切到对应图标,默认手机)
  const deviceIcon = (() => {
    const n = (device.device_name || "").toLowerCase();
    if (/(电脑|computer|laptop|pc|mac|台式)/i.test(n)) return "uil:laptop";
    if (/(平板|ipad|tablet)/i.test(n)) return "uil:tablet";
    if (/(路由|router|wifi)/i.test(n)) return "uil:wifi-router";
    if (/(电视|tv|盒子|box)/i.test(n)) return "uil:desktop";
    if (/(server|服务器)/i.test(n)) return "uil:server";
    return "uil:mobile-android";
  })();

  const submitRename = async () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === device.device_name) {
      setRenaming(false);
      return;
    }
    try {
      await renameDevice(device.id, { name: trimmed });
      toast.success(t("device.renamed", "已重命名"));
      setRenaming(false);
      onChanged();
    } catch {
      // request layer toasts
    }
  };

  const copyUrl = (url?: string) => {
    const target = url || device.subscribe_url;
    navigator.clipboard?.writeText(target).then(
      () => toast.success(t("copySuccess", "订阅链接已复制")),
      () => toast.error(t("copyFailed", "复制失败,请手动选中复制"))
    );
  };

  // V4.3:admin 配置的多个订阅域名(主线 + 备用 + CDN)→ 多条 URL,
  // 全部展示给用户选择。subscribe_urls 兜底为单条 subscribe_url(老接口兼容)。
  const subscribeUrls =
    device.subscribe_urls && device.subscribe_urls.length > 0
      ? device.subscribe_urls
      : [device.subscribe_url];

  // 用户多次反馈看不到命名提示 — 现实场景中设备一开始就有默认名「设备 N」,
  // 所以 input placeholder 永远不会触发。这里把"建议命名"做成永驻 hint,
  // 当名字仍是默认「设备 N」(后端兜底)或空时,直接在卡片上提示用户该改名。
  const isDefaultName =
    !device.device_name || /^设备\s*\d+$/.test(device.device_name);

  // V4.3 第一档改造:从未连接的设备只显示一行 ghost 提示,不展开 3 列状态网格(信息密度太低)
  const neverConnected = !(device.last_seen_at || device.today_traffic);

  // V4.3 第二档改造:订阅链接默认折叠 — URL 是给机器看的,默认占地太大。
  // 折叠时只显示标签 + 主操作(复制/QR);展开后才显示完整 URL 列表。
  const [urlExpanded, setUrlExpanded] = useState(false);

  return (
    // V4.3:卡片可点击 → 选为客户端导入目标。
    // 选中态用 data-selected="true" + 全局 CSS 上色(因 catch-all 用了 !important
    // 普通 className 的 bg-primary/X 会被覆盖,这里走 data-attribute + 专属规则)。
    <Card
      className={cn(
        "relative cursor-pointer transition-all",
        device.status === 0 && "opacity-60",
        isSelected
          ? "shadow-xl ring-2 ring-primary"
          : "hover:ring-1 hover:ring-primary/30"
      )}
      data-selected={isSelected || undefined}
      onClick={(e) => {
        // 只有点击卡片空白处才选中,点按钮 / 输入框 / 链接都不触发
        const target = e.target as HTMLElement;
        if (target.closest("button, input, a, [role='button'], [role='tab']"))
          return;
        onSelect();
      }}
    >
      {/* 选中徽章 — 右上角浮动,字号 text-xs(12px),清晰可读 */}
      {isSelected && (
        <span className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 font-medium text-primary-foreground text-xs shadow-md">
          <Icon className="size-3" icon="uil:check-circle" />
          {t("device.activeForImport", "客户端使用此设备")}
        </span>
      )}
      <CardHeader className="space-y-2 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {/* 在线状态点:绿=在线 / 黄=最近 / 灰=离线 / 红=禁用 */}
            <span
              className={cn(
                "size-2.5 shrink-0 rounded-full",
                isDisabled
                  ? "bg-destructive"
                  : onlineState === "online"
                    ? "animate-pulse bg-green-500"
                    : onlineState === "recent"
                      ? "bg-amber-400"
                      : "bg-muted-foreground/40"
              )}
              title={
                isDisabled
                  ? t("device.disabled", "已停用")
                  : onlineState === "online"
                    ? t("device.online", "在线")
                    : onlineState === "recent"
                      ? t("device.recent", "刚离线")
                      : t("device.offline", "离线")
              }
            />
            <Icon
              className={cn(
                "size-4 shrink-0",
                isDisabled ? "text-muted-foreground" : "text-primary"
              )}
              icon={deviceIcon}
            />
            {renaming ? (
              <Input
                autoFocus
                className="h-7 flex-1"
                onBlur={submitRename}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitRename();
                  if (e.key === "Escape") {
                    setName(device.device_name);
                    setRenaming(false);
                  }
                }}
                placeholder={t(
                  "device.namePlaceholder",
                  "例如:手机/电脑/iPad/路由器"
                )}
                value={name}
              />
            ) : (
              // V4.3:设备名改回纯文字 + 独立小铅笔按钮触发重命名。
              // 之前整个名字都是按钮 → 选中卡片时容易误碰进入重命名。
              // 现在点名字只触发选中(card click handler 排除 button),点铅笔才改名。
              <div className="group flex min-w-0 flex-1 items-center gap-1.5">
                <span className="min-w-0 truncate font-medium">
                  {device.device_name || t("device.unnamed", "未命名设备")}
                </span>
                <button
                  className="shrink-0 rounded p-0.5 text-muted-foreground opacity-0 transition hover:bg-muted hover:text-foreground focus:opacity-100 group-hover:opacity-100"
                  onClick={(e) => {
                    // 阻止冒泡到 Card click,避免点铅笔顺便选中卡片
                    e.stopPropagation();
                    setRenaming(true);
                  }}
                  title={t("device.clickToRename", "重命名设备")}
                  type="button"
                >
                  <Icon className="size-3.5" icon="uil:edit" />
                </button>
              </div>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap gap-1">
            {isDisabled && (
              <Badge variant="destructive">
                {t("device.disabled", "已停用")}
              </Badge>
            )}
            {device.is_addon && (
              <Badge className="bg-amber-500 text-white" variant="default">
                {t("device.addonBadge", "加购")}
              </Badge>
            )}
          </div>
        </div>
        {/* V4.3:命名建议常驻提示 — 默认名「设备 N」时高亮,引导用户点击改名。
            套餐内只在第一台默认名设备显示一次,避免视觉重复。 */}
        {!renaming && isDefaultName && showNameHint && (
          <button
            className="-mt-1 flex items-center gap-1 text-amber-600 text-xs hover:underline dark:text-amber-400"
            onClick={() => setRenaming(true)}
            type="button"
          >
            <Icon className="size-3" icon="uil:lightbulb-alt" />
            {t(
              "device.nameHint",
              "建议命名:点击重命名,例如「手机」「电脑」「iPad」「路由器」"
            )}
          </button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 订阅链接区块 — 第二档改造:默认折叠成一行带主操作,展开看完整 URL 列表。
            URL 是给机器看的,默认无需占据视觉重量;用户需要时点展开。 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <button
              className="flex min-w-0 items-center gap-1.5 text-muted-foreground text-xs hover:text-foreground"
              onClick={() => setUrlExpanded((v) => !v)}
              type="button"
            >
              <Icon
                className={cn(
                  "size-3 shrink-0 transition-transform",
                  urlExpanded && "rotate-90"
                )}
                icon="uil:angle-right"
              />
              <span>{t("device.subscribeUrl", "订阅链接")}</span>
              {subscribeUrls.length > 1 && (
                <span className="rounded bg-primary/10 px-1.5 py-0.5 font-medium text-[10px] text-primary">
                  {t("device.urlCount", "{{n}} 条线路", {
                    n: subscribeUrls.length,
                  })}
                </span>
              )}
            </button>
            {/* 折叠态主操作:一键复制(用主线路)+ 扫码 — 都带文字标签,清晰可识别 */}
            {!urlExpanded && (
              <div className="flex items-center gap-1.5">
                <Button
                  className="h-8 gap-1 px-2.5"
                  onClick={() => copyUrl(subscribeUrls[lineIdx])}
                  size="sm"
                  title={t("device.copyUrl", "复制订阅链接")}
                  variant="default"
                >
                  <Icon className="size-3.5" icon="uil:copy" />
                  {t("copy", "复制")}
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className="h-8 gap-1 px-2.5"
                      size="sm"
                      title={t("device.qrCode", "扫描二维码导入")}
                      variant="outline"
                    >
                      <Icon className="size-3.5" icon="uil:qrcode-scan" />
                      {t("device.scan", "扫码")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3">
                    <QRCodeCanvas
                      bgColor="transparent"
                      fgColor="rgb(59, 130, 246)"
                      size={180}
                      value={subscribeUrls[lineIdx] || device.subscribe_url}
                    />
                    <p className="mt-2 text-center text-muted-foreground text-xs">
                      {t("device.scanHint", "客户端「扫码导入」")}
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
          {/* 展开态:完整 URL 列表(每条线路一行带独立的复制/QR/线路切换) */}
          {urlExpanded && (
            <div className="space-y-1">
              {subscribeUrls.map((url, idx) => (
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-md border p-1.5 transition",
                    isSelected && idx === lineIdx && subscribeUrls.length > 1
                      ? "border-primary/40 bg-primary/5"
                      : "bg-muted/30"
                  )}
                  key={url}
                >
                  {subscribeUrls.length > 1 &&
                    (isSelected ? (
                      // 选中态:线路标签可点击切换
                      <button
                        className={cn(
                          "shrink-0 rounded px-1.5 py-0.5 font-medium text-[10px] transition",
                          idx === lineIdx
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary hover:bg-primary/20"
                        )}
                        onClick={() => onLineChange(idx)}
                        title={t("device.switchLine", "点击切换为导入线路")}
                        type="button"
                      >
                        {t("device.lineN", "线路{{n}}", { n: idx + 1 })}
                        {idx === lineIdx && " ✓"}
                      </button>
                    ) : (
                      <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 font-medium text-[10px] text-primary">
                        {t("device.lineN", "线路{{n}}", { n: idx + 1 })}
                      </span>
                    ))}
                  <code className="min-w-0 flex-1 truncate font-mono text-xs">
                    {url}
                  </code>
                  <Button
                    className="h-7 gap-1 px-2"
                    onClick={() => copyUrl(url)}
                    size="sm"
                    title={t("device.copyUrl", "复制订阅链接")}
                    variant="default"
                  >
                    <Icon className="size-3" icon="uil:copy" />
                    {t("copy", "复制")}
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        className="h-7 gap-1 px-2"
                        size="sm"
                        title={t("device.qrCode", "扫描二维码导入")}
                        variant="outline"
                      >
                        <Icon className="size-3.5" icon="uil:qrcode-scan" />
                        <span className="hidden sm:inline">
                          {t("device.scan", "扫码")}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3">
                      <QRCodeCanvas
                        bgColor="transparent"
                        fgColor="rgb(59, 130, 246)"
                        size={180}
                        value={url}
                      />
                      <p className="mt-2 text-center text-muted-foreground text-xs">
                        {t("device.scanHint", "客户端「扫码导入」")}
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
              ))}
              {subscribeUrls.length > 1 && (
                <p className="text-[10px] text-muted-foreground">
                  {t(
                    "device.multiLineHint",
                    "多条线路任选其一导入即可;遇到连接失败可换另一条试试。"
                  )}
                </p>
              )}
            </div>
          )}
        </div>

        {/* V4.3 第一档改造:状态网格情境化
            - 从未连接 → 单行 ghost 提示「等待首次连接」(信息密度高,占地少)
            - 已连接过 → 展开为 3 列状态网格(只有有数据时才占地) */}
        {neverConnected ? (
          <div className="flex items-center gap-2 rounded-md border border-muted-foreground/20 border-dashed bg-muted/10 p-2.5 text-muted-foreground text-xs">
            <Icon
              className="size-3.5 shrink-0 animate-pulse"
              icon="uil:clock"
            />
            <span>
              {t(
                "device.waitingFirstConnect",
                "等待首次连接 — 把订阅链接导入客户端开始使用"
              )}
            </span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 rounded-md bg-muted/20 p-2 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-muted-foreground">
                  {t("device.status", "状态")}
                </span>
                <span
                  className={cn(
                    "font-medium",
                    isDisabled
                      ? "text-destructive"
                      : onlineState === "online"
                        ? "text-green-600"
                        : onlineState === "recent"
                          ? "text-amber-600"
                          : "text-muted-foreground"
                  )}
                >
                  {isDisabled
                    ? t("device.disabled", "已停用")
                    : onlineState === "online"
                      ? `● ${t("device.online", "在线")}`
                      : onlineState === "recent"
                        ? `● ${t("device.recent", "刚离线")}`
                        : `● ${t("device.offline", "离线")}`}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-muted-foreground">
                  {t("device.lastSeen", "最近上线")}
                </span>
                <span className="font-medium" title={lastSeenAbs}>
                  {lastSeenRel}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-muted-foreground">
                  {t("device.today", "今日流量")}
                </span>
                <span className="font-medium">{todayHuman}</span>
              </div>
            </div>
            {device.last_seen_ip && (
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Icon className="size-3" icon="uil:wifi" />
                <span>
                  {t("device.lastIp", "上次 IP")}: {device.last_seen_ip}
                </span>
              </div>
            )}
          </>
        )}

        <Separator />

        <div className="flex flex-wrap gap-2">
          {/* V4.3:换设备(主操作) - 强调用户价值 + 详细规则,引导正确认知 */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm">
                <Icon className="mr-1 size-3" icon="mdi:cellphone-arrow-down" />
                {t("device.change", "换设备")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("device.changeTitle", "确认换设备?")}
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-2 text-sm">
                    <p>
                      {t(
                        "device.changeDesc1",
                        "把这个设备 URL 换到新手机/电脑使用等。"
                      )}
                    </p>
                    <p>
                      {t(
                        "device.changeDesc2",
                        "老 URL 立即作废,你需要在新设备上重新导入。"
                      )}
                    </p>
                    <p>
                      {t(
                        "device.changeDesc3",
                        "限速防滥用:每小时 3 次,每天 10 次。"
                      )}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {t(
                        "device.changeDesc4",
                        "每个设备 URL 仅允许 1 台设备稳定使用。"
                      )}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {t(
                        "device.changeDesc5",
                        "同一设备 URL 若被多人共享,将触发互踢或拒绝连接。"
                      )}
                    </p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel", "Cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    try {
                      await resetDevice(device.id);
                      toast.success(
                        t("device.changeSuccess", "已换发新 URL,请在新设备导入")
                      );
                      onChanged();
                    } catch {
                      // request layer toasts
                    }
                  }}
                >
                  {t("confirm", "Confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* 重置(快捷) - 同一后端动作,给习惯老术语的用户保留 */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Icon className="mr-1 size-3" icon="uil:sync" />
                {t("device.reset", "Reset")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("device.resetTitle", "Reset this device?")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t(
                    "device.resetDesc",
                    "Generates new token + UUID. The old subscribe URL stops working immediately. Limit: 3/hour, 10/day."
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel", "Cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    try {
                      await resetDevice(device.id);
                      toast.success(t("device.resetSuccess", "Device reset"));
                      onChanged();
                    } catch {
                      // request layer toasts
                    }
                  }}
                >
                  {t("confirm", "Confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {device.status === 1 ? (
            <Button
              onClick={async () => {
                try {
                  await disableDevice(device.id);
                  toast.success(t("device.disabled", "Disabled"));
                  onChanged();
                } catch {
                  // request layer toasts
                }
              }}
              size="sm"
              variant="outline"
            >
              <Icon className="mr-1 size-3" icon="uil:pause-circle" />
              {t("device.disable", "Disable")}
            </Button>
          ) : (
            <Button
              onClick={async () => {
                try {
                  await enableDevice(device.id);
                  toast.success(t("device.enabled", "Enabled"));
                  onChanged();
                } catch {
                  // request layer toasts
                }
              }}
              size="sm"
              variant="outline"
            >
              <Icon className="mr-1 size-3" icon="uil:play-circle" />
              {t("device.enable", "Enable")}
            </Button>
          )}

          {/* V4.3:仅加购设备显示「删除」。套餐基础设备不可删,后端也会拒绝。 */}
          {device.is_addon && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  <Icon className="mr-1 size-3" icon="mdi:delete-sweep" />
                  {t("device.delete", "Delete")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("device.deleteTitle", "Delete this addon device?")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t(
                      "device.deleteDesc",
                      "永久删除该加购设备槽位,该设备的订阅 URL 立即失效。已扣的费用不退还。套餐基础设备不可删除。"
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel", "Cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      try {
                        await deleteAddonDevice(device.id);
                        toast.success(
                          t("device.deleteSuccess", "Addon device deleted")
                        );
                        onChanged();
                      } catch {
                        // request layer toasts
                      }
                    }}
                  >
                    {t("confirm", "Confirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* V4.3 第一档改造:客户端区已上移到 SubscribeBlock 级,这里不再渲染。
            一组共用客户端按钮 + 用户切换"客户端使用此设备" → 代替原来每张卡重复一遍。 */}
      </CardContent>
    </Card>
  );
}

function SubscribeBlock({
  sub,
  legacy,
  onChanged,
}: {
  sub: MySubscribeInfo;
  // Matching entry from queryUserSubscribe — provides Renew/Unsubscribe data
  // (subscribe object with replacement / allow_deduction / unit_price etc.).
  // Optional because some devices may have no legacy mapping yet.
  legacy?: API.UserSubscribe;
  onChanged: () => void;
}) {
  const { t } = useTranslation("dashboard");
  const { common } = useGlobalStore();
  const updateIntervalHours = common?.subscribe?.update_interval_hours ?? 0;

  // V4.3:平台 Tab 提到 sub 级,所有设备卡共享。客户端列表也在 sub 级取一次。
  const { applications, availablePlatforms } = useApplications();
  const [platform, setPlatform] = useState<keyof API.DownloadLink>(() => {
    const detected =
      getPlatform() === "macos"
        ? "mac"
        : (getPlatform() as keyof API.DownloadLink);
    return detected;
  });
  useEffect(() => {
    if (
      availablePlatforms.length > 0 &&
      !availablePlatforms.includes(platform)
    ) {
      setPlatform(availablePlatforms[0]!);
    }
  }, [availablePlatforms, platform]);

  // V4.3 第一档改造:客户端区上移到套餐级 — 这里集中管理"哪台设备 + 哪条线路"。
  //   selectedDeviceId  → 客户端按钮会用这台设备的 URL 导入
  //   deviceLines[id]    → 这台设备当前选中的线路索引(默认 0)
  // 用户点其它设备卡 → 切换 selectedDeviceId,客户端按钮自动用新设备 URL。
  const [selectedDeviceId, setSelectedDeviceId] = useState<number>(
    sub.devices[0]?.id ?? 0
  );
  const [deviceLines, setDeviceLines] = useState<Record<number, number>>({});

  // 设备列表变化(增删)时,自动调整选中设备到合法值
  useEffect(() => {
    if (!sub.devices.find((d) => d.id === selectedDeviceId)) {
      setSelectedDeviceId(sub.devices[0]?.id ?? 0);
    }
  }, [sub.devices, selectedDeviceId]);

  const selectedDevice = sub.devices.find((d) => d.id === selectedDeviceId);
  const selectedDeviceUrls = selectedDevice
    ? selectedDevice.subscribe_urls && selectedDevice.subscribe_urls.length > 0
      ? selectedDevice.subscribe_urls
      : [selectedDevice.subscribe_url]
    : [];
  const selectedLineIdx = Math.min(
    deviceLines[selectedDeviceId] ?? 0,
    Math.max(0, selectedDeviceUrls.length - 1)
  );
  const activeImportUrl =
    selectedDeviceUrls[selectedLineIdx] || selectedDevice?.subscribe_url || "";

  // 命名提示去重 — 套餐内只在第一台默认名设备显示一次,避免视觉冗余
  const firstDefaultNameDeviceId = sub.devices.find(
    (d) => !d.device_name || /^设备\s*\d+$/.test(d.device_name)
  )?.id;

  // V4.3 第三档改造 G:设备卡按"基础/加购"分组排序
  // 套餐基础设备先 → 加购设备后,加购卡的橙色「加购」徽章自然形成视觉分组。
  const sortedDevices = [...sub.devices].sort((a, b) => {
    if (a.is_addon === b.is_addon) return a.id - b.id;
    return a.is_addon ? 1 : -1;
  });
  const usedPct =
    sub.traffic_total > 0
      ? Math.min(100, Math.round((sub.traffic_used / sub.traffic_total) * 100))
      : 0;
  const expireDate =
    sub.expire_time > 0
      ? new Date(sub.expire_time).toLocaleDateString()
      : t("noLimit", "No Limit");

  // handleAddDevice / handleAddTraffic 已经迁移到 <AddDeviceDialog> /
  // <AddTrafficDialog>;按钮换成 Dialog trigger,弹窗里展示价格 + 确认。

  const handleResetAll = async () => {
    try {
      const { data } = await resetAllDevices(sub.id);
      toast.success(
        t("resetAllSuccess", "Reset {{count}} devices", {
          count: data?.data?.reset_count || 0,
        })
      );
      onChanged();
    } catch {
      // request layer toasts
    }
  };

  const enabledDevices = sub.devices.filter((d) => d.status === 1).length;

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <Icon className="size-5" icon="uil:server" />
            {sub.subscribe_name}
            <StatusBadge status={sub.status} />
          </CardTitle>
          <span className="text-muted-foreground text-sm">
            {t("expire", "Expires")}: {expireDate}
          </span>
        </div>
        <ThrottleBanner sub={sub} />
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t("traffic", "Traffic")}
            </span>
            <span className="font-medium">
              {formatBytes(sub.traffic_used)} / {formatBytes(sub.traffic_total)}
              {sub.traffic_addon > 0 && (
                <span className="ml-1 text-primary text-xs">
                  (+{formatBytes(sub.traffic_addon)})
                </span>
              )}
            </span>
          </div>
          <Progress value={usedPct} />
        </div>
        {/* V4.3 自适应:窄屏(< sm)按钮只显示图标 + tooltip,中屏以上展开文字。
            从原来的 4 行挤压成 1 行,减少 ~120px 垂直空间。 */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm">
            <Icon className="size-4 text-primary" icon="uil:mobile-android" />
            <span className="font-medium">
              {enabledDevices} / {sub.device_count}
            </span>
            <span className="hidden text-muted-foreground sm:inline">
              {t("devices", "Devices")}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {/* V4.3:加购按钮改走确认 Dialog,不再静默 fire API。
                未配置单价时按钮 disabled,鼠标悬停 tooltip 解释。 */}
            <AddDeviceDialog
              onSuccess={onChanged}
              sub={sub}
              trigger={
                <Button
                  disabled={
                    !sub.unit_price_per_device || sub.unit_price_per_device <= 0
                  }
                  size="sm"
                  title={
                    !sub.unit_price_per_device || sub.unit_price_per_device <= 0
                      ? t(
                          "addon.unsupportedDeviceShort",
                          "套餐未配置每设备单价"
                        )
                      : t("addDevice", "Add Device")
                  }
                  variant="outline"
                >
                  {/* V4.3 第三档 F:图标加色块背景,跟 sidebar nav 配色一致 */}
                  <span className="flex size-5 shrink-0 items-center justify-center rounded bg-emerald-500/15 text-emerald-600 sm:mr-1.5 dark:text-emerald-400">
                    <Icon className="size-3" icon="uil:plus" />
                  </span>
                  <span className="hidden sm:inline">
                    {t("addDevice", "Add Device")}
                  </span>
                </Button>
              }
            />
            <AddTrafficDialog
              onSuccess={onChanged}
              sub={sub}
              trigger={
                <Button
                  disabled={
                    !sub.traffic_addon_unit_price ||
                    sub.traffic_addon_unit_price <= 0
                  }
                  size="sm"
                  title={
                    !sub.traffic_addon_unit_price ||
                    sub.traffic_addon_unit_price <= 0
                      ? t(
                          "addon.unsupportedTrafficShort",
                          "套餐未配置流量包单价"
                        )
                      : t("addTraffic", "Add Traffic")
                  }
                  variant="outline"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded bg-cyan-500/15 text-cyan-600 sm:mr-1.5 dark:text-cyan-400">
                    <Icon className="size-3" icon="uil:wifi-router" />
                  </span>
                  <span className="hidden sm:inline">
                    {t("addTraffic", "Add Traffic")}
                  </span>
                </Button>
              }
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  title={t("resetAll", "Reset All")}
                  variant="destructive"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded bg-white/20 sm:mr-1.5">
                    <Icon className="size-3" icon="uil:redo" />
                  </span>
                  <span className="hidden sm:inline">
                    {t("resetAll", "Reset All")}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("resetAllTitle", "Reset all devices?")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t(
                      "resetAllDesc",
                      "All subscribe URLs of this plan will be regenerated simultaneously. Old URLs become invalid."
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel", "Cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetAll}>
                    {t("confirm", "Confirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {/* Plan-level actions (renew / unsubscribe) absorbed from the
              old "我的订阅" card so users don't see two separate panels. */}
            {legacy && legacy.expire_time !== 0 && (
              <Renewal id={legacy.id} subscribe={legacy.subscribe} />
            )}
            {legacy && (
              <Unsubscribe
                allowDeduction={legacy.subscribe.allow_deduction}
                id={legacy.id}
                onSuccess={onChanged}
              />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* V4.3:平台 Tab 在 sub 级一处选择,所有设备卡共享 */}
        {availablePlatforms.length > 1 && (
          <div className="flex justify-end">
            <PlatformTabs
              availablePlatforms={availablePlatforms}
              onChange={setPlatform}
              value={platform}
            />
          </div>
        )}
        {/* V4.3 修复横向溢出:必须显式 grid-cols-1,否则 Tailwind v4 默认让 grid 按内容固有宽度
            自动撑开,长 URL / 长按钮会把整列撑爆 viewport,卡片右侧被切。
            minmax(0,1fr) 是 Tailwind 内置语义,确保列严格按 fr 切分 ≤ 100% 宽。 */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {sortedDevices.map((d) => (
            <DeviceCard
              device={d}
              isSelected={d.id === selectedDeviceId}
              key={d.id}
              lineIdx={deviceLines[d.id] ?? 0}
              onChanged={onChanged}
              onLineChange={(idx) =>
                setDeviceLines((prev) => ({ ...prev, [d.id]: idx }))
              }
              onSelect={() => setSelectedDeviceId(d.id)}
              showNameHint={d.id === firstDefaultNameDeviceId}
            />
          ))}
        </div>

        {/* V4.3 第一档改造:客户端区从设备卡上移到套餐级,只渲染一次。
            会用「当前选中设备(selectedDevice)」的当前选中线路 URL 导入。
            用户点其它设备卡 → selectedDeviceId 切换 → 客户端按钮自动跟着换 URL。 */}
        {applications && applications.length > 0 && selectedDevice && (
          <div className="space-y-3 border-t pt-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-semibold text-base">
                <Icon className="size-5 text-primary" icon="uil:download-alt" />
                {t("clients.title", "导入客户端")}
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <span>{t("clients.using", "将导入到")}</span>
                <span className="rounded-md bg-primary/15 px-2.5 py-1 font-semibold text-primary text-sm">
                  {selectedDevice.device_name ||
                    t("device.unnamed", "未命名设备")}
                  {selectedDeviceUrls.length > 1 &&
                    ` · ${t("device.lineN", "线路{{n}}", {
                      n: selectedLineIdx + 1,
                    })}`}
                </span>
              </div>
            </div>
            <AppDownloadGrid
              applications={applications}
              compact
              platform={platform}
              subscribeUrl={activeImportUrl}
            />
            {updateIntervalHours > 0 && (
              <div className="flex items-start gap-1.5 text-muted-foreground text-xs">
                <Icon
                  className="mt-0.5 size-3.5 shrink-0"
                  icon="uil:info-circle"
                />
                <span>
                  {t(
                    "device.autoUpdateHint",
                    "导入后客户端将每 {{n}} 小时自动更新订阅(Clash 家族 / Hiddify / Surge 系列已自动设置;v2rayN / Shadowrocket 等需手动)。",
                    { n: updateIntervalHours }
                  )}
                </span>
              </div>
            )}
            <p className="text-muted-foreground text-xs">
              <Icon
                className="mr-1 inline size-3.5 align-text-bottom"
                icon="uil:lightbulb-alt"
              />
              {t(
                "clients.tip",
                "点上方任意设备卡可切换导入目标;多线路时点设备卡内「线路 N」标签切换。"
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function MySubscribes() {
  const { t } = useTranslation("dashboard");
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["my_subscribes"],
    queryFn: async () => {
      const { data } = await queryMySubscribes();
      return data?.data?.list || [];
    },
  });
  // Pull the legacy `userSubscribe` list too so each device card can offer
  // Renew / Unsubscribe actions without rendering a duplicate panel below.
  const {
    data: legacyList = [],
    refetch: refetchLegacy,
    isFetching: isFetchingLegacy,
  } = useQuery({
    queryKey: ["queryUserSubscribe"],
    queryFn: async () => {
      const { data } = await queryUserSubscribe();
      return data?.data?.list || [];
    },
  });
  const legacyById = new Map<number, API.UserSubscribe>(
    legacyList.map((u) => [u.id, u])
  );

  // Only render plans that have device slots (device-billing native plans).
  const subs = (data || []).filter((s) => s.device_count > 0);
  if (subs.length === 0) return null;

  // V4.3 修复刷新无反馈:并行 await 两个 refetch + toast 成功提示。
  // isFetching 同时驱动按钮 disabled 和图标自旋,用户立即看到 "正在刷新"。
  const refreshing = isFetching || isFetchingLegacy;
  const refresh = async () => {
    if (refreshing) return;
    try {
      await Promise.all([refetch(), refetchLegacy()]);
      toast.success(t("refreshSuccess", "已刷新"));
    } catch {
      // request layer toasts errors
    }
  };

  // V4.3:标题智能自适应 — 显示真实设备数,不再写死 "(设备槽)" 这种术语。
  // 单套餐:「我的订阅 · 3 台设备」
  // 多套餐:「我的订阅 · 9 台设备 · 3 个套餐」
  const totalDevices = subs.reduce(
    (acc, s) => acc + (s.devices?.length || 0),
    0
  );
  const subtitle = (() => {
    if (subs.length === 0) return "";
    if (subs.length === 1) {
      return t("titleDeviceCount", "{{n}} 台设备", { n: totalDevices });
    }
    return t("titleDeviceAndPlanCount", "{{n}} 台设备 · {{m}} 个套餐", {
      n: totalDevices,
      m: subs.length,
    });
  })();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-semibold">
          <span className="flex items-center gap-1.5">
            <Icon className="size-5" icon="uil:devices" />
            {t("title", "我的订阅")}
          </span>
          {subtitle && (
            <span className="font-normal text-muted-foreground text-sm">
              · {subtitle}
            </span>
          )}
        </h2>
        <Button
          disabled={refreshing}
          onClick={refresh}
          size="sm"
          title={t("refresh", "刷新")}
          variant="outline"
        >
          <Icon className={cn(refreshing && "animate-spin")} icon="uil:sync" />
        </Button>
      </div>
      {subs.map((sub) => (
        <SubscribeBlock
          key={sub.id}
          legacy={legacyById.get(sub.id)}
          onChanged={refresh}
          sub={sub}
        />
      ))}
    </div>
  );
}
