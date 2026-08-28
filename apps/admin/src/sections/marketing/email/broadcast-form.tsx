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
import { Input } from "@workspace/ui/components/input";
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
  postMarketingEmailBatchSend as createBatchSendEmailTask,
  postMarketingEmailBatchPreSendCount as getPreSendEmailCount,
} from "@workspace/ui/services/admin/admin";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

export default function EmailBroadcastForm() {
  const { t } = useTranslation("marketing");

  // Define schema with internationalized error messages
  const emailBroadcastSchema = z.object({
    subject: z
      .string()
      .min(
        1,
        `${t("subject", "Email Subject")} ${t("cannotBeEmpty", "cannot be empty")}`
      ),
    content: z
      .string()
      .min(
        1,
        `${t("content", "Email Content")} ${t("cannotBeEmpty", "cannot be empty")}`
      ),
    scope: z.union([
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
      z.literal(5),
    ]),
    register_start_time: z.string().optional(),
    register_end_time: z.string().optional(),
    additional: z
      .string()
      .optional()
      .refine(
        (value) => {
          if (!value || value.trim() === "") return true;
          const emails = value
            .split("\n")
            .filter((email) => email.trim() !== "");
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emails.every((email) => emailRegex.test(email.trim()));
        },
        {
          message: t(
            "pleaseEnterValidEmailAddresses",
            "Please enter valid email addresses, one per line"
          ),
        }
      ),
    scheduled: z.string().optional(),
    interval: z
      .number()
      .min(
        0.1,
        t("emailIntervalMinimum", "Email interval must be at least 0.1 seconds")
      )
      .optional(),
    limit: z
      .number()
      .min(1, t("dailyLimit", "Daily limit must be at least 1"))
      .optional(),
  });

  type EmailBroadcastFormData = z.infer<typeof emailBroadcastSchema>;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [estimatedRecipients, setEstimatedRecipients] = useState<{
    users: number;
    additional: number;
    total: number;
  }>({ users: 0, additional: 0, total: 0 });

  const form = useForm<EmailBroadcastFormData>({
    resolver: zodResolver(emailBroadcastSchema),
    defaultValues: {
      subject: "",
      content: "",
      scope: 1, // ScopeAll
      register_start_time: "",
      register_end_time: "",
      additional: "",
      scheduled: "",
      interval: 1,
      limit: 1000,
    },
  });

  // Calculate recipient count
  const calculateRecipients = async () => {
    const formData = form.getValues();

    try {
      // Call API to get actual recipient count
      const scope = formData.scope || 1; // Default to ScopeAll

      // Convert dates to timestamps if they exist
      let register_start_time = 0;
      let register_end_time = 0;

      if (formData.register_start_time) {
        register_start_time = Math.floor(
          new Date(formData.register_start_time).getTime()
        );
      }

      if (formData.register_end_time) {
        register_end_time = Math.floor(
          new Date(formData.register_end_time).getTime()
        );
      }

      const response = await getPreSendEmailCount({
        scope,
        register_start_time,
        register_end_time,
      });

      const userCount = response.data?.data?.count || 0;

      // Calculate additional email count
      const additionalEmails = formData.additional || "";
      const additionalCount = additionalEmails
        .split("\n")
        .filter((email: string) => email.trim() !== "").length;

      const total = userCount + additionalCount;

      setEstimatedRecipients({
        users: userCount,
        additional: additionalCount,
        total,
      });
    } catch (error) {
      console.error("Failed to get recipient count:", error);
      // Set to 0 if API fails, don't use fallback simulation
      const additionalEmails = formData.additional || "";
      const additionalCount = additionalEmails
        .split("\n")
        .filter((email: string) => email.trim() !== "").length;

      setEstimatedRecipients({
        users: 0,
        additional: additionalCount,
        total: additionalCount,
      });
    }
  };

  // Listen to form changes
  const watchedValues = form.watch();

  // Use useEffect to respond to form changes, but only when sheet is open
  useEffect(() => {
    if (!open) return; // Only calculate when sheet is open

    const debounceTimer = setTimeout(() => {
      calculateRecipients();
    }, 500); // Add debounce to avoid too frequent API calls

    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    open, // Add open dependency
    watchedValues.scope,
    watchedValues.register_start_time,
    watchedValues.register_end_time,
    watchedValues.additional,
  ]);

  const onSubmit = async (data: EmailBroadcastFormData) => {
    setLoading(true);
    try {
      // Validate scheduled send time
      let scheduled: number | undefined;
      if (data.scheduled && data.scheduled.trim() !== "") {
        const scheduledDate = new Date(data.scheduled);
        const now = new Date();
        if (scheduledDate <= now) {
          toast.error(
            t(
              "scheduledSendTimeMustBeLater",
              "Scheduled send time must be later than current time"
            )
          );
          return;
        }
        scheduled = Math.floor(scheduledDate.getTime());
      }

      let register_start_time = 0;
      let register_end_time = 0;

      if (data.register_start_time) {
        register_start_time = Math.floor(
          new Date(data.register_start_time).getTime()
        );
      }

      if (data.register_end_time) {
        register_end_time = Math.floor(
          new Date(data.register_end_time).getTime()
        );
      }

      // Prepare API request data
      const requestData: API.CreateBatchSendEmailTaskRequest = {
        subject: data.subject,
        content: data.content,
        scope: data.scope,
        register_start_time,
        register_end_time,
        additional: data.additional || undefined,
        scheduled,
        interval: data.interval || undefined,
        limit: data.limit,
      };

      // Call API to create batch send email task
      await createBatchSendEmailTask(requestData);

      if (!data.scheduled || data.scheduled.trim() === "") {
        toast.success(
          t(
            "emailBroadcastTaskCreatedSuccessfully",
            "Email broadcast task created successfully"
          )
        );
      } else {
        toast.success(
          t("emailAddedToScheduledQueue", "Email added to scheduled send queue")
        );
      }

      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Email broadcast failed:", error);
      toast.error(t("sendFailed", "Send failed, please try again"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <div className="flex cursor-pointer items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" icon="mdi:email-send" />
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {t("emailBroadcast", "Email Broadcast")}
              </p>
              <p className="text-muted-foreground text-sm">
                {t(
                  "createNewEmailBroadcastCampaign",
                  "Create new email broadcast campaign"
                )}
              </p>
            </div>
          </div>
          <Icon className="size-6" icon="mdi:chevron-right" />
        </div>
      </SheetTrigger>
      <SheetContent className="w-[700px] max-w-full md:max-w-screen-lg">
        <SheetHeader>
          <SheetTitle>{t("createBroadcast", "Create Broadcast")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-48px-36px-36px-env(safe-area-inset-top))] px-6">
          <Form {...form}>
            <form
              className="space-y-2 pt-4"
              id="broadcast-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <Tabs className="space-y-2" defaultValue="content">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content">
                    {t("content", "Email Content")}
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    {t("sendSettings", "Send Settings")}
                  </TabsTrigger>
                </TabsList>
                {/* Email Content Tab */}
                <TabsContent className="space-y-2" value="content">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("subject", "Email Subject")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`${t("pleaseEnter", "Please enter")} ${t("subject", "Email Subject").toLowerCase()}`}
                            {...field}
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
                        <FormLabel>{t("content", "Email Content")}</FormLabel>
                        <FormControl>
                          <HTMLEditor
                            onChange={(value) => {
                              form.setValue(field.name, value || "");
                            }}
                            value={field.value}
                          />
                        </FormControl>
                        <FormDescription>
                          {t(
                            "useMarkdownEditor",
                            "Use Markdown editor to write email content with preview functionality"
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Send Settings Tab */}
                <TabsContent className="space-y-2" value="settings">
                  {/* Send scope and estimated recipients */}
                  <div className="grid grid-cols-2 items-center gap-4">
                    <FormField
                      control={form.control}
                      name="scope"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("sendScope", "Send Scope")}</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number.parseInt(value, 10))
                            }
                            value={field.value?.toString() || "1"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t(
                                    "selectSendScope",
                                    "Select send scope"
                                  )}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">
                                {t("allUsers", "All Users")}
                              </SelectItem>{" "}
                              {/* ScopeAll */}
                              <SelectItem value="2">
                                {t(
                                  "subscribedUsersOnly",
                                  "Subscribed users only"
                                )}
                              </SelectItem>{" "}
                              {/* ScopeActive */}
                              <SelectItem value="3">
                                {t(
                                  "expiredSubscriptionUsersOnly",
                                  "Expired subscription users only"
                                )}
                              </SelectItem>{" "}
                              {/* ScopeExpired */}
                              <SelectItem value="4">
                                {t(
                                  "noSubscriptionUsersOnly",
                                  "No subscription users only"
                                )}
                              </SelectItem>{" "}
                              {/* ScopeNone */}
                              <SelectItem value="5">
                                {t(
                                  "specificUsersOnly",
                                  "Additional emails only (skip platform users)"
                                )}
                              </SelectItem>{" "}
                              {/* ScopeSkip */}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {t(
                              "sendScopeDescription",
                              'Choose the user scope for email sending. Select "Additional emails only" to send only to the email addresses filled below'
                            )}
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    {/* Estimated recipients info */}
                    <div className="flex justify-end">
                      <div className="border-l-4 border-l-primary bg-primary/10 px-4 py-3 text-sm">
                        <span className="text-muted-foreground">
                          {t("estimatedRecipients", "Estimated recipients")}:{" "}
                        </span>
                        <span className="font-medium text-lg text-primary">
                          {estimatedRecipients.total}
                        </span>
                        <span className="ml-2 text-muted-foreground text-xs">
                          ({t("users", "users")}: {estimatedRecipients.users},{" "}
                          {t("additional", "Additional")}:{" "}
                          {estimatedRecipients.additional})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="register_start_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t(
                              "registrationStartDate",
                              "Registration Start Date"
                            )}
                          </FormLabel>
                          <FormControl>
                            <EnhancedInput
                              disabled={form.watch("scope") === 5}
                              onValueChange={field.onChange}
                              step="1" // ScopeSkip
                              type="datetime-local"
                              value={field.value}
                            />
                          </FormControl>
                          <FormDescription>
                            {t(
                              "includeUsersRegisteredAfter",
                              "Include users registered on or after this date"
                            )}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="register_end_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("registrationEndDate", "Registration End Date")}
                          </FormLabel>
                          <FormControl>
                            <EnhancedInput
                              disabled={form.watch("scope") === 5}
                              onValueChange={field.onChange}
                              step="1" // ScopeSkip
                              type="datetime-local"
                              value={field.value}
                            />
                          </FormControl>
                          <FormDescription>
                            {t(
                              "includeUsersRegisteredBefore",
                              "Include users registered on or before this date"
                            )}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Additional recipients */}
                  <FormField
                    control={form.control}
                    name="additional"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "additionalRecipientEmails",
                            "Additional recipient emails"
                          )}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-[120px] font-mono text-sm"
                            placeholder={`${t("pleaseEnter", "Please enter")}${t("additionalRecipientEmails", "Additional recipient emails").toLowerCase()}，${t("onePerLine", "one per line")}，for example:\nexample1@domain.com\nexample2@domain.com\nexample3@domain.com`}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t(
                            "additionalRecipientsDescription",
                            "These emails will receive the broadcast in addition to the user filter above"
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Send time settings */}
                  <FormField
                    control={form.control}
                    name="scheduled"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("scheduledSend", "Schedule Send")}
                        </FormLabel>
                        <FormControl>
                          <EnhancedInput
                            onValueChange={field.onChange}
                            placeholder={t(
                              "leaveEmptyForImmediateSend",
                              "Leave empty for immediate send"
                            )}
                            step="1"
                            type="datetime-local"
                            value={field.value}
                          />
                        </FormControl>
                        <FormDescription>
                          {t(
                            "selectSendTime",
                            "Select send time, leave empty for immediate send"
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Send rate control */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="interval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("emailInterval", "Email Interval (seconds)")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              min={1}
                              placeholder="1"
                              step={0.1}
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseFloat(e.target.value) || 1
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            {t(
                              "intervalTimeBetweenEmails",
                              "Interval time between each email"
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="limit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("dailySendLimit", "Daily Send Limit")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              min={1}
                              placeholder="1000"
                              step={1}
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseInt(e.target.value, 10) || 1000
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            {t(
                              "maximumNumberPerDay",
                              "Maximum number of emails to send per day"
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </ScrollArea>
        <SheetFooter className="flex flex-row items-center justify-end gap-2 pt-3">
          <Button onClick={() => setOpen(false)} variant="outline">
            {t("cancel", "Cancel")}
          </Button>
          <Button disabled={loading} form="broadcast-form" type="submit">
            {loading && (
              <Icon className="mr-2 h-4 w-4 animate-spin" icon="mdi:loading" />
            )}
            {loading
              ? t("processing", "Processing...")
              : !form.watch("scheduled") ||
                  form.watch("scheduled")?.trim() === ""
                ? t("sendNow", "Send Now")
                : t("scheduleSend", "Schedule Send")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
