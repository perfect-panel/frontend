"use client";

import {
  MonacoEditor,
  type MonacoEditorProps,
} from "@workspace/ui/composed/editor/monaco-editor";
import { Markdown } from "@workspace/ui/composed/markdown";

export function MarkdownEditor(props: MonacoEditorProps) {
  return (
    <MonacoEditor
      description="Support markdown and html syntax"
      title="Markdown Editor"
      {...props}
      language="markdown"
      render={(value) => <Markdown>{value || ""}</Markdown>}
    />
  );
}
