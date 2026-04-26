"use client";

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
import { Textarea } from "@workspace/ui/components/textarea";
import { EnhancedInput } from "@workspace/ui/composed/enhanced-input";
import { Icon } from "@workspace/ui/composed/icon";
import {
  getSubscribeConfig,
  updateSubscribeConfig,
} from "@workspace/ui/services/admin/system";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const subscribeConfigSchema = z.object({
  single_model: z.boolean().optional(),
  pan_domain: z.boolean().optional(),
  subscribe_path: z.string().optional(),
  subscribe_domain: z.string().optional(),
  user_agent_limit: z.boolean().optional(),
  user_agent_list: z.string().optional(),
  // V4.3:导入后客户端自动更新订阅的间隔(小时)。0 = 关闭。
  update_interval_hours: z.number().int().min(0).max(168).optional(),
});

type SubscribeConfigFormData = z.infer<typeof subscribeConfigSchema>;

export default function ConfigForm() {
  const { t } = useTranslation("subscribe");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["getSubscribeConfig"],
    queryFn: async () => {
      const { data } = await getSubscribeConfig();
      return data.data;
    },
    enabled: open,
  });

  const form = useForm<SubscribeConfigFormData>({
    resolver: zodResolver(subscribeConfigSchema),
    defaultValues: {
      single_model: false,
      pan_domain: false,
      subscribe_path: "",
      subscribe_domain: "",
      user_agent_limit: false,
      user_agent_list: "",
      update_interval_hours: 24,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  async function onSubmit(values: SubscribeConfigFormData) {
    setLoading(true);
    try {
      await updateSubscribeConfig(values as API.SubscribeConfig);
      toast.success(t("config.updateSuccess", "Settings updated successfully"));
      refetch();
      setOpen(false);
    } catch (_error) {
      toast.error(t("config.updateError", "Update failed"));
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
              <Icon className="h-5 w-5 text-primary" icon="mdi:cog" />
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {t("config.title", "Subscription Configuration")}
              </p>
              <p className="text-muted-foreground text-sm">
                {t("config.description", "Manage subscription system settings")}
              </p>
            </div>
          </div>
          <Icon className="size-6" icon="mdi:chevron-right" />
        </div>
      </SheetTrigger>
      <SheetContent className="w-[600px] max-w-full md:max-w-screen-md">
        <SheetHeader>
          <SheetTitle>
            {t("config.title", "Subscription Configuration")}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-48px-36px-36px-env(safe-area-inset-top))] px-6">
          <Form {...form}>
            <form
              className="space-y-2 pt-4"
              id="subscribe-config-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="single_model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        "config.singleSubscriptionMode",
                        "Single Subscription Mode"
                      )}
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
                        "config.singleSubscriptionModeDescription",
                        "Limit users to one active subscription. Existing subscriptions unaffected"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pan_domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("config.wildcardResolution", "Wildcard Resolution")}
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
                        "config.wildcardResolutionDescription",
                        "Enable wildcard domain resolution for subscriptions"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subscribe_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("config.subscriptionPath", "Subscription Path")}
                    </FormLabel>
                    <FormControl>
                      <EnhancedInput
                        onValueBlur={field.onChange}
                        placeholder={t(
                          "config.subscriptionPathPlaceholder",
                          "Enter subscription path"
                        )}
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "config.subscriptionPathDescription",
                        "Custom path for subscription endpoints (better performance after system restart)"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subscribe_domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("config.subscriptionDomain", "Subscription Domain")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-32"
                        placeholder={`${t(
                          "config.subscriptionDomainPlaceholder",
                          "Enter subscription domain, one per line"
                        )}\nexample.com\nwww.example.com`}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "config.subscriptionDomainDescription",
                        "Custom domain for subscription links"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="update_interval_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("config.updateInterval", "订阅自动更新间隔(小时)")}
                    </FormLabel>
                    <FormControl>
                      <EnhancedInput
                        max={168}
                        min={0}
                        onValueBlur={(v) => field.onChange(Number(v) || 0)}
                        placeholder="24"
                        type="number"
                        value={field.value ?? 24}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "config.updateIntervalDescription",
                        "导入后客户端按此周期自动更新订阅。0 = 关闭。智能识别客户端:Clash 家族 / Hiddify / Mihomo Party 走 Profile-Update-Interval header;Surge / Stash 走 #!MANAGED-CONFIG 注入;v2rayN / Shadowrocket / QuanX / Loon 不支持,需用户手动设置。"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user_agent_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("config.userAgentLimit", "{{userAgent}} Restriction", {
                        userAgent: "User-Agent",
                      })}
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
                        "config.userAgentLimitDescription",
                        "Enable access restrictions based on {{userAgent}}",
                        {
                          userAgent: "User-Agent",
                        }
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user_agent_list"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("config.userAgentList", "{{userAgent}} Whitelist", {
                        userAgent: "User-Agent",
                      })}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-32"
                        placeholder={`${t(
                          "config.userAgentListPlaceholder",
                          "Enter allowed {{userAgent}}, one per line",
                          { userAgent: "User-Agent" }
                        )}\nClashX\nClashForAndroid\nClash-verge`}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "config.userAgentListDescription",
                        "Allowed {{userAgent}} for subscription access, one per line. Configured application {{userAgent}} will be automatically included",
                        {
                          userAgent: "User-Agent",
                        }
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
            {t("actions.cancel", "Cancel")}
          </Button>
          <Button disabled={loading} form="subscribe-config-form" type="submit">
            {loading && (
              <Icon className="mr-2 animate-spin" icon="mdi:loading" />
            )}
            {t("actions.save", "Save")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
