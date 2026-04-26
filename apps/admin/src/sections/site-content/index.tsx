"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet";
import { Textarea } from "@workspace/ui/components/textarea";
import { Icon } from "@workspace/ui/composed/icon";
import type { SiteContentItem } from "@workspace/ui/services/admin/siteContent";
import {
  getSiteContent,
  upsertSiteContent,
} from "@workspace/ui/services/admin/siteContent";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const LANGS = ["zh-CN", "en-US"] as const;
type Lang = (typeof LANGS)[number];

// Stable display order — terms first, then tutorials by official client list.
const KEY_ORDER = [
  "terms_of_use",
  "client_tutorial_v2rayn",
  "client_tutorial_clash",
  "client_tutorial_clashmeta",
  "client_tutorial_stash",
  "client_tutorial_shadowrocket",
  "client_tutorial_hiddify",
  "client_tutorial_quantumult",
  "client_tutorial_loon",
  "client_tutorial_flclash",
  "client_tutorial_surge",
  "client_tutorial_surge_mac",
];

function keyLabel(key: string, t: (k: any, d?: any) => string) {
  const map: Record<string, string> = {
    terms_of_use: t("siteContent.key.terms_of_use", "Terms of Use"),
    client_tutorial_v2rayn: "v2rayN",
    client_tutorial_clash: "Clash",
    client_tutorial_clashmeta: "Clash Meta",
    client_tutorial_stash: "Stash",
    client_tutorial_shadowrocket: "Shadowrocket",
    client_tutorial_hiddify: "Hiddify",
    client_tutorial_quantumult: "Quantumult X",
    client_tutorial_loon: "Loon",
    client_tutorial_flclash: "FlClash",
    client_tutorial_surge: "Surge",
    client_tutorial_surge_mac: "Surge for Mac",
  };
  return map[key] || key;
}

type Editor = {
  contentKey: string;
  contentLang: Lang;
  title: string;
  body: string;
  version: string;
};

export default function SiteContentPage() {
  const { t } = useTranslation("system");
  const [open, setOpen] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);

  const { data, refetch } = useQuery({
    queryKey: ["site_content_all"],
    queryFn: async () => {
      const { data } = await getSiteContent({});
      return data?.data?.list || [];
    },
  });

  const grouped = useMemo(() => {
    const map = new Map<string, Map<Lang, SiteContentItem>>();
    (data || []).forEach((row) => {
      if (!map.has(row.content_key)) {
        map.set(row.content_key, new Map());
      }
      map.get(row.content_key)!.set(row.content_lang as Lang, row);
    });
    // Discover keys not in static order (defensive against backend additions)
    const knownKeys = new Set<string>(KEY_ORDER);
    const extra: string[] = [];
    map.forEach((_, k) => {
      if (!knownKeys.has(k)) extra.push(k);
    });
    return {
      map,
      orderedKeys: [...KEY_ORDER.filter((k) => map.has(k)), ...extra.sort()],
    };
  }, [data]);

  const openEditor = (key: string, lang: Lang) => {
    const existing = grouped.map.get(key)?.get(lang);
    setEditor({
      contentKey: key,
      contentLang: lang,
      title: existing?.title || keyLabel(key, t),
      body: existing?.body || "",
      version: existing?.version || "1",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!editor) return;
    if (!editor.body.trim()) {
      toast.error(t("siteContent.bodyRequired", "Body cannot be empty"));
      return;
    }
    try {
      await upsertSiteContent({
        content_key: editor.contentKey,
        content_lang: editor.contentLang,
        title: editor.title,
        body: editor.body,
        version: editor.version,
      });
      toast.success(t("saved", "Saved"));
      setOpen(false);
      await refetch();
    } catch {
      // request layer already toasts
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon className="size-5" icon="flat-color-icons:document" />
            {t("siteContent.title", "Site Content (CMS)")}
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            {t(
              "siteContent.subtitle",
              "Edit the user agreement and 11 client tutorials, with per-language fallback."
            )}
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {grouped.orderedKeys.length === 0 && (
            <p className="text-muted-foreground">
              {t("siteContent.empty", "No content rows yet.")}
            </p>
          )}
          {grouped.orderedKeys.map((key) => {
            const langs =
              grouped.map.get(key) || new Map<Lang, SiteContentItem>();
            return (
              <div
                className="flex flex-row items-center justify-between rounded-md border p-3"
                key={key}
              >
                <div className="flex items-center gap-3">
                  <Icon className="size-4 text-primary" icon="uil:edit" />
                  <span className="font-medium">{keyLabel(key, t)}</span>
                  <code className="text-muted-foreground text-xs">{key}</code>
                </div>
                <div className="flex items-center gap-2">
                  {LANGS.map((lang) => {
                    const exists = langs.has(lang);
                    return (
                      <Badge
                        key={lang}
                        variant={exists ? "default" : "outline"}
                      >
                        {lang} {exists ? "✓" : "✗"}
                      </Badge>
                    );
                  })}
                  {LANGS.map((lang) => (
                    <Button
                      key={lang}
                      onClick={() => openEditor(key, lang)}
                      size="sm"
                      variant="outline"
                    >
                      {t("siteContent.edit", "Edit")} {lang}
                    </Button>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Sheet onOpenChange={setOpen} open={open}>
        <SheetContent className="w-[640px] sm:max-w-[640px]" side="right">
          <SheetHeader>
            <SheetTitle>
              {t("siteContent.editor", "Edit Site Content")}
            </SheetTitle>
            <SheetDescription>
              {editor && (
                <>
                  <code className="text-xs">{editor.contentKey}</code>
                  {" · "}
                  <Badge variant="outline">{editor.contentLang}</Badge>
                </>
              )}
            </SheetDescription>
          </SheetHeader>

          {editor && (
            <div className="space-y-4 px-4 py-2">
              <div className="space-y-2">
                <Label>{t("siteContent.titleField", "Title")}</Label>
                <Input
                  onChange={(e) =>
                    setEditor({ ...editor, title: e.target.value })
                  }
                  value={editor.title}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("siteContent.body", "Body (HTML / Markdown)")}</Label>
                <Textarea
                  className="min-h-[320px] font-mono text-xs"
                  onChange={(e) =>
                    setEditor({ ...editor, body: e.target.value })
                  }
                  placeholder={t(
                    "siteContent.bodyPlaceholder",
                    "Paste markdown or HTML here. Renders on user-facing pages."
                  )}
                  value={editor.body}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  {t(
                    "siteContent.version",
                    "Version (bump to force users re-accept terms)"
                  )}
                </Label>
                <Input
                  onChange={(e) =>
                    setEditor({ ...editor, version: e.target.value })
                  }
                  placeholder="1"
                  value={editor.version}
                />
              </div>
            </div>
          )}

          <SheetFooter>
            <Button onClick={handleSave}>{t("save", "Save")}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
