import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import { ConfirmButton } from "@workspace/ui/composed/confirm-button";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/pro-table";
import {
  postAnnouncement as createAnnouncement,
  deleteAnnouncement,
  getAnnouncementList,
  putAnnouncement as updateAnnouncement,
} from "@workspace/ui/services/admin/admin";
import { format } from "date-fns";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import NoticeForm from "./notice-form";

export default function Page() {
  const { t } = useTranslation("announcement");
  const [loading, setLoading] = useState(false);
  const ref = useRef<ProTableActions>(null);

  return (
    <ProTable<API.Announcement, { enable: boolean; search: string }>
      action={ref}
      actions={{
        render(row) {
          return [
            <NoticeForm<API.Announcement>
              initialValues={row}
              key="edit"
              loading={loading}
              onSubmit={async (values) => {
                setLoading(true);
                try {
                  await updateAnnouncement({
                    ...row,
                    ...values,
                  });
                  toast.success(t("updateSuccess", "Updated successfully"));
                  ref.current?.refresh();
                  setLoading(false);
                  return true;
                } catch {
                  setLoading(false);
                  return false;
                }
              }}
              title={t("editAnnouncement", "Edit Announcement")}
              trigger={t("edit", "Edit")}
            />,
            <ConfirmButton
              cancelText={t("cancel", "Cancel")}
              confirmText={t("confirm", "Confirm")}
              description={t(
                "deleteDescription",
                "This action cannot be undone."
              )}
              key="delete"
              onConfirm={async () => {
                await deleteAnnouncement({
                  id: row.id,
                });
                toast.success(t("deleteSuccess", "Deleted successfully"));
                ref.current?.refresh();
              }}
              title={t("confirmDelete", "Confirm Delete")}
              trigger={
                <Button variant="destructive">{t("delete", "Delete")}</Button>
              }
            />,
          ];
        },
        batchRender(rows) {
          return [
            <ConfirmButton
              cancelText={t("cancel", "Cancel")}
              confirmText={t("confirm", "Confirm")}
              description={t(
                "deleteDescription",
                "This action cannot be undone."
              )}
              key="delete"
              onConfirm={async () => {
                for (const element of rows) {
                  await deleteAnnouncement({
                    id: element.id!,
                  });
                }
                toast.success(t("deleteSuccess", "Deleted successfully"));
                ref.current?.refresh();
              }}
              title={t("confirmDelete", "Confirm Delete")}
              trigger={
                <Button variant="destructive">{t("delete", "Delete")}</Button>
              }
            />,
          ];
        },
      }}
      columns={[
        {
          accessorKey: "show",
          header: t("show", "Show"),
          cell: ({ row }) => (
            <Switch
              defaultChecked={row.getValue("show")}
              onCheckedChange={async (checked) => {
                await updateAnnouncement({
                  ...row.original,
                  show: checked,
                });
                ref.current?.refresh();
              }}
            />
          ),
        },
        {
          accessorKey: "pinned",
          header: t("pinned", "Pinned"),
          cell: ({ row }) => (
            <Switch
              defaultChecked={row.getValue("pinned")}
              onCheckedChange={async (checked) => {
                await updateAnnouncement({
                  ...row.original,
                  pinned: checked,
                });
                ref.current?.refresh();
              }}
            />
          ),
        },
        {
          accessorKey: "popup",
          header: t("popup", "Popup"),
          cell: ({ row }) => (
            <Switch
              defaultChecked={row.getValue("popup")}
              onCheckedChange={async (checked) => {
                await updateAnnouncement({
                  ...row.original,
                  popup: checked,
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
          accessorKey: "content",
          header: t("content", "Content"),
        },
        {
          accessorKey: "updated_at",
          header: t("updatedAt", "Updated At"),
          cell: ({ row }) =>
            format(row.getValue("updated_at"), "yyyy-MM-dd HH:mm:ss"),
        },
      ]}
      header={{
        title: t("announcementList", "Announcement List"),
        toolbar: (
          <NoticeForm<API.CreateAnnouncementRequest>
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await createAnnouncement(values);
                toast.success(t("createSuccess", "Created successfully"));
                ref.current?.refresh();
                setLoading(false);
                return true;
              } catch {
                setLoading(false);
                return false;
              }
            }}
            title={t("createAnnouncement", "Create Announcement")}
            trigger={t("create", "Create")}
          />
        ),
      }}
      params={[
        {
          key: "enable",
          placeholder: t("enable", "Enable"),
          options: [
            { label: t("show", "Show"), value: "false" },
            { label: t("hide", "Hide"), value: "true" },
          ],
        },
        { key: "search" },
      ]}
      request={async (pagination, filter) => {
        const { data } = await getAnnouncementList({
          ...pagination,
          ...filter,
        });
        return {
          list: data.data?.list || [],
          total: data.data?.total || 0,
        };
      }}
    />
  );
}
