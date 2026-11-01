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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { putV1PublicUserPassword as updateUserPassword } from "@workspace/ui/services/user/user";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { useGlobalStore } from "@/stores/global";
import { Logout } from "@/utils/common";
import CurrentCredentialFields, {
  type VerifyBy,
} from "./current-credential-fields";

export default function ChangePassword() {
  const { t } = useTranslation("profile");
  const { user } = useGlobalStore();
  const hasMobile = user?.auth_methods?.some(
    (auth) => auth.auth_type === "mobile"
  );
  const email = user?.auth_methods?.find(
    (auth) => auth.auth_type === "email"
  )?.auth_identifier;
  const [verifyBy, setVerifyBy] = useState<VerifyBy>("password");
  const FormSchema = z
    .object({
      old_password: z.string().optional(),
      current_code: z.string().optional(),
      password: z
        .string()
        .min(
          8,
          t(
            "accountSettings.passwordLength",
            "Password must be 8-128 characters"
          )
        )
        .max(
          128,
          t(
            "accountSettings.passwordLength",
            "Password must be 8-128 characters"
          )
        ),
      repeat_password: z.string(),
    })
    .refine((data) => data.password === data.repeat_password, {
      message: t("accountSettings.passwordMismatch", "Passwords do not match"),
      path: ["repeat_password"],
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      old_password: "",
      current_code: "",
      password: "",
      repeat_password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // Without a bound email the field stays optional: an account with
    // neither a password nor a bound address sets its first one unproven.
    const credential = verifyBy === "code" ? "current_code" : "old_password";
    if (email && !data[credential]) {
      form.setError(credential, {
        message:
          verifyBy === "code"
            ? t("currentCredential.codeRequired", "Enter the verification code")
            : t(
                "currentCredential.passwordRequired",
                "Enter your current password"
              ),
      });
      return;
    }
    await updateUserPassword({
      password: data.password,
      old_password: data.old_password || undefined,
      current_code: data.current_code || undefined,
    });
    // The change ends every session of the account, this one included.
    toast.success(
      t("currentCredential.signInAgain", "Updated. Please sign in again.")
    );
    Logout();
  }

  return (
    <Card className="min-w-80">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {t("accountSettings.accountSettings", "Password Settings")}
          <Button form="password-form" size="sm" type="submit">
            {t("accountSettings.updatePassword", "Update Password")}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-4"
            id="password-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <CurrentCredentialFields
              email={email}
              hint={
                hasMobile
                  ? undefined
                  : t(
                      "currentCredential.firstPassword",
                      "Leave empty when setting your first password."
                    )
              }
              onVerifyByChange={setVerifyBy}
              passwordName="old_password"
              verifyBy={verifyBy}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "accountSettings.newPasswordHint",
                        "New Password (at least 8 characters)"
                      )}
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repeat_password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "accountSettings.repeatNewPassword",
                        "Repeat New Password"
                      )}
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
