import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { getCookie } from "@workspace/ui/lib/cookies";
import { useEffect } from "react";
import UserLayout from "@/sections/user/layout";

function ProtectedUserLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Protect all user pages behind authentication.
    if (!getCookie("Authorization")) {
      const next = `${window.location.hash?.slice(1) || "/dashboard"}`;
      navigate({
        to: "/auth",
        // For hash routing, pass redirect via search so it stays inside `#`.
        // (Router types don't declare auth search params, so keep this best-effort.)
        search: { redirect: next.startsWith("/") ? next : "/dashboard" },
        replace: true,
      } as any);
    }
  }, [navigate]);

  if (!getCookie("Authorization")) return null;
  return <UserLayout />;
}

export const Route = createLazyFileRoute("/(main)/(user)")({
  component: ProtectedUserLayout,
});
