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
  getSystemInviteConfig as getInviteConfig,
  putSystemInviteConfig as updateInviteConfig,
} from "@workspace/ui/services/admin/admin";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const inviteSchema = z.object({
  forced_invite: z.boolean().optional(),
  referral_percentage: z.number().optional(),
  only_first_purchase: z.boolean().optional(),
});

type InviteFormData = z.infer<typeof inviteSchema>;

export default function InviteConfig() {
  const { t } = useTranslation("system");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["getInviteConfig"],
    queryFn: async () => {
      const { data } = await getInviteConfig();
      return data.data;
    },
    enabled: open,
  });

  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      forced_invite: false,
      referral_percentage: 0,
      only_first_purchase: false,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  async function onSubmit(values: InviteFormData) {
    setLoading(true);
    try {
      await updateInviteConfig(values as API.InviteConfig);
      toast.success(t("invite.saveSuccess", "Save Successful"));
      refetch();
      setOpen(false);
    } catch (_error) {
      toast.error(t("invite.saveFailed", "Save Failed"));
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
                icon="mdi:account-multiple-plus-outline"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {t("invite.title", "Invitation Settings")}
              </p>
              <p className="text-muted-foreground text-sm">
                {t(
                  "invite.description",
                  "Configure user invitation and referral reward settings"
                )}
              </p>
            </div>
          </div>
          <Icon className="size-6" icon="mdi:chevron-right" />
        </div>
      </SheetTrigger>
      <SheetContent className="w-[600px] max-w-full md:max-w-screen-md">
        <SheetHeader>
          <SheetTitle>{t("invite.title", "Invitation Settings")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-48px-36px-36px-24px-env(safe-area-inset-top))] px-6">
          <Form {...form}>
            <form
              className="space-y-2 pt-4"
              id="invite-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="forced_invite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        "invite.forcedInvite",
                        "Require Invitation to Register"
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
                        "invite.forcedInviteDescription",
                        "When enabled, users must register through an invitation link"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referral_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        "invite.referralPercentage",
                        "Referral Reward Percentage"
                      )}
                    </FormLabel>
                    <FormControl>
                      <EnhancedInput
                        max={100}
                        min={0}
                        onValueBlur={(value) => field.onChange(Number(value))}
                        placeholder={t(
                          "invite.inputPlaceholder",
                          "Please enter"
                        )}
                        suffix="%"
                        type="number"
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "invite.referralPercentageDescription",
                        "Percentage of reward given to referrers"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="only_first_purchase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        "invite.onlyFirstPurchase",
                        "First Purchase Reward Only"
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
                        "invite.onlyFirstPurchaseDescription",
                        "When enabled, referrers only receive rewards for the first purchase by referred users"
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
          <Button disabled={loading} form="invite-form" type="submit">
            {loading && (
              <Icon className="mr-2 animate-spin" icon="mdi:loading" />
            )}
            {t("common.save", "Save Settings")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
