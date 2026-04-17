"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
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
import { Icon } from "@workspace/ui/composed/icon";
import { getModuleConfig } from "@workspace/ui/services/admin/system";
import { restartSystem } from "@workspace/ui/services/admin/tool";
import { basicCheckServiceVersion } from "@workspace/ui/services/gateway/basicCheckServiceVersion";
import { basicUpdateService } from "@workspace/ui/services/gateway/basicUpdateService";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface WebVersionMetadata {
  commit: string;
  tag: string | null;
  display_version: string;
}

function isWebVersionMetadata(value: unknown): value is WebVersionMetadata {
  if (!(value && typeof value === "object")) return false;

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.commit === "string" &&
    candidate.commit.length > 0 &&
    (candidate.tag === null || typeof candidate.tag === "string") &&
    typeof candidate.display_version === "string" &&
    candidate.display_version.length > 0
  );
}

function parseWebVersionMetadata(text: string) {
  try {
    const payload = JSON.parse(text) as unknown;
    if (isWebVersionMetadata(payload)) return payload;
  } catch {
    return null;
  }

  return null;
}

async function getDeployedWebVersion() {
  try {
    const response = await fetch(
      new URL("version.json", window.location.href),
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) return null;

    const text = await response.text();
    return parseWebVersionMetadata(text);
  } catch {
    return null;
  }
}

export default function SystemVersionCard() {
  const { t } = useTranslation("tool");
  const queryClient = useQueryClient();
  const [openRestart, setOpenRestart] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [openUpdateWeb, setOpenUpdateWeb] = useState(false);
  const [openUpdateServer, setOpenUpdateServer] = useState(false);
  const [isUpdatingWeb, setIsUpdatingWeb] = useState(false);
  const injectedWebVersion = __APP_GIT_VERSION__;

  const { data: moduleConfig } = useQuery({
    queryKey: ["getModuleConfig"],
    queryFn: async () => {
      const { data } = await getModuleConfig({ skipErrorHandler: true });
      return data.data;
    },
    staleTime: 0,
  });

  const { data: serverVersionInfo } = useQuery({
    queryKey: ["checkServerVersion", moduleConfig?.secret],
    queryFn: async () => {
      const { data } = await basicCheckServiceVersion(
        {
          service_name: moduleConfig!.service_name,
          secret: moduleConfig!.secret,
        },
        { skipErrorHandler: true }
      );
      return data.data;
    },
    enabled: !!moduleConfig?.secret,
    staleTime: 0,
    retry: 1,
  });

  const { data: webVersionInfo } = useQuery({
    queryKey: ["checkWebVersion", moduleConfig?.secret],
    queryFn: async () => {
      const { data } = await basicCheckServiceVersion(
        {
          service_name: "admin-web-with-api",
          secret: moduleConfig!.secret,
        },
        { skipErrorHandler: true }
      );
      return data.data;
    },
    enabled: !!moduleConfig?.secret,
    staleTime: 0,
    retry: 1,
  });

  const { data: deployedWebVersion } = useQuery({
    queryKey: ["deployedWebVersion"],
    queryFn: getDeployedWebVersion,
    enabled: !import.meta.env.DEV,
    staleTime: 0,
    retry: false,
  });

  const updateServerMutation = useMutation({
    mutationFn: async (serviceName: string) => {
      await basicUpdateService({
        service_name: serviceName,
        secret: moduleConfig!.secret,
      });
    },
    onSuccess: () => {
      toast.success(t("updateSuccess", "Update completed successfully"));
      queryClient.invalidateQueries({ queryKey: ["checkServerVersion"] });
      queryClient.invalidateQueries({ queryKey: ["getModuleConfig"] });
      setOpenUpdateServer(false);
    },
    onError: () => {
      toast.error(t("updateFailed", "Update failed"));
    },
  });

  const handleUpdateWeb = async () => {
    if (!moduleConfig?.secret) return;

    setIsUpdatingWeb(true);
    try {
      await basicUpdateService({
        service_name: "admin-web-with-api",
        secret: moduleConfig.secret,
      });
      toast.success(t("adminUpdateSuccess", "Admin updated successfully"));

      await basicUpdateService({
        service_name: "user-web-with-api",
        secret: moduleConfig.secret,
      });
      toast.success(t("userUpdateSuccess", "User updated successfully"));

      setOpenUpdateWeb(false);
      window.location.reload();
    } catch {
      toast.error(t("updateFailed", "Update failed"));
    } finally {
      setIsUpdatingWeb(false);
    }
  };

  const hasServerNewVersion = serverVersionInfo?.has_update ?? false;
  const hasWebNewVersion = webVersionInfo?.has_update ?? false;
  const isUpdatingServer = updateServerMutation.isPending;
  const currentWebVersion =
    deployedWebVersion?.display_version ||
    injectedWebVersion?.display_version ||
    webVersionInfo?.current_version ||
    "-";

  return (
    <Card className="gap-0 p-3">
      <CardHeader className="mb-2 p-0">
        <CardTitle className="flex items-center justify-between">
          {t("systemServices", "System Services")}
          <div className="flex items-center space-x-2">
            <AlertDialog onOpenChange={setOpenRestart} open={openRestart}>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  {t("systemReboot", "System Reboot")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("confirmSystemReboot", "Confirm System Reboot")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t(
                      "rebootDescription",
                      "Are you sure you want to reboot the system? This action cannot be undone."
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel", "Cancel")}</AlertDialogCancel>
                  <Button
                    disabled={isRestarting}
                    onClick={async () => {
                      setIsRestarting(true);
                      await restartSystem();
                      await new Promise((resolve) => setTimeout(resolve, 5000));
                      setIsRestarting(false);
                      setOpenRestart(false);
                    }}
                  >
                    {isRestarting && (
                      <Icon className="mr-2 animate-spin" icon="mdi:loading" />
                    )}
                    {isRestarting
                      ? t("rebooting", "Rebooting...")
                      : t("confirmReboot", "Confirm Reboot")}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-0">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center">
            <Icon className="mr-2 h-4 w-4 text-green-600" icon="mdi:web" />
            <span className="font-medium text-sm">
              {t("webVersion", "Web Version")}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge>{currentWebVersion}</Badge>
            <AlertDialog onOpenChange={setOpenUpdateWeb} open={openUpdateWeb}>
              <AlertDialogTrigger asChild>
                <Button
                  className="h-6 px-2 text-xs"
                  disabled={!hasWebNewVersion || isUpdatingWeb}
                  size="sm"
                  variant="outline"
                >
                  {isUpdatingWeb && (
                    <Icon className="mr-1 animate-spin" icon="mdi:loading" />
                  )}
                  {hasWebNewVersion
                    ? t("upgrade", "Upgrade")
                    : t("latestVersion", "Latest Version")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("confirmUpdateWeb", "Confirm Update Web")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t(
                      "updateWebDescription",
                      "Are you sure you want to update admin and user web services? This may cause temporary interruption."
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel", "Cancel")}</AlertDialogCancel>
                  <Button disabled={isUpdatingWeb} onClick={handleUpdateWeb}>
                    {isUpdatingWeb && (
                      <Icon className="mr-2 animate-spin" icon="mdi:loading" />
                    )}
                    {isUpdatingWeb
                      ? t("updating", "Updating...")
                      : t("confirm", "Confirm")}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center">
            <Icon className="mr-2 h-4 w-4 text-blue-600" icon="mdi:server" />
            <span className="font-medium text-sm">
              {t("serverVersion", "Server Version")}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge>{moduleConfig?.service_version || "1.0.0"}</Badge>
            <AlertDialog
              onOpenChange={setOpenUpdateServer}
              open={openUpdateServer}
            >
              <AlertDialogTrigger asChild>
                <Button
                  className="h-6 px-2 text-xs"
                  disabled={!hasServerNewVersion || isUpdatingServer}
                  size="sm"
                  variant="outline"
                >
                  {isUpdatingServer && (
                    <Icon className="mr-1 animate-spin" icon="mdi:loading" />
                  )}
                  {hasServerNewVersion
                    ? t("upgrade", "Upgrade")
                    : t("latestVersion", "Latest Version")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("confirmUpdateServer", "Confirm Update Server")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t(
                      "updateServerDescription",
                      "Are you sure you want to update the server service? This may cause temporary interruption."
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel", "Cancel")}</AlertDialogCancel>
                  <Button
                    disabled={isUpdatingServer}
                    onClick={() =>
                      updateServerMutation.mutate(moduleConfig!.service_name)
                    }
                  >
                    {isUpdatingServer && (
                      <Icon className="mr-2 animate-spin" icon="mdi:loading" />
                    )}
                    {isUpdatingServer
                      ? t("updating", "Updating...")
                      : t("confirm", "Confirm")}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
