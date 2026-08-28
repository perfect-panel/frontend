import { createLazyFileRoute, Outlet } from "@tanstack/react-router";
import { LogNavigation } from "@/sections/log/log-navigation";

export const Route = createLazyFileRoute("/dashboard/log")({
  component: LogLayout,
});

function LogLayout() {
  return (
    <div className="flex flex-col gap-4">
      <LogNavigation />
      <Outlet />
    </div>
  );
}
