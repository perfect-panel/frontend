"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Link } from "@tanstack/react-router";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { LanguageSwitch } from "@workspace/ui/composed/language-switch";
import { ThemeSwitch } from "@workspace/ui/composed/theme-switch";
import { useTranslation } from "react-i18next";
import { useGlobalStore } from "@/stores/global";
import EmailAuthForm from "./email/auth-form";
import { OAuthMethods } from "./oauth-methods";
import PhoneAuthForm from "./phone/auth-form";

export default function Main() {
  const { t } = useTranslation("auth");
  const { common } = useGlobalStore();
  const { site, auth } = common;

  const AUTH_METHODS = [
    {
      key: "email",
      enabled: auth.email.enable,
      children: <EmailAuthForm />,
    },
    {
      key: "mobile",
      enabled: auth.mobile.enable,
      children: <PhoneAuthForm />,
    },
  ].filter((method) => method.enabled);

  return (
    <main className="flex h-full min-h-screen items-center" style={{ background: 'linear-gradient(135deg, oklch(0.88 0.05 220) 0%, oklch(0.93 0.03 280) 50%, oklch(0.90 0.04 240) 100%)' }}>
      <div className="flex size-full flex-auto flex-col lg:flex-row">
        <div className="flex bg-center bg-cover lg:w-1/2 lg:flex-auto">
          <div className="flex w-full flex-col items-center justify-center px-5 py-7 md:px-15 lg:py-15">
            <Link className="mb-6 flex flex-col items-center lg:mb-12" to="/">
              {site.site_logo && (
                <img alt="logo" height={48} src={site.site_logo} width={48} />
              )}
              <span className="font-semibold text-2xl">{site.site_name}</span>
            </Link>
            <div className="min-h-[180px] flex items-center justify-center">
              <DotLottieReact
                autoplay
                className="mx-auto hidden w-[275px] lg:block xl:w-[500px]"
                loop
                src="./assets/lotties/login.json"
              />
            </div>
            <p className="hidden w-[275px] text-center md:w-1/2 lg:block xl:w-[500px]">
              {site.site_desc}
            </p>
          </div>
        </div>
        <div className="flex flex-initial justify-center p-12 lg:flex-auto lg:justify-end">
          <div className="flex w-full flex-col items-center rounded-2xl md:w-[600px] md:p-10 lg:flex-auto lg:shadow" style={{ background: 'var(--glass-bg-strong)', backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur)', border: '1px solid var(--glass-border)', boxShadow: '0 20px 60px oklch(0 0 0 / 0.12), 0 4px 16px oklch(0 0 0 / 0.06), inset 0 1px 0 oklch(1 0 0 / 0.5)' }}>
            <div className="flex w-full flex-col items-stretch justify-center md:w-[400px] lg:h-full">
              <div className="flex flex-col justify-center lg:flex-auto">
                <h1 className="mb-3 text-center font-bold text-2xl">
                  {t("verifyAccount", "Verify Your Account")}
                </h1>
                <div className="mb-6 text-center font-medium text-muted-foreground">
                  {t(
                    "verifyAccountDesc",
                    "Please login or register to continue"
                  )}
                </div>
                {AUTH_METHODS.length === 1
                  ? AUTH_METHODS[0]?.children
                  : AUTH_METHODS[0] && (
                      <Tabs defaultValue={AUTH_METHODS[0].key}>
                        <TabsList className="mb-6 flex w-full *:flex-1">
                          {AUTH_METHODS.map((item) => (
                            <TabsTrigger key={item.key} value={item.key}>
                              {t(`methods.${item.key}`)}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        {AUTH_METHODS.map((item) => (
                          <TabsContent key={item.key} value={item.key}>
                            {item.children}
                          </TabsContent>
                        ))}
                      </Tabs>
                    )}
              </div>
              <div className="py-8">
                <OAuthMethods />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <LanguageSwitch />
                  <ThemeSwitch />
                </div>
                <div className="flex gap-2 font-semibold text-primary text-sm">
                  <Link to="/tos">{t("tos", "Terms of Service")}</Link>
                  <span className="text-foreground/30">|</span>
                  <Link to="/privacy-policy">
                    {t("privacyPolicy", "Privacy Policy")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
