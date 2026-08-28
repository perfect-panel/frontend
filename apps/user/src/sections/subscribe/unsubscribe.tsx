"use client";

import { useQuery } from "@tanstack/react-query";
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
import {
  postV1PublicUserUnsubscribePre as preUnsubscribe,
  postV1PublicUserUnsubscribe as unsubscribe,
} from "@workspace/ui/services/user/user";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Display } from "@/components/display";
import { useGlobalStore } from "@/stores/global";

interface UnsubscribeProps {
  id: number;
  allowDeduction?: boolean;
  onSuccess?: () => void;
}

export default function Unsubscribe({
  id,
  allowDeduction,
  onSuccess,
}: Readonly<UnsubscribeProps>) {
  const { t } = useTranslation("subscribe");
  const { common, getUserInfo } = useGlobalStore();
  const single_model = common.subscribe.single_model;

  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    enabled: Boolean(open && id && allowDeduction),
    queryKey: ["preUnsubscribe", id],
    queryFn: async () => {
      const { data } = await preUnsubscribe({ id });
      return data.data?.deduction_amount;
    },
  });

  const handleSubmit = async () => {
    try {
      await unsubscribe(
        { id },
        {
          skipErrorHandler: true,
        }
      );
      toast.success(t("unsubscribe.success", "Unsubscribed successfully"));
      await getUserInfo();
      onSuccess?.();
      setOpen(false);
    } catch (_error) {
      toast.error(t("unsubscribe.failed", "Unsubscribe failed"));
    }
  };

  if (!(single_model || allowDeduction)) return null;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          {t("unsubscribe.unsubscribe", "Unsubscribe")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("unsubscribe.confirmUnsubscribe", "Confirm Unsubscribe")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "unsubscribe.confirmUnsubscribeDescription",
              "Are you sure you want to unsubscribe?"
            )}
          </DialogDescription>
        </DialogHeader>
        <p>{t("unsubscribe.residualValue", "Residual Value")}</p>
        <p className="font-semibold text-2xl text-primary">
          <Display type="currency" value={data} />
        </p>
        <p className="text-muted-foreground text-sm">
          {t(
            "unsubscribe.unsubscribeDescription",
            "The residual value will be refunded to your account"
          )}
        </p>
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="outline">
            {t("unsubscribe.cancel", "Cancel")}
          </Button>
          <Button onClick={handleSubmit}>
            {t("unsubscribe.confirm", "Confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
