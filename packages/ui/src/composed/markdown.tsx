"use client";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";
import ReactMarkdown, {
  type Components,
  defaultUrlTransform,
} from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";

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
          customStyle={{
            margin: 0,
            borderRadius: 0,
          }}
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

interface MarkdownProps {
  children: string;
  components?: Components;
}

const APP_DEEPLINK_SCHEME =
  /^(clash|clashmeta|shadowrocket|surge|surge3|sing-box|stash|loon|surfboard|hiddify|egern|v2rayng|quantumult-x):/i;

// react-markdown strips unknown URL schemes by default, which would break the
// client one-click-import deep links (clash://, shadowrocket://, ...). Allow
// those schemes explicitly; everything else keeps the default sanitization.
function appUrlTransform(url: string): string {
  return APP_DEEPLINK_SCHEME.test(url) ? url : defaultUrlTransform(url);
}

export function Markdown({ children, components }: MarkdownProps) {
  return (
    <div className="prose dark:prose-invert wrap-break-word w-full max-w-[unset]">
      <ReactMarkdown
        components={{
          h1: ({ node, className, ...props }) => (
            <h1
              className={cn(
                "mb-8 scroll-m-20 font-extrabold text-4xl tracking-tight last:mb-0",
                className
              )}
              {...props}
            />
          ),
          h2: ({ node, className, ...props }) => (
            <h2
              className={cn(
                "mt-8 mb-4 scroll-m-20 font-semibold text-3xl tracking-tight first:mt-0 last:mb-0",
                className
              )}
              {...props}
            />
          ),
          h3: ({ node, className, ...props }) => (
            <h3
              className={cn(
                "mt-6 mb-4 scroll-m-20 font-semibold text-2xl tracking-tight first:mt-0 last:mb-0",
                className
              )}
              {...props}
            />
          ),
          h4: ({ node, className, ...props }) => (
            <h4
              className={cn(
                "mt-6 mb-4 scroll-m-20 font-semibold text-xl tracking-tight first:mt-0 last:mb-0",
                className
              )}
              {...props}
            />
          ),
          h5: ({ node, className, ...props }) => (
            <h5
              className={cn(
                "my-4 font-semibold text-lg first:mt-0 last:mb-0",
                className
              )}
              {...props}
            />
          ),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          h6: ({ node, className, ...props }) => (
            <h6
              className={cn(
                "my-4 font-semibold first:mt-0 last:mb-0",
                className
              )}
              {...props}
            />
          ),
          p: ({ node, className, ...props }) => (
            <p
              className={cn(
                "mt-5 mb-5 leading-7 first:mt-0 last:mb-0",
                className
              )}
              {...props}
            />
          ),
          a: ({ node, className, ...props }) => (
            <a
              className={cn(
                "font-medium text-primary underline underline-offset-4",
                className
              )}
              target="_blank"
              {...props}
            />
          ),
          blockquote: ({ node, className, ...props }) => (
            <blockquote
              className={cn("border-l-2 pl-6 italic", className)}
              {...props}
            />
          ),
          ul: ({ node, className, ...props }) => (
            <ul
              className={cn("my-5 ml-6 list-disc [&>li]:mt-2", className)}
              {...props}
            />
          ),
          ol: ({ node, className, ...props }) => (
            <ol
              className={cn("my-5 ml-6 list-decimal [&>li]:mt-2", className)}
              {...props}
            />
          ),
          hr: ({ node, className, ...props }) => (
            <hr className={cn("my-5 border-b", className)} {...props} />
          ),
          table: ({ node, className, ...props }) => (
            <table
              className={cn(
                "my-5 w-full border-separate border-spacing-0 overflow-y-auto",
                className
              )}
              {...props}
            />
          ),
          th: ({ node, className, ...props }) => (
            <th
              className={cn(
                "bg-muted px-4 py-2 text-left font-bold first:rounded-tl-lg last:rounded-tr-lg [&[align=center]]:text-center [&[align=right]]:text-right",
                className
              )}
              {...props}
            />
          ),
          td: ({ node, className, ...props }) => (
            <td
              className={cn(
                "border-b border-l px-4 py-2 text-left last:border-r [&[align=center]]:text-center [&[align=right]]:text-right",
                className
              )}
              {...props}
            />
          ),
          tr: ({ node, className, ...props }) => (
            <tr
              className={cn(
                "m-0 border-b p-0 first:border-t [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg",
                className
              )}
              {...props}
            />
          ),
          sup: ({ node, className, ...props }) => (
            <sup
              className={cn("[&>a]:text-xs [&>a]:no-underline", className)}
              {...props}
            />
          ),
          pre: ({ node, className, ...props }) => (
            <pre
              className={cn("overflow-x-auto rounded-b-lg p-0", className)}
              {...props}
            />
          ),
          code(props) {
            return <CodeBlock {...(props as CodeBlockProps)} />;
          },
          ...components,
        }}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        urlTransform={appUrlTransform}
        remarkPlugins={[remarkGfm, remarkToc, remarkMath]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
