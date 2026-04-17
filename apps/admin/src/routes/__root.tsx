import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Toaster } from "@workspace/ui/components/sonner";
import { NavigationProgress } from "@workspace/ui/composed/navigation-progress";
import { TanStackQueryDevtools } from "@workspace/ui/integrations/tanstack-query-devtools";
import { getCookie } from "@workspace/ui/lib/cookies";
import { getGlobalConfig } from "@workspace/ui/services/common/common";
import { isBrowser } from "@workspace/ui/utils/index";
import { useEffect } from "react";
import { useGlobalStore } from "@/stores/global";

function syncDocumentHead({
  title,
  description,
  keywords,
  canonicalUrl,
  iconHref,
}: {
  title: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  iconHref?: string;
}) {
  document.title = title;

  const upsertMeta = (name: string, content?: string) => {
    let element = document.head.querySelector<HTMLMetaElement>(
      `meta[name="${name}"]`
    );

    if (!content) {
      element?.remove();
      return;
    }

    if (!element) {
      element = document.createElement("meta");
      element.name = name;
      document.head.appendChild(element);
    }

    element.content = content;
  };

  const upsertLink = (rel: string, href?: string) => {
    let element = document.head.querySelector<HTMLLinkElement>(
      `link[rel="${rel}"]`
    );

    if (!href) {
      element?.remove();
      return;
    }

    if (!element) {
      element = document.createElement("link");
      element.rel = rel;
      document.head.appendChild(element);
    }

    element.href = href;
  };

  upsertMeta("description", description);
  upsertMeta("keywords", keywords);
  upsertLink("canonical", canonicalUrl);
  upsertLink("icon", iconHref);
  upsertLink("apple-touch-icon", iconHref);
}

export const Route = createRootRouteWithContext()({
  component: () => {
    const { common, setCommon, getUserInfo } = useGlobalStore();
    useEffect(() => {
      const initializeApp = async () => {
        try {
          const configResponse = await getGlobalConfig();
          if (configResponse.data?.data) {
            setCommon(configResponse.data.data);
          }
          try {
            if (getCookie("Authorization")) {
              await getUserInfo();
            }
          } catch {
            /* empty */
          }
        } catch (error) {
          console.error("Failed to initialize app:", error);
        }
      };

      initializeApp();
    }, []);

    const { site } = common;
    const title = site.site_name || "Perfect Panel";
    const description = site.site_desc || title;
    const keywords = site.keywords || "";
    const logo = site.site_logo || "";
    const url = isBrowser() ? window.location.href : "";

    useEffect(() => {
      if (!isBrowser()) return;

      syncDocumentHead({
        title,
        description,
        keywords,
        canonicalUrl: url,
        iconHref: logo,
      });
    }, [description, keywords, logo, title, url]);

    return (
      <>
        <NavigationProgress />
        <Outlet />
        <Toaster closeButton richColors />
        <div
          dangerouslySetInnerHTML={{ __html: common?.site.custom_html || "" }}
          id="custom_html"
        />
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
      </>
    );
  },
});
