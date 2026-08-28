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
import { Combobox } from "@workspace/ui/composed/combobox";
import { EnhancedInput } from "@workspace/ui/composed/enhanced-input";
import { Icon } from "@workspace/ui/composed/icon";
import {
  getSystemRegisterConfig as getRegisterConfig,
  putSystemRegisterConfig as updateRegisterConfig,
} from "@workspace/ui/services/admin/admin";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { useSubscribe } from "@/stores/subscribe";

const registerSchema = z.object({
  stop_register: z.boolean().optional(),
  enable_trial: z.boolean().optional(),
  trial_subscribe: z.number().optional(),
  trial_time: z.number().optional(),
  trial_time_unit: z.string().optional(),
  enable_ip_register_limit: z.boolean().optional(),
  ip_register_limit: z.number().optional(),
  ip_register_limit_duration: z.number().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterConfig() {
  const { t } = useTranslation("system");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["getRegisterConfig"],
    queryFn: async () => {
      const { data } = await getRegisterConfig();
      return data.data;
    },
    enabled: open,
  });

  const { subscribes } = useSubscribe();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      stop_register: false,
      enable_trial: false,
      trial_subscribe: undefined,
      trial_time: 0,
      trial_time_unit: "day",
      enable_ip_register_limit: false,
      ip_register_limit: 1,
      ip_register_limit_duration: 1,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  async function onSubmit(values: RegisterFormData) {
    setLoading(true);
    try {
      await updateRegisterConfig(values as API.RegisterConfig);
      toast.success(t("register.saveSuccess", "Save Successful"));
      refetch();
      setOpen(false);
    } catch (_error) {
      toast.error(t("register.saveFailed", "Save Failed"));
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
                icon="mdi:account-plus-outline"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {t("register.title", "Registration Settings")}
              </p>
              <p className="text-muted-foreground text-sm">
                {t(
                  "register.description",
                  "Configure user registration related settings"
                )}
              </p>
            </div>
          </div>
          <Icon className="size-6" icon="mdi:chevron-right" />
        </div>
      </SheetTrigger>
      <SheetContent className="w-[600px] max-w-full md:max-w-screen-md">
        <SheetHeader>
          <SheetTitle>
            {t("register.title", "Registration Settings")}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-48px-36px-36px-24px-env(safe-area-inset-top))] px-6">
          <Form {...form}>
            <form
              className="space-y-2 pt-4"
              id="register-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="stop_register"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        "register.stopNewUserRegistration",
                        "Stop New User Registration"
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
                        "register.stopNewUserRegistrationDescription",
                        "When enabled, new user registration will be disabled"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enable_ip_register_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        "register.ipRegistrationLimit",
                        "IP Registration Limit"
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
                        "register.ipRegistrationLimitDescription",
                        "Limit the number of registrations from a single IP address"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("enable_ip_register_limit") && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="ip_register_limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "register.registrationLimitCount",
                            "Registration Limit Count"
                          )}
                        </FormLabel>
                        <FormControl>
                          <EnhancedInput
                            min={1}
                            onValueBlur={(value) =>
                              field.onChange(Number(value))
                            }
                            placeholder={t(
                              "register.inputPlaceholder",
                              "Please enter"
                            )}
                            type="number"
                            value={field.value}
                          />
                        </FormControl>
                        <FormDescription>
                          {t(
                            "register.registrationLimitCountDescription",
                            "Number of registrations allowed per IP within the limit period"
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ip_register_limit_duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "register.registrationLimitExpire",
                            "Limit Period"
                          )}
                        </FormLabel>
                        <FormControl>
                          <EnhancedInput
                            min={1}
                            onValueBlur={(value) =>
                              field.onChange(Number(value))
                            }
                            placeholder={t(
                              "register.inputPlaceholder",
                              "Please enter"
                            )}
                            suffix={t("register.minute", "Minute(s)")}
                            type="number"
                            value={field.value}
                          />
                        </FormControl>
                        <FormDescription>
                          {t(
                            "register.registrationLimitExpireDescription",
                            "Duration for IP registration limit (minutes)"
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="enable_trial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("register.enableTrial", "Enable Trial")}
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
                        "register.enableTrialDescription",
                        "When enabled, new users will receive a trial subscription upon registration"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("enable_trial") && (
                <FormField
                  control={form.control}
                  name="trial_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("register.trialConfig", "Trial Configuration")}
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <EnhancedInput
                            className="flex-1"
                            min={0}
                            onValueBlur={(value) =>
                              field.onChange(Number(value))
                            }
                            placeholder={t(
                              "register.inputPlaceholder",
                              "Please enter"
                            )}
                            prefix={
                              <FormField
                                control={form.control}
                                name="trial_subscribe"
                                render={({ field }) => (
                                  <Combobox
                                    className="w-32 rounded-r-none bg-secondary"
                                    onChange={(value: number) => {
                                      if (value) {
                                        field.onChange(value);
                                      }
                                    }}
                                    options={subscribes?.map((item) => ({
                                      label: item.name!,
                                      value: item.id!,
                                    }))}
                                    placeholder={t(
                                      "register.selectPlaceholder",
                                      "Please select"
                                    )}
                                    value={field.value}
                                  />
                                )}
                              />
                            }
                            suffix={
                              <FormField
                                control={form.control}
                                name="trial_time_unit"
                                render={({ field: unitField }) => (
                                  <Combobox
                                    className="w-32 rounded-l-none bg-secondary"
                                    onChange={(value: string) => {
                                      unitField.onChange(value);
                                    }}
                                    options={[
                                      {
                                        label: t("register.none", "None"),
                                        value: "None",
                                      },
                                      {
                                        label: t("register.year", "Year(s)"),
                                        value: "Year",
                                      },
                                      {
                                        label: t("register.month", "Month(s)"),
                                        value: "Month",
                                      },
                                      {
                                        label: t("register.day", "Day(s)"),
                                        value: "Day",
                                      },
                                      {
                                        label: t("register.hour", "Hour(s)"),
                                        value: "Hour",
                                      },
                                      {
                                        label: t(
                                          "register.minute",
                                          "Minute(s)"
                                        ),
                                        value: "Minute",
                                      },
                                    ]}
                                    placeholder={t(
                                      "register.selectPlaceholder",
                                      "Please select"
                                    )}
                                    value={unitField.value}
                                  />
                                )}
                              />
                            }
                            type="number"
                            value={field.value}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        {t(
                          "register.trialConfigDescription",
                          "Configure trial subscription, duration and time unit for new users upon registration"
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
          <Button disabled={loading} form="register-form" type="submit">
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
