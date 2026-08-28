import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Icon } from "@workspace/ui/composed/icon";
import { getToolLog as getSystemLog } from "@workspace/ui/services/admin/admin";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface SystemLogsDialogProps {
  trigger?: React.ReactNode;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "sm" | "default" | "lg";
}

export default function SystemLogsDialog({
  trigger,
  variant = "outline",
  size = "sm",
}: SystemLogsDialogProps) {
  const { t } = useTranslation("tool");
  const [open, setOpen] = useState(false);

  const {
    data: logs,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["getSystemLog"],
    queryFn: async () => {
      const { data } = await getSystemLog();
      return data.data?.list || [];
    },
    enabled: open,
  });

  const defaultTrigger = (
    <Button size={size} variant={variant}>
      {t("systemLogs", "System Logs")}
    </Button>
  );

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t("systemLogs", "System Logs")}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] max-h-[80vh] min-h-[400px] w-full rounded-lg border bg-muted/30 p-1">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Icon
                className="h-8 w-8 animate-spin text-primary"
                icon="uil:loading"
              />
            </div>
          ) : (
            <Accordion className="w-full" collapsible type="single">
              {logs?.map((log: any, index: number) => (
                <AccordionItem
                  className="px-4"
                  key={index}
                  value={`item-${index}`}
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex w-full flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
                      <span className="font-medium text-xs sm:text-sm">
                        {log.timestamp}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-2">
                    {Object.entries(log).map(([key, value]) => (
                      <div
                        className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 sm:text-sm"
                        key={key}
                      >
                        <span className="font-medium">{key}:</span>
                        <span className="break-all">{value as string}</span>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </ScrollArea>
        <DialogFooter>
          <Button
            onClick={() => {
              refetch();
            }}
            variant="outline"
          >
            <Icon
              className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
              icon="uil:refresh"
            />
            <span>{t("refreshLogs", "Refresh Logs")}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
