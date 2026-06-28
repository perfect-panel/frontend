import { createLazyFileRoute } from "@tanstack/react-router";
import PluginManagement from "@/sections/plugin";

export const Route = createLazyFileRoute("/dashboard/plugin")({
  component: PluginManagement,
});
