"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { ArrayInput } from "@workspace/ui/composed/dynamic-Inputs";
import { Icon } from "@workspace/ui/composed/icon";
import {
  getSystemGetNodeMultiplier as getNodeMultiplier,
  postSystemSetNodeMultiplier as setNodeMultiplier,
} from "@workspace/ui/services/admin/admin";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function DynamicMultiplier() {
  const { t } = useTranslation("servers");
  const [open, setOpen] = useState(false);
  const [timeSlots, setTimeSlots] = useState<API.TimePeriod[]>([]);

  const { data: periodsResp, refetch: refetchPeriods } = useQuery({
    queryKey: ["getNodeMultiplier"],
    queryFn: async () => {
      const { data } = await getNodeMultiplier();
      return (data.data?.periods || []) as API.TimePeriod[];
    },
    enabled: open,
  });

  useEffect(() => {
    if (periodsResp) {
      setTimeSlots(periodsResp);
    }
  }, [periodsResp]);

  async function savePeriods() {
    await setNodeMultiplier({ periods: timeSlots });
    await refetchPeriods();
    toast.success(t("server_config.saveSuccess", "Saved successfully"));
    setOpen(false);
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Card>
          <CardContent>
            <div className="flex cursor-pointer items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon
                    className="h-5 w-5 text-primary"
                    icon="mdi:clock-time-eight"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {t(
                      "server_config.dynamic_multiplier",
                      "Dynamic multiplier"
                    )}
                  </p>
                  <p className="truncate text-muted-foreground text-sm">
                    {t(
                      "server_config.dynamic_multiplier_desc",
                      "Define time slots and multipliers to adjust traffic accounting."
                    )}
                  </p>
                </div>
              </div>
              <Icon className="size-6" icon="mdi:chevron-right" />
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>

      <SheetContent className="w-[600px] max-w-full md:max-w-3xl">
        <SheetHeader>
          <SheetTitle>
            {t("server_config.dynamic_multiplier", "Dynamic multiplier")}
          </SheetTitle>
          <SheetDescription>
            {t(
              "server_config.dynamic_multiplier_desc",
              "Define time slots and multipliers to adjust traffic accounting."
            )}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-48px-36px-60px-env(safe-area-inset-top))] px-6">
          <div className="space-y-4 pt-4">
            <ArrayInput<API.TimePeriod>
              fields={[
                {
                  name: "start_time",
                  prefix: t("server_config.fields.start_time", "Start time"),
                  type: "time",
                  step: "1",
                },
                {
                  name: "end_time",
                  prefix: t("server_config.fields.end_time", "End time"),
                  type: "time",
                  step: "1",
                },
                {
                  name: "multiplier",
                  prefix: t("server_config.fields.multiplier", "Multiplier"),
                  type: "number",
                  placeholder: "0",
                },
              ]}
              onChange={setTimeSlots}
              value={timeSlots}
            />
          </div>
        </ScrollArea>

        <SheetFooter className="flex-row justify-between pt-3">
          <Button
            onClick={() => setTimeSlots(periodsResp || [])}
            variant="outline"
          >
            {t("server_config.fields.reset", "Reset")}
          </Button>
          <div className="flex gap-2">
            <Button onClick={() => setOpen(false)} variant="outline">
              {t("actions.cancel", "Cancel")}
            </Button>
            <Button onClick={savePeriods}>{t("actions.save", "Save")}</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
