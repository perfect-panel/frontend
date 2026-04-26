import { useTranslation } from "react-i18next";

export interface NavItem {
  title: string;
  url: string;
  icon: string;
  /**
   * 彩色 nav:每个入口配一个品牌色 (hex),sidebar 把图标渲染成「淡色背景 + 同色图标」的小色块。
   * 风格参考 Apple Settings / Notion / Linear 的 sidebar。
   */
  color?: string;
}

export interface NavGroup {
  title: string;
  url?: string;
  icon?: string;
  color?: string;
  items?: NavItem[];
}

export function useNavs() {
  const { t } = useTranslation("components");

  const navs: NavGroup[] = [
    {
      title: t("menu.dashboard", "Dashboard"),
      url: "/dashboard",
      icon: "uil:dashboard",
      color: "#3b82f6", // blue
    },
    {
      title: t("menu.personal", "Personal"),
      items: [
        {
          title: t("menu.profile", "User Detail"),
          url: "/profile",
          icon: "uil:user",
          color: "#8b5cf6", // violet
        },
      ],
    },
    {
      title: t("menu.server", "Server Management"),
      items: [
        {
          url: "/subscribe",
          icon: "uil:shop",
          title: t("menu.subscribe", "Subscribe"),
          color: "#10b981", // emerald
        },
      ],
    },
    {
      title: t("menu.finance", "Commerce"),
      items: [
        {
          url: "/order",
          icon: "uil:notes",
          title: t("menu.order", "Order Management"),
          color: "#f59e0b", // amber
        },
        {
          url: "/wallet",
          icon: "uil:wallet",
          title: t("menu.wallet", "Balance"),
          color: "#f43f5e", // rose
        },
        {
          url: "/affiliate",
          icon: "uil:users-alt",
          title: t("menu.affiliate", "Commission"),
          color: "#ec4899", // pink
        },
      ],
    },
    {
      title: t("menu.help", "Users & Support"),
      items: [
        {
          url: "/document",
          icon: "uil:book-alt",
          title: t("menu.document", "Document Management"),
          color: "#06b6d4", // cyan
        },
        {
          url: "/announcement",
          icon: "uil:megaphone",
          title: t("menu.announcement", "Announcement Management"),
          color: "#f97316", // orange
        },
        {
          url: "/ticket",
          icon: "uil:message",
          title: t("menu.ticket", "Ticket Management"),
          color: "#6366f1", // indigo
        },
      ],
    },
  ];

  return navs;
}

export function useFindNavByUrl(url: string) {
  const navs = useNavs();

  for (const nav of navs) {
    if (nav.url && nav.url === url) {
      return [nav];
    }
    if (nav.items) {
      const current = nav.items.find((item) => item.url === url);
      if (current) {
        return [nav, current];
      }
    }
  }
  return [];
}

export function useNavItems() {
  const { t } = useTranslation("components");

  return [
    {
      url: "/profile",
      icon: "uil:user",
      title: t("menu.profile", "User Detail"),
    },
    {
      url: "/subscribe",
      icon: "uil:shop",
      title: t("menu.subscribe", "Subscribe"),
    },
    {
      url: "/order",
      icon: "uil:notes",
      title: t("menu.order", "Order Management"),
    },
    {
      url: "/wallet",
      icon: "uil:wallet",
      title: t("menu.wallet", "Balance"),
    },
  ];
}
