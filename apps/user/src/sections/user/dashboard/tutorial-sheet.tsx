"use client";

// V4.3 决策 25 用户端入口:点击客户端卡片的 📚 按钮弹出该客户端的使用教程。
//
// 教程内容存放在 site_content (key + lang),通过公开接口
// `/v1/common/site_content?key=&lang=` 拉取。语言跟随全局 i18n 切换。
// 模板变量 {{.SubscribeUrl}} / {{.AppScheme}} / {{.AppName}} / {{.SiteName}}
// 在前端做替换,把通用文案变成「这个用户的真实订阅链接」。

import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Icon } from "@workspace/ui/composed/icon";
import { getSiteContentItem } from "@workspace/ui/services/common/siteContent";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { useGlobalStore } from "@/stores/global";

interface TutorialSheetProps {
  tutorialKey: string;
  appName: string;
  appScheme?: string;
  subscribeUrl: string;
  /** Optional custom trigger; defaults to a small ghost button with 📚 icon. */
  trigger?: React.ReactNode;
}

function substituteVariables(
  body: string,
  vars: Record<string, string>
): string {
  return body.replace(
    /\{\{\s*\.([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g,
    (m, name) => vars[name] ?? m
  );
}

export function TutorialSheet({
  tutorialKey,
  appName,
  appScheme,
  subscribeUrl,
  trigger,
}: TutorialSheetProps) {
  const { t, i18n } = useTranslation("dashboard");
  const lang = i18n.language || "zh-CN";
  const { common } = useGlobalStore();
  const siteName = common?.site?.site_name || "";

  const { data, isLoading } = useQuery({
    queryKey: ["site_content_item", tutorialKey, lang],
    enabled: !!tutorialKey,
    queryFn: async () => {
      const { data } = await getSiteContentItem({ key: tutorialKey, lang });
      return data?.data;
    },
  });

  const rendered = substituteVariables(data?.body || "", {
    SubscribeUrl: subscribeUrl,
    AppScheme: appScheme || "",
    AppName: appName,
    SiteName: siteName,
  });

  const importUrl =
    appScheme && subscribeUrl
      ? `${appScheme}${encodeURIComponent(subscribeUrl)}`
      : "";

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <Button className="px-2" size="sm" variant="outline">
            <Icon className="mr-1 size-3" icon="mdi:book-open-page-variant" />
            {t("tutorial", "使用教程")}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        className="!w-[600px] !max-w-[90vw] flex flex-col gap-0 p-0"
        side="right"
      >
        <SheetHeader className="border-b p-4">
          <SheetTitle className="flex items-center gap-2">
            <Icon className="size-5" icon="mdi:book-open-page-variant" />
            {data?.title ||
              t("tutorialOf", "{{name}} Tutorial", { name: appName })}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Icon className="mr-2 animate-spin" icon="mdi:loading" />
              {t("loading", "Loading…")}
            </div>
          ) : rendered.trim() ? (
            <article className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
              >
                {rendered}
              </ReactMarkdown>
            </article>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <Icon
                className="size-12 opacity-50"
                icon="mdi:file-document-outline"
              />
              <p>{t("tutorialEmpty", "Tutorial not yet written.")}</p>
            </div>
          )}
        </div>

        {importUrl && (
          <div className="border-t p-4">
            <Button asChild className="w-full">
              <a href={importUrl}>
                <Icon className="mr-2 size-4" icon="mdi:download" />
                {t("oneClickImport", "One-click import to {{name}}", {
                  name: appName,
                })}
              </a>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
