"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { ConfirmButton } from "@workspace/ui/composed/confirm-button";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/pro-table";
import { cn } from "@workspace/ui/lib/utils";
import {
  createServer,
  deleteServer,
  filterServerList,
  resetSortWithServer,
  updateServer,
} from "@workspace/ui/services/admin/server";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useNode } from "@/stores/node";
import { useServer } from "@/stores/server";
import DirectListEditor from "./direct-list";
import DynamicMultiplier from "./dynamic-multiplier";
import { getLabel } from "./form-schema";
import OnlineUsersCell from "./online-users-cell";
import ServerConfig from "./server-config";
import ServerForm from "./server-form";
import ServerInstall from "./server-install";

function PctBar({ value }: { value: number }) {
  const v = value.toFixed(2);
  const widthClass =
    value >= 90
      ? "w-[90%]"
      : value >= 80
        ? "w-4/5"
        : value >= 70
          ? "w-[70%]"
          : value >= 60
            ? "w-3/5"
            : value >= 50
              ? "w-1/2"
              : value >= 40
                ? "w-2/5"
                : value >= 30
                  ? "w-[30%]"
                  : value >= 20
                    ? "w-1/5"
                    : value >= 10
                      ? "w-[10%]"
                      : "w-0";
  return (
    <div className="min-w-24">
      <div className="text-xs leading-none">{v}%</div>
      <div className="h-1.5 w-full rounded bg-muted">
        <div className={cn("h-1.5 rounded bg-primary", widthClass)} />
      </div>
    </div>
  );
}

function RegionIpCell({
  country,
  city,
  ip,
  notAvailableText,
}: {
  country?: string;
  city?: string;
  ip?: string;
  notAvailableText: string;
}) {
  const region =
    [country, city].filter(Boolean).join(" / ") || notAvailableText;
  return (
    <div className="flex items-center gap-1">
      <Badge variant="outline">{region}</Badge>
      <Badge variant="secondary">{ip || notAvailableText}</Badge>
    </div>
  );
}

export default function Servers() {
  const { t } = useTranslation("servers");
  const { isServerReferencedByNodes } = useNode();
  const { fetchServers } = useServer();

  const [loading, setLoading] = useState(false);
  const ref = useRef<ProTableActions>(null);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DynamicMultiplier />
        <ServerConfig />
      </div>
      <ProTable<API.Server, { search: string }>
        action={ref}
        actions={{
          render: (row) => [
            <ServerForm
              initialValues={row}
              key="edit"
              loading={loading}
              onSubmit={async (values) => {
                setLoading(true);
                try {
                  await updateServer({
                    id: row.id,
                    ...(values as unknown as Omit<
                      API.UpdateServerRequest,
                      "id"
                    >),
                  });
                  toast.success(t("updated", "Updated"));
                  ref.current?.refresh();
                  fetchServers();
                  setLoading(false);
                  return true;
                } catch {
                  setLoading(false);
                  return false;
                }
              }}
              title={t("drawerEditTitle", "Edit Server")}
              trigger={t("edit", "Edit")}
            />,
            <ServerInstall key="install" server={row} />,
            <DirectListEditor key="direct-list" serverId={row.id} />,
            <ConfirmButton
              cancelText={t("cancel", "Cancel")}
              confirmText={t("confirm", "Confirm")}
              description={t(
                "confirmDeleteDesc",
                "This action cannot be undone."
              )}
              key="delete"
              onConfirm={async () => {
                await deleteServer({ id: row.id } as API.DeleteServerRequest);
                toast.success(t("deleted", "Deleted"));
                ref.current?.refresh();
                fetchServers();
              }}
              title={t("confirmDeleteTitle", "Delete this server?")}
              trigger={
                <Button
                  disabled={isServerReferencedByNodes(row.id)}
                  variant="destructive"
                >
                  {t("delete", "Delete")}
                </Button>
              }
            />,
            <Button
              key="copy"
              onClick={async () => {
                setLoading(true);
                const {
                  id: _id,
                  created_at: _created_at,
                  updated_at: _updated_at,
                  last_reported_at: _last_reported_at,
                  status: _status,
                  ...others
                } = row as Record<string, unknown>;
                const body: API.CreateServerRequest = {
                  name: others.name as string,
                  country: others.country as string,
                  city: others.city as string,
                  address: others.address as string,
                  protocols: (others.protocols as API.Protocol[]) || [],
                };
                await createServer(body);
                toast.success(t("copied", "Copied"));
                ref.current?.refresh();
                fetchServers();
                setLoading(false);
              }}
              variant="outline"
            >
              {t("copy", "Copy")}
            </Button>,
          ],
          batchRender(rows) {
            const hasReferencedServers = rows.some((row) =>
              isServerReferencedByNodes(row.id)
            );
            return [
              <ConfirmButton
                cancelText={t("cancel", "Cancel")}
                confirmText={t("confirm", "Confirm")}
                description={t(
                  "confirmDeleteDesc",
                  "This action cannot be undone."
                )}
                key="delete"
                onConfirm={async () => {
                  await Promise.all(
                    rows.map((r) => deleteServer({ id: r.id }))
                  );
                  toast.success(t("deleted", "Deleted"));
                  ref.current?.refresh();
                  fetchServers();
                }}
                title={t("confirmDeleteTitle", "Delete this server?")}
                trigger={
                  <Button disabled={hasReferencedServers} variant="destructive">
                    {t("delete", "Delete")}
                  </Button>
                }
              />,
            ];
          },
        }}
        columns={[
          {
            accessorKey: "id",
            header: t("id", "ID"),
            cell: ({ row }) => <Badge>{row.getValue("id")}</Badge>,
          },
          { accessorKey: "name", header: t("name", "Name") },
          {
            id: "region_ip",
            header: t("address", "Address"),
            cell: ({ row }) => (
              <RegionIpCell
                city={row.original.city as unknown as string}
                country={row.original.country as unknown as string}
                ip={row.original.address as unknown as string}
                notAvailableText={t("notAvailable", "Not Available")}
              />
            ),
          },
          {
            accessorKey: "protocols",
            header: t("protocols", "Protocols"),
            cell: ({ row }) => {
              const list = row.original.protocols.filter(
                (p) => p.enable
              ) as API.Protocol[];
              if (!list.length) return "—";
              return (
                <div className="flex flex-col gap-1">
                  {list.map((p, idx) => {
                    const ratio = Number(p.ratio ?? 1) || 1;
                    return (
                      <div className="flex items-center gap-2" key={idx}>
                        <Badge variant="outline">{ratio.toFixed(2)}x</Badge>
                        <Badge variant="secondary">{getLabel(p.type)}</Badge>
                        <Badge variant="secondary">{p.port}</Badge>
                      </div>
                    );
                  })}
                </div>
              );
            },
          },

          {
            id: "status",
            header: t("status", "Status"),
            cell: ({ row }) => {
              const offline = row.original.status.status === "offline";
              return (
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-block h-2.5 w-2.5 rounded-full",
                      offline ? "bg-zinc-400" : "bg-emerald-500"
                    )}
                  />
                  <span className="text-sm">
                    {offline ? t("offline", "Offline") : t("online", "Online")}
                  </span>
                </div>
              );
            },
          },
          {
            id: "cpu",
            header: t("cpu", "CPU"),
            cell: ({ row }) => (
              <PctBar
                value={(row.original.status?.cpu as unknown as number) ?? 0}
              />
            ),
          },
          {
            id: "mem",
            header: t("memory", "Memory"),
            cell: ({ row }) => (
              <PctBar
                value={(row.original.status?.mem as unknown as number) ?? 0}
              />
            ),
          },
          {
            id: "disk",
            header: t("disk", "Disk"),
            cell: ({ row }) => (
              <PctBar
                value={(row.original.status?.disk as unknown as number) ?? 0}
              />
            ),
          },

          {
            id: "online_users",
            header: t("onlineUsers", "Online Users"),
            cell: ({ row }) => (
              <OnlineUsersCell
                status={row.original.status as API.ServerStatus}
              />
            ),
          },
        ]}
        header={{
          title: t("pageTitle", "Servers"),
          toolbar: (
            <div className="flex gap-2">
              <ServerForm
                loading={loading}
                onSubmit={async (values) => {
                  setLoading(true);
                  try {
                    await createServer(
                      values as unknown as API.CreateServerRequest
                    );
                    toast.success(t("created", "Created"));
                    ref.current?.refresh();
                    fetchServers();
                    setLoading(false);
                    return true;
                  } catch {
                    setLoading(false);
                    return false;
                  }
                }}
                title={t("drawerCreateTitle", "Create Server")}
                trigger={t("create", "Create")}
              />
            </div>
          ),
        }}
        onSort={async (source, target, items) => {
          const sourceIndex = items.findIndex(
            (item) => String(item.id) === source
          );
          const targetIndex = items.findIndex(
            (item) => String(item.id) === target
          );

          const originalSorts = items.map((item) => item.sort);

          const [movedItem] = items.splice(sourceIndex, 1);
          items.splice(targetIndex, 0, movedItem!);

          const updatedItems = items.map((item, index) => {
            const originalSort = originalSorts[index];
            const newSort =
              originalSort !== undefined ? originalSort : item.sort;
            return { ...item, sort: newSort };
          });

          const changedItems = updatedItems.filter(
            (item, index) => item.sort !== items[index]?.sort
          );

          if (changedItems.length > 0) {
            resetSortWithServer({
              sort: changedItems.map((item) => ({
                id: item.id,
                sort: item.sort,
              })) as API.SortItem[],
            });
            toast.success(t("sorted_success", "Sorted successfully"));
          }
          return updatedItems;
        }}
        params={[{ key: "search" }]}
        request={async (pagination, filter) => {
          const { data } = await filterServerList({
            page: pagination.page,
            size: pagination.size,
            search: filter?.search || undefined,
          });
          const list = (data?.data?.list || []) as API.Server[];
          const total = (data?.data?.total ?? list.length) as number;
          return { list, total };
        }}
      />
    </div>
  );
}
