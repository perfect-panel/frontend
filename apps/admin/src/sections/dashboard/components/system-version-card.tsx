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
import packageJson from "../../../../../../package.json";

export default function SystemVersionCard() {
  const { t } = useTranslation("tool");
  const queryClient = useQueryClient();
  const [openRestart, setOpenRestart] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [openUpdateWeb, setOpenUpdateWeb] = useState(false);
  const [openUpdateServer, setOpenUpdateServer] = useState(false);
  const [isUpdatingWeb, setIsUpdatingWeb] = useState(false);

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
            <Badge>V{packageJson.version}</Badge>
            <AlertDialog onOpenChange={setOpenUpdateWeb} open={openUpdateWeb}>
              <AlertDialogTrigger asChild>
                <Button
                  className="h-6 px-2 text-xs"
                  disabled={!hasWebNewVersion || isUpdatingWeb}
                  size="sm"
                  variant="outline"
                >
                  <Icon className="mr-1 h-3 w-3" icon="mdi:download" />
                  {hasWebNewVersion && webVersionInfo
                    ? `${t("update", "Update")} ${webVersionInfo.latest_version}`
                    : t("update", "Update")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("confirmUpdate", "Confirm Update")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {webVersionInfo
                      ? t(
                          "updateWebDescription",
                          "Are you sure you want to update the web version from {{current}} to {{latest}}?",
                          {
                            current: webVersionInfo.current_version,
                            latest: webVersionInfo.latest_version,
                          }
                        )
                      : t(
                          "updateDescription",
                          "Are you sure you want to update?"
                        )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel", "Cancel")}</AlertDialogCancel>
                  <Button disabled={isUpdatingWeb} onClick={handleUpdateWeb}>
                    {isUpdatingWeb && (
                      <Icon className="mr-2 animate-spin" icon="mdi:loading" />
                    )}
                    {t("confirmUpdate", "Confirm Update")}
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
            <Badge>
              V
              {moduleConfig?.service_version ||
                serverVersionInfo?.current_version ||
                "1.0.0"}
            </Badge>
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
                  <Icon className="mr-1 h-3 w-3" icon="mdi:download" />
                  {hasServerNewVersion && serverVersionInfo
                    ? `${t("update", "Update")} ${serverVersionInfo.latest_version}`
                    : t("update", "Update")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("confirmUpdate", "Confirm Update")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {serverVersionInfo && moduleConfig
                      ? t(
                          "updateServerDescription",
                          "Are you sure you want to update the server version from {{current}} to {{latest}}?",
                          {
                            current:
                              moduleConfig.service_version ||
                              serverVersionInfo.current_version,
                            latest: serverVersionInfo.latest_version,
                          }
                        )
                      : t(
                          "updateDescription",
                          "Are you sure you want to update?"
                        )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel", "Cancel")}</AlertDialogCancel>
                  <Button
                    disabled={isUpdatingServer || !moduleConfig}
                    onClick={() =>
                      moduleConfig &&
                      updateServerMutation.mutate(moduleConfig.service_name)
                    }
                  >
                    {isUpdatingServer && (
                      <Icon className="mr-2 animate-spin" icon="mdi:loading" />
                    )}
                    {t("confirmUpdate", "Confirm Update")}
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
