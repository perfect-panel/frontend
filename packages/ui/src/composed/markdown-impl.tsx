"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import type { MarkdownProps } from "./markdown";
import { appUrlTransform, markdownComponents } from "./markdown-elements";

export default function MarkdownImpl({ children, components }: MarkdownProps) {
  return (
    <div className="prose dark:prose-invert wrap-break-word w-full max-w-[unset]">
      <ReactMarkdown
        components={{ ...markdownComponents, ...components }}
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm, remarkToc]}
        urlTransform={appUrlTransform}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
