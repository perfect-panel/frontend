"use client";

import { useQuery } from "@tanstack/react-query";
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
import {
  getToolVersion as getServerVersion,
  getToolRestart as restartSystem,
} from "@workspace/ui/services/admin/admin";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import packageJson from "../../../../../../package.json";

export default function SystemVersionCard() {
  const { t } = useTranslation("tool");
  const [openRestart, setOpenRestart] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const { data: serverVersion } = useQuery({
    queryKey: ["getServerVersion"],
    queryFn: async () => {
      const { data } = await getServerVersion({ skipErrorHandler: true });
      return data.data?.version ?? null;
    },
    retry: 1,
  });

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
                      try {
                        await restartSystem();
                        await new Promise((resolve) =>
                          setTimeout(resolve, 5000)
                        );
                        setOpenRestart(false);
                      } catch {
                        // The request layer reports the failure.
                      } finally {
                        setIsRestarting(false);
                      }
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
            <Badge>{serverVersion ? `V${serverVersion}` : "—"}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
