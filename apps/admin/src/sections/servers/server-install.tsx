"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { getSystemNodeConfig as getNodeConfig } from "@workspace/ui/services/admin/admin";
import {
  type ChangeEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type Props = {
  server: API.Server;
  trigger?: ReactNode;
};

export default function ServerInstall({ server, trigger }: Props) {
  const { t } = useTranslation("servers");
  const [open, setOpen] = useState(false);
  const [domain, setDomain] = useState("");

  const { data: cfgResp } = useQuery({
    queryKey: ["getNodeConfig"],
    queryFn: async () => {
      const { data } = await getNodeConfig();
      return data.data as API.NodeConfig | undefined;
    },
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      const host = localStorage.getItem("API_HOST") ?? window.location.origin;
      setDomain(host);
    }
  }, [open]);

  const installCommand = useMemo(() => {
    const secret = cfgResp?.node_secret ?? "";
    return `wget -N https://raw.githubusercontent.com/perfect-panel/ppanel-node/master/scripts/install.sh && bash install.sh --api-host ${domain} --server-id ${server.id} --secret-key ${secret}`;
  }, [domain, server.id, cfgResp?.node_secret]);

  async function handleCopy() {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(installCommand);
      } else {
        // fallback for environments without clipboard API
        const el = document.createElement("textarea");
        el.value = installCommand;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      toast.success(t("copied", "Copied"));
      setOpen(false);
    } catch {
      toast.error(t("copyFailed", "Copy failed"));
    }
  }

  const onDomainChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
    localStorage.setItem("API_HOST", e.target.value);
  }, []);
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="secondary">{t("connect", "Connect")}</Button>
        )}
      </DialogTrigger>

      <DialogContent className="w-[720px] max-w-full md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("oneClickInstall", "One-click Install")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>{t("apiHost", "API Host")}</Label>
            <div className="flex items-center gap-2">
              <Input
                onChange={onDomainChange}
                placeholder={t("apiHostPlaceholder", "http(s)://example.com")}
                value={domain}
              />
            </div>
          </div>

          <div>
            <Label>{t("installCommand", "Install command")}</Label>
            <div className="flex flex-col gap-2">
              <textarea
                aria-label={t("installCommand", "Install command")}
                className="min-h-[88px] w-full rounded border p-2 font-mono text-sm"
                readOnly
                value={installCommand}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex-row justify-end gap-2 pt-3">
          <Button onClick={() => setOpen(false)} variant="outline">
            {t("close", "Close")}
          </Button>
          <Button onClick={handleCopy}>
            {t("copyAndClose", "Copy and Close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
