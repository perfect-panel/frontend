"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet";
import { Switch } from "@workspace/ui/components/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { ConfirmButton } from "@workspace/ui/composed/confirm-button";
import { GoTemplateEditor } from "@workspace/ui/composed/editor/index";
import { EnhancedInput } from "@workspace/ui/composed/enhanced-input";
import { Icon } from "@workspace/ui/composed/icon";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/index";
import { UploadImage } from "@workspace/ui/composed/upload-image";
import {
  createSubscribeApplication,
  deleteSubscribeApplication,
  getSubscribeApplicationList,
  updateSubscribeApplication,
} from "@workspace/ui/services/admin/application";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { subscribeSchema } from "./schema";
import { TemplatePreview } from "./template-preview";
import { TutorialTab } from "./tutorial-tab";

const createClientFormSchema = (t: any) =>
  z.object({
    name: z
      .string()
      .min(1, t("form.validation.nameRequired", "Client name is required")),
    description: z.string().optional(),
    icon: z.string().optional(),
    user_agent: z
      .string()
      .min(
        1,
        `User-Agent ${t("form.validation.userAgentRequiredSuffix", "is required")}`
      ),
    scheme: z.string().optional(),
    template: z.string(),
    output_format: z.string(),
    download_link: z.object({
      windows: z.string().optional(),
      mac: z.string().optional(),
      linux: z.string().optional(),
      ios: z.string().optional(),
      android: z.string().optional(),
      harmony: z.string().optional(),
    }),
    // V4.3 决策 25:关联到 site_content.content_key 的教程
    tutorial_key: z.string().optional(),
  });

type ClientFormData = z.infer<ReturnType<typeof createClientFormSchema>>;

export function ProtocolForm() {
  const { t } = useTranslation("subscribe");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingClient, setEditingClient] =
    useState<API.SubscribeApplication | null>(null);
  const tableRef = useRef<ProTableActions>(null);

  const clientFormSchema = createClientFormSchema(t);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
      user_agent: "",
      scheme: "",
      template: "",
      output_format: "",
      download_link: {
        windows: "",
        mac: "",
        linux: "",
        ios: "",
        android: "",
        harmony: "",
      },
      tutorial_key: "",
    },
  });

  const request = async (
    pagination: { page: number; size: number },
    _filter: Record<string, unknown>
  ) => {
    const { data } = await getSubscribeApplicationList({
      page: pagination.page,
      size: pagination.size,
    });

    return {
      list: data.data?.list || [],
      total: data.data?.total || 0,
    };
  };

  const columns: ColumnDef<API.SubscribeApplication, any>[] = [
    {
      // V4.3:列名「默认」改为「启用」,Switch 控制 enabled 字段。
      // 关闭后该客户端不会出现在用户端的客户端列表里(管理端 + UA 命中仍可用)。
      accessorKey: "enabled",
      header: t("table.columns.enabled", "Enabled"),
      cell: ({ row }) => (
        <Switch
          checked={row.original.enabled !== false}
          onCheckedChange={async (checked) => {
            await updateSubscribeApplication({
              ...row.original,
              enabled: checked,
            });
            tableRef.current?.refresh();
          }}
        />
      ),
    },
    {
      accessorKey: "name",
      header: t("table.columns.name", "Client Name"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.icon && (
            <div className="relative h-6 w-6 flex-shrink-0">
              <img
                alt={row.original.name}
                className="h-full w-full rounded object-contain"
                height={24}
                onError={() => {
                  console.log(`Failed to load image for ${row.original.name}`);
                }}
                src={row.original.icon}
                width={24}
              />
            </div>
          )}
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "user_agent",
      header: "User-Agent",
      cell: ({ row }) => (
        <div className="max-w-[150px] truncate font-mono text-muted-foreground text-sm">
          {row.original.user_agent}
        </div>
      ),
    },
    {
      accessorKey: "output_format",
      header: t("table.columns.outputFormat", "Output Format"),
      cell: ({ row }) => (
        <Badge className="text-xs" variant="secondary">
          {t(
            `outputFormats.${row.original.output_format}`,
            row.original.output_format
          ) || row.original.output_format}
        </Badge>
      ),
    },
    {
      accessorKey: "download_link",
      header: t("table.columns.supportedPlatforms", "Supported Platforms"),
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {Object.entries(row.original.download_link || {}).map(
            ([key, value]) => {
              if (value) {
                return (
                  <Badge className="text-xs" key={key} variant="secondary">
                    {t(`platforms.${key}`, key)}
                  </Badge>
                );
              }
              return null;
            }
          )}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: t("table.columns.description", "Description"),
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="max-w-[200px] truncate text-muted-foreground text-sm">
                {row.original.description}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{row.original.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingClient(null);
    form.reset({
      name: "",
      description: "",
      icon: "",
      user_agent: "",
      scheme: "",
      template: "",
      output_format: "",
      download_link: {
        windows: "",
        mac: "",
        linux: "",
        ios: "",
        android: "",
        harmony: "",
      },
      tutorial_key: "",
    });
    setOpen(true);
  };

  const handleEdit = (client: API.SubscribeApplication) => {
    setEditingClient(client);
    form.reset({
      ...client,
      download_link: client.download_link || {
        windows: "",
        mac: "",
        linux: "",
        ios: "",
        android: "",
        harmony: "",
      },
      tutorial_key: client.tutorial_key || "",
    });
    setOpen(true);
  };

  const handleDelete = async (client: API.SubscribeApplication) => {
    setLoading(true);
    try {
      await deleteSubscribeApplication({ id: client.id });
      tableRef.current?.refresh();
      toast.success(t("actions.deleteSuccess", "Deleted successfully"));
    } catch (error) {
      console.error("Failed to delete client:", error);
      toast.error(t("actions.deleteFailed", "Delete failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleBatchDelete = async (clients: API.SubscribeApplication[]) => {
    setLoading(true);
    try {
      await Promise.all(
        clients.map((client) => deleteSubscribeApplication({ id: client.id }))
      );
      tableRef.current?.refresh();
      toast.success(
        t(
          "actions.batchDeleteSuccess",
          "Successfully deleted {count} clients",
          { count: clients.length }
        )
      );
    } catch (error) {
      console.error("Failed to batch delete clients:", error);
      toast.error(t("actions.deleteFailed", "Delete failed"));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ClientFormData) => {
    setLoading(true);
    try {
      if (editingClient) {
        await updateSubscribeApplication({
          ...data,
          is_default: editingClient.is_default,
          // Preserve current enabled state — it's flipped via the row Switch,
          // not via the Sheet form, so don't let an undefined form value
          // accidentally overwrite it.
          enabled: editingClient.enabled !== false,
          id: editingClient.id,
        });
        toast.success(t("actions.updateSuccess", "Updated successfully"));
      } else {
        await createSubscribeApplication({
          ...data,
          is_default: false,
          // New clients default to enabled (visible to users).
          enabled: true,
        });
        toast.success(t("actions.createSuccess", "Created successfully"));
      }

      setOpen(false);
      tableRef.current?.refresh();
    } catch (error) {
      console.error("Failed to save client:", error);
      toast.error(t("actions.saveFailed", "Save failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ProTable<API.SubscribeApplication, Record<string, unknown>>
        action={tableRef}
        actions={{
          render: (row: API.SubscribeApplication) => [
            <TemplatePreview
              applicationId={row.id}
              key="preview"
              output_format={row.output_format}
            />,
            <Button
              key="edit"
              onClick={() =>
                handleEdit(row as unknown as API.SubscribeApplication)
              }
            >
              {t("actions.edit", "Edit")}
            </Button>,
            <ConfirmButton
              cancelText={t("actions.cancel", "Cancel")}
              confirmText={t("actions.confirm", "Confirm")}
              description={t(
                "actions.deleteWarning",
                "This operation cannot be undone. Are you sure you want to delete this client?"
              )}
              key="delete"
              onConfirm={() =>
                handleDelete(row as unknown as API.SubscribeApplication)
              }
              title={t("actions.confirmDelete", "Confirm Delete")}
              trigger={
                <Button disabled={loading} variant="destructive">
                  {t("actions.delete", "Delete")}
                </Button>
              }
            />,
          ],
          batchRender: (rows: API.SubscribeApplication[]) => [
            <ConfirmButton
              cancelText={t("actions.cancel", "Cancel")}
              confirmText={t("actions.confirm", "Confirm")}
              description={t(
                "actions.batchDeleteWarning",
                "Are you sure you want to delete the selected {count} clients?",
                {
                  count: rows.length,
                }
              )}
              key="batchDelete"
              onConfirm={() =>
                handleBatchDelete(rows as unknown as API.SubscribeApplication[])
              }
              title={t("actions.confirmDelete", "Confirm Delete")}
              trigger={
                <Button variant="destructive">
                  {t("actions.batchDelete", "Batch Delete")}
                </Button>
              }
            />,
          ],
        }}
        columns={columns}
        header={{
          title: (
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">
                {t("protocol.title", "Client Management")}
              </h2>
              <a
                className="inline-flex items-center gap-2 rounded-md px-3 py-1 font-medium text-primary text-sm hover:underline"
                href="https://github.com/perfect-panel/subscription-template"
                rel="noreferrer noopener"
                target="_blank"
              >
                <Icon className="h-4 w-4" icon="mdi:github" />
                <span>Template Repo</span>
                <Icon
                  className="h-4 w-4 text-muted-foreground"
                  icon="mdi:open-in-new"
                />
              </a>
            </div>
          ),
          toolbar: (
            <Button onClick={handleAdd}>{t("actions.add", "Add")}</Button>
          ),
        }}
        request={request}
      />

      <Sheet onOpenChange={setOpen} open={open}>
        <SheetContent className="w-[580px] max-w-full md:max-w-screen-md">
          <SheetHeader>
            <SheetTitle>
              {editingClient
                ? t("form.editTitle", "Edit Client")
                : t("form.addTitle", "Add Client")}
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100dvh-48px-36px-36px)] px-6">
            <Form {...form}>
              <form className="space-y-6 py-4">
                <Tabs className="w-full" defaultValue="basic">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">
                      {t("form.tabs.basic", "Basic Info")}
                    </TabsTrigger>
                    <TabsTrigger value="template">
                      {t("form.tabs.template", "Templates")}
                    </TabsTrigger>
                    <TabsTrigger value="tutorial">
                      {t("form.tabs.tutorial", "Tutorial")}
                    </TabsTrigger>
                    <TabsTrigger value="download">
                      {t("form.tabs.download", "Downloads")}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent className="space-y-4" value="basic">
                    <FormField
                      control={form.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.fields.icon", "Icon")}</FormLabel>
                          <FormControl>
                            <EnhancedInput
                              onValueChange={(value) => {
                                form.setValue(field.name, value as string);
                              }}
                              placeholder="https://example.com/icon.png"
                              suffix={
                                <UploadImage
                                  className="h-9 rounded-none border-none bg-muted px-2"
                                  onChange={(value) => {
                                    form.setValue(field.name, value as string);
                                  }}
                                />
                              }
                              type="text"
                              value={field.value}
                            />
                          </FormControl>
                          <FormDescription>
                            {t(
                              "form.descriptions.icon",
                              "Icon URL or base64 encoding"
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.fields.name", "Name")}</FormLabel>
                          <FormControl>
                            <Input placeholder="Clash for Windows" {...field} />
                          </FormControl>
                          <FormDescription>
                            {t("form.descriptions.name", "Client display name")}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="user_agent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User-Agent</FormLabel>
                          <FormControl>
                            <Input placeholder="Clash" {...field} />
                          </FormControl>
                          <FormDescription>
                            {t(
                              "form.descriptions.userAgentPrefix",
                              "Client identifier for distinguishing different clients"
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("form.fields.description", "Description")}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t(
                                "form.descriptions.description",
                                "Detailed client description"
                              )}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {t(
                              "form.descriptions.description",
                              "Detailed client description"
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent className="space-y-4" value="template">
                    <FormField
                      control={form.control}
                      name="output_format"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("form.fields.outputFormat", "Output Format")}
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select ..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="base64">
                                  {t("outputFormats.base64", "Base64")}
                                </SelectItem>
                                <SelectItem value="yaml">
                                  {t("outputFormats.yaml", "YAML")}
                                </SelectItem>
                                <SelectItem value="json">
                                  {t("outputFormats.json", "JSON")}
                                </SelectItem>
                                <SelectItem value="conf">
                                  {t("outputFormats.conf", "CONF")}
                                </SelectItem>
                                <SelectItem value="plain">
                                  {t("outputFormats.plain", "Plain Text")}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            {t(
                              "form.descriptions.outputFormat",
                              "Subscription configuration file format"
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="scheme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            {t("form.fields.scheme", "URL Scheme")}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                >
                                  <Icon
                                    className="h-4 w-4 text-muted-foreground"
                                    icon="mdi:help-circle-outline"
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-md bg-secondary text-secondary-foreground"
                                  side="right"
                                >
                                  <div className="space-y-2 text-sm">
                                    <div className="font-medium">
                                      {t(
                                        "form.descriptions.scheme.title",
                                        "URL Scheme template"
                                      )}
                                    </div>

                                    <div>
                                      <div className="font-medium">
                                        {t(
                                          "form.descriptions.scheme.variables",
                                          "Supports variables:"
                                        )}
                                      </div>
                                      <ul className="ml-2 list-disc space-y-1 text-xs">
                                        <li>
                                          <code className="rounded px-1">
                                            {"${url}"}
                                          </code>{" "}
                                          -{" "}
                                          {t(
                                            "form.descriptions.scheme.urlVariable",
                                            "subscription URL"
                                          )}
                                        </li>
                                        <li>
                                          <code className="rounded px-1">
                                            {"${name}"}
                                          </code>{" "}
                                          -{" "}
                                          {t(
                                            "form.descriptions.scheme.nameVariable",
                                            "site name"
                                          )}
                                        </li>
                                      </ul>
                                    </div>

                                    <div>
                                      <div className="font-medium">
                                        {t(
                                          "form.descriptions.scheme.functions",
                                          "Supports functions:"
                                        )}
                                      </div>
                                      <ul className="ml-2 list-disc space-y-1 text-xs">
                                        <li>
                                          <code className="rounded px-1">
                                            {"${encodeURIComponent(...)}"}
                                          </code>{" "}
                                          -{" "}
                                          {t(
                                            "form.descriptions.scheme.urlEncoding",
                                            "URL encoding"
                                          )}
                                        </li>
                                        <li>
                                          <code className="rounded px-1">
                                            {"${window.btoa(...)}"}
                                          </code>{" "}
                                          -{" "}
                                          {t(
                                            "form.descriptions.scheme.base64Encoding",
                                            "Base64 encoding"
                                          )}
                                        </li>
                                        <li>
                                          <code className="rounded px-1">
                                            {"${JSON.stringify(...)}"}
                                          </code>{" "}
                                          -{" "}
                                          {t(
                                            "form.descriptions.scheme.jsonStringify",
                                            "JSON object to string"
                                          )}
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="clash://install-config?url=${url}&name=${name}"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="template"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            {t(
                              "form.fields.template",
                              "Subscription File Template"
                            )}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                >
                                  <Icon
                                    className="h-4 w-4 text-muted-foreground"
                                    icon="mdi:help-circle-outline"
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-md bg-secondary text-secondary-foreground"
                                  side="right"
                                >
                                  <div className="space-y-2 text-sm">
                                    <div className="font-medium">
                                      {t(
                                        "form.descriptions.template.title",
                                        "Go Template Syntax"
                                      )}
                                    </div>

                                    <div>
                                      <div className="font-medium">
                                        {t(
                                          "form.descriptions.template.variables",
                                          "Available variables:"
                                        )}
                                      </div>
                                      <ul className="ml-2 list-disc space-y-1 text-xs">
                                        <li>
                                          <code className="rounded px-1">
                                            .SiteName
                                          </code>{" "}
                                          -{" "}
                                          {t(
                                            "form.descriptions.template.siteName",
                                            "site name"
                                          )}
                                        </li>
                                        <li>
                                          <code className="rounded px-1">
                                            .SubscribeName
                                          </code>{" "}
                                          -{" "}
                                          {t(
                                            "form.descriptions.template.subscribeName",
                                            "subscription name"
                                          )}
                                        </li>
                                        <li>
                                          <code className="rounded px-1">
                                            .Proxies
                                          </code>{" "}
                                          -{" "}
                                          {t(
                                            "form.descriptions.template.nodes",
                                            "proxy nodes list"
                                          )}
                                        </li>
                                        <li>
                                          <code className="rounded px-1">
                                            .UserInfo
                                          </code>{" "}
                                          -{" "}
                                          {t(
                                            "form.descriptions.template.userInfo",
                                            "user info (traffic, expiry, etc.)"
                                          )}
                                        </li>
                                      </ul>
                                    </div>

                                    <div>
                                      <div className="font-medium">
                                        {t(
                                          "form.descriptions.template.functions",
                                          "Template functions:"
                                        )}
                                      </div>
                                      <ul className="ml-2 list-disc space-y-1 text-xs">
                                        <li>
                                          <code className="rounded px-1">
                                            {"{{range .Proxies}}...{{end}}"}
                                          </code>{" "}
                                          -{" "}
                                          {t(
                                            "form.descriptions.template.range",
                                            "iterate arrays"
                                          )}
                                        </li>
                                        <li>
                                          <code className="rounded px-1">
                                            {"{{if .condition}}...{{end}}"}
                                          </code>{" "}
                                          -{" "}
                                          {t(
                                            "form.descriptions.template.if",
                                            "conditional statements"
                                          )}
                                        </li>
                                        <li>
                                          <code className="rounded px-1">
                                            {"{{sprig_func}}"}
                                          </code>{" "}
                                          -{" "}
                                          {t(
                                            "form.descriptions.template.sprig",
                                            "Sprig function library (string processing, dates, etc.)"
                                          )}
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <GoTemplateEditor
                              enableSprig
                              onChange={(value: string | undefined) =>
                                field.onChange(value || "")
                              }
                              schema={subscribeSchema}
                              showLineNumbers
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent className="space-y-4" value="tutorial">
                    {/* V4.3 决策 25:多语言教程编辑,内容存到 site_content
                        表;语言跟随右上角全局切换器。 */}
                    <TutorialTab
                      clientName={form.watch("name")}
                      onKeyChange={(key) =>
                        form.setValue("tutorial_key", key, {
                          shouldDirty: true,
                        })
                      }
                      tutorialKey={form.watch("tutorial_key")}
                    />
                  </TabsContent>

                  <TabsContent className="space-y-4" value="download">
                    <div className="space-y-4">
                      <div className="grid gap-3">
                        {[
                          "windows",
                          "mac",
                          "linux",
                          "ios",
                          "android",
                          "harmony",
                        ].map((key) => (
                          <FormField
                            control={form.control}
                            key={key}
                            name={
                              `download_link.${key}` as `download_link.${keyof ClientFormData["download_link"]}`
                            }
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t(`platforms.${key}`, key)}
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                  {t(`platforms.${key}`, key)}{" "}
                                  {t(
                                    "form.descriptions.downloadLink",
                                    "platform download URL"
                                  )}
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </form>
            </Form>
          </ScrollArea>
          <SheetFooter className="flex-row justify-end gap-2 pt-3">
            <Button onClick={() => setOpen(false)} variant="outline">
              {t("actions.cancel", "Cancel")}
            </Button>
            <Button disabled={loading} onClick={form.handleSubmit(onSubmit)}>
              {loading && (
                <Icon className="mr-2 animate-spin" icon="mdi:loading" />
              )}
              {editingClient
                ? t("actions.update", "Update")
                : t("actions.add", "Add")}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
