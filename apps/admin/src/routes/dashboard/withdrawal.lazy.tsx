import { createLazyFileRoute } from "@tanstack/react-router";
import WithdrawalPage from "@/sections/withdrawal";

export const Route = createLazyFileRoute("/dashboard/withdrawal")({
  component: WithdrawalPage,
});
