import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import { ConfirmButton } from "@workspace/ui/composed/confirm-button";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/pro-table";
import {
  postAds as createAds,
  deleteAds,
  getAdsList,
  putAds as updateAds,
} from "@workspace/ui/services/admin/admin";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { formatDate } from "@/utils/common";
import AdsForm from "./ads-form";

export default function Ads() {
  const { t } = useTranslation("ads");
  const [loading, setLoading] = useState(false);
  const ref = useRef<ProTableActions>(null);

  return (
    <ProTable<API.Ads, Record<string, unknown>>
      action={ref}
      actions={{
        render: (row) => [
          <AdsForm<API.UpdateAdsRequest>
            initialValues={row}
            key="edit"
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await updateAds({ ...row, ...values });
                toast.success(t("updateSuccess", "Updated successfully"));
                ref.current?.refresh();
                return true;
              } catch {
                return false;
              } finally {
                setLoading(false);
              }
            }}
            title={t("editAds", "Edit Ad")}
            trigger={t("edit", "Edit")}
          />,
          <ConfirmButton
            cancelText={t("cancel", "Cancel")}
            confirmText={t("confirm", "Confirm")}
            description={t(
              "deleteWarning",
              "Are you sure you want to delete this ad? This action cannot be undone."
            )}
            key="delete"
            onConfirm={async () => {
              await deleteAds({ id: row.id });
              toast.success(t("deleteSuccess", "Deleted successfully"));
              ref.current?.refresh();
            }}
            title={t("confirmDelete", "Confirm Delete")}
            trigger={
              <Button variant="destructive">{t("delete", "Delete")}</Button>
            }
          />,
        ],
      }}
      columns={[
        {
          accessorKey: "status",
          header: t("status", "Status"),
          cell: ({ row }) => (
            <Switch
              defaultChecked={row.getValue("status") === 1}
              onCheckedChange={async (checked) => {
                await updateAds({
                  ...row.original,
                  status: checked ? 1 : 0,
                });
                ref.current?.refresh();
              }}
            />
          ),
        },
        {
          accessorKey: "title",
          header: t("title", "Title"),
        },
        {
          accessorKey: "type",
          header: t("type", "Type"),
          cell: ({ row }) => {
            const type = row.original.type;
            return <Badge>{type}</Badge>;
          },
        },
        {
          accessorKey: "target_url",
          header: t("targetUrl", "Target URL"),
        },
        {
          accessorKey: "description",
          header: t("form.description", "Description"),
        },
        {
          accessorKey: "period",
          header: t("validityPeriod", "Validity Period"),
          cell: ({ row }) => {
            const { start_time, end_time } = row.original;
            return (
              <>
                {formatDate(start_time)} - {formatDate(end_time)}
              </>
            );
          },
        },
      ]}
      header={{
        toolbar: (
          <AdsForm<API.CreateAdsRequest>
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await createAds({
                  ...values,
                  status: 0,
                });
                toast.success(t("createSuccess", "Created successfully"));
                ref.current?.refresh();
                return true;
              } catch {
                return false;
              } finally {
                setLoading(false);
              }
            }}
            title={t("createAds", "Create Ad")}
            trigger={t("create", "Create")}
          />
        ),
      }}
      params={[
        {
          key: "status",
          placeholder: t("status", "Status"),
          options: [
            { label: t("enabled", "Enabled"), value: "1" },
            { label: t("disabled", "Disabled"), value: "0" },
          ],
        },
        {
          key: "search",
        },
      ]}
      request={async (pagination, filters) => {
        const { data } = await getAdsList({
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
