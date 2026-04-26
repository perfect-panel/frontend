import { createLazyFileRoute } from "@tanstack/react-router";
import AuditLogPage from "@/sections/audit";

export const Route = createLazyFileRoute("/dashboard/audit")({
  component: AuditLogPage,
});
