"use client";
import { Outlet } from "@tanstack/react-router";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import Announcement from "@/sections/user/announcement";
import { SidebarLeft } from "./sidebar-left";
import { SidebarRight } from "./sidebar-right";

export default function UserLayout() {
  return (
    <SidebarProvider className="container">
      <SidebarLeft
        className="sticky top-[84px] hidden w-52 border-r-0 lg:flex"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "var(--glass-blur-light)",
          WebkitBackdropFilter: "var(--glass-blur-light)",
        }}
      />
      <SidebarInset className="relative p-4">
        <Outlet />
      </SidebarInset>
      <SidebarRight
        className="sticky top-[84px] hidden w-52 border-r-0 2xl:flex"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "var(--glass-blur-light)",
          WebkitBackdropFilter: "var(--glass-blur-light)",
        }}
      />
      <Announcement type="popup" />
    </SidebarProvider>
  );
}
