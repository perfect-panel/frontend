import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { ConfirmButton } from "@workspace/ui/composed/confirm-button";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/pro-table";
import {
  batchDeleteDocument,
  createDocument,
  deleteDocument,
  getDocumentList,
  updateDocument,
} from "@workspace/ui/services/admin/document";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DateCell } from "@/components/date-cell";
import SiteContent from "@/sections/site-content";
import DocumentForm from "./document-form";

function CustomDocumentList() {
  const { t } = useTranslation("document");
  const [loading, setLoading] = useState(false);
  const ref = useRef<ProTableActions>(null);

  return (
    <ProTable<API.Document, { tag: string; search: string }>
      action={ref}
      actions={{
        render(row) {
          return [
            <DocumentForm<API.UpdateDocumentRequest>
              initialValues={row}
              key="edit"
              loading={loading}
              onSubmit={async (values) => {
                setLoading(true);
                try {
                  await updateDocument({
                    ...row,
                    ...values,
                  });
                  toast.success(t("updateSuccess", "Updated successfully"));
                  ref.current?.refresh();
                  return true;
                } catch {
                  return false;
                } finally {
                  setLoading(false);
                }
              }}
              title={t("editDocument", "Edit Document")}
              trigger={t("edit", "Edit")}
            />,
            <ConfirmButton
              cancelText={t("cancel", "Cancel")}
              confirmText={t("confirm", "Confirm")}
              description={t(
                "deleteDescription",
                "Are you sure you want to delete this document? This action cannot be undone."
              )}
              key="delete"
              onConfirm={async () => {
                await deleteDocument({
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
                "Are you sure you want to delete this document? This action cannot be undone."
              )}
              key="delete"
              onConfirm={async () => {
                await batchDeleteDocument({
                  ids: rows.map((item) => item.id),
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
      }}
      columns={[
        {
          accessorKey: "show",
          header: t("show", "Show"),
          cell: ({ row }) => (
            <Switch
              defaultChecked={row.getValue("show")}
              onCheckedChange={async (checked) => {
                await updateDocument({
                  ...row.original,
                  show: checked,
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
          accessorKey: "tags",
          header: t("tags", "Tags"),
          cell: ({ row }) => row.original.tags.join(", "),
        },
        {
          accessorKey: "updated_at",
          header: t("updatedAt", "Updated At"),
          cell: ({ row }) => (
            <DateCell ts={row.getValue("updated_at") as number} />
          ),
        },
      ]}
      header={{
        title: t("DocumentList", "Document List"),
        toolbar: (
          <DocumentForm<API.CreateDocumentRequest>
            key="create"
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await createDocument({
                  ...values,
                  show: false,
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
            title={t("createDocument", "Create Document")}
            trigger={t("create", "Create")}
          />
        ),
      }}
      params={[
        {
          key: "search",
        },
        {
          key: "tag",
          placeholder: t("tags", "Tags"),
        },
      ]}
      request={async (pagination, filter) => {
        const { data } = await getDocumentList({ ...pagination, ...filter });
        return {
          list: data.data?.list || [],
          total: data.data?.total || 0,
        };
      }}
    />
  );
}

export default function Page() {
  const { t } = useTranslation("document");
  return (
    <Tabs defaultValue="documents">
      <TabsList className="mb-4">
        <TabsTrigger value="documents">
          {t("tabDocuments", "Documents")}
        </TabsTrigger>
        <TabsTrigger value="site-content">
          {t("tabSiteContent", "Site Content (Terms / Tutorials)")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="documents">
        <CustomDocumentList />
      </TabsContent>
      <TabsContent value="site-content">
        <SiteContent />
      </TabsContent>
    </Tabs>
  );
}
