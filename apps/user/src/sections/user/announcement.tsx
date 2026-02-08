"use client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import Empty from "@workspace/ui/composed/empty";
import { Icon } from "@workspace/ui/composed/icon";
import { Markdown } from "@workspace/ui/composed/markdown";
import { queryAnnouncement } from "@workspace/ui/services/user/announcement";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGlobalStore } from "@/stores/global";

export default function Announcement({ type }: { type: "popup" | "pinned" }) {
  const { t } = useTranslation("dashboard");
  const { user } = useGlobalStore();

  const { data } = useQuery({
    queryKey: ["announcement", type],
    queryFn: async () => {
      const result = await queryAnnouncement(
        {
          page: 1,
          size: 10,
          pinned: type === "pinned",
          popup: type === "popup",
        },
        {
          skipErrorHandler: true,
        }
      );
      return result.data.data?.announcements.find((item) => item[type]) || null;
    },
    enabled: !!user,
  });

  if (!data) return null;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (type === "popup" && !!data) setOpen(true);
  }, [data, type]);

  if (type === "popup") {
    return (
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="max-h-[85vh] overflow-auto sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{data?.title}</DialogTitle>
          </DialogHeader>
          <Markdown>{data?.content}</Markdown>
        </DialogContent>
      </Dialog>
    );
  }
  if (type === "pinned") {
    return (
      <>
        <h2 className="flex items-center gap-1.5 font-semibold">
          <Icon className="size-5" icon="uil:bell" />
          {t("latestAnnouncement", "Latest Announcement")}
        </h2>
        <Card className="p-6">
          {data?.content ? <Markdown>{data?.content}</Markdown> : <Empty />}
        </Card>
      </>
    );
  }
}
