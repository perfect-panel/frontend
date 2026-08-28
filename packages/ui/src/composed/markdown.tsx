"use client";

import { lazy, Suspense } from "react";
import type { Components } from "react-markdown";

export interface MarkdownProps {
  children: string;
  components?: Components;
  rich?: boolean;
}

// Basic Markdown covers common prose. Math and syntax highlighting stay in a
// separate chunk and are requested only when the content needs them.
const MarkdownImpl = lazy(() => import("./markdown-impl"));
const RichMarkdownImpl = lazy(() => import("./rich-markdown-impl"));

function requiresRichRendering(content: string) {
  const hasFencedCode = /(^|\n)\s*(```|~~~)/.test(content);
  const hasBlockMath = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]/.test(content);
  const hasInlineMath = /(^|[^\\])\$[^$\n]+\$(?!\$)/m.test(content);
  return hasFencedCode || hasBlockMath || hasInlineMath;
}

export function Markdown({ rich, ...props }: MarkdownProps) {
  const Impl =
    rich || requiresRichRendering(props.children)
      ? RichMarkdownImpl
      : MarkdownImpl;

  return (
    <Suspense fallback={null}>
      <Impl {...props} />
    </Suspense>
  );
}
