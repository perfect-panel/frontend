"use client";

// V4.3:下载客户端 UI。
//
// 两种模式:
//   * 完整版(默认):带平台 Tab + 多列 grid + QR 码 — 用在订阅卡顶部
//   * 紧凑版(compact=true):只渲染过滤后的客户端按钮列表 — 用在设备卡内
//
// 平台过滤(关键):严格按 download_link[platform] 是否存在判断,
// 没有该平台下载链接的客户端**不在该平台 Tab 下显示**(即便有 scheme 导入)。
// 之前的实现是 `download_link[platform] || scheme`,导致 Surge for Mac 在
// Windows 标签下也出现。现在收紧。

import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Icon } from "@workspace/ui/composed/icon";
import { getClient } from "@workspace/ui/services/common/common";
import { isBrowser } from "@workspace/ui/utils/index";
import { QRCodeCanvas } from "qrcode.react";
import React, { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useGlobalStore } from "@/stores/global";
import { getPlatform } from "@/utils/common";
import { TutorialSheet } from "./tutorial-sheet";

const platforms: (keyof API.DownloadLink)[] = [
  "windows",
  "mac",
  "linux",
  "ios",
  "android",
  "harmony",
];

// V4.3 修复:iOS 不能用 simple-icons:ios — 那个图标渲染为文字 "iOS",
// 跟我后面加的 PLATFORM_NAMES.ios 文字会重复成「iOS iOS」。
// 改用 mdi:apple-ios 真实图形(苹果 + iOS 数字),或 mdi:cellphone-iphone(iPhone 形状)。
const PLATFORM_ICONS: Record<keyof API.DownloadLink, string> = {
  windows: "mdi:microsoft-windows",
  mac: "mdi:laptop-mac",
  linux: "uil:linux",
  ios: "mdi:cellphone-iphone",
  android: "uil:android",
  harmony: "simple-icons:harmonyos",
};

// V4.3:平台名 — 中屏以上 Tab 显示「icon + 文字」,提升可读性。
const PLATFORM_NAMES: Record<keyof API.DownloadLink, string> = {
  windows: "Windows",
  mac: "macOS",
  linux: "Linux",
  ios: "iOS",
  android: "Android",
  harmony: "HarmonyOS",
};

// Hook:取客户端列表 + 计算可用平台 + 默认平台 (按系统判断)
export function useApplications() {
  const { data: applications } = useQuery({
    queryKey: ["getClient"],
    queryFn: async () => {
      const { data } = await getClient();
      return data.data?.list || [];
    },
  });
  const availablePlatforms = React.useMemo(() => {
    if (!applications || applications.length === 0) return platforms;
    const set = new Set<keyof API.DownloadLink>();
    for (const app of applications) {
      if (app.download_link) {
        for (const p of platforms) {
          if (app.download_link[p]) set.add(p);
        }
      }
    }
    return platforms.filter((p) => set.has(p));
  }, [applications]);
  return { applications: applications || [], availablePlatforms };
}

// Sub-level platform tabs widget. Controlled component.
export function PlatformTabs({
  value,
  onChange,
  availablePlatforms,
}: {
  value: keyof API.DownloadLink;
  onChange: (p: keyof API.DownloadLink) => void;
  availablePlatforms: (keyof API.DownloadLink)[];
}) {
  if (availablePlatforms.length <= 1) return null;
  return (
    <Tabs
      onValueChange={(v) => onChange(v as keyof API.DownloadLink)}
      value={value}
    >
      <TabsList className="flex h-auto *:flex-auto">
        {availablePlatforms.map((p) => (
          <TabsTrigger
            className="gap-1.5 px-2 py-1.5 sm:px-3"
            key={p}
            value={p}
          >
            <Icon className="size-5 sm:size-[18px]" icon={PLATFORM_ICONS[p]} />
            {/* 中屏以上显示平台名,小屏只看图标(节省空间) */}
            <span className="hidden font-medium text-xs sm:inline">
              {PLATFORM_NAMES[p]}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

interface AppDownloadGridProps {
  /** Per-device subscribe URL — used for Import / QR / tutorial substitution. */
  subscribeUrl: string;
  /** Controlled platform — if omitted, auto-detect from user OS. */
  platform?: keyof API.DownloadLink;
  /** Apps prop optional — if omitted, internally fetches via useApplications. */
  applications?: API.SubscribeClient[];
  /** Compact mode for embedding inside a device card (no header / no QR). */
  compact?: boolean;
}

export function AppDownloadGrid({
  subscribeUrl,
  platform: platformProp,
  applications: appsProp,
  compact = false,
}: AppDownloadGridProps) {
  const { t } = useTranslation("dashboard");
  const { getAppSubLink } = useGlobalStore();

  const internal = useApplications();
  const applications = appsProp ?? internal.applications;
  const availablePlatforms = internal.availablePlatforms;

  // Internal platform state only used when uncontrolled (standalone mode).
  const [internalPlatform, setInternalPlatform] = useState<
    keyof API.DownloadLink
  >(() => {
    const detected =
      getPlatform() === "macos"
        ? "mac"
        : (getPlatform() as keyof API.DownloadLink);
    return detected;
  });
  const platform = platformProp ?? internalPlatform;

  useEffect(() => {
    if (
      !platformProp &&
      availablePlatforms.length > 0 &&
      !availablePlatforms.includes(internalPlatform)
    ) {
      setInternalPlatform(availablePlatforms[0]!);
    }
  }, [availablePlatforms, internalPlatform, platformProp]);

  if (!applications || applications.length === 0) return null;

  const handleCopy = (
    _: string,
    ok: boolean,
    application: API.SubscribeClient
  ) => {
    if (!ok) return;
    const href = getAppSubLink(subscribeUrl, application.scheme);
    const showSuccess = () => {
      toast.success(
        <>
          <p>{t("copySuccess", "Copy Success")}</p>
          <br />
          <p>{t("manualImportMessage", "Please import manually")}</p>
        </>
      );
    };
    if (isBrowser() && href) {
      window.location.href = href;
      const checkRedirect = setTimeout(() => {
        if (window.location.href !== href) showSuccess();
        clearTimeout(checkRedirect);
      }, 1000);
      return;
    }
    showSuccess();
  };

  // V4.3 严格过滤:必须有当前平台的 download_link 才显示。
  // 没下载链接的客户端在该平台下隐藏,即便有 scheme 也不展示
  // (避免 Surge for Mac 在 Windows 下出现)。
  const filteredApps = applications.filter(
    (a) => !!a.download_link?.[platform]
  );
  if (filteredApps.length === 0) {
    return (
      <p className="text-muted-foreground text-xs">
        {t("noClientForPlatform", "当前平台暂无可用客户端")}
      </p>
    );
  }

  // ── Compact mode: 客户端卡片网格 — 每张卡 icon + 名称 + 操作按钮 ──
  // V4.3:卡片放大,字号 / 图标 / 按钮全部上调一档,可读性优先。
  if (compact) {
    return (
      <div className="flex flex-wrap gap-3">
        {filteredApps.map((app) => (
          <div
            className="flex flex-col items-center gap-1.5 rounded-lg border bg-muted/20 p-3"
            key={app.id}
            style={{ minWidth: 110 }}
          >
            {app.icon ? (
              <img
                alt={app.name}
                className="size-10 object-contain"
                height={40}
                src={app.icon}
                width={40}
              />
            ) : (
              <Icon
                className="size-10 text-muted-foreground"
                icon="mdi:cube-outline"
              />
            )}
            <span className="line-clamp-1 max-w-[100px] font-semibold text-sm">
              {app.name}
            </span>
            <div className="flex items-center gap-1.5">
              {app.scheme ? (
                <CopyToClipboard
                  onCopy={(text, ok) => handleCopy(text, ok, app)}
                  text={getAppSubLink(subscribeUrl, app.scheme)}
                >
                  <Button className="h-7 px-2.5 text-xs" size="sm">
                    {t("import", "导入")}
                  </Button>
                </CopyToClipboard>
              ) : (
                <Button
                  asChild
                  className="h-7 px-2.5 text-xs"
                  size="sm"
                  variant="secondary"
                >
                  <a
                    href={app.download_link?.[platform]}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {t("download", "下载")}
                  </a>
                </Button>
              )}
              {app.tutorial_key && (
                <TutorialSheet
                  appName={app.name}
                  appScheme={app.scheme}
                  subscribeUrl={subscribeUrl}
                  trigger={
                    <Button
                      className="h-7 gap-1 px-2.5 text-xs"
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      <Icon
                        className="size-3.5"
                        icon="mdi:book-open-page-variant"
                      />
                      {t("tutorial", "教程")}
                    </Button>
                  }
                  tutorialKey={app.tutorial_key}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Full mode (legacy standalone) — header + tabs + grid + QR ──
  return (
    <div className="space-y-3 border-t pt-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-medium text-sm">
          {t("downloadClients", "Download Clients")}
        </h3>
        {!platformProp && (
          <PlatformTabs
            availablePlatforms={availablePlatforms}
            onChange={setInternalPlatform}
            value={platform}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredApps.map((app) => {
          const downloadUrl = app.download_link?.[platform];
          return (
            <div
              className="flex flex-col items-center justify-between gap-2 rounded border p-2 text-center text-muted-foreground text-xs"
              key={app.id}
            >
              <span className="line-clamp-1 font-medium">{app.name}</span>
              {app.icon && (
                <img
                  alt={app.name}
                  className="p-1"
                  height={48}
                  src={app.icon}
                  width={48}
                />
              )}
              <div className="flex w-full items-center justify-center gap-1">
                {downloadUrl && (
                  <Button
                    asChild
                    className="px-2"
                    size="sm"
                    variant="secondary"
                  >
                    <a
                      href={downloadUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {t("download", "Download")}
                    </a>
                  </Button>
                )}
                {app.scheme && (
                  <CopyToClipboard
                    onCopy={(text, ok) => handleCopy(text, ok, app)}
                    text={getAppSubLink(subscribeUrl, app.scheme)}
                  >
                    <Button className="px-2" size="sm">
                      {t("import", "Import")}
                    </Button>
                  </CopyToClipboard>
                )}
                {app.tutorial_key && (
                  <TutorialSheet
                    appName={app.name}
                    appScheme={app.scheme}
                    subscribeUrl={subscribeUrl}
                    tutorialKey={app.tutorial_key}
                  />
                )}
              </div>
            </div>
          );
        })}

        {/* QR code at the end on lg+ */}
        <div className="hidden flex-col items-center justify-between gap-2 rounded border p-2 text-muted-foreground text-xs lg:flex">
          <span>{t("qrCode", "QR Code")}</span>
          <QRCodeCanvas
            bgColor="transparent"
            fgColor="rgb(59, 130, 246)"
            size={48}
            value={subscribeUrl}
          />
          <span>{t("scanToSubscribe", "Scan to Subscribe")}</span>
        </div>
      </div>
    </div>
  );
}
