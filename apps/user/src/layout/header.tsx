import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@workspace/ui/components/button";
import { LanguageSwitch } from "@workspace/ui/composed/language-switch";
import { ThemeSwitch } from "@workspace/ui/composed/theme-switch";
import { useTranslation } from "react-i18next";
import { useGlobalStore } from "@/stores/global";
import { UserNav } from "./user-nav";

export default function Header() {
  const { t } = useTranslation("components");

  const { common, user } = useGlobalStore();
  const { site } = common;
  // V4.3 自适应:Logo 整体可缩(min-w-0),站点名 truncate,
  // 极窄屏(<sm)只显示图标。右侧按钮 shrink-0,确保点得到。
  const Logo = (
    <Link
      className="flex min-w-0 items-center gap-2 font-bold text-base sm:text-lg"
      to="/"
    >
      {site.site_logo && (
        <img
          alt="logo"
          className="size-8 shrink-0 sm:size-9"
          height={36}
          src={site.site_logo}
          width={36}
        />
      )}
      <span className="truncate">{site.site_name}</span>
    </Link>
  );
  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-2">
        <nav className="flex min-w-0 flex-1 items-center md:gap-5 md:text-sm lg:gap-6">
          {Logo}
        </nav>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <LanguageSwitch />
          <ThemeSwitch />
          <UserNav />
          {!user && (
            <Link
              className={buttonVariants({
                size: "sm",
              })}
              to="/auth"
            >
              {t("loginRegister", "Login / Register")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
