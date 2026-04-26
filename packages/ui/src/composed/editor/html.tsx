"use client";

import {
  MonacoEditor,
  type MonacoEditorProps,
} from "@workspace/ui/composed/editor/monaco-editor";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export function HTMLEditor(props: MonacoEditorProps) {
  const { t } = useTranslation("components");
  return (
    <MonacoEditor
      description={t("editor.htmlDescription", "Support HTML")}
      title={t("editor.htmlTitle", "HTML Editor")}
      {...props}
      language="markdown"
      render={(value) => <HTMLPreview value={value} />}
    />
  );
}

interface HTMLPreviewProps {
  value?: string;
}

function HTMLPreview({ value }: HTMLPreviewProps) {
  const { t } = useTranslation("components");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframeDocument = iframeRef.current?.contentDocument;
    if (iframeDocument) {
      iframeDocument.open();
      iframeDocument.write(value || "");
      iframeDocument.close();
    }
  }, [value]);

  return (
    <iframe
      className="h-full w-full border-0"
      ref={iframeRef}
      title={t("editor.htmlPreviewTitle", "HTML Preview")}
    />
  );
}
