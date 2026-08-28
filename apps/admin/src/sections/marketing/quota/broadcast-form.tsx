import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
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
  postMarketingQuotaCreate as createQuotaTask,
  postMarketingQuotaPreCount as queryQuotaTaskPreCount,
} from "@workspace/ui/services/admin/admin";
import { unitConversion } from "@workspace/ui/utils/unit-conversions";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { Display } from "@/components/display";
import { useSubscribe } from "@/stores/subscribe";

export default function QuotaBroadcastForm() {
  const { t } = useTranslation("marketing");

  // Define schema with internationalized error messages
  const quotaBroadcastSchema = z.object({
    subscribers: z
      .array(z.number())
      .min(1, t("pleaseSelectSubscribers", "Please select packages")),
    is_active: z.boolean(),
    start_time: z.string().optional(),
    end_time: z.string().optional(),
    reset_traffic: z.boolean(),
    days: z.number().optional(),
    gift_type: z.union([z.literal(0), z.literal(1), z.literal(2)]),
    gift_value: z.number().optional(),
  });

  type QuotaBroadcastFormData = z.infer<typeof quotaBroadcastSchema>;

  const form = useForm<QuotaBroadcastFormData>({
    resolver: zodResolver(quotaBroadcastSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      subscribers: [],
      is_active: true,
      start_time: "",
      end_time: "",
      reset_traffic: false,
      days: 0,
      gift_type: 1,
      gift_value: 0,
    },
  });

  const [recipients, setRecipients] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const { subscribes } = useSubscribe();

  // Calculate recipient count
  const calculateRecipients = async () => {
    setIsCalculating(true);
    try {
      const formData = form.getValues();
      let start_time = 0;
      let end_time = 0;

      if (formData.start_time) {
        start_time = new Date(formData.start_time).getTime();
      }

      if (formData.end_time) {
        end_time = new Date(formData.end_time).getTime();
      }

      const response = await queryQuotaTaskPreCount({
        subscribers: formData.subscribers,
        is_active: formData.is_active,
        start_time,
        end_time,
      });

      if (response.data?.data?.count !== undefined) {
        setRecipients(response.data.data.count);
      }
    } catch (error) {
      console.error("Failed to calculate recipients:", error);
      toast.error(
        t("failedToCalculateRecipients", "Failed to calculate recipients")
      );
      setRecipients(0);
    } finally {
      setIsCalculating(false);
    }
  };

  // Watch form values and recalculate recipients only when sheet is open
  const watchedValues = form.watch();

  useEffect(() => {
    if (!open) return; // Only calculate when sheet is open

    const debounceTimer = setTimeout(() => {
      calculateRecipients();
    }, 500); // Add debounce to avoid too frequent API calls

    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    open,
    watchedValues.subscribers,
    watchedValues.is_active,
    watchedValues.start_time,
    watchedValues.end_time,
  ]);

  const onSubmit = async (data: QuotaBroadcastFormData) => {
    setIsSubmitting(true);
    try {
      let start_time = 0;
      let end_time = 0;

      if (data.start_time) {
        start_time = Math.floor(new Date(data.start_time).getTime());
      }

      if (data.end_time) {
        end_time = Math.floor(new Date(data.end_time).getTime());
      }

      await createQuotaTask({
        subscribers: data.subscribers,
        is_active: data.is_active,
        start_time,
        end_time,
        reset_traffic: data.reset_traffic,
        days: data.days || 0,
        gift_type: data.gift_type,
        gift_value: data.gift_value || 0,
      });

      toast.success(
        t("quotaTaskCreatedSuccessfully", "Quota task created successfully")
      );
      form.reset();
      setRecipients(0);
      setOpen(false); // Close the sheet after successful submission
    } catch (error) {
      console.error("Failed to create quota task:", error);
      toast.error(t("failedToCreateQuotaTask", "Failed to create quota task"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <div className="flex cursor-pointer items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" icon="mdi:gift" />
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {t("quotaBroadcast", "Quota Distribution")}
              </p>
              <p className="text-muted-foreground text-sm">
                {t(
                  "createAndSendQuotaTasks",
                  "Create and Distribute Quota Tasks"
                )}
              </p>
            </div>
          </div>
          <Icon className="size-6" icon="mdi:chevron-right" />
        </div>
      </SheetTrigger>
      <SheetContent className="w-[600px] max-w-full md:max-w-screen-md">
        <SheetHeader>
          <SheetTitle>{t("createQuotaTask", "Create Quota Task")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-48px-36px-32px-env(safe-area-inset-top))] px-6">
          <Form {...form}>
            <form
              className="mt-4 space-y-6"
              id="quota-broadcast-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/* Subscribers selection */}
              <FormField
                control={form.control}
                name="subscribers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("subscribers", "Packages")}</FormLabel>
                    <FormControl>
                      <Combobox
                        multiple={true}
                        onChange={field.onChange}
                        options={subscribes?.map((subscribe) => ({
                          value: subscribe.id!,
                          label: subscribe.name!,
                          children: (
                            <div>
                              <div>{subscribe.name}</div>
                              <div className="text-muted-foreground text-xs">
                                <Display
                                  type="traffic"
                                  value={subscribe.traffic || 0}
                                />{" "}
                                /{" "}
                                <Display
                                  type="currency"
                                  value={subscribe.unit_price || 0}
                                />
                              </div>
                            </div>
                          ),
                        }))}
                        placeholder={t(
                          "pleaseSelectSubscribers",
                          "Please select packages"
                        )}
                        value={field.value || []}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subscription count info and active status */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("validOnly", "Valid Only")}</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          className="!mt-0 float-end"
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "selectValidSubscriptionsOnly",
                          "Select currently valid subscriptions only"
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center border-l-4 border-l-primary bg-primary/10 px-4 py-3 text-sm">
                  <span className="text-muted-foreground">
                    {t("subscriptionCount", "Subscription Count")}:{" "}
                  </span>
                  <span className="font-medium text-lg text-primary">
                    {isCalculating ? (
                      <Icon
                        className="ml-2 h-4 w-4 animate-spin"
                        icon="mdi:loading"
                      />
                    ) : (
                      recipients.toLocaleString()
                    )}
                  </span>
                </div>
              </div>

              {/* Subscription validity period range */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "subscriptionValidityStartDate",
                          "Subscription Validity Start Date"
                        )}
                      </FormLabel>
                      <FormControl>
                        <EnhancedInput
                          onValueChange={field.onChange}
                          step="1"
                          type="datetime-local"
                          value={field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "includeSubscriptionsValidAfter",
                          "Include subscriptions valid on or after this date"
                        )}
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "subscriptionValidityEndDate",
                          "Subscription Validity End Date"
                        )}
                      </FormLabel>
                      <FormControl>
                        <EnhancedInput
                          onValueChange={field.onChange}
                          step="1"
                          type="datetime-local"
                          value={field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "includeSubscriptionsValidBefore",
                          "Include subscriptions valid on or before this date"
                        )}
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              {/* Reset traffic */}
              <FormField
                control={form.control}
                name="reset_traffic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("resetTraffic", "Reset Traffic")}</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        className="!mt-0 float-end"
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "resetTrafficDescription",
                        "Whether to reset subscription used traffic"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Quota days */}
              <FormField
                control={form.control}
                name="days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("quotaDays", "Extend Expiration Days")}
                    </FormLabel>
                    <FormControl>
                      <EnhancedInput
                        min={1}
                        onValueChange={(value) =>
                          field.onChange(Number.parseInt(value, 10))
                        }
                        type="number"
                        value={field.value?.toString()}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "numberOfDaysForTheQuota",
                        "Number of days to extend subscription expiration"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gift configuration */}
              <FormField
                control={form.control}
                name="gift_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("giftType", "Gift Amount Type")}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        className="flex gap-4"
                        defaultValue={String(field.value)}
                        onValueChange={(value) => {
                          field.onChange(Number(value));
                          form.setValue("gift_value", 0);
                        }}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="1" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t("fixedAmount", "Fixed Amount")}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="2" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t("percentageAmount", "Percentage Amount")}
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gift amount based on type */}
              {form.watch("gift_type") === 1 && (
                <FormField
                  control={form.control}
                  name="gift_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("giftAmount", "Gift Amount")}</FormLabel>
                      <FormControl>
                        <EnhancedInput<number>
                          formatInput={(value) =>
                            unitConversion("centsToDollars", value)
                          }
                          formatOutput={(value) =>
                            unitConversion("dollarsToCents", value)
                          }
                          min={1}
                          onValueChange={(value) => field.onChange(value)}
                          placeholder={t("enterAmount", "Enter amount")}
                          type="number"
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {form.watch("gift_type") === 2 && (
                <FormField
                  control={form.control}
                  name="gift_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("giftAmount", "Gift Amount")}</FormLabel>
                      <FormControl>
                        <EnhancedInput
                          max={100}
                          min={1}
                          onValueChange={(value) => field.onChange(value)}
                          placeholder={t("enterPercentage", "Enter percentage")}
                          suffix="%"
                          type="number"
                          value={field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        {t(
                          "percentageAmountDescription",
                          "Gift percentage amount based on current package price"
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
        <SheetFooter className="flex flex-row items-center justify-end gap-2 pt-3">
          <Button onClick={() => setOpen(false)} variant="outline">
            {t("cancel", "Cancel")}
          </Button>
          <Button
            disabled={
              isSubmitting ||
              !form.formState.isValid ||
              form.watch("subscribers").length === 0
            }
            form="quota-broadcast-form"
            type="submit"
          >
            {isSubmitting && (
              <Icon className="mr-2 h-4 w-4 animate-spin" icon="mdi:loading" />
            )}
            {t("createQuotaTask", "Create Quota Task")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
