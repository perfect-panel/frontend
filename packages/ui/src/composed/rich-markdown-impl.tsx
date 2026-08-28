"use client";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";
import type { MarkdownProps } from "./markdown";
import { appUrlTransform, markdownComponents } from "./markdown-elements";

interface CodeBlockProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

function CodeBlock({ className, children, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const match = className?.startsWith("language-")
    ? /language-(\w+)/.exec(className)
    : null;

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(() => {
        alert("Failed to copy text. Please try again.");
      });
  }, []);

  if (match) {
    return (
      <div className="group relative my-4 w-full overflow-hidden rounded-lg">
        <div className="flex items-center justify-between gap-4 bg-muted px-4 py-2 font-semibold text-sm">
          <span className="lowercase [&>span]:text-xs">{match[1]}</span>
          <Button
            className="absolute top-0 right-2 z-20 p-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            onClick={() => handleCopy(String(children).replace(/\n$/, ""))}
            size="icon"
            variant="ghost"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </Button>
        </div>
        <SyntaxHighlighter
          {...props}
          customStyle={{ margin: 0, borderRadius: 0 }}
          language={match[1]}
          PreTag="div"
          showLineNumbers
          style={oneDark}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <code {...props} className={cn(className, "rounded border font-semibold")}>
      {children}
    </code>
  );
}

export default function RichMarkdownImpl({
  children,
  components,
}: MarkdownProps) {
  return (
    <div className="prose dark:prose-invert wrap-break-word w-full max-w-[unset]">
      <ReactMarkdown
        components={{
          ...markdownComponents,
          code(props) {
            return <CodeBlock {...(props as CodeBlockProps)} />;
          },
          ...components,
        }}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        remarkPlugins={[remarkGfm, remarkToc, remarkMath]}
        urlTransform={appUrlTransform}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
