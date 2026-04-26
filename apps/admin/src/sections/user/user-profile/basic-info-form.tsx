import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Switch } from "@workspace/ui/components/switch";
import { EnhancedInput } from "@workspace/ui/composed/enhanced-input";
import { TagInput } from "@workspace/ui/composed/tag-input";
import { UploadImage } from "@workspace/ui/composed/upload-image";
import { updateUserBasicInfo } from "@workspace/ui/services/admin/user";
import { unitConversion } from "@workspace/ui/utils/unit-conversions";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";
import { useGlobalStore } from "@/stores/global";

const basicInfoSchema = z.object({
  avatar: z.string().optional(),
  balance: z.number().optional(),
  commission: z.number().optional(),
  gift_amount: z.number().optional(),
  refer_code: z.string().optional(),
  referer_id: z.number().optional(),
  referral_percentage: z.number().optional(),
  only_first_purchase: z.boolean().optional(),
  is_admin: z.boolean().optional(),
  password: z.string().optional(),
  enable: z.boolean(),
  tags: z.array(z.string()).optional(),
});

type BasicInfoValues = z.infer<typeof basicInfoSchema>;

export function BasicInfoForm({
  user,
  refetch,
}: {
  user: API.User;
  refetch: () => Promise<unknown>;
}) {
  const { t } = useTranslation("user");

  const { common } = useGlobalStore();
  const { currency } = common;

  const form = useForm<BasicInfoValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      avatar: user.avatar,
      balance: user.balance,
      commission: user.commission,
      gift_amount: user.gift_amount,
      refer_code: user.refer_code,
      referer_id: user.referer_id,
      referral_percentage: user.referral_percentage,
      only_first_purchase: user.only_first_purchase,
      is_admin: user.is_admin,
      enable: user.enable,
      tags: (user as any).tags || [],
    },
  });

  async function onSubmit(data: BasicInfoValues) {
    await updateUserBasicInfo({
      user_id: user.id,
      telegram: user.telegram,
      ...data,
    } as API.UpdateUserBasiceInfoRequest);
    toast.success(t("updateSuccess", "Updated successfully"));
    refetch();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t("basicInfoTitle", "Basic Info")}</CardTitle>
            <Button size="sm" type="submit">
              {t("save", "Save")}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="enable"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-x-2">
                  <FormLabel>{t("accountEnable", "Account Enable")}</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_admin"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-x-2">
                  <FormLabel>{t("administrator", "Administrator")}</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("balance", "Balance")}</FormLabel>
                    <FormControl>
                      <EnhancedInput
                        formatInput={(value) =>
                          unitConversion("centsToDollars", value)
                        }
                        formatOutput={(value) =>
                          unitConversion("dollarsToCents", value)
                        }
                        min={0}
                        onValueChange={(value) => {
                          form.setValue(field.name, value as number);
                        }}
                        prefix={currency?.currency_symbol ?? "$"}
                        type="number"
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="commission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("commission", "Commission")}</FormLabel>
                    <FormControl>
                      <EnhancedInput
                        formatInput={(value) =>
                          unitConversion("centsToDollars", value)
                        }
                        formatOutput={(value) =>
                          unitConversion("dollarsToCents", value)
                        }
                        min={0}
                        onValueChange={(value) => {
                          form.setValue(field.name, value as number);
                        }}
                        prefix={currency?.currency_symbol ?? "$"}
                        type="number"
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gift_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("giftAmount", "Gift Amount")}</FormLabel>
                    <FormControl>
                      <EnhancedInput
                        formatInput={(value) =>
                          unitConversion("centsToDollars", value)
                        }
                        formatOutput={(value) =>
                          unitConversion("dollarsToCents", value)
                        }
                        min={0}
                        onValueChange={(value) => {
                          form.setValue(field.name, value as number);
                        }}
                        prefix={currency?.currency_symbol ?? "$"}
                        type="number"
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="refer_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("referralCode", "Referral Code")}</FormLabel>
                    <FormControl>
                      <EnhancedInput
                        onValueChange={(value) => {
                          form.setValue(field.name, value as string);
                        }}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="referer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("referrerUserId", "Referrer User ID")}
                    </FormLabel>
                    <FormControl>
                      <EnhancedInput
                        onValueChange={(value) => {
                          form.setValue(field.name, value as number);
                        }}
                        type="number"
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("tags", "标签")}</FormLabel>
                  <FormControl>
                    <TagInput
                      onChange={(v) => form.setValue(field.name, v)}
                      placeholder={t("tagsPlaceholder", "输入标签后按回车")}
                      value={field.value || []}
                    />
                  </FormControl>
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
                    {t("referralPercentage", "Referral Percentage")}
                  </FormLabel>
                  <FormControl>
                    <EnhancedInput
                      max={100}
                      min={0}
                      onValueChange={(value) => {
                        form.setValue(field.name, value as number);
                      }}
                      suffix="%"
                      type="number"
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="only_first_purchase"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-x-2">
                  <FormLabel>
                    {t("onlyFirstPurchase", "First Purchase Only")}
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("avatar", "Avatar")}</FormLabel>
                  <FormControl>
                    <EnhancedInput
                      onValueChange={(value) => {
                        form.setValue(field.name, value as string);
                      }}
                      suffix={
                        <UploadImage
                          className="h-9 rounded-none border-none bg-muted px-2"
                          onChange={(value) =>
                            form.setValue("avatar", value as string)
                          }
                          returnType="base64"
                        />
                      }
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("password", "Password")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "passwordPlaceholder",
                        "Enter new password"
                      )}
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
