"use client";

import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { buttonVariants } from "@workspace/ui/components/button";
import { Markdown } from "@workspace/ui/composed/markdown";
import { useOutsideClick } from "@workspace/ui/hooks/use-outside-click";
import { cn } from "@workspace/ui/lib/utils";
import { queryDocumentDetail } from "@workspace/ui/services/user/document";
import { queryUserSubscribe } from "@workspace/ui/services/user/user";
import { formatDate } from "@workspace/ui/utils/formatting";
import { AnimatePresence, motion } from "framer-motion";
import { type RefObject, useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGlobalStore } from "@/stores/global";
import { CloseIcon } from "./close-icon";

export function DocumentButton({ items }: { items: API.Document[] }) {
  const { t } = useTranslation("document");
  const [active, setActive] = useState<API.Document | boolean | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    enabled: !!(active as API.Document)?.id,
    queryKey: ["queryDocumentDetail", (active as API.Document)?.id],
    queryFn: async () => {
      const { data } = await queryDocumentDetail({
        id: (active as API.Document)?.id,
      });
      return data.data?.content;
    },
  });

  const { common, getUserSubscribe } = useGlobalStore();
  const { data: userSubscriptions } = useQuery({
    queryKey: ["queryUserSubscribe"],
    queryFn: async () => {
      const { data } = await queryUserSubscribe();
      return data.data?.list || [];
    },
  });

  const firstSubscribe = userSubscriptions?.[0];
  const subscribeUrl = firstSubscribe
    ? (getUserSubscribe(firstSubscribe.short, firstSubscribe.token)?.[0] ?? "")
    : "";
  const siteName = common.site?.site_name ?? "";

  const fillVariables = (content: string) => {
    if (!content) {
      return "";
    }
    const hasSub = Boolean(subscribeUrl);
    const purchaseHint = t("noSubscription", "Please purchase a subscription");
    const toBase64 = (value: string) => {
      try {
        return btoa(value);
      } catch {
        return "";
      }
    };
    return content
      .replaceAll("{{subscribe_url}}", hasSub ? subscribeUrl : purchaseHint)
      .replaceAll(
        "{{subscribe_url_encoded}}",
        hasSub ? encodeURIComponent(subscribeUrl) : ""
      )
      .replaceAll(
        "{{subscribe_url_base64}}",
        hasSub ? toBase64(subscribeUrl) : ""
      )
      .replaceAll(
        "{{subscribe_url_qx}}",
        hasSub
          ? encodeURIComponent(
              `{"server_remote":["${subscribeUrl}, tag=${siteName}"]}`
            )
          : ""
      )
      .replaceAll("{{site_name}}", siteName)
      .replaceAll("{{site_name_encoded}}", encodeURIComponent(siteName));
  };

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref as RefObject<HTMLDivElement>, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-10 h-full w-full bg-black/20"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 z-[100] grid place-items-center">
            <motion.button
              animate={{
                opacity: 1,
              }}
              className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-white dark:text-black"
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              initial={{
                opacity: 0,
              }}
              key={`button-${active.title}-${id}`}
              layout
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              className="flex size-full flex-col overflow-auto bg-muted p-6 sm:rounded"
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
            >
              <Markdown>{fillVariables(data || "")}</Markdown>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <div className="flex w-full flex-col gap-4">
        {items.map((item) => (
          <motion.div
            className="flex cursor-pointer items-center justify-between rounded-xl border bg-background p-4 hover:bg-accent"
            key={`card-${item.id}-${id}`}
            layoutId={`card-${item.id}-${id}`}
            onClick={() => setActive(item)}
          >
            <div className="flex flex-row items-center gap-4">
              <motion.div layoutId={`image-${item.id}-${id}`}>
                <Avatar className="size-12">
                  <AvatarFallback className="bg-primary/80 text-white">
                    {item.title.split("")[0]}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div className="">
                <motion.h3
                  className="font-medium"
                  layoutId={`title-${item.id}-${id}`}
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  className="text-neutral-600 text-sm dark:text-neutral-400"
                  layoutId={`description-${item.id}-${id}`}
                >
                  {formatDate(item.updated_at)}
                </motion.p>
              </div>
            </div>
            <motion.button
              className={cn(
                buttonVariants({
                  variant: "secondary",
                }),
                "rounded-full"
              )}
              layoutId={`button-${item.id}-${id}`}
            >
              {t("read", "Read")}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </>
  );
}
