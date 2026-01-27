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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Textarea } from "@workspace/ui/components/textarea";
import { HTMLEditor } from "@workspace/ui/composed/editor/html";
import { EnhancedInput } from "@workspace/ui/composed/enhanced-input";
import { Icon } from "@workspace/ui/composed/icon";
import {
  getAuthMethodConfig,
  testEmailSend,
  updateAuthMethodConfig,
} from "@workspace/ui/services/admin/authMethod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const emailSettingsSchema = z.object({
  id: z.number(),
  method: z.string(),
  enabled: z.boolean(),
  config: z
    .object({
      enable_verify: z.boolean(),
      enable_domain_suffix: z.boolean(),
      domain_suffix_list: z.string().optional(),
      verify_email_template: z.string().optional(),
      expiration_email_template: z.string().optional(),
      maintenance_email_template: z.string().optional(),
      traffic_exceed_email_template: z.string().optional(),
      platform: z.string(),
      platform_config: z
        .object({
          host: z.string().optional(),
          port: z.number().optional(),
          ssl: z.boolean(),
          user: z.string().optional(),
          pass: z.string().optional(),
          from: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

type EmailSettingsFormData = z.infer<typeof emailSettingsSchema>;

export default function EmailSettingsForm() {
  const { t } = useTranslation("auth-control");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState<string>();

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["getAuthMethodConfig", "email"],
    queryFn: async () => {
      const { data } = await getAuthMethodConfig({
        method: "email",
      });
      return data.data;
    },
    enabled: open,
  });

  const form = useForm<EmailSettingsFormData>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      id: 0,
      method: "email",
      enabled: false,
      config: {
        enable_verify: false,
        enable_domain_suffix: false,
        domain_suffix_list: "",
        verify_email_template: "",
        expiration_email_template: "",
        maintenance_email_template: "",
        traffic_exceed_email_template: "",
        platform: "smtp",
        platform_config: {
          host: "",
          port: 587,
          ssl: false,
          user: "",
          pass: "",
          from: "",
        },
      },
    },
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  async function onSubmit(values: EmailSettingsFormData) {
    setLoading(true);
    try {
      await updateAuthMethodConfig({
        ...values,
        config: {
          ...values.config,
          platform: "smtp",
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
              <Icon className="h-5 w-5 text-primary" icon="mdi:email-outline" />
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {t("email.title", "Email Settings")}
              </p>
              <p className="text-muted-foreground text-sm">
                {t(
                  "email.description",
                  "Configure email authentication and templates"
                )}
              </p>
            </div>
          </div>
          <Icon className="size-6" icon="mdi:chevron-right" />
        </div>
      </SheetTrigger>
      <SheetContent className="md:!max-w-screen-lg max-w-full">
        <SheetHeader>
          <SheetTitle>{t("email.title", "Email Settings")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-48px-36px-36px-24px-env(safe-area-inset-top))] px-6">
          <Form {...form}>
            <form
              className="space-y-2 pt-4"
              id="email-settings-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <Tabs className="space-y-2" defaultValue="basic">
                <TabsList className="flex h-full w-full flex-wrap *:flex-auto md:flex-nowrap">
                  <TabsTrigger value="basic">
                    {t("email.basicSettings", "Basic Settings")}
                  </TabsTrigger>
                  <TabsTrigger value="smtp">
                    {t("email.smtpSettings", "SMTP Settings")}
                  </TabsTrigger>
                  <TabsTrigger value="verify">
                    {t("email.verifyTemplate", "Verify Template")}
                  </TabsTrigger>
                  <TabsTrigger value="expiration">
                    {t("email.expirationTemplate", "Expiration Template")}
                  </TabsTrigger>
                  <TabsTrigger value="maintenance">
                    {t("email.maintenanceTemplate", "Maintenance Template")}
                  </TabsTrigger>
                  <TabsTrigger value="traffic">
                    {t("email.trafficTemplate", "Traffic Template")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent className="space-y-2" value="basic">
                  <FormField
                    control={form.control}
                    name="enabled"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("email.enable", "Enable")}</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            className="!mt-0 float-end"
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>
                          {t(
                            "email.enableDescription",
                            "When enabled, users can sign in with email"
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="config.enable_verify"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("email.emailVerification", "Email Verification")}
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
                            "email.emailVerificationDescription",
                            "Require email verification for new users"
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="config.enable_domain_suffix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "email.emailSuffixWhitelist",
                            "Email Suffix Whitelist"
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
                            "email.emailSuffixWhitelistDescription",
                            "Only allow emails from whitelisted domains"
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="config.domain_suffix_list"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("email.whitelistSuffixes", "Whitelist Suffixes")}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            className="h-32"
                            onChange={field.onChange}
                            placeholder={t(
                              "email.whitelistSuffixesPlaceholder",
                              "gmail.com, outlook.com"
                            )}
                            value={field.value}
                          />
                        </FormControl>
                        <FormDescription>
                          {t(
                            "email.whitelistSuffixesDescription",
                            "One domain suffix per line"
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent className="space-y-2" value="smtp">
                  <FormField
                    control={form.control}
                    name="config.platform_config.host"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("email.smtpServerAddress", "SMTP Server Address")}
                        </FormLabel>
                        <FormControl>
                          <EnhancedInput
                            onValueChange={field.onChange}
                            placeholder={t(
                              "email.inputPlaceholder",
                              "Please enter"
                            )}
                            value={field.value}
                          />
                        </FormControl>
                        <FormDescription>
                          {t(
                            "email.smtpServerAddressDescription",
                            "The SMTP server hostname"
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="config.platform_config.port"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("email.smtpServerPort", "SMTP Server Port")}
                        </FormLabel>
                        <FormControl>
                          <EnhancedInput
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            placeholder="587"
                            type="number"
                            value={field.value?.toString()}
                          />
                        </FormControl>
                        <FormDescription>
                          {t(
                            "email.smtpServerPortDescription",
                            "The SMTP server port (usually 25, 465, or 587)"
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="config.platform_config.ssl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "email.smtpEncryptionMethod",
                            "SSL/TLS Encryption"
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
                            "email.smtpEncryptionMethodDescription",
                            "Enable SSL/TLS encryption for SMTP connection"
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="config.platform_config.user"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("email.smtpAccount", "SMTP Account")}
                        </FormLabel>
                        <FormControl>
                          <EnhancedInput
                            onValueChange={field.onChange}
                            placeholder={t(
                              "email.inputPlaceholder",
                              "Please enter"
                            )}
                            value={field.value}
                          />
                        </FormControl>
                        <FormDescription>
                          {t(
                            "email.smtpAccountDescription",
                            "The SMTP authentication username"
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="config.platform_config.pass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("email.smtpPassword", "SMTP Password")}
                        </FormLabel>
                        <FormControl>
                          <EnhancedInput
                            onValueChange={field.onChange}
                            placeholder={t(
                              "email.inputPlaceholder",
                              "Please enter"
                            )}
                            type="password"
                            value={field.value}
                          />
                        </FormControl>
                        <FormDescription>
                          {t(
                            "email.smtpPasswordDescription",
                            "The SMTP authentication password"
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="config.platform_config.from"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("email.senderAddress", "Sender Address")}
                        </FormLabel>
                        <FormControl>
                          <EnhancedInput
                            onValueChange={field.onChange}
                            placeholder={t(
                              "email.inputPlaceholder",
                              "Please enter"
                            )}
                            value={field.value}
                          />
                        </FormControl>
                        <FormDescription>
                          {t(
                            "email.senderAddressDescription",
                            "The email address that appears in the From field"
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2 border-t pt-4">
                    <FormLabel>
                      {t("email.sendTestEmail", "Send Test Email")}
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <EnhancedInput
                        onValueChange={(value) => setTestEmail(value as string)}
                        placeholder="test@example.com"
                        type="email"
                        value={testEmail}
                      />
                      <Button
                        disabled={!testEmail || isFetching}
                        onClick={async () => {
                          if (!testEmail) return;
                          try {
                            await testEmailSend({ email: testEmail });
                            toast.success(
                              t("email.sendSuccess", "Email sent successfully")
                            );
                          } catch {
                            toast.error(
                              t("email.sendFailure", "Email send failed")
                            );
                          }
                        }}
                        type="button"
                      >
                        {t("email.sendTestEmail", "Send Test Email")}
                      </Button>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {t(
                        "email.sendTestEmailDescription",
                        "Send a test email to verify your SMTP configuration"
                      )}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent className="space-y-2" value="verify">
                  <FormField
                    control={form.control}
                    name="config.verify_email_template"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "email.verifyEmailTemplate",
                            "Verify Email Template"
                          )}
                        </FormLabel>
                        <FormControl>
                          <HTMLEditor
                            onChange={field.onChange}
                            placeholder={t(
                              "email.inputPlaceholder",
                              "Please enter"
                            )}
                            value={field.value}
                          />
                        </FormControl>
                        <div className="mt-4 space-y-2 border-t pt-4">
                          <p className="font-medium text-muted-foreground text-sm">
                            {t(
                              "email.templateVariables.title",
                              "Template Variables"
                            )}
                          </p>
                          <div className="space-y-2 text-muted-foreground text-xs">
                            <div className="flex items-center gap-2">
                              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                                {"{{.Type}}"}
                              </code>
                              <span>
                                {t(
                                  "email.templateVariables.type.description",
                                  "Email type (1: Register, 2: Reset Password)"
                                )}
                              </span>
                            </div>
                            <div className="pl-6 text-orange-600 dark:text-orange-400">
                              💡{" "}
                              {t(
                                "email.templateVariables.type.conditionalSyntax",
                                "Use conditional syntax to display different content"
                              )}
                              <br />
                              <code className="rounded bg-orange-50 px-1 text-xs dark:bg-orange-900/20">
                                {"{{if eq .Type 1}}...{{else}}...{{end}}"}
                              </code>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                                {"{{.SiteLogo}}"}
                              </code>
                              <span>
                                {t(
                                  "email.templateVariables.siteLogo.description",
                                  "Site logo URL"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                                {"{{.SiteName}}"}
                              </code>
                              <span>
                                {t(
                                  "email.templateVariables.siteName.description",
                                  "Site name"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                                {"{{.Expire}}"}
                              </code>
                              <span>
                                {t(
                                  "email.templateVariables.expire.description",
                                  "Code expiration time"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                                {"{{.Code}}"}
                              </code>
                              <span>
                                {t(
                                  "email.templateVariables.code.description",
                                  "Verification code"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent className="space-y-2" value="expiration">
                  <FormField
                    control={form.control}
                    name="config.expiration_email_template"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "email.expirationEmailTemplate",
                            "Expiration Email Template"
                          )}
                        </FormLabel>
                        <FormControl>
                          <HTMLEditor
                            onChange={field.onChange}
                            placeholder={t(
                              "email.inputPlaceholder",
                              "Please enter"
                            )}
                            value={field.value}
                          />
                        </FormControl>
                        <div className="mt-4 space-y-2 border-t pt-4">
                          <p className="font-medium text-muted-foreground text-sm">
                            {t(
                              "email.templateVariables.title",
                              "Template Variables"
                            )}
                          </p>
                          <div className="space-y-2 text-muted-foreground text-xs">
                            <div className="flex items-center gap-2">
                              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                                {"{{.SiteLogo}}"}
                              </code>
                              <span>
                                {t(
                                  "email.templateVariables.siteLogo.description",
                                  "Site logo URL"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                                {"{{.SiteName}}"}
                              </code>
                              <span>
                                {t(
                                  "email.templateVariables.siteName.description",
                                  "Site name"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                                {"{{.ExpireDate}}"}
                              </code>
                              <span>
                                {t(
                                  "email.templateVariables.expireDate.description",
                                  "Subscription expiration date"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent className="space-y-2" value="maintenance">
                  <FormField
                    control={form.control}
                    name="config.maintenance_email_template"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "email.maintenanceEmailTemplate",
                            "Maintenance Email Template"
                          )}
                        </FormLabel>
                        <FormControl>
                          <HTMLEditor
                            onChange={field.onChange}
                            placeholder={t(
                              "email.inputPlaceholder",
                              "Please enter"
                            )}
                            value={field.value}
                          />
                        </FormControl>
                        <div className="mt-4 space-y-2 border-t pt-4">
                          <p className="font-medium text-muted-foreground text-sm">
                            {t(
                              "email.templateVariables.title",
                              "Template Variables"
                            )}
                          </p>
                          <div className="space-y-2 text-muted-foreground text-xs">
                            <div className="flex items-center gap-2">
                              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                                {"{{.SiteLogo}}"}
                              </code>
                              <span>
                                {t(
                                  "email.templateVariables.siteLogo.description",
                                  "Site logo URL"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                                {"{{.SiteName}}"}
                              </code>
                              <span>
                                {t(
                                  "email.templateVariables.siteName.description",
                                  "Site name"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                                {"{{.MaintenanceDate}}"}
                              </code>
                              <span>
                                {t(
                                  "email.templateVariables.maintenanceDate.description",
                                  "Maintenance date"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                                {"{{.MaintenanceTime}}"}
                              </code>
                              <span>
                                {t(
                                  "email.templateVariables.maintenanceTime.description",
                                  "Maintenance time"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent className="space-y-2" value="traffic">
                  <FormField
                    control={form.control}
                    name="config.traffic_exceed_email_template"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "email.trafficExceedEmailTemplate",
                            "Traffic Exceed Email Template"
                          )}
                        </FormLabel>
                        <FormControl>
                          <HTMLEditor
                            onChange={field.onChange}
                            placeholder={t(
                              "email.inputPlaceholder",
                              "Please enter"
                            )}
                            value={field.value}
                          />
                        </FormControl>
                        <div className="mt-4 space-y-2 border-t pt-4">
                          <p className="font-medium text-muted-foreground text-sm">
                            {t(
                              "email.templateVariables.title",
                              "Template Variables"
                            )}
                          </p>
                          <div className="space-y-2 text-muted-foreground text-xs">
                            <div className="flex items-center gap-2">
                              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                                {"{{.SiteLogo}}"}
                              </code>
                              <span>
                                {t(
                                  "email.templateVariables.siteLogo.description",
                                  "Site logo URL"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                                {"{{.SiteName}}"}
                              </code>
                              <span>
                                {t(
                                  "email.templateVariables.siteName.description",
                                  "Site name"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
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
          <Button disabled={loading} form="email-settings-form" type="submit">
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
