"use client";

import {
  MonacoEditor,
  type MonacoEditorProps,
} from "@workspace/ui/composed/editor/monaco-editor";
import { Markdown } from "@workspace/ui/composed/markdown";
import { useTranslation } from "react-i18next";

export function MarkdownEditor(props: MonacoEditorProps) {
  const { t } = useTranslation("components");
  return (
    <MonacoEditor
      description={t(
        "editor.markdownDescription",
        "Support markdown and html syntax"
      )}
      title={t("editor.markdownTitle", "Markdown Editor")}
      {...props}
      language="markdown"
      render={(value) => <Markdown>{value || ""}</Markdown>}
    />
  );
}
