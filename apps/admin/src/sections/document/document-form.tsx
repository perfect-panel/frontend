import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { MarkdownEditor } from "@workspace/ui/composed/editor/markdown";
import { Icon } from "@workspace/ui/composed/icon";
import { TagInput } from "@workspace/ui/composed/tag-input";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const formSchema = z.object({
  title: z.string(),
  tags: z.array(z.string()).nullish(),
  content: z.string().nullish(),
});

interface DocumentFormProps<T> {
  onSubmit: (data: T) => Promise<boolean> | boolean;
  initialValues?: T;
  loading?: boolean;
  trigger: string;
  title: string;
}

export default function DocumentForm<T extends Record<string, any>>({
  onSubmit,
  initialValues,
  loading,
  trigger,
  title,
}: DocumentFormProps<T>) {
  const { t } = useTranslation("document");
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tags: [],
      ...initialValues,
    } as any,
  });

  useEffect(() => {
    form?.reset({
      tags: [],
      ...initialValues,
    });
  }, [form, initialValues]);

  async function handleSubmit(data: { [x: string]: any }) {
    const bool = await onSubmit(data as T);
    if (bool) setOpen(false);
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button
          onClick={() => {
            form.reset();
            setOpen(true);
          }}
        >
          {trigger}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[500px] max-w-full md:max-w-screen-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-48px-36px-36px-env(safe-area-inset-top))]">
          <Form {...form}>
            <form
              className="space-y-4 px-6 pt-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.title", "Title")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          "form.titlePlaceholder",
                          "Enter document title"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.tags", "Tags")}</FormLabel>
                    <FormControl>
                      <TagInput
                        onChange={(value) => form.setValue(field.name, value)}
                        placeholder={t("form.tagsPlaceholder", "Enter tags")}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.content", "Content")}</FormLabel>
                    <FormControl>
                      <MarkdownEditor
                        onChange={(value) => {
                          form.setValue(field.name, value);
                        }}
                        value={field.value}
                      />
                    </FormControl>
                    <div className="mt-4 space-y-2 border-t pt-4">
                      <p className="font-medium text-muted-foreground text-sm">
                        {t(
                          "form.variables.title",
                          "Template variables (replaced with the viewing user's own data)"
                        )}
                      </p>
                      <div className="space-y-2 text-muted-foreground text-xs">
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                            {"{{subscribe_url}}"}
                          </code>
                          <span>
                            {t(
                              "form.variables.subscribeUrl",
                              "Subscription link (raw)"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                            {"{{subscribe_url_encoded}}"}
                          </code>
                          <span>
                            {t(
                              "form.variables.subscribeUrlEncoded",
                              "Subscription link, URL-encoded (most client deep links)"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                            {"{{subscribe_url_base64}}"}
                          </code>
                          <span>
                            {t(
                              "form.variables.subscribeUrlBase64",
                              "Subscription link, Base64 (Shadowrocket)"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                            {"{{subscribe_url_qx}}"}
                          </code>
                          <span>
                            {t(
                              "form.variables.subscribeUrlQx",
                              "For Quantumult X add-resource"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                            {"{{site_name}}"}
                          </code>
                          <span>{t("form.variables.siteName", "Site name")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                            {"{{site_name_encoded}}"}
                          </code>
                          <span>
                            {t(
                              "form.variables.siteNameEncoded",
                              "Site name (URL-encoded)"
                            )}
                          </span>
                        </div>
                        <div className="pl-6 text-orange-600 dark:text-orange-400">
                          💡{" "}
                          {t(
                            "form.variables.example",
                            "Example: clash://install-config?url={{subscribe_url_encoded}}"
                          )}
                        </div>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        <SheetFooter className="flex-row justify-end gap-2 pt-3">
          <Button
            disabled={loading}
            onClick={() => {
              setOpen(false);
            }}
            variant="outline"
          >
            {t("form.cancel", "Cancel")}
          </Button>
          <Button disabled={loading} onClick={form.handleSubmit(handleSubmit)}>
            {loading && (
              <Icon className="mr-2 animate-spin" icon="mdi:loading" />
            )}{" "}
            {t("form.confirm", "Confirm")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
