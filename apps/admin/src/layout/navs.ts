import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export interface NavItem {
  title: string;
  url?: string;
  icon?: string;
  items?: NavItem[];
  defaultOpen?: boolean;
}

export function useNavs() {
  const { t } = useTranslation("menu");

  const navs: NavItem[] = useMemo(
    () => [
      {
        title: t("Dashboard", "Dashboard"),
        url: "/dashboard",
        icon: "flat-color-icons:globe",
      },

      {
        title: t("Maintenance", "Maintenance"),
        icon: "flat-color-icons:data-protection",
        items: [
          {
            title: t("Server Management", "Server Management"),
            url: "/dashboard/servers",
            icon: "flat-color-icons:data-protection",
          },
          {
            title: t("Node Management", "Node Management"),
            url: "/dashboard/nodes",
            icon: "flat-color-icons:mind-map",
          },
          {
            title: t("Subscribe Config", "Subscribe Config"),
            url: "/dashboard/subscribe",
            icon: "flat-color-icons:ruler",
          },
          {
            title: t("Product Management", "Product Management"),
            url: "/dashboard/product",
            icon: "flat-color-icons:shop",
          },
        ],
      },

      {
        title: t("Commerce", "Commerce"),
        icon: "flat-color-icons:sales-performance",
        items: [
          {
            title: t("Order Management", "Order Management"),
            url: "/dashboard/order",
            icon: "flat-color-icons:todo-list",
          },
          {
            title: t("Coupon Management", "Coupon Management"),
            url: "/dashboard/coupon",
            icon: "flat-color-icons:bookmark",
          },
          {
            title: t("Marketing Management", "Marketing Management"),
            url: "/dashboard/marketing",
            icon: "flat-color-icons:bullish",
          },
          {
            title: t("Announcement Management", "Announcement Management"),
            url: "/dashboard/announcement",
            icon: "flat-color-icons:advertising",
          },
        ],
      },

      {
        title: t("Users & Support", "Users & Support"),
        icon: "flat-color-icons:collaboration",
        items: [
          {
            title: t("User Management", "User Management"),
            url: "/dashboard/user",
            icon: "flat-color-icons:conference-call",
          },
          {
            title: t("Ticket Management", "Ticket Management"),
            url: "/dashboard/ticket",
            icon: "flat-color-icons:collaboration",
          },
          {
            title: t("Document Management", "Document Management"),
            url: "/dashboard/document",
            icon: "flat-color-icons:document",
          },
        ],
      },

      {
        defaultOpen: false,
        title: t("System", "System"),
        icon: "flat-color-icons:services",
        items: [
          {
            title: t("System Config", "System Config"),
            url: "/dashboard/system",
            icon: "flat-color-icons:services",
          },
          {
            title: t("Auth Control", "Auth Control"),
            url: "/dashboard/auth-control",
            icon: "flat-color-icons:lock-portrait",
          },
          {
            title: t("Payment Config", "Payment Config"),
            url: "/dashboard/payment",
            icon: "flat-color-icons:currency-exchange",
          },
          {
            title: t("ADS Config", "ADS Config"),
            url: "/dashboard/ads",
            icon: "flat-color-icons:electrical-sensor",
          },
        ],
      },

      {
        defaultOpen: false,
        title: t("Logs & Analytics", "Logs & Analytics"),
        icon: "flat-color-icons:statistics",
        items: [
          {
            title: t("Login", "Login"),
            url: "/dashboard/log/login",
            icon: "flat-color-icons:unlock",
          },
          {
            title: t("Register", "Register"),
            url: "/dashboard/log/register",
            icon: "flat-color-icons:contacts",
          },
          {
            title: t("Email", "Email"),
            url: "/dashboard/log/email",
            icon: "flat-color-icons:feedback",
          },
          {
            title: t("Mobile", "Mobile"),
            url: "/dashboard/log/mobile",
            icon: "flat-color-icons:sms",
          },
          {
            title: t("Subscribe", "Subscribe"),
            url: "/dashboard/log/subscribe",
            icon: "flat-color-icons:workflow",
          },
          {
            title: t("Reset Subscribe", "Reset Subscribe"),
            url: "/dashboard/log/reset-subscribe",
            icon: "flat-color-icons:refresh",
          },
          {
            title: t("Subscribe Traffic", "Subscribe Traffic"),
            url: "/dashboard/log/subscribe-traffic",
            icon: "flat-color-icons:statistics",
          },
          {
            title: t("Server Traffic", "Server Traffic"),
            url: "/dashboard/log/server-traffic",
            icon: "flat-color-icons:statistics",
          },
          {
            title: t("Traffic Details", "Traffic Details"),
            url: "/dashboard/log/traffic-details",
            icon: "flat-color-icons:combo-chart",
          },
          {
            title: t("Balance", "Balance"),
            url: "/dashboard/log/balance",
            icon: "flat-color-icons:sales-performance",
          },
          {
            title: t("Commission", "Commission"),
            url: "/dashboard/log/commission",
            icon: "flat-color-icons:debt",
          },
          {
            title: t("Gift", "Gift"),
            url: "/dashboard/log/gift",
            icon: "flat-color-icons:donate",
          },
          {
            title: t("Audit", "Audit"),
            url: "/dashboard/audit",
            icon: "flat-color-icons:rules",
          },
        ],
      },
    ],
    [t]
  );

  return navs;
}

export function findNavByUrl(navs: NavItem[], url: string) {
  function matchDynamicRoute(pattern: string, path: string): boolean {
    const regexPattern = pattern
      .replace(/:[^/]+/g, "[^/]+")
      .replace(/\//g, "\\/");
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(path);
  }
  function findNav(
    items: NavItem[],
    url: string,
    path: NavItem[] = []
  ): NavItem[] {
    for (const item of items) {
      if (item.url === url || (item.url && matchDynamicRoute(item.url, url))) {
        return [...path, item];
      }
      if (item.items) {
        const result = findNav(item.items, url, [...path, item]);
        if (result.length) return result;
      }
    }
    return [];
  }
  return findNav(navs, url);
}
