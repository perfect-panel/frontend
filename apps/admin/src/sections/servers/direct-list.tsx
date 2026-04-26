"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  getServerDirectList,
  updateServerDirectList,
} from "@workspace/ui/services/admin/server";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const DEFAULT_HINT = [
  "panel.example.com",
  "sub.example.com",
  "stripe.com",
  "paypal.com",
  "alipay.com",
  "qpay.tenpay.com",
];

export default function DirectListEditor({ serverId }: { serverId: number }) {
  const { t } = useTranslation("servers");
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await getServerDirectList(serverId);
        if (cancelled) return;
        const list = data?.data?.direct_list || [];
        setText(list.join("\n"));
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, serverId]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const list = text
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);
      await updateServerDirectList(serverId, { direct_list: list });
      toast.success(t("saved", "Saved"));
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const lines = text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean).length;

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button variant="outline">{t("directList", "Direct List")}</Button>
      </SheetTrigger>
      <SheetContent className="w-[520px] sm:max-w-[520px]" side="right">
        <SheetHeader>
          <SheetTitle>{t("directListTitle", "Direct Allowlist")}</SheetTitle>
          <SheetDescription>
            {t(
              "directListDesc",
              "Domains the client connects directly (not via proxy). One per line. Includes panel/payment domains so users can recharge while throttled."
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-3 px-4 py-2">
          <div className="flex items-center justify-between">
            <Label>{t("directListField", "Direct domains")}</Label>
            <Badge variant="outline">
              {lines} {t("entries", "entries")}
            </Badge>
          </div>
          <Textarea
            className="min-h-[320px] font-mono text-xs"
            disabled={loading}
            onChange={(e) => setText(e.target.value)}
            placeholder={DEFAULT_HINT.join("\n")}
            value={text}
          />
          <p className="text-muted-foreground text-xs">
            {t(
              "directListHint",
              "Suggested: panel domain, subscribe domain, payment gateways (Stripe / PayPal / Alipay / WeChat Pay)."
            )}
          </p>
        </div>

        <SheetFooter>
          <Button disabled={loading} onClick={handleSave}>
            {t("save", "Save")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
