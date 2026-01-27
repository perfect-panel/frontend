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
import type { Dispatch, SetStateAction } from "react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useGlobalStore } from "@/stores/global";
import SendCode from "../send-code";
import type { TurnstileRef } from "../turnstile";
import CloudFlareTurnstile from "../turnstile";

export default function LoginForm({
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
  const { verify } = common;

  const formSchema = z.object({
    telephone_area_code: z.string(),
    telephone: z.string(),
    telephone_code: z.string().optional(),
    password: z.string().optional(),
    cf_token:
      verify.enable_login_verify && verify.turnstile_site_key
        ? z.string()
        : z.string().optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const [mode, setMode] = useState<"password" | "code">("password");

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
            name={mode === "code" ? "telephone_code" : "password"}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex gap-2">
                    <Input
                      placeholder={
                        mode === "code" ? "Enter code..." : "Enter password..."
                      }
                      type={mode === "code" ? "text" : "password"}
                      {...field}
                    />
                    {mode === "code" && (
                      <SendCode
                        params={{
                          telephone: form.watch("telephone"),
                          telephone_area_code: form.watch(
                            "telephone_area_code"
                          ),
                          type: 2,
                        }}
                        type="phone"
                      />
                    )}
                  </div>
                </FormControl>
                <div className="!mt-0 text-right">
                  <Button
                    className="px-0 text-primary text-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setMode(mode === "password" ? "code" : "password");
                    }}
                    variant="link"
                  >
                    {mode === "password"
                      ? t("login.codeLogin", "Login with Code")
                      : t("login.passwordLogin", "Login with Password")}
                  </Button>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
          {verify.enable_login_verify && (
            <FormField
              control={form.control}
              name="cf_token"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CloudFlareTurnstile
                      id="login"
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
            {t("login.title", "Login")}
          </Button>
        </form>
      </Form>
      <div className="mt-4 flex w-full justify-between text-sm">
        <Button
          className="p-0"
          onClick={() => onSwitchForm("reset")}
          type="button"
          variant="link"
        >
          {t("login.forgotPassword", "Forgot Password?")}
        </Button>
        <Button
          className="p-0"
          onClick={() => {
            // setInitialValues(undefined);
            onSwitchForm("register");
          }}
          variant="link"
        >
          {t("login.registerAccount", "Register Account")}
        </Button>
      </div>
    </>
  );
}
