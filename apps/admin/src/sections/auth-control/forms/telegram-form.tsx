import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Switch } from "@workspace/ui/components/switch";
import { EnhancedInput } from "@workspace/ui/composed/enhanced-input";
import { Icon } from "@workspace/ui/composed/icon";
import {
  getAuthMethodConfig,
  updateAuthMethodConfig,
} from "@workspace/ui/services/admin/authMethod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const telegramSchema = z.object({
  enabled: z.boolean(),
  bot_token: z.string().optional(),
  enable_notify: z.boolean(),
  webhook_domain: z.string().optional(),
});

type TelegramFormData = z.infer<typeof telegramSchema>;

export default function TelegramForm() {
  const { t } = useTranslation("auth-control");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["getAuthMethodConfig", "telegram"],
    queryFn: async () => {
      const { data } = await getAuthMethodConfig({
        method: "telegram",
      });

      return data.data;
    },
    enabled: open,
  });

  const form = useForm<TelegramFormData>({
    resolver: zodResolver(telegramSchema),
    defaultValues: {
      enabled: false,
      bot_token: "",
      enable_notify: false,
      webhook_domain: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        enabled: data.enabled,
        bot_token: data.config?.bot_token || "",
        enable_notify: data.config?.enable_notify ?? false,
        webhook_domain: data.config?.webhook_domain || "",
      });
    }
  }, [data, form]);

  async function onSubmit(values: TelegramFormData) {
    setLoading(true);
    try {
      await updateAuthMethodConfig({
        ...data,
        enabled: values.enabled,
        config: {
          ...data?.config,
          bot_token: values.bot_token,
          enable_notify: values.enable_notify,
          webhook_domain: values.webhook_domain,
        },
      } as API.UpdateAuthMethodConfigRequest);
      toast.success(t("common.saveSuccess", "Saved successfully"));
      refetch();
      setOpen(false);
    } catch (_error) {
      toast.error(t("common.saveFailed", "Save failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <div className="flex cursor-pointer items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" icon="mdi:telegram" />
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {t("telegram.title", "Telegram Sign-In")}
              </p>
              <p className="text-muted-foreground text-sm">
                {t(
                  "telegram.description",
                  "Authenticate users with Telegram accounts"
                )}
              </p>
            </div>
          </div>
          <Icon className="size-6" icon="mdi:chevron-right" />
        </div>
      </SheetTrigger>
      <SheetContent className="w-[500px] max-w-full md:max-w-screen-md">
        <SheetHeader>
          <SheetTitle>{t("telegram.title", "Telegram Sign-In")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-48px-36px-36px-24px-env(safe-area-inset-top))] px-6">
          <Form {...form}>
            <form
              className="space-y-2 pt-4"
              id="telegram-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("telegram.enable", "Enable")}</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        className="!mt-0 float-end"
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "telegram.enableDescription",
                        "When enabled, users can sign in with their Telegram account"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bot_token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("telegram.botToken", "Bot Token")}
                    </FormLabel>
                    <FormControl>
                      <EnhancedInput
                        onValueChange={field.onChange}
                        placeholder="123456789:AAHn_xxxxxxxxxxxxxxxxxxxxxxxx"
                        type="password"
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "telegram.botTokenDescription",
                        "Telegram Bot Token from @BotFather"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="webhook_domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("telegram.webhookDomain", "Webhook Domain")}
                    </FormLabel>
                    <FormControl>
                      <EnhancedInput
                        onValueChange={field.onChange}
                        placeholder="https://your-domain.com"
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "telegram.webhookDomainDescription",
                        "Public HTTPS URL of this server. Leave empty to use long-polling."
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enable_notify"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("telegram.enableNotify", "Enable Notifications")}
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        className="!mt-0 float-end"
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "telegram.enableNotifyDescription",
                        "Send order and expiry notifications to users via Telegram"
                      )}
                    </FormDescription>
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
            onClick={() => setOpen(false)}
            variant="outline"
          >
            {t("common.cancel", "Cancel")}
          </Button>
          <Button disabled={loading} form="telegram-form" type="submit">
            {loading && (
              <Icon className="mr-2 animate-spin" icon="mdi:loading" />
            )}
            {t("common.save", "Save")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
