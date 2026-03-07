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

const googleSchema = z.object({
  enabled: z.boolean(),
  client_id: z.string().optional(),
  client_secret: z.string().optional(),
});

type GoogleFormData = z.infer<typeof googleSchema>;

export default function GoogleForm() {
  const { t } = useTranslation("auth-control");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["getAuthMethodConfig", "google"],
    queryFn: async () => {
      const { data } = await getAuthMethodConfig({
        method: "google",
      });
      return data.data;
    },
    enabled: open,
  });

  const form = useForm<GoogleFormData>({
    resolver: zodResolver(googleSchema),
    defaultValues: {
      enabled: false,
      client_id: "",
      client_secret: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        enabled: data.enabled,
        client_id: data.config?.client_id || "",
        client_secret: data.config?.client_secret || "",
      });
    }
  }, [data, form]);

  async function onSubmit(values: GoogleFormData) {
    setLoading(true);
    try {
      await updateAuthMethodConfig({
        ...data,
        enabled: values.enabled,
        config: {
          ...data?.config,
          client_id: values.client_id,
          client_secret: values.client_secret,
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
              <Icon className="h-5 w-5 text-primary" icon="mdi:google" />
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {t("google.title", "Google Sign-In")}
              </p>
              <p className="text-muted-foreground text-sm">
                {t(
                  "google.description",
                  "Authenticate users with Google accounts"
                )}
              </p>
            </div>
          </div>
          <Icon className="size-6" icon="mdi:chevron-right" />
        </div>
      </SheetTrigger>
      <SheetContent className="w-[600px] max-w-full md:max-w-screen-md">
        <SheetHeader>
          <SheetTitle>{t("google.title", "Google Sign-In")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-48px-36px-36px-24px-env(safe-area-inset-top))] px-6">
          <Form {...form}>
            <form
              className="space-y-2 pt-4"
              id="google-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("google.enable", "Enable")}</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        className="!mt-0 float-end"
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "google.enableDescription",
                        "When enabled, users can sign in with their Google account"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("google.clientId", "Client ID")}</FormLabel>
                    <FormControl>
                      <EnhancedInput
                        onValueChange={field.onChange}
                        placeholder="123456789-abc123def456.apps.googleusercontent.com"
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "google.clientIdDescription",
                        "Google OAuth Client ID, available from Google Cloud Console"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="client_secret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("google.clientSecret", "Client Secret")}
                    </FormLabel>
                    <FormControl>
                      <EnhancedInput
                        onValueChange={field.onChange}
                        placeholder="GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        type="password"
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "google.clientSecretDescription",
                        "Google OAuth Client Secret, available from Google Cloud Console"
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
          <Button disabled={loading} form="google-form" type="submit">
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
