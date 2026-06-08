import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useGlobalStore } from "@/stores/global";
import { GlobalMap } from "./global-map";
import { Hero } from "./hero";
import { ProductShowcase } from "./product-showcase";
import { Stats } from "./stats";

export default function Main() {
  const { user, isLoadingUser } = useGlobalStore();
  const navigate = useNavigate();

  const showLanding = import.meta.env.VITE_SHOW_LANDING_PAGE !== "false";

  useEffect(() => {
    // Wait for user info to load before making navigation decisions
    if (isLoadingUser) {
      return;
    }

    if (user) {
      navigate({ to: "/dashboard" });
      return;
    }

    if (!showLanding) {
      navigate({ to: "/auth" });
    }
  }, [user, isLoadingUser, navigate, showLanding]);

  if (!showLanding) return null;

  return (
    <main className="container space-y-16">
      <Hero />
      <Stats />
      <ProductShowcase />
      <GlobalMap />
    </main>
  );
}
