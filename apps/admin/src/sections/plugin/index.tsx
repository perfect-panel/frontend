import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Separator } from "@workspace/ui/components/separator";
import { ConfirmButton } from "@workspace/ui/composed/confirm-button";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/pro-table";
import {
  disablePlugin,
  enablePlugin,
  getPluginEvents,
  getPluginHealth,
  getPluginList,
  getPluginManifest,
  getPluginMiddlewares,
  getPluginRoutes,
  type PluginEventSubscription,
  type PluginHealth,
  type PluginInfo,
  type PluginManifest,
  type PluginMiddleware,
  type PluginRoute,
  type PluginStatus,
  reloadAllPlugins,
  restartPlugin,
  validatePlugin,
} from "@workspace/ui/services/admin/plugin";
import { CheckCircle2, Eye, Power, PowerOff, RotateCcw } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface PluginDetailData {
  manifest?: PluginManifest;
  health?: PluginHealth;
  routes: PluginRoute[];
  middlewares: PluginMiddleware[];
  events: PluginEventSubscription[];
}

const statusVariant: Record<
  PluginStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  unloaded: "outline",
  loaded: "secondary",
  initialized: "secondary",
  running: "default",
  stopped: "outline",
  error: "destructive",
};

export default function PluginManagement() {
  const { t } = useTranslation("plugin");
  const tableRef = useRef<ProTableActions>(null);

  const refresh = () => tableRef.current?.refresh();

  return (
    <ProTable<PluginInfo, { q?: string; status?: string }>
      action={tableRef}
      actions={{
        render: (row) => [
          <PluginDetailDialog key="detail" plugin={row} />,
          row.status === "unloaded" ? (
            <Button
              key="enable"
              onClick={async () => {
                await enablePlugin(row.name);
                toast.success(t("enabled", "Enabled"));
                refresh();
              }}
              size="sm"
              variant="outline"
            >
              <Power />
              {t("enable", "Enable")}
            </Button>
          ) : (
            <ConfirmButton
              cancelText={t("cancel", "Cancel")}
              confirmText={t("confirm", "Confirm")}
              description={t(
                "disableDescription",
                "The plugin runtime will be stopped and its dynamic routes, middleware, events and scheduled tasks will be removed."
              )}
              key="disable"
              onConfirm={async () => {
                await disablePlugin(row.name);
                toast.success(t("disabled", "Disabled"));
                refresh();
              }}
              title={t("disableTitle", "Disable plugin?")}
              trigger={
                <Button size="sm" variant="outline">
                  <PowerOff />
                  {t("disable", "Disable")}
                </Button>
              }
            />
          ),
          <ConfirmButton
            cancelText={t("cancel", "Cancel")}
            confirmText={t("confirm", "Confirm")}
            description={t(
              "reloadDescription",
              "The current WASM instance will be stopped and the plugin will be loaded again from disk."
            )}
            key="reload"
            onConfirm={async () => {
              await restartPlugin(row.name);
              toast.success(t("restarted", "Restarted"));
              refresh();
            }}
            title={t("restartTitle", "Restart plugin?")}
            trigger={
              <Button
                disabled={row.status === "unloaded"}
                size="sm"
                variant="outline"
              >
                <RotateCcw />
                {t("restart", "Restart")}
              </Button>
            }
          />,
          <Button
            key="validate"
            onClick={async () => {
              const { data } = await validatePlugin(row.name);
              if (data.data?.valid) {
                toast.success(t("validationPassed", "Validation passed"));
              } else {
                toast.error(
                  data.data?.error || t("validationFailed", "Validation failed")
                );
              }
            }}
            size="sm"
            variant="outline"
          >
            <CheckCircle2 />
            {t("validate", "Validate")}
          </Button>,
        ],
      }}
      columns={[
        {
          accessorKey: "status",
          header: t("status", "Status"),
          cell: ({ row }) => (
            <Badge variant={statusVariant[row.original.status] || "outline"}>
              {row.original.status}
            </Badge>
          ),
        },
        {
          accessorKey: "name",
          header: t("name", "Name"),
          cell: ({ row }) => (
            <div className="flex min-w-0 flex-col gap-1">
              <span className="font-medium">{row.original.name}</span>
              {row.original.description ? (
                <span className="max-w-[360px] truncate text-muted-foreground text-xs">
                  {row.original.description}
                </span>
              ) : null}
            </div>
          ),
        },
        {
          accessorKey: "version",
          header: t("version", "Version"),
          cell: ({ row }) => row.original.version || "-",
        },
        {
          accessorKey: "author",
          header: t("author", "Author"),
          cell: ({ row }) => row.original.author || "-",
        },
        {
          accessorKey: "permissions",
          header: t("permissions", "Permissions"),
          cell: ({ row }) => (
            <div className="flex max-w-[300px] flex-wrap gap-1">
              {row.original.permissions?.length ? (
                row.original.permissions.slice(0, 4).map((item) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
              {(row.original.permissions?.length || 0) > 4 ? (
                <Badge variant="secondary">
                  +{(row.original.permissions?.length || 0) - 4}
                </Badge>
              ) : null}
            </div>
          ),
        },
        {
          accessorKey: "routes",
          header: t("routes", "Routes"),
          cell: ({ row }) => row.original.routes?.length || 0,
        },
        {
          accessorKey: "error",
          header: t("error", "Error"),
          cell: ({ row }) =>
            row.original.error ? (
              <span className="line-clamp-2 max-w-[320px] text-destructive text-xs">
                {row.original.error}
              </span>
            ) : (
              <span className="text-muted-foreground">-</span>
            ),
        },
      ]}
      header={{
        title: t("title", "Plugins"),
        toolbar: (
          <ConfirmButton
            cancelText={t("cancel", "Cancel")}
            confirmText={t("confirm", "Confirm")}
            description={t(
              "reloadAllDescription",
              "All running plugin instances will be stopped, the plugin directory will be scanned again, and allowed plugins will be loaded."
            )}
            onConfirm={async () => {
              await reloadAllPlugins();
              toast.success(t("reloadAllCompleted", "Reloaded plugins"));
              refresh();
            }}
            title={t("reloadAllTitle", "Reload all plugins?")}
            trigger={
              <Button variant="outline">
                <RotateCcw />
                {t("reloadAll", "Reload all")}
              </Button>
            }
          />
        ),
      }}
      params={[
        {
          key: "status",
          placeholder: t("status", "Status"),
          options: [
            { label: t("running", "Running"), value: "running" },
            { label: t("unloaded", "Unloaded"), value: "unloaded" },
            { label: t("error", "Error"), value: "error" },
          ],
        },
        {
          key: "q",
          placeholder: t("search", "Search"),
        },
      ]}
      request={async (pagination, filters) => {
        const { data } = await getPluginList({
          page: pagination.page,
          size: pagination.size,
          q: filters.q,
          status: filters.status,
        });
        return {
          list: data.data?.list || [],
          total: data.data?.total || 0,
        };
      }}
    />
  );
}

function PluginDetailDialog({ plugin }: { plugin: PluginInfo }) {
  const { t } = useTranslation("plugin");
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<PluginDetailData | null>(null);

  const loadDetail = async () => {
    const [manifest, health, routes, middlewares, events] = await Promise.all([
      getPluginManifest(plugin.name),
      getPluginHealth(plugin.name),
      getPluginRoutes(plugin.name),
      getPluginMiddlewares(plugin.name),
      getPluginEvents(plugin.name),
    ]);
    setDetail({
      manifest: manifest.data.data,
      health: health.data.data,
      routes: routes.data.data || [],
      middlewares: middlewares.data.data || [],
      events: events.data.data || [],
    });
  };

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          loadDetail().catch(() => setDetail(null));
        }
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Eye />
          {t("detail", "Detail")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[86vh] max-w-5xl">
        <DialogHeader>
          <DialogTitle>{plugin.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[72vh] pr-4">
          <div className="grid gap-5">
            <section className="grid gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={statusVariant[plugin.status] || "outline"}>
                  {plugin.status}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  {plugin.version || "-"}
                </span>
                <span className="text-muted-foreground text-sm">
                  {plugin.author || "-"}
                </span>
              </div>
              {plugin.error ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-destructive text-sm">
                  {plugin.error}
                </div>
              ) : null}
            </section>

            <Separator />

            <section className="grid gap-3 md:grid-cols-4">
              <Metric
                label={t("ready", "Ready")}
                value={detail?.health?.ready ? t("yes", "Yes") : t("no", "No")}
              />
              <Metric
                label={t("poolSize", "Pool Size")}
                value={detail?.health?.pool_size ?? "-"}
              />
              <Metric
                label={t("asyncInflight", "Async In-flight")}
                value={`${detail?.health?.async_in_flight ?? 0}/${detail?.health?.async_limit ?? 0}`}
              />
              <Metric
                label={t("registeredRoutes", "Registered Routes")}
                value={detail?.health?.registered_route ?? 0}
              />
            </section>

            <Separator />

            <DetailSection title={t("manifest", "Manifest")}>
              <pre className="max-h-72 overflow-auto rounded-md bg-muted p-3 text-xs">
                {JSON.stringify(detail?.manifest || {}, null, 2)}
              </pre>
            </DetailSection>

            <DetailSection title={t("runtimeRoutes", "Runtime Routes")}>
              <RuntimeList
                emptyText={t("noRoutes", "No runtime routes")}
                items={detail?.routes.map((item) => ({
                  key: `${item.Method}:${item.Path}`,
                  title: `${item.Method} ${item.Path}`,
                  description: item.Handler,
                  meta: item.Middleware?.join(", "),
                }))}
              />
            </DetailSection>

            <DetailSection
              title={t("runtimeMiddlewares", "Runtime Middlewares")}
            >
              <RuntimeList
                emptyText={t("noMiddlewares", "No runtime middlewares")}
                items={detail?.middlewares.map((item) => ({
                  key: item.Name,
                  title: item.Name,
                  description: item.Handler,
                }))}
              />
            </DetailSection>

            <DetailSection
              title={t("eventSubscriptions", "Event Subscriptions")}
            >
              <RuntimeList
                emptyText={t("noEvents", "No event subscriptions")}
                items={detail?.events.map((item) => ({
                  key: `${item.Event}:${item.Handler}`,
                  title: item.Event,
                  description: item.Handler,
                }))}
              />
            </DetailSection>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-muted-foreground text-xs">{label}</div>
      <div className="mt-1 font-medium text-sm">{value}</div>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-2">
      <h3 className="font-medium text-sm">{title}</h3>
      {children}
    </section>
  );
}

function RuntimeList({
  items,
  emptyText,
}: {
  items?: Array<{
    key: string;
    title: string;
    description?: string;
    meta?: string;
  }>;
  emptyText: string;
}) {
  if (!items?.length) {
    return <div className="text-muted-foreground text-sm">{emptyText}</div>;
  }

  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <div className="rounded-md border p-3" key={item.key}>
          <div className="font-medium text-sm">{item.title}</div>
          {item.description ? (
            <div className="mt-1 text-muted-foreground text-xs">
              {item.description}
            </div>
          ) : null}
          {item.meta ? (
            <div className="mt-2 text-muted-foreground text-xs">
              {item.meta}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
