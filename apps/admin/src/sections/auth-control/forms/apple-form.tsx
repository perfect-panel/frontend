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
  getAuthMethodConfig,
  updateAuthMethodConfig,
} from "@workspace/ui/services/admin/authMethod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const appleSchema = z.object({
  enabled: z.boolean(),
  config: z
    .object({
      team_id: z.string().optional(),
      key_id: z.string().optional(),
      client_id: z.string().optional(),
      client_secret: z.string().optional(),
      redirect_url: z.string().optional(),
    })
    .optional(),
});

type AppleFormData = z.infer<typeof appleSchema>;

export default function AppleForm() {
  const { t } = useTranslation("auth-control");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["getAuthMethodConfig", "apple"],
    queryFn: async () => {
      const { data } = await getAuthMethodConfig({
        method: "apple",
      });

      return data.data;
    },
    enabled: open,
  });

  const form = useForm<AppleFormData>({
    resolver: zodResolver(appleSchema),
    defaultValues: {
      enabled: false,
      config: {
        team_id: "",
        key_id: "",
        client_id: "",
        client_secret: "",
        redirect_url: "",
      },
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        enabled: data.enabled,
        config: {
          team_id: data.config?.team_id || "",
          key_id: data.config?.key_id || "",
          client_id: data.config?.client_id || "",
          client_secret: data.config?.client_secret || "",
          redirect_url: data.config?.redirect_url || "",
        },
      });
    }
  }, [data, form]);

  async function onSubmit(values: AppleFormData) {
    setLoading(true);
    try {
      await updateAuthMethodConfig({
        ...data,
        enabled: values.enabled,
        config: {
          ...data?.config,
          ...values.config,
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
              <Icon className="h-5 w-5 text-primary" icon="mdi:apple" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{t("apple.title", "Apple Sign-In")}</p>
              <p className="text-muted-foreground text-sm">
                {t(
                  "apple.description",
                  "Authenticate users with Apple accounts"
                )}
              </p>
            </div>
          </div>
          <Icon className="size-6" icon="mdi:chevron-right" />
        </div>
      </SheetTrigger>
      <SheetContent className="w-[500px] max-w-full md:max-w-screen-md">
        <SheetHeader>
          <SheetTitle>{t("apple.title", "Apple Sign-In")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-48px-36px-36px-24px-env(safe-area-inset-top))] px-6">
          <Form {...form}>
            <form
              className="space-y-2 pt-4"
              id="apple-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("apple.enable", "Enable")}</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        className="!mt-0 float-end"
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "apple.enableDescription",
                        "When enabled, users can sign in with their Apple ID"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="config.team_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("apple.teamId", "Team ID")}</FormLabel>
                    <FormControl>
                      <EnhancedInput
                        onValueChange={field.onChange}
                        placeholder="ABCDE1FGHI"
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("apple.teamIdDescription", "Apple Developer Team ID")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="config.key_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("apple.keyId", "Key ID")}</FormLabel>
                    <FormControl>
                      <EnhancedInput
                        onValueChange={field.onChange}
                        placeholder="ABC1234567"
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "apple.keyIdDescription",
                        "Your private key ID from Apple Developer Portal"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="config.client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("apple.clientId", "Service ID")}</FormLabel>
                    <FormControl>
                      <EnhancedInput
                        onValueChange={field.onChange}
                        placeholder="com.your.app.service"
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "apple.clientIdDescription",
                        "Apple Service ID, available from Apple Developer Portal"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="config.client_secret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("apple.clientSecret", "Private Key")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-20"
                        onChange={field.onChange}
                        placeholder={
                          "-----BEGIN PRIVATE KEY-----\nMIGTAgEA...\n-----END PRIVATE KEY-----"
                        }
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "apple.clientSecretDescription",
                        "Private key content (.p8 file) for authenticating with Apple"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="config.redirect_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("apple.redirectUri", "Redirect URL")}
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
                        "apple.redirectUriDescription",
                        "Backend API callback URL that Apple will POST to (e.g. https://api.example.com/v1/auth/oauth/callback/apple). Must be registered in Apple Developer Portal."
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
          <Button disabled={loading} form="apple-form" type="submit">
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
