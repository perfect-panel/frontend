"use client";

// V4.3 决策 25:订阅客户端的「使用教程」编辑 Tab。
//
// 内容存放在 site_content 表 (content_key + content_lang),所以这个 Tab 不
// 走表单 submit,而是单独的 load/save。
//
// 语言完全跟随全局右上角语言切换器 (useTranslation().i18n.language) —
// 切换语言会自动重载对应语种的内容。

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { HTMLEditor } from "@workspace/ui/composed/editor/html";
import {
  getSiteContent,
  upsertSiteContent,
} from "@workspace/ui/services/admin/siteContent";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface TutorialTabProps {
  /** Empty for new clients — admin can fill in to bind to a CMS row. */
  tutorialKey?: string;
  /** Used to suggest a default key when creating a new client. */
  clientName?: string;
  /** Notify parent when admin types a new key (so it gets saved with the
   *  client record). */
  onKeyChange?: (key: string) => void;
}

function suggestKey(name?: string): string {
  if (!name) return "";
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug ? `client_tutorial_${slug}` : "";
}

export function TutorialTab({
  tutorialKey,
  clientName,
  onKeyChange,
}: TutorialTabProps) {
  const { t, i18n } = useTranslation("subscribe");
  const lang = i18n.language || "zh-CN";

  const [keyInput, setKeyInput] = useState(tutorialKey || "");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync incoming prop on edit
  useEffect(() => {
    setKeyInput(tutorialKey || "");
  }, [tutorialKey]);

  // Auto-suggest a key for new clients (only if empty + name available)
  useEffect(() => {
    if (!keyInput && clientName) {
      const s = suggestKey(clientName);
      if (s) {
        setKeyInput(s);
        onKeyChange?.(s);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientName]);

  // Load CMS content whenever (key, lang) changes
  useEffect(() => {
    if (!keyInput) {
      setTitle("");
      setBody("");
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const { data } = await getSiteContent({ lang, prefix: keyInput });
        if (cancelled) return;
        const row = (data?.data?.list || []).find(
          (r) => r.content_key === keyInput && r.content_lang === lang
        );
        setTitle(row?.title || "");
        setBody(row?.body || "");
      } catch {
        // request layer toasts
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [keyInput, lang]);

  const handleSave = async () => {
    if (!keyInput) {
      toast.error(t("tutorial.keyRequired", "Please set a tutorial key first"));
      return;
    }
    setSaving(true);
    try {
      await upsertSiteContent({
        content_key: keyInput,
        content_lang: lang,
        title: title || keyInput,
        body,
      });
      toast.success(t("tutorial.saved", "Tutorial saved"));
    } catch {
      // request layer toasts
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tutorial-key">
          {t("tutorial.keyLabel", "Tutorial Key")}
        </Label>
        <Input
          id="tutorial-key"
          onChange={(e) => {
            setKeyInput(e.target.value);
            onKeyChange?.(e.target.value);
          }}
          placeholder="client_tutorial_shadowrocket"
          value={keyInput}
        />
        <p className="text-muted-foreground text-xs">
          {t(
            "tutorial.keyDescription",
            "site_content row key. Same key shared across languages — switch the language at the top-right to edit a different translation."
          )}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tutorial-title">
          {t("tutorial.titleLabel", "Title")}
        </Label>
        <Input
          id="tutorial-title"
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("tutorial.titlePlaceholder", "e.g. 导入教程")}
          value={title}
        />
      </div>

      <div className="space-y-2">
        <Label>{t("tutorial.bodyLabel", "Content")}</Label>
        <HTMLEditor
          onChange={(v) => setBody(v || "")}
          placeholder={t(
            "tutorial.bodyPlaceholder",
            "Markdown / HTML content. Variables: {{.SubscribeUrl}}, {{.AppScheme}}, {{.AppName}}, {{.SiteName}}"
          )}
          value={body}
        />
        <p className="text-muted-foreground text-xs">
          {t(
            "tutorial.variableHint",
            "Template variables auto-replaced when shown to users: {{.SubscribeUrl}} / {{.AppScheme}} / {{.AppName}} / {{.SiteName}}"
          )}
        </p>
      </div>

      <div className="flex items-center justify-end gap-2">
        <span className="text-muted-foreground text-xs">
          {loading
            ? t("tutorial.loading", "Loading…")
            : t("tutorial.editingLang", "Editing: {{lang}}", { lang })}
        </span>
        <Button
          disabled={saving || !keyInput}
          onClick={handleSave}
          type="button"
        >
          {saving
            ? t("tutorial.saving", "Saving…")
            : t("tutorial.save", "Save Tutorial")}
        </Button>
      </div>
    </div>
  );
}
