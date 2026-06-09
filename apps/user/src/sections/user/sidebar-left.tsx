"use client";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import { Icon } from "@workspace/ui/composed/icon";
import { useTranslation } from "react-i18next";
import { useNavs } from "@/layout/navs";

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation("components");
  const location = useLocation();
  const navs = useNavs();
  return (
    <Sidebar collapsible="none" side="left" {...props}>
      <SidebarContent>
        <SidebarMenu>
          {navs.map((nav) => (
            <SidebarGroup key={nav.title}>
              {nav.items && (
                <SidebarGroupLabel>{t(nav.title)}</SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {(nav.items || [nav]).map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={item.url === location.pathname}
                        tooltip={t(item.title)}
                      >
                        <Link to={item.url || "/"}>
                          {item.icon && <Icon icon={item.icon} />}
                          <span>{t(item.title)}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
