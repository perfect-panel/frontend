"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import { ConfirmButton } from "@workspace/ui/composed/confirm-button";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/pro-table";
import {
  batchDeleteSubscribe,
  createSubscribe,
  deleteSubscribe,
  getSubscribeList,
  subscribeSort,
  updateSubscribe,
} from "@workspace/ui/services/admin/subscribe";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Display } from "@/components/display";
import { useSubscribe } from "@/stores/subscribe";
import SubscribeForm from "./subscribe-form";

export default function SubscribeTable() {
  const { t } = useTranslation("product");
  const [loading, setLoading] = useState(false);
  const ref = useRef<ProTableActions>(null);
  const { fetchSubscribes } = useSubscribe();
  return (
    <ProTable<API.SubscribeItem, { group_id: number; query: string }>
      action={ref}
      actions={{
        render: (row) => [
          <SubscribeForm<API.SubscribeItem>
            initialValues={row}
            key="edit"
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await updateSubscribe({
                  ...row,
                  ...values,
                } as API.UpdateSubscribeRequest);
                toast.success(t("updateSuccess"));
                ref.current?.refresh();
                fetchSubscribes();
                setLoading(false);
                return true;
              } catch {
                setLoading(false);

                return false;
              }
            }}
            title={t("editSubscribe")}
            trigger={t("edit")}
          />,
          <ConfirmButton
            cancelText={t("cancel")}
            confirmText={t("confirm")}
            description={t("deleteWarning")}
            key="delete"
            onConfirm={async () => {
              await deleteSubscribe({
                id: row.id!,
              });
              toast.success(t("deleteSuccess"));
              ref.current?.refresh();
              fetchSubscribes();
            }}
            title={t("confirmDelete")}
            trigger={<Button variant="destructive">{t("delete")}</Button>}
          />,
          <Button
            key="copy"
            onClick={async () => {
              setLoading(true);
              try {
                const {
                  id: _id,
                  sort: _sort,
                  sell: _sell,
                  updated_at: _updated_at,
                  created_at: _created_at,
                  ...params
                } = row;
                await createSubscribe({
                  ...params,
                  show: false,
                  sell: false,
                } as API.CreateSubscribeRequest);
                toast.success(t("copySuccess"));
                ref.current?.refresh();
                fetchSubscribes();
                setLoading(false);
                return true;
              } catch {
                setLoading(false);
                return false;
              }
            }}
            variant="secondary"
          >
            {t("copy")}
          </Button>,
        ],
        batchRender: (rows) => [
          <ConfirmButton
            cancelText={t("cancel")}
            confirmText={t("confirm")}
            description={t("deleteWarning")}
            key="delete"
            onConfirm={async () => {
              await batchDeleteSubscribe({
                ids: rows.map((item) => item.id) as number[],
              });

              toast.success(t("deleteSuccess"));
              ref.current?.reset();
              fetchSubscribes();
            }}
            title={t("confirmDelete")}
            trigger={<Button variant="destructive">{t("delete")}</Button>}
          />,
        ],
      }}
      columns={[
        {
          accessorKey: "show",
          header: t("show"),
          cell: ({ row }) => (
            <Switch
              defaultChecked={row.getValue("show")}
              onCheckedChange={async (checked) => {
                await updateSubscribe({
                  ...row.original,
                  show: checked,
                } as API.UpdateSubscribeRequest);
                ref.current?.refresh();
                fetchSubscribes();
              }}
            />
          ),
        },
        {
          accessorKey: "sell",
          header: t("sell"),
          cell: ({ row }) => (
            <Switch
              defaultChecked={row.getValue("sell")}
              onCheckedChange={async (checked) => {
                await updateSubscribe({
                  ...row.original,
                  sell: checked,
                } as API.UpdateSubscribeRequest);
                ref.current?.refresh();
                fetchSubscribes();
              }}
            />
          ),
        },
        {
          accessorKey: "name",
          header: t("name"),
        },
        {
          accessorKey: "unit_price",
          header: t("unitPrice"),
          cell: ({ row }) => (
            <>
              <Display type="currency" value={row.getValue("unit_price")} />/
              {t(
                row.original.unit_time
                  ? `form.${row.original.unit_time}`
                  : "form.Month"
              )}
            </>
          ),
        },
        {
          accessorKey: "replacement",
          header: t("replacement"),
          cell: ({ row }) => (
            <Display type="currency" value={row.getValue("replacement")} />
          ),
        },
        {
          accessorKey: "traffic",
          header: t("traffic"),
          cell: ({ row }) => (
            <Display type="traffic" unlimited value={row.getValue("traffic")} />
          ),
        },
        {
          accessorKey: "device_limit",
          header: t("deviceLimit"),
          cell: ({ row }) => (
            <Display
              type="number"
              unlimited
              value={row.getValue("device_limit")}
            />
          ),
        },
        {
          accessorKey: "inventory",
          header: t("inventory"),
          cell: ({ row }) => {
            const inventory = row.getValue("inventory") as number;
            return inventory === -1 ? (
              <Display type="number" unlimited value={0} />
            ) : (
              <Display type="number" unlimited value={inventory} />
            );
          },
        },
        {
          accessorKey: "quota",
          header: t("quota"),
          cell: ({ row }) => (
            <Display type="number" unlimited value={row.getValue("quota")} />
          ),
        },
        {
          accessorKey: "language",
          header: t("language"),
          cell: ({ row }) => {
            const language = row.getValue("language") as string;
            return language ? (
              <Badge variant="outline">{language}</Badge>
            ) : (
              "--"
            );
          },
        },
        {
          accessorKey: "sold",
          header: t("sold"),
          cell: ({ row }) => (
            <Badge variant="outline">{row.getValue("sold")}</Badge>
          ),
        },
      ]}
      header={{
        toolbar: (
          <SubscribeForm<API.CreateSubscribeRequest>
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await createSubscribe({
                  ...values,
                  show: false,
                  sell: false,
                });
                toast.success(t("createSuccess"));
                ref.current?.refresh();
                fetchSubscribes();
                setLoading(false);

                return true;
              } catch {
                setLoading(false);

                return false;
              }
            }}
            title={t("createSubscribe")}
            trigger={t("create")}
          />
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
          const newSort = originalSort !== undefined ? originalSort : item.sort;
          return { ...item, sort: newSort };
        });

        const changedItems = updatedItems.filter(
          (item, index) => item.sort !== items[index]?.sort
        );

        if (changedItems.length > 0) {
          await subscribeSort({
            sort: changedItems.map((item) => ({
              id: item.id,
              sort: item.sort,
            })) as API.SortItem[],
          });
          toast.success(t("sortSuccess", "Sort completed successfully"));
        }

        return updatedItems;
      }}
      params={[
        {
          key: "search",
        },
      ]}
      request={async (pagination, filters) => {
        const { data } = await getSubscribeList({
          ...pagination,
          ...filters,
        });
        return {
          list: data.data?.list || [],
          total: data.data?.total || 0,
        };
      }}
    />
  );
}
