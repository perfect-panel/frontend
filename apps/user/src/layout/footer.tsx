"use client";

import { Link } from "@tanstack/react-router";
import { Separator } from "@workspace/ui/components/separator";
import { Icon } from "@workspace/ui/composed/icon";
import { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGlobalStore } from "@/stores/global";

interface CustomData {
  community?: {
    discord?: string;
    facebook?: string;
    github?: string;
    instagram?: string;
    linkedin?: string;
    telegram?: string;
    twitter?: string;
  };
  contacts?: {
    address?: string;
    email?: string;
    telephone?: string;
  };
  website?: string;
}

export default function Footer() {
  const { t } = useTranslation("components");
  const { common } = useGlobalStore();
  const { site } = common;

  const customData = useMemo<CustomData>(() => {
    try {
      return JSON.parse(site.custom_data || "{}");
    } catch {
      return {};
    }
  }, [site.custom_data]);

  const links = useMemo(
    () => [
      {
        name: "email",
        icon: "uil:envelope",
        href: customData.contacts?.email
          ? `mailto:${customData.contacts.email}`
          : undefined,
      },
      {
        name: "telegram",
        icon: "uil:telegram",
        href: customData.community?.telegram,
      },
      {
        name: "twitter",
        icon: "uil:twitter",
        href: customData.community?.twitter,
      },
      {
        name: "discord",
        icon: "uil:discord",
        href: customData.community?.discord,
      },
      {
        name: "instagram",
        icon: "uil:instagram",
        href: customData.community?.instagram,
      },
      {
        name: "linkedin",
        icon: "uil:linkedin",
        href: customData.community?.linkedin,
      },
      {
        name: "github",
        icon: "uil:github",
        href: customData.community?.github,
      },
      {
        name: "facebook",
        icon: "uil:facebook",
        href: customData.community?.facebook,
      },
    ],
    [customData]
  );
  return (
    <footer>
      <Separator className="my-14" />
      <div className="container mb-14 flex flex-wrap justify-between gap-4 text-muted-foreground text-sm">
        <nav className="flex flex-wrap items-center gap-2">
          {links
            .filter((item) => item.href)
            .map((item, index) => (
              <Fragment key={index}>
                {index !== 0 && <Separator orientation="vertical" />}
                <a
                  aria-label={t(
                    `footer.social.${item.name}`,
                    `Visit our ${item.name}`
                  )}
                  href={item.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon className="size-5 text-foreground" icon={item.icon} />
                </a>
              </Fragment>
            ))}
        </nav>
        <div>
          <strong className="text-foreground">{site.site_name}</strong> ©{" "}
          {t("footer.copyright", "All rights reserved")}.
          <div>
            <Link className="underline" to="/tos">
              {t("footer.tos", "Terms of Service")}
            </Link>
            <Link className="ml-2 underline" to="/privacy-policy">
              {t("footer.privacyPolicy", "Privacy Policy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
