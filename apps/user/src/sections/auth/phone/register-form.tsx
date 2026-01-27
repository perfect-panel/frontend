import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
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
import { Markdown } from "@workspace/ui/composed/markdown";
import type { Dispatch, SetStateAction } from "react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useGlobalStore } from "@/stores/global";
import SendCode from "../send-code";
import type { TurnstileRef } from "../turnstile";
import CloudFlareTurnstile from "../turnstile";

export default function RegisterForm({
  loading,
  onSubmit,
  initialValues,
  onSwitchForm,
}: {
  loading?: boolean;
  onSubmit: (data: any) => void;
  initialValues: any;
  onSwitchForm: Dispatch<SetStateAction<"register" | "reset" | "login">>;
}) {
  const { t } = useTranslation("auth");
  const { common } = useGlobalStore();
  const { verify, auth, invite } = common;
  const { enable_whitelist, whitelist } = auth.mobile;

  const formSchema = z
    .object({
      telephone_area_code: z.string(),
      telephone: z.string(),
      password: z.string(),
      repeat_password: z.string(),
      code: z.string(),
      invite: invite.forced_invite ? z.string().min(1) : z.string().nullish(),
      cf_token:
        verify.enable_register_verify && verify.turnstile_site_key
          ? z.string()
          : z.string().nullish(),
    })
    .superRefine(({ password, repeat_password }, ctx) => {
      if (password !== repeat_password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("register.passwordMismatch", "Passwords do not match"),
          path: ["repeat_password"],
        });
      }
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialValues,
      telephone_area_code: initialValues?.telephone_area_code || "1",
      invite: localStorage.getItem("invite") || "",
    },
  });

  const turnstile = useRef<TurnstileRef>(null);
  const handleSubmit = form.handleSubmit((data) => {
    try {
      onSubmit(data);
    } catch (_error) {
      turnstile.current?.reset();
    }
  });

  return (
    <>
      {auth.register.stop_register ? (
        <Markdown>
          {t("register.message", "Registration is currently disabled")}
        </Markdown>
      ) : (
        <Form {...form}>
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex">
                      <FormField
                        control={form.control}
                        name="telephone_area_code"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <AreaCodeSelect
                                className="w-32 rounded-r-none border-r-0"
                                onChange={(value) => {
                                  if (value.phone) {
                                    form.setValue(
                                      "telephone_area_code",
                                      value.phone
                                    );
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter your password..."
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
                      disabled={loading}
                      placeholder="Enter password again..."
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
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        disabled={loading}
                        placeholder="Enter code..."
                        type="text"
                        {...field}
                        value={field.value as string}
                      />

                      <SendCode
                        params={{
                          telephone: form.watch("telephone"),
                          telephone_area_code: form.watch(
                            "telephone_area_code"
                          ),
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
            <FormField
              control={form.control}
              name="invite"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={loading || !!localStorage.getItem("invite")}
                      placeholder={t(
                        "register.invite",
                        "Invitation Code (Optional)"
                      )}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {verify.enable_register_verify && (
              <FormField
                control={form.control}
                name="cf_token"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CloudFlareTurnstile
                        id="register"
                        {...field}
                        ref={turnstile}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button disabled={loading} type="submit">
              {loading && <Icon className="animate-spin" icon="mdi:loading" />}
              {t("register.title", "Register")}
            </Button>
          </form>
        </Form>
      )}
      <div className="mt-4 text-right text-sm">
        {t("register.existingAccount", "Already have an account?")}&nbsp;
        <Button
          className="p-0"
          onClick={() => {
            // setInitialValues(undefined);
            onSwitchForm("login");
          }}
          variant="link"
        >
          {t("register.switchToLogin", "Login")}
        </Button>
      </div>
    </>
  );
}
