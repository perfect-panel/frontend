"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { AreaCodeSelect } from "@workspace/ui/composed/area-code-select";
import { Icon } from "@workspace/ui/composed/icon";
import {
  bindOAuth,
  unbindOAuth,
  updateBindEmail,
  updateBindMobile,
} from "@workspace/ui/services/user/user";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import SendCode from "@/sections/auth/send-code";
import { useGlobalStore } from "@/stores/global";

function MobileBindDialog({
  onSuccess,
  children,
}: {
  onSuccess: () => void;
  children: React.ReactNode;
}) {
  const { t } = useTranslation("profile");
  const { common } = useGlobalStore();
  const { enable_whitelist, whitelist } = common.auth.mobile;
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    area_code: z.string().min(1, "Area code is required"),
    mobile: z.string().min(5, "Phone number is required"),
    code: z.string().min(4, "Verification code is required"),
  });

  type MobileBindFormValues = z.infer<typeof formSchema>;

  const form = useForm<MobileBindFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      area_code: "1",
      mobile: "",
      code: "",
    },
  });

  const onSubmit = async (values: MobileBindFormValues) => {
    try {
      await updateBindMobile(values);
      toast.success(t("thirdParty.bindSuccess", "Successfully connected"));
      onSuccess();
      setOpen(false);
    } catch (_error) {
      toast.error(t("thirdParty.bindFailed", "Failed to connect"));
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {t("thirdParty.bindMobile", "Connect Mobile")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex">
                      <FormField
                        control={form.control}
                        name="area_code"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <AreaCodeSelect
                                className="w-32 rounded-r-none border-r-0"
                                onChange={(value) => {
                                  if (value.phone) {
                                    form.setValue(field.name, value.phone);
                                  }
                                }}
                                placeholder="Area code..."
                                simple
                                value={field.value}
                                whitelist={enable_whitelist ? whitelist : []}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Input
                        className="rounded-l-none"
                        placeholder="Enter your telephone..."
                        type="tel"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter code..."
                        type="text"
                        {...field}
                      />
                      <SendCode
                        params={{
                          telephone_area_code: form.watch("area_code"),
                          telephone: form.watch("mobile"),
                          type: 1,
                        }}
                        type="phone"
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              {t("thirdParty.confirm", "Confirm")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function ThirdPartyAccounts() {
  const { t } = useTranslation("profile");
  const { user, getUserInfo, common } = useGlobalStore();
  const { oauth_methods } = common;

  const accounts = [
    {
      id: "email",
      icon: "logos:mailgun-icon",
      name: "Email",
      type: "Basic",
      descriptionDefault: "Link your email address",
    },
    {
      id: "mobile",
      icon: "mdi:telephone",
      name: "Mobile",
      type: "Basic",
      descriptionDefault: "Link your mobile number",
    },
    {
      id: "telegram",
      icon: "logos:telegram",
      name: "Telegram",
      type: "OAuth",
      descriptionDefault: "Sign in with Telegram",
    },
    {
      id: "apple",
      icon: "uil:apple",
      name: "Apple",
      type: "OAuth",
      descriptionDefault: "Sign in with Apple",
    },
    {
      id: "google",
      icon: "logos:google",
      name: "Google",
      type: "OAuth",
      descriptionDefault: "Sign in with Google",
    },
    {
      id: "facebook",
      icon: "logos:facebook",
      name: "Facebook",
      type: "OAuth",
      descriptionDefault: "Sign in with Facebook",
    },
    {
      id: "github",
      icon: "uil:github",
      name: "GitHub",
      type: "OAuth",
      descriptionDefault: "Sign in with GitHub",
    },
    {
      id: "device",
      icon: "mdi:devices",
      name: "Device",
      type: "OAuth",
      descriptionDefault: "Sign in with Device ID",
    },
  ].filter((account) => oauth_methods?.includes(account.id));

  const [editValues, setEditValues] = useState<Record<string, any>>({});

  const handleBasicAccountUpdate = async (
    account: (typeof accounts)[0],
    value: string
  ) => {
    if (account.id === "email") {
      await updateBindEmail({ email: value });
      await getUserInfo();
      toast.success(t("thirdParty.updateSuccess", "Update Successful"));
    }
  };

  const handleAccountAction = async (account: (typeof accounts)[number]) => {
    const isBound = user?.auth_methods?.find(
      (auth) => auth.auth_type === account.id
    )?.auth_identifier;
    if (isBound) {
      await unbindOAuth({ method: account.id });
      await getUserInfo();
    } else {
      const res = await bindOAuth({
        method: account.id,
        redirect: `${window.location.origin}/bind/${account.id}`,
      });
      if (res.data?.data?.redirect) {
        window.location.href = res.data.data.redirect;
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("thirdParty.title", "Connected Accounts")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accounts.map((account) => {
            const method = user?.auth_methods?.find(
              (auth) => auth.auth_type === account.id
            );
            const isEditing = account.id === "email";
            const currentValue =
              method?.auth_identifier || editValues[account.id];
            let displayValue = "";

            switch (account.id) {
              case "email":
                displayValue = isEditing
                  ? currentValue
                  : method?.auth_identifier || "";
                break;
              default:
                displayValue =
                  method?.auth_identifier ||
                  t(
                    `thirdParty.${account.id}.description`,
                    account.descriptionDefault
                  );
            }

            return (
              <div className="flex w-full flex-col gap-2" key={account.id}>
                <span className="flex gap-3 font-medium">
                  <Icon className="size-6" icon={account.icon} />
                  {account.name}
                </span>
                <div className="flex items-center gap-2">
                  <Input
                    className="flex-1 truncate bg-muted"
                    disabled={!isEditing}
                    onChange={(e) =>
                      isEditing &&
                      setEditValues((prev) => ({
                        ...prev,
                        [account.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && isEditing) {
                        handleBasicAccountUpdate(account, currentValue);
                      }
                    }}
                    value={displayValue}
                  />
                  {account.id === "mobile" ? (
                    <MobileBindDialog onSuccess={getUserInfo}>
                      <Button
                        className="whitespace-nowrap"
                        variant={
                          method?.auth_identifier ? "outline" : "default"
                        }
                      >
                        {t(
                          method?.auth_identifier
                            ? "thirdParty.update"
                            : "thirdParty.bind",
                          method?.auth_identifier ? "Update" : "Connect"
                        )}
                      </Button>
                    </MobileBindDialog>
                  ) : (
                    <Button
                      className="whitespace-nowrap"
                      onClick={() =>
                        isEditing
                          ? handleBasicAccountUpdate(account, currentValue)
                          : handleAccountAction(account)
                      }
                      variant={method?.auth_identifier ? "outline" : "default"}
                    >
                      {t(
                        isEditing
                          ? "thirdParty.save"
                          : method?.auth_identifier
                            ? "thirdParty.unbind"
                            : "thirdParty.bind",
                        isEditing
                          ? "Save"
                          : method?.auth_identifier
                            ? "Disconnect"
                            : "Connect"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
