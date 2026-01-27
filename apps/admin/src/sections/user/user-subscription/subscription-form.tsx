import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
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
import { Combobox } from "@workspace/ui/composed/combobox";
import { DatePicker } from "@workspace/ui/composed/date-picker";
import { EnhancedInput } from "@workspace/ui/composed/enhanced-input";
import { Icon } from "@workspace/ui/composed/icon";
import { unitConversion } from "@workspace/ui/utils/unit-conversions";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useSubscribe } from "@/stores/subscribe";

interface Props {
  trigger: ReactNode;
  title: string;
  loading?: boolean;
  initialData?: API.UserSubscribe;
  onSubmit: (values: any) => Promise<boolean>;
}

const formSchema = z.object({
  subscribe_id: z.number().optional(),
  traffic: z.number().optional(),
  speed_limit: z.number().optional(),
  device_limit: z.number().optional(),
  expired_at: z.number().nullish().optional(),
  upload: z.number().optional(),
  download: z.number().optional(),
  id: z.number().optional(),
});

export function SubscriptionForm({
  trigger,
  title,
  loading,
  initialData,
  onSubmit,
}: Props) {
  const { t } = useTranslation("user");
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subscribe_id: initialData?.subscribe_id || 0,
      traffic: initialData?.traffic || 0,
      upload: initialData?.upload || 0,
      download: initialData?.download || 0,
      expired_at: initialData?.expire_time || 0,
      ...(initialData && { id: initialData.id }),
    },
  });

  const handleSubmit = async (values: any) => {
    const success = await onSubmit(values);
    if (success) {
      setOpen(false);
      form.reset();
    }
  };

  const { subscribes } = useSubscribe();

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button
          onClick={() => {
            form.reset();
            setOpen(true);
          }}
        >
          {trigger}
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-48px-36px-36px-env(safe-area-inset-top))] px-4">
          <div className="pr-4">
            <Form {...form}>
              <form
                className="mt-4 space-y-4"
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                <FormField
                  control={form.control}
                  name="subscribe_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("subscription", "Subscription")}</FormLabel>
                      <FormControl>
                        <Combobox<number, false>
                          onChange={(value) => {
                            form.setValue(field.name, value);
                          }}
                          options={subscribes?.map((item) => ({
                            value: item.id!,
                            label: item.name!,
                          }))}
                          placeholder="Select Subscription"
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="traffic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("trafficLimit", "Traffic Limit")}
                      </FormLabel>
                      <FormControl>
                        <EnhancedInput
                          placeholder={t("unlimited", "Unlimited")}
                          type="number"
                          {...field}
                          formatInput={(value) =>
                            unitConversion("bytesToGb", value)
                          }
                          formatOutput={(value) =>
                            unitConversion("gbToBytes", value)
                          }
                          onValueChange={(value) => {
                            form.setValue(field.name, value as number);
                          }}
                          suffix="GB"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="upload"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("uploadTraffic", "Upload Traffic")}
                      </FormLabel>
                      <FormControl>
                        <EnhancedInput
                          placeholder="0"
                          type="number"
                          {...field}
                          formatInput={(value) =>
                            unitConversion("bytesToGb", value)
                          }
                          formatOutput={(value) =>
                            unitConversion("gbToBytes", value)
                          }
                          onValueChange={(value) => {
                            form.setValue(field.name, value as number);
                          }}
                          suffix="GB"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="download"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("downloadTraffic", "Download Traffic")}
                      </FormLabel>
                      <FormControl>
                        <EnhancedInput
                          placeholder="0"
                          type="number"
                          {...field}
                          formatInput={(value) =>
                            unitConversion("bytesToGb", value)
                          }
                          formatOutput={(value) =>
                            unitConversion("gbToBytes", value)
                          }
                          onValueChange={(value) => {
                            form.setValue(field.name, value as number);
                          }}
                          suffix="GB"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expired_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("expiredAt", "Expired At")}</FormLabel>
                      <FormControl>
                        <DatePicker
                          onChange={(value: number | null | undefined) => {
                            form.setValue(field.name, value || 0);
                          }}
                          placeholder={t("permanent", "Permanent")}
                          value={
                            field.value && field.value > 0
                              ? field.value
                              : undefined
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </ScrollArea>
        <SheetFooter className="flex-row justify-end gap-2 pt-3">
          <Button
            disabled={loading}
            onClick={() => {
              setOpen(false);
            }}
            variant="outline"
          >
            {t("cancel", "Cancel")}
          </Button>
          <Button disabled={loading} onClick={form.handleSubmit(handleSubmit)}>
            {loading && (
              <Icon className="mr-2 animate-spin" icon="mdi:loading" />
            )}
            {t("confirm", "Confirm")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
