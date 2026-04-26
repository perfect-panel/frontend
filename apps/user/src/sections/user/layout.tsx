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
    // V4.3 移动端横向溢出修复:
    //   - SidebarProvider 加 max-w-full + min-w-0 → 防止内容把容器撑大
    //   - SidebarInset 加 min-w-0 → flex 子项默认 min-width:auto 会跟内容走,
    //     设成 0 才能正确 truncate 长文本(订阅 URL 是常见元凶)
    //   - p-4 → p-3 sm:p-4 移动端边距收紧
    <SidebarProvider className="container min-w-0 max-w-full">
      <SidebarLeft className="sticky top-[84px] hidden w-52 border-r-0 bg-transparent lg:flex" />
      <SidebarInset className="relative min-w-0 p-3 sm:p-4">
        <Outlet />
      </SidebarInset>
      <SidebarRight className="sticky top-[84px] hidden w-52 border-r-0 bg-transparent 2xl:flex" />
      <Announcement type="popup" />
    </SidebarProvider>
  );
}
