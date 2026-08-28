import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
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
import { AreaCodeSelect } from "@workspace/ui/composed/area-code-select";
import { EnhancedInput } from "@workspace/ui/composed/enhanced-input";
import { Icon } from "@workspace/ui/composed/icon";
import TagInput from "@workspace/ui/composed/tag-input";
import {
  getAuthMethodConfig,
  getAuthMethodSmsPlatform as getSmsPlatform,
  postAuthMethodTestSmsSend as testSmsSend,
  putAuthMethodConfig as updateAuthMethodConfig,
} from "@workspace/ui/services/admin/admin";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const phoneSettingsSchema = z.object({
  id: z.number(),
  method: z.string(),
  enabled: z.boolean(),
  config: z
    .object({
      enable_whitelist: z.boolean().optional(),
      whitelist: z.array(z.string()).optional(),
      platform: z.string().optional(),
      platform_config: z
        .object({
          access: z.string().optional(),
          endpoint: z.string().optional(),
          secret: z.string().optional(),
          template_code: z.string().optional(),
          sign_name: z.string().optional(),
          phone_number: z.string().optional(),
          template: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

type PhoneSettingsFormData = z.infer<typeof phoneSettingsSchema>;

export default function PhoneSettingsForm() {
  const { t } = useTranslation("auth-control");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testParams, setTestParams] = useState<API.TestSmsSendRequest>({
    telephone: "",
    area_code: "1",
  });

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["getAuthMethodConfig", "mobile"],
    queryFn: async () => {
      const { data } = await getAuthMethodConfig({
        method: "mobile",
      });
      return data.data;
    },
    enabled: open,
  });

  const { data: platforms } = useQuery({
    queryKey: ["getSmsPlatform"],
    queryFn: async () => {
      const { data } = await getSmsPlatform();
      return data.data?.list;
    },
    enabled: open,
  });

  const form = useForm<PhoneSettingsFormData>({
    resolver: zodResolver(phoneSettingsSchema),
    defaultValues: {
      id: 0,
      method: "mobile",
      enabled: false,
      config: {
        enable_whitelist: false,
        whitelist: [],
        platform: "",
        platform_config: {
          access: "",
          endpoint: "",
          secret: "",
          template_code: "code",
          sign_name: "",
          phone_number: "",
          template: "",
        },
      },
    },
  });

  const selectedPlatform = platforms?.find(
    (platform) => platform.platform === form.watch("config.platform")
  );
  const { platform_url, platform_field_description: platformConfig } =
    selectedPlatform ?? {};

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  async function onSubmit(values: PhoneSettingsFormData) {
    setLoading(true);
    try {
      await updateAuthMethodConfig(values as API.UpdateAuthMethodConfigRequest);
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
              <Icon
                className="h-5 w-5 text-primary"
                icon="mdi:phone-settings"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">{t("phone.title", "SMS Settings")}</p>
              <p className="text-muted-foreground text-sm">
                {t("phone.description", "Configure SMS authentication")}
              </p>
            </div>
          </div>
          <Icon className="size-6" icon="mdi:chevron-right" />
        </div>
      </SheetTrigger>
      <SheetContent className="w-[600px] max-w-full md:max-w-screen-md">
        <SheetHeader>
          <SheetTitle>{t("phone.title", "SMS Settings")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-48px-36px-36px-24px-env(safe-area-inset-top))] px-6">
          <Form {...form}>
            <form
              className="space-y-2 pt-4"
              id="phone-settings-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("phone.enable", "Enable")}</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        className="!mt-0 float-end"
                        disabled={isFetching}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "phone.enableTip",
                        "When enabled, users can sign in with their phone number"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="config.enable_whitelist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("phone.whitelistValidation", "Whitelist Validation")}
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
                        "phone.whitelistValidationTip",
                        "Only allow phone numbers with whitelisted area codes"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="config.whitelist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("phone.whitelistAreaCode", "Whitelist Area Codes")}
                    </FormLabel>
                    <FormControl>
                      <TagInput
                        onChange={field.onChange}
                        placeholder="1, 852, 886, 888"
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "phone.whitelistAreaCodeTip",
                        "Enter area codes separated by commas"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="config.platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("phone.platform", "SMS Platform")}</FormLabel>
                    <div className="flex items-center gap-1">
                      <FormControl>
                        <Select
                          disabled={isFetching}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {platforms?.map((item) => (
                              <SelectItem
                                key={item.platform}
                                value={item.platform}
                              >
                                {item.platform}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {platform_url && (
                        <Button asChild size="sm">
                          <Link target="_blank" to={platform_url}>
                            {t("phone.applyPlatform", "Apply")}
                          </Link>
                        </Button>
                      )}
                    </div>
                    <FormDescription>
                      {t("phone.platformTip", "Select SMS service provider")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="config.platform_config.access"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("phone.accessLabel", "Access Key")}
                    </FormLabel>
                    <FormControl>
                      <EnhancedInput
                        disabled={isFetching}
                        onValueChange={field.onChange}
                        placeholder={t(
                          "phone.platformConfigTip",
                          "Please enter {{key}}",
                          {
                            key: platformConfig?.access,
                          }
                        )}
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("phone.platformConfigTip", "Please enter {{key}}", {
                        key: platformConfig?.access,
                      })}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {platformConfig?.endpoint && (
                <FormField
                  control={form.control}
                  name="config.platform_config.endpoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("phone.endpointLabel", "Endpoint")}
                      </FormLabel>
                      <FormControl>
                        <EnhancedInput
                          disabled={isFetching}
                          onValueChange={field.onChange}
                          placeholder={t(
                            "phone.platformConfigTip",
                            "Please enter {{key}}",
                            {
                              key: platformConfig?.endpoint,
                            }
                          )}
                          value={field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("phone.platformConfigTip", "Please enter {{key}}", {
                          key: platformConfig?.endpoint,
                        })}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="config.platform_config.secret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("phone.secretLabel", "Secret Key")}
                    </FormLabel>
                    <FormControl>
                      <EnhancedInput
                        disabled={isFetching}
                        onValueChange={field.onChange}
                        placeholder={t(
                          "phone.platformConfigTip",
                          "Please enter {{key}}",
                          {
                            key: platformConfig?.secret,
                          }
                        )}
                        type="password"
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("phone.platformConfigTip", "Please enter {{key}}", {
                        key: platformConfig?.secret,
                      })}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {platformConfig?.template_code && (
                <FormField
                  control={form.control}
                  name="config.platform_config.template_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("phone.templateCodeLabel", "Template Code")}
                      </FormLabel>
                      <FormControl>
                        <EnhancedInput
                          disabled={isFetching}
                          onValueChange={field.onChange}
                          placeholder={t(
                            "phone.platformConfigTip",
                            "Please enter {{key}}",
                            {
                              key: platformConfig?.template_code,
                            }
                          )}
                          value={field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("phone.platformConfigTip", "Please enter {{key}}", {
                          key: platformConfig?.template_code,
                        })}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {platformConfig?.sign_name && (
                <FormField
                  control={form.control}
                  name="config.platform_config.sign_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("phone.signNameLabel", "Sign Name")}
                      </FormLabel>
                      <FormControl>
                        <EnhancedInput
                          disabled={isFetching}
                          onValueChange={field.onChange}
                          placeholder={t(
                            "phone.platformConfigTip",
                            "Please enter {{key}}",
                            {
                              key: platformConfig?.sign_name,
                            }
                          )}
                          value={field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("phone.platformConfigTip", "Please enter {{key}}", {
                          key: platformConfig?.sign_name,
                        })}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {platformConfig?.phone_number && (
                <FormField
                  control={form.control}
                  name="config.platform_config.phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("phone.phoneNumberLabel", "Phone Number")}
                      </FormLabel>
                      <FormControl>
                        <EnhancedInput
                          disabled={isFetching}
                          onValueChange={field.onChange}
                          placeholder={t(
                            "phone.platformConfigTip",
                            "Please enter {{key}}",
                            {
                              key: platformConfig?.phone_number,
                            }
                          )}
                          value={field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("phone.platformConfigTip", "Please enter {{key}}", {
                          key: platformConfig?.phone_number,
                        })}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {platformConfig?.code_variable && (
                <FormField
                  control={form.control}
                  name="config.platform_config.template"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("phone.template", "Template")}</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={isFetching}
                          onChange={field.onChange}
                          placeholder={t(
                            "phone.placeholders.template",
                            "Use {{code}} for verification code",
                            {
                              code: platformConfig?.code_variable,
                            }
                          )}
                          value={field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "phone.templateTip",
                          "Use {{code}} variable for the verification code",
                          {
                            code: platformConfig?.code_variable,
                          }
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="space-y-4 border-t pt-4">
                <div>
                  <FormLabel>{t("phone.testSms", "Test SMS")}</FormLabel>
                  <p className="mb-3 text-muted-foreground text-sm">
                    {t(
                      "phone.testSmsTip",
                      "Send a test SMS to verify configuration"
                    )}
                  </p>
                  <div className="flex items-center gap-2">
                    <AreaCodeSelect
                      onChange={(value) => {
                        if (value.phone) {
                          setTestParams((prev) => ({
                            ...prev,
                            area_code: value.phone!,
                          }));
                        }
                      }}
                      value={testParams.area_code}
                    />
                    <EnhancedInput
                      onValueChange={(value) => {
                        setTestParams((prev) => ({
                          ...prev,
                          telephone: value as string,
                        }));
                      }}
                      placeholder={t("phone.testSmsPhone", "Phone number")}
                      value={testParams.telephone}
                    />
                    <Button
                      disabled={
                        !(testParams.telephone && testParams.area_code) ||
                        isFetching
                      }
                      onClick={async () => {
                        if (
                          isFetching ||
                          !testParams.telephone ||
                          !testParams.area_code
                        )
                          return;
                        try {
                          await testSmsSend(testParams);
                          toast.success(
                            t("phone.sendSuccess", "SMS sent successfully")
                          );
                        } catch {
                          toast.error(t("phone.sendFailed", "SMS send failed"));
                        }
                      }}
                      type="button"
                    >
                      {t("phone.testSms", "Test SMS")}
                    </Button>
                  </div>
                </div>
              </div>
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
          <Button disabled={loading} form="phone-settings-form" type="submit">
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
