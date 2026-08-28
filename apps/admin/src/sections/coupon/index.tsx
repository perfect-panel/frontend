import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import { ConfirmButton } from "@workspace/ui/composed/confirm-button";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/pro-table";
import {
  deleteCouponBatch as batchDeleteCoupon,
  postCoupon as createCoupon,
  deleteCoupon,
  getCouponList,
  putCoupon as updateCoupon,
} from "@workspace/ui/services/admin/admin";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Display } from "@/components/display";
import { useSubscribe } from "@/stores/subscribe";
import { formatDate } from "@/utils/common";
import CouponForm from "./coupon-form";

export default function Coupon() {
  const { t } = useTranslation("coupon");
  const [loading, setLoading] = useState(false);
  const { subscribes } = useSubscribe();
  const ref = useRef<ProTableActions>(null);
  return (
    <ProTable<API.Coupon, { group_id: number; query: string }>
      action={ref}
      actions={{
        render: (row) => [
          <CouponForm<API.UpdateCouponRequest>
            initialValues={row}
            key="edit"
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await updateCoupon({ ...row, ...values });
                toast.success(t("updateSuccess", "Update Success"));
                ref.current?.refresh();
                setLoading(false);
                return true;
              } catch (_error) {
                setLoading(false);
                return false;
              }
            }}
            title={t("editCoupon", "Edit Coupon")}
            trigger={t("edit", "Edit")}
          />,
          <ConfirmButton
            cancelText={t("cancel", "Cancel")}
            confirmText={t("confirm", "Confirm")}
            description={t(
              "deleteWarning",
              "Once deleted, data cannot be recovered. Please proceed with caution."
            )}
            key="delete"
            onConfirm={async () => {
              await deleteCoupon({ id: row.id });
              toast.success(t("deleteSuccess", "Delete Success"));
              ref.current?.refresh();
            }}
            title={t("confirmDelete", "Are you sure you want to delete?")}
            trigger={
              <Button variant="destructive">{t("delete", "Delete")}</Button>
            }
          />,
        ],
        batchRender: (rows) => [
          <ConfirmButton
            cancelText={t("cancel", "Cancel")}
            confirmText={t("confirm", "Confirm")}
            description={t(
              "deleteWarning",
              "Once deleted, data cannot be recovered. Please proceed with caution."
            )}
            key="delete"
            onConfirm={async () => {
              await batchDeleteCoupon({ ids: rows.map((item) => item.id) });
              toast.success(t("deleteSuccess", "Delete Success"));
              ref.current?.reset();
            }}
            title={t("confirmDelete", "Are you sure you want to delete?")}
            trigger={
              <Button variant="destructive">{t("delete", "Delete")}</Button>
            }
          />,
        ],
      }}
      columns={[
        {
          accessorKey: "enable",
          header: t("enable", "Enable"),
          cell: ({ row }) => (
            <Switch
              defaultChecked={row.getValue("enable")}
              onCheckedChange={async (checked) => {
                await updateCoupon({
                  ...row.original,
                  enable: checked,
                } as API.UpdateCouponRequest);
                ref.current?.refresh();
              }}
            />
          ),
        },
        {
          accessorKey: "name",
          header: t("name", "Name"),
        },
        {
          accessorKey: "code",
          header: t("code", "Code"),
        },
        {
          accessorKey: "type",
          header: t("type", "Type"),
          cell: ({ row }) => (
            <Badge
              variant={row.getValue("type") === 1 ? "default" : "secondary"}
            >
              {row.getValue("type") === 1
                ? t("percentage", "Percentage")
                : t("amount", "Amount")}
            </Badge>
          ),
        },
        {
          accessorKey: "discount",
          header: t("discount", "Discount"),
          cell: ({ row }) => (
            <Badge
              variant={row.getValue("type") === 1 ? "default" : "secondary"}
            >
              {row.getValue("type") === 1 ? (
                `${row.original.discount} %`
              ) : (
                <Display type="currency" value={row.original.discount} />
              )}
            </Badge>
          ),
        },
        {
          accessorKey: "count",
          header: t("count", "Count"),
          cell: ({ row }) => (
            <div className="flex flex-col">
              <span>
                {t("count", "Count")}:{" "}
                {row.original.count === 0
                  ? t("unlimited", "Unlimited")
                  : row.original.count}
              </span>
              <span>
                {t("remainingTimes", "Remaining")}:{" "}
                {row.original.count === 0
                  ? t("unlimited", "Unlimited")
                  : row.original.count - row.original.used_count}
              </span>
              <span>
                {t("usedTimes", "Usage Times")}: {row.original.used_count}
              </span>
            </div>
          ),
        },
        {
          accessorKey: "expire",
          header: t("validityPeriod", "Validity Period"),
          cell: ({ row }) => {
            const { start_time, expire_time } = row.original;
            if (start_time) {
              return expire_time ? (
                <>
                  {formatDate(start_time)} - {formatDate(expire_time)}
                </>
              ) : start_time ? (
                formatDate(start_time)
              ) : (
                "--"
              );
            }
            return "--";
          },
        },
      ]}
      header={{
        toolbar: (
          <CouponForm<API.CreateCouponRequest>
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await createCoupon({
                  ...values,
                  enable: false,
                });
                toast.success(t("createSuccess", "Create Success"));
                ref.current?.refresh();
                setLoading(false);
                return true;
              } catch (_error) {
                setLoading(false);
                return false;
              }
            }}
            title={t("createCoupon", "Create Coupon")}
            trigger={t("create", "Create")}
          />
        ),
      }}
      params={[
        {
          key: "subscribe",
          placeholder: t("subscribe", "Subscribe"),
          options: subscribes?.map((item) => ({
            label: item.name!,
            value: String(item.id),
          })),
        },
        {
          key: "search",
        },
      ]}
      request={async (pagination, filters) => {
        const { data } = await getCouponList({
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
