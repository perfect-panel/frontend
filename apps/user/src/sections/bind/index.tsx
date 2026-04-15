"use client";

import { Spinner } from "@workspace/ui/components/spinner";
import { Icon } from "@workspace/ui/composed/icon";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { getOAuthProviderMeta } from "@/config/oauth-providers";
import Certification from "./certification";

export default function BindPage({
  platform,
  children,
}: {
  platform: string;
  children?: ReactNode;
}) {
  const { t } = useTranslation("auth");
  const provider = getOAuthProviderMeta(platform);

  return (
    <Certification platform={platform}>
      <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
        <div className="flex animate-pulse flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <Icon className="size-12" icon={provider.icon} />
            <Spinner className="size-8" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h1 className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text font-black text-transparent text-xl uppercase md:text-2xl dark:from-blue-400 dark:via-indigo-300 dark:to-violet-400">
              {provider.label}
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              {t("binding", "Binding account...")}
            </p>
          </div>
        </div>
        {children}
      </div>
    </Certification>
  );
}
