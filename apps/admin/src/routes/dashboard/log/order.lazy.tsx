import { createLazyFileRoute } from "@tanstack/react-router";
import OrderLogPage from "@/sections/log/order";

export const Route = createLazyFileRoute("/dashboard/log/order")({
  component: OrderLogPage,
});
