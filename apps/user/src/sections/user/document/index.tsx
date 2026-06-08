"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import Empty from "@workspace/ui/composed/empty";
import { queryDocumentList } from "@workspace/ui/services/user/document";
import { useTranslation } from "react-i18next";
import { DocumentButton } from "@/sections/user/document/document-button";
import { getTutorialList } from "@/sections/user/document/tutorial";
import { TutorialButton } from "@/sections/user/document/tutorial-button";
import { useGlobalStore } from "@/stores/global";

export default function Document() {
  const { t, i18n } = useTranslation("document");
  const locale = i18n.language;
  const { common } = useGlobalStore();

  const { data } = useQuery({
    queryKey: ["queryDocumentList"],
    queryFn: async () => {
      const response = await queryDocumentList();
      const list = response.data.data?.list || [];
      return {
        tags: Array.from(
          new Set(
            list.reduce((acc: string[], item) => acc.concat(item.tags), [])
          )
        ),
        list,
      };
    },
  });
  const { tags, list: DocumentList } = data || { tags: [], list: [] };

  const { data: TutorialList } = useQuery({
    queryKey: ["getTutorialList", locale],
    queryFn: async () => {
      const list = await getTutorialList();
      return list.get(locale);
    },
    enabled: common.subscribe?.show_tutorial !== false,
  });

  if (
    (!DocumentList || DocumentList.length === 0) &&
    (!TutorialList || TutorialList.length === 0)
  ) {
    return <Empty border />;
  }

  return (
    <div className="space-y-4">
      {DocumentList?.length > 0 && (
        <>
          <h2 className="flex items-center gap-1.5 font-semibold">
            {t("document", "Document")}
          </h2>
          <Tabs defaultValue="all">
            <TabsList className="h-full flex-wrap">
              <TabsTrigger value="all">{t("all", "All")}</TabsTrigger>
              {tags?.map((item) => (
                <TabsTrigger key={item} value={item}>
                  {item}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="all">
              <DocumentButton items={DocumentList} />
            </TabsContent>
            {tags?.map((item) => (
              <TabsContent key={item} value={item}>
                <DocumentButton
                  items={DocumentList.filter((docs) =>
                    item ? docs.tags.includes(item) : true
                  )}
                />
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}

      {TutorialList && TutorialList?.length > 0 && (
        <>
          <h2 className="flex items-center gap-1.5 font-semibold">
            {t("tutorial", "Tutorial")}
          </h2>
          <Tabs defaultValue={TutorialList?.[0]?.title}>
            <TabsList className="h-full flex-wrap">
              {TutorialList?.map((tutorial) => (
                <TabsTrigger key={tutorial.title} value={tutorial.title}>
                  {tutorial.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {TutorialList?.map((tutorial) => (
              <TabsContent key={tutorial.title} value={tutorial.title}>
                <TutorialButton
                  items={
                    tutorial.subItems && tutorial.subItems?.length > 0
                      ? tutorial.subItems
                      : [tutorial]
                  }
                  key={tutorial.path}
                />
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  );
}
