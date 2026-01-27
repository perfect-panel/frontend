import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
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
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Icon } from "@workspace/ui/composed/icon";
import { cn } from "@workspace/ui/lib/utils";
import { getClient, getStat } from "@workspace/ui/services/common/common";
import {
  queryUserSubscribe,
  resetUserSubscribeToken,
} from "@workspace/ui/services/user/user";
import { differenceInDays, formatDate } from "@workspace/ui/utils/formatting";
import { isBrowser } from "@workspace/ui/utils/index";
import { QRCodeCanvas } from "qrcode.react";
import React, { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Display } from "@/components/display";
import { useGlobalStore } from "@/stores/global";
import { getPlatform } from "@/utils/common";
import Subscribe from "../../subscribe";
import Renewal from "../../subscribe/renewal";
import ResetTraffic from "../../subscribe/reset-traffic";
import Unsubscribe from "../../subscribe/unsubscribe";

const platforms: (keyof API.DownloadLink)[] = [
  "windows",
  "mac",
  "linux",
  "ios",
  "android",
  "harmony",
];

export default function Content() {
  const { t } = useTranslation("dashboard");
  const { getUserSubscribe, getAppSubLink } = useGlobalStore();

  const [protocol, setProtocol] = useState("");

  const {
    data: userSubscribe = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["queryUserSubscribe"],
    queryFn: async () => {
      const { data } = await queryUserSubscribe();
      return data.data?.list || [];
    },
  });
  const { data: applications } = useQuery({
    queryKey: ["getClient"],
    queryFn: async () => {
      const { data } = await getClient();
      return data.data?.list || [];
    },
  });

  const availablePlatforms = React.useMemo(() => {
    if (!applications || applications.length === 0) return platforms;

    const platformsSet = new Set<keyof API.DownloadLink>();

    applications.forEach((app) => {
      if (app.download_link) {
        platforms.forEach((platform) => {
          if (app.download_link?.[platform]) {
            platformsSet.add(platform);
          }
        });
      }
    });

    return platforms.filter((platform) => platformsSet.has(platform));
  }, [applications]);

  const [platform, setPlatform] = useState<keyof API.DownloadLink>(() => {
    const detectedPlatform =
      getPlatform() === "macos"
        ? "mac"
        : (getPlatform() as keyof API.DownloadLink);
    return detectedPlatform;
  });

  React.useEffect(() => {
    if (
      availablePlatforms.length > 0 &&
      !availablePlatforms.includes(platform)
    ) {
      const firstAvailablePlatform = availablePlatforms[0];
      if (firstAvailablePlatform) {
        setPlatform(firstAvailablePlatform);
      }
    }
  }, [availablePlatforms, platform]);

  const { data } = useQuery({
    queryKey: ["getStat"],
    queryFn: async () => {
      const { data } = await getStat({
        skipErrorHandler: true,
      });
      return data.data;
    },
    refetchOnWindowFocus: false,
  });

  const statusWatermarks = {
    2: t("finished", "Finished"),
    3: t("expired", "Expired"),
    4: t("deducted", "Deducted"),
  };

  return (
    <>
      {userSubscribe.length ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 font-semibold">
              <Icon className="size-5" icon="uil:servers" />
              {t("mySubscriptions", "My Subscriptions")}
            </h2>
            <div className="flex gap-2">
              <Button
                className={isLoading ? "animate-pulse" : ""}
                onClick={() => {
                  refetch();
                }}
                size="sm"
                variant="outline"
              >
                <Icon icon="uil:sync" />
              </Button>
              <Button asChild size="sm">
                <Link to="/subscribe">
                  {t("purchaseSubscription", "Purchase Subscription")}
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap justify-between gap-4">
            {availablePlatforms.length > 0 && (
              <Tabs
                className="w-full max-w-full md:w-auto"
                onValueChange={(value) =>
                  setPlatform(value as keyof API.DownloadLink)
                }
                value={platform}
              >
                <TabsList className="flex *:flex-auto">
                  {availablePlatforms.map((item) => (
                    <TabsTrigger
                      className="px-1 lg:px-3"
                      key={item}
                      value={item}
                    >
                      <Icon
                        className="size-5"
                        icon={`${
                          {
                            windows: "mdi:microsoft-windows",
                            mac: "uil:apple",
                            linux: "uil:linux",
                            ios: "simple-icons:ios",
                            android: "uil:android",
                            harmony: "simple-icons:harmonyos",
                          }[item]
                        }`}
                      />
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
            {data?.protocol && data?.protocol.length > 1 && (
              <Tabs
                className="w-full max-w-full md:w-auto"
                onValueChange={setProtocol}
                value={protocol}
              >
                <TabsList className="flex *:flex-auto">
                  {["all", ...(data?.protocol || [])].map((item) => (
                    <TabsTrigger
                      className="px-1 uppercase lg:px-3"
                      key={item}
                      value={item === "all" ? "" : item}
                    >
                      {item}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
          </div>
          {userSubscribe.map((item) => {
            // 如果过期时间为0，说明是永久订阅，不应该显示过期状态
            const isActuallyExpired =
              item.status === 3 && item.expire_time !== 0;
            const shouldShowWatermark =
              item.status === 2 || item.status === 4 || isActuallyExpired;

            return (
              <Card
                className={cn("relative", {
                  "relative opacity-80 grayscale": isActuallyExpired,
                  "relative hidden opacity-60 blur-[0.3px] grayscale":
                    item.status === 4,
                })}
                key={item.id}
              >
                {shouldShowWatermark && (
                  <div
                    className={cn(
                      "pointer-events-none absolute top-0 left-0 z-10 h-full w-full overflow-hidden mix-blend-difference brightness-150 contrast-200 invert-[0.2]",
                      {
                        "text-destructive": item.status === 2,
                        "text-white": isActuallyExpired || item.status === 4,
                      }
                    )}
                  >
                    <div className="absolute inset-0">
                      {Array.from({ length: 16 }).map((_, i) => {
                        const row = Math.floor(i / 4);
                        const col = i % 4;
                        const top = 10 + row * 25 + (col % 2 === 0 ? 5 : -5);
                        const left = 5 + col * 30 + (row % 2 === 0 ? 0 : 10);

                        return (
                          <span
                            className="absolute rotate-[-30deg] whitespace-nowrap font-black text-lg opacity-40 shadow-[0px_0px_1px_rgba(255,255,255,0.5)]"
                            key={i}
                            style={{
                              top: `${top}%`,
                              left: `${left}%`,
                            }}
                          >
                            {
                              statusWatermarks[
                                item.status as keyof typeof statusWatermarks
                              ]
                            }
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
                  <CardTitle className="font-medium">
                    {item.subscribe.name}
                    <p className="mt-1 text-foreground/50 text-sm">
                      {formatDate(item.start_time)}
                    </p>
                  </CardTitle>
                  {item.status !== 4 && (
                    <div className="flex flex-wrap gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            {t("resetSubscription", "Reset Subscription")}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {t("prompt", "Prompt")}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {t(
                                "confirmResetSubscription",
                                "Are you sure you want to reset your subscription?"
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              {t("cancel", "Cancel")}
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                await resetUserSubscribeToken({
                                  user_subscribe_id: item.id,
                                });
                                await refetch();
                                toast.success(
                                  t("resetSuccess", "Reset Success")
                                );
                              }}
                            >
                              {t("confirm", "Confirm")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <ResetTraffic
                        id={item.id}
                        replacement={item.subscribe.replacement}
                      />
                      {item.expire_time !== 0 && (
                        <Renewal id={item.id} subscribe={item.subscribe} />
                      )}
                      <Unsubscribe
                        allowDeduction={item.subscribe.allow_deduction}
                        id={item.id}
                        onSuccess={refetch}
                      />
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-2 gap-3 *:flex *:flex-col *:justify-between lg:grid-cols-4">
                    <li>
                      <span className="text-muted-foreground">
                        {t("used", "Used")}
                      </span>
                      <span className="font-bold text-2xl">
                        <Display
                          type="traffic"
                          unlimited={!item.traffic}
                          value={item.upload + item.download}
                        />
                      </span>
                    </li>
                    <li>
                      <span className="text-muted-foreground">
                        {t("totalTraffic", "Total Traffic")}
                      </span>
                      <span className="font-bold text-2xl">
                        <Display
                          type="traffic"
                          unlimited={!item.traffic}
                          value={item.traffic}
                        />
                      </span>
                    </li>
                    <li>
                      <span className="text-muted-foreground">
                        {t("nextResetDays", "Next Reset Days")}
                      </span>
                      <span className="font-semibold text-2xl">
                        {item.reset_time
                          ? differenceInDays(
                              new Date(item.reset_time),
                              new Date()
                            )
                          : t("noReset", "No Reset")}
                      </span>
                    </li>
                    <li>
                      <span className="text-muted-foreground">
                        {t("expirationDays", "Expiration Days")}
                      </span>
                      <span className="font-semibold text-2xl">
                        {}
                        {item.expire_time
                          ? differenceInDays(
                              new Date(item.expire_time),
                              new Date()
                            ) || t("unknown", "Unknown")
                          : t("noLimit", "No Limit")}
                      </span>
                    </li>
                  </ul>
                  <Separator className="mt-4" />
                  <Accordion
                    className="w-full"
                    collapsible
                    defaultValue="0"
                    type="single"
                  >
                    {getUserSubscribe(item.short, item.token, protocol)?.map(
                      (url, index) => (
                        <AccordionItem key={url} value={String(index)}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex w-full flex-row items-center justify-between">
                              <CardTitle className="font-medium text-sm">
                                {t("subscriptionUrl", "Subscription URL")}{" "}
                                {index + 1}
                              </CardTitle>

                              <CopyToClipboard
                                onCopy={(_, result) => {
                                  if (result) {
                                    toast.success(
                                      t("copySuccess", "Copy Success")
                                    );
                                  }
                                }}
                                text={url}
                              >
                                <span
                                  className="mr-4 flex cursor-pointer rounded p-2 text-primary text-sm hover:bg-accent"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Icon
                                    className="mr-2 size-5"
                                    icon="uil:copy"
                                  />
                                  {t("copy", "Copy")}
                                </span>
                              </CopyToClipboard>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                              {applications
                                ?.filter(
                                  (application) =>
                                    !!(
                                      application.download_link?.[platform] &&
                                      application.scheme
                                    )
                                )
                                .map((application) => {
                                  const downloadUrl =
                                    application.download_link?.[platform];

                                  const handleCopy = (
                                    _: string,
                                    result: boolean
                                  ) => {
                                    if (result) {
                                      const href = getAppSubLink(
                                        url,
                                        application.scheme
                                      );
                                      const showSuccessMessage = () => {
                                        toast.success(
                                          <>
                                            <p>
                                              {t("copySuccess", "Copy Success")}
                                            </p>
                                            <br />
                                            <p>
                                              {t(
                                                "manualImportMessage",
                                                "Please import manually"
                                              )}
                                            </p>
                                          </>
                                        );
                                      };

                                      if (isBrowser() && href) {
                                        window.location.href = href;
                                        const checkRedirect = setTimeout(() => {
                                          if (window.location.href !== href) {
                                            showSuccessMessage();
                                          }
                                          clearTimeout(checkRedirect);
                                        }, 1000);
                                        return;
                                      }

                                      showSuccessMessage();
                                    }
                                  };

                                  return (
                                    <div
                                      className="flex size-full flex-col items-center justify-between gap-2 text-muted-foreground text-xs"
                                      key={application.name}
                                    >
                                      <span>{application.name}</span>

                                      {application.icon && (
                                        <img
                                          alt={application.name}
                                          className="p-1"
                                          height={64}
                                          src={application.icon}
                                          width={64}
                                        />
                                      )}
                                      <div className="flex">
                                        {downloadUrl && (
                                          <Button
                                            asChild
                                            className={
                                              application.scheme
                                                ? "rounded-r-none px-1.5"
                                                : "px-1.5"
                                            }
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

                                        {application.scheme && (
                                          <CopyToClipboard
                                            onCopy={handleCopy}
                                            text={getAppSubLink(
                                              url,
                                              application.scheme
                                            )}
                                          >
                                            <Button
                                              className={
                                                downloadUrl
                                                  ? "rounded-l-none p-2"
                                                  : "p-2"
                                              }
                                              size="sm"
                                            >
                                              {t("import", "Import")}
                                            </Button>
                                          </CopyToClipboard>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              <div className="hidden size-full flex-col items-center justify-between gap-2 text-muted-foreground text-sm lg:flex">
                                <span>{t("qrCode", "QR Code")}</span>
                                <QRCodeCanvas
                                  bgColor="transparent"
                                  fgColor="rgb(59, 130, 246)"
                                  size={80}
                                  value={url}
                                />
                                <span className="text-center">
                                  {t("scanToSubscribe", "Scan to Subscribe")}
                                </span>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    )}
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </>
      ) : (
        <>
          <h2 className="flex items-center gap-1.5 font-semibold">
            <Icon className="size-5" icon="uil:shop" />
            {t("purchaseSubscription", "Purchase Subscription")}
          </h2>
          <Subscribe />
        </>
      )}
    </>
  );
}
