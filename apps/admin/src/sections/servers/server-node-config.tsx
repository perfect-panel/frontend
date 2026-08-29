"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
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
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Switch } from "@workspace/ui/components/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Textarea } from "@workspace/ui/components/textarea";
import { ArrayInput } from "@workspace/ui/composed/dynamic-Inputs";
import { Icon } from "@workspace/ui/composed/icon";
import { cn } from "@workspace/ui/lib/utils";
import {
  getServerNodeConfig,
  postServerNodeConfigUpdate as updateServerNodeConfig,
} from "@workspace/ui/services/admin/admin";
import { useEffect, useState } from "react";
import { type Control, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import {
  normalizeOutboundConfig,
  outboundConfigSchema,
} from "./outbound-config";
import { OutboundConfigInput } from "./outbound-config-input";

const dnsConfigSchema = z.object({
  proto: z.string(),
  address: z.string(),
  server_name: z.string().optional(),
  domains: z.array(z.string()),
});

const serverNodeConfigSchema = z.object({
  inherit_ip_strategy: z.boolean(),
  ip_strategy: z.enum(["prefer_ipv4", "prefer_ipv6"]),
  inherit_dns: z.boolean(),
  dns: z.array(dnsConfigSchema),
  inherit_block: z.boolean(),
  block: z.array(z.string()),
  inherit_outbound: z.boolean(),
  outbound: z.array(outboundConfigSchema),
});

type ServerNodeConfigFormData = z.infer<typeof serverNodeConfigSchema>;
type IPStrategy = ServerNodeConfigFormData["ip_strategy"];

function normalizeIPStrategy(value?: string): IPStrategy {
  return value === "prefer_ipv6" ? "prefer_ipv6" : "prefer_ipv4";
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function ToggleField({
  control,
  name,
  label,
  description,
  inheritedText,
  customText,
}: {
  control: Control<ServerNodeConfigFormData>;
  name:
    | "inherit_ip_strategy"
    | "inherit_dns"
    | "inherit_block"
    | "inherit_outbound";
  label: string;
  description: string;
  inheritedText: string;
  customText: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors",
            field.value ? "bg-muted/30" : "border-primary/30 bg-primary/5"
          )}
        >
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-sm">{label}</span>
              <Badge variant={field.value ? "secondary" : "outline"}>
                {field.value ? inheritedText : customText}
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">{description}</p>
          </div>
          <Switch
            aria-label={label}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        </div>
      )}
    />
  );
}

function InheritedPreview({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-dashed bg-muted/20 p-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary">
        <Icon
          className="size-4 text-muted-foreground"
          icon="mdi:source-branch-sync"
        />
      </div>
      <div className="space-y-1">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
    </div>
  );
}

function getFormValues(
  config: API.GetServerNodeConfigResponse
): ServerNodeConfigFormData {
  const { effective, override } = config;
  return {
    inherit_ip_strategy: override.inherit_ip_strategy,
    ip_strategy: normalizeIPStrategy(
      override.inherit_ip_strategy
        ? effective.ip_strategy
        : override.ip_strategy
    ),
    inherit_dns: override.inherit_dns,
    dns: override.inherit_dns ? effective.dns || [] : override.dns || [],
    inherit_block: override.inherit_block,
    block: override.inherit_block
      ? effective.block || []
      : override.block || [],
    inherit_outbound: override.inherit_outbound,
    outbound: override.inherit_outbound
      ? effective.outbound || []
      : override.outbound || [],
  };
}

export default function ServerNodeConfig({ server }: { server: API.Server }) {
  const { t } = useTranslation("servers");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    data: cfgResp,
    refetch,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["getServerNodeConfig", server.id],
    queryFn: async () => {
      const { data } = await getServerNodeConfig({ server_id: server.id });
      return data.data;
    },
    enabled: open,
    retry: false,
  });

  const form = useForm<ServerNodeConfigFormData>({
    resolver: zodResolver(serverNodeConfigSchema),
    defaultValues: {
      inherit_ip_strategy: true,
      ip_strategy: "prefer_ipv4",
      inherit_dns: true,
      dns: [],
      inherit_block: true,
      block: [],
      inherit_outbound: true,
      outbound: [],
    },
  });

  useEffect(() => {
    if (!cfgResp) return;
    form.reset(getFormValues(cfgResp));
  }, [cfgResp, form]);

  const inheritIPStrategy = form.watch("inherit_ip_strategy");
  const inheritDNS = form.watch("inherit_dns");
  const inheritOutbound = form.watch("inherit_outbound");
  const inheritBlock = form.watch("inherit_block");
  const { isDirty } = form.formState;

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen && cfgResp) {
      form.reset(getFormValues(cfgResp));
    }
    setOpen(nextOpen);
  }

  function getIPStrategyLabel(value?: string) {
    return value === "prefer_ipv6"
      ? t("server_config.fields.ip_strategy_ipv6", "Prefer IPv6")
      : t("server_config.fields.ip_strategy_ipv4", "Prefer IPv4");
  }

  async function onSubmit(values: ServerNodeConfigFormData) {
    setSaving(true);
    try {
      await updateServerNodeConfig({
        server_id: server.id,
        inherit_ip_strategy: values.inherit_ip_strategy,
        ip_strategy: values.ip_strategy,
        inherit_dns: values.inherit_dns,
        dns: values.dns,
        inherit_block: values.inherit_block,
        block: values.block,
        inherit_outbound: values.inherit_outbound,
        outbound: values.outbound.map((item) => normalizeOutboundConfig(item)),
      });
      toast.success(t("server_node_config.saveSuccess", "Saved successfully"));
      await refetch();
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet onOpenChange={handleOpenChange} open={open}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Icon className="mr-2 h-4 w-4" icon="mdi:tune-variant" />
          {t("server_node_config.trigger", "Node Config")}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full max-w-full gap-0 sm:max-w-4xl">
        <SheetHeader className="border-b pr-12">
          <SheetTitle>
            {t("server_node_config.title", "Node configuration overrides")}
          </SheetTitle>
          <SheetDescription>
            {t(
              "server_node_config.description",
              "Choose which global settings this server inherits and which ones it overrides."
            )}
          </SheetDescription>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge>{server.name}</Badge>
            <Badge variant="outline">#{server.id}</Badge>
            {server.address ? (
              <Badge variant="secondary">{server.address}</Badge>
            ) : null}
          </div>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="px-4 pb-4">
            {isLoading && !cfgResp ? (
              <div className="space-y-4 pt-4" role="status">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-40 w-full" />
                <span className="sr-only">
                  {t("server_node_config.loading", "Loading configuration")}
                </span>
              </div>
            ) : null}
            {isError || !(isLoading || cfgResp) ? (
              <Alert className="mt-4" variant="destructive">
                <Icon icon="mdi:alert-circle-outline" />
                <AlertTitle>
                  {t(
                    "server_node_config.loadErrorTitle",
                    "Unable to load configuration"
                  )}
                </AlertTitle>
                <AlertDescription>
                  <p>
                    {t(
                      "server_node_config.loadError",
                      "Nothing can be changed until the current server configuration is loaded."
                    )}
                  </p>
                  <Button onClick={() => refetch()} size="sm" variant="outline">
                    <Icon icon="mdi:refresh" />
                    {t("server_node_config.retry", "Retry")}
                  </Button>
                </AlertDescription>
              </Alert>
            ) : null}
            {cfgResp ? (
              <Tabs className="mt-4" defaultValue="dns">
                <TabsList className="grid h-auto w-full grid-cols-1 sm:grid-cols-3">
                  <TabsTrigger className="gap-2" value="dns">
                    <span>
                      {t("server_config.tabs.dns", "DNS Configuration")}
                    </span>
                    <Badge
                      className="px-1.5 py-0"
                      variant={
                        inheritIPStrategy && inheritDNS
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {inheritIPStrategy && inheritDNS
                        ? t("server_node_config.modeInherited", "Inherited")
                        : t("server_node_config.modeCustom", "Custom")}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger className="gap-2" value="outbound">
                    <span>
                      {t("server_config.tabs.outbound", "Outbound Rules")}
                    </span>
                    <Badge
                      className="px-1.5 py-0"
                      variant={inheritOutbound ? "secondary" : "outline"}
                    >
                      {inheritOutbound
                        ? t("server_node_config.modeInherited", "Inherited")
                        : t("server_node_config.modeCustom", "Custom")}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger className="gap-2" value="block">
                    <span>{t("server_config.tabs.block", "Block Rules")}</span>
                    <Badge
                      className="px-1.5 py-0"
                      variant={inheritBlock ? "secondary" : "outline"}
                    >
                      {inheritBlock
                        ? t("server_node_config.modeInherited", "Inherited")
                        : t("server_node_config.modeCustom", "Custom")}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <Form {...form}>
                  <form
                    className="space-y-4 pt-4"
                    id="server-node-config-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <TabsContent className="space-y-4" value="dns">
                      <section className="space-y-3">
                        <ToggleField
                          control={form.control}
                          customText={t(
                            "server_node_config.modeCustom",
                            "Custom"
                          )}
                          description={t(
                            "server_node_config.inherit_ip_strategy_desc",
                            "Turn this off to choose a different IP preference for this server."
                          )}
                          inheritedText={t(
                            "server_node_config.modeInherited",
                            "Inherited"
                          )}
                          label={t(
                            "server_node_config.inherit_ip_strategy",
                            "Use global IP strategy"
                          )}
                          name="inherit_ip_strategy"
                        />
                        {inheritIPStrategy ? (
                          <InheritedPreview
                            description={t(
                              "server_node_config.global_ip_strategy_summary",
                              "Current global value: {{value}}",
                              {
                                value: getIPStrategyLabel(
                                  cfgResp.global.ip_strategy
                                ),
                              }
                            )}
                            title={t(
                              "server_node_config.globalPreview",
                              "Using global configuration"
                            )}
                          />
                        ) : (
                          <FormField
                            control={form.control}
                            name="ip_strategy"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t(
                                    "server_config.fields.ip_strategy",
                                    "IP Strategy"
                                  )}
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={t(
                                          "server_config.fields.ip_strategy_placeholder",
                                          "Select IP strategy"
                                        )}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="prefer_ipv4">
                                      {t(
                                        "server_config.fields.ip_strategy_ipv4",
                                        "Prefer IPv4"
                                      )}
                                    </SelectItem>
                                    <SelectItem value="prefer_ipv6">
                                      {t(
                                        "server_config.fields.ip_strategy_ipv6",
                                        "Prefer IPv6"
                                      )}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </section>

                      <section className="space-y-3 border-t pt-4">
                        <ToggleField
                          control={form.control}
                          customText={t(
                            "server_node_config.modeCustom",
                            "Custom"
                          )}
                          description={t(
                            "server_node_config.inherit_dns_desc",
                            "Turn this off to maintain a DNS list only for this server."
                          )}
                          inheritedText={t(
                            "server_node_config.modeInherited",
                            "Inherited"
                          )}
                          label={t(
                            "server_node_config.inherit_dns",
                            "Use global DNS configuration"
                          )}
                          name="inherit_dns"
                        />
                        {inheritDNS ? (
                          <InheritedPreview
                            description={t(
                              "server_node_config.global_dns_summary",
                              "{{count}} DNS entries are provided by the global configuration.",
                              { count: cfgResp.global.dns?.length || 0 }
                            )}
                            title={t(
                              "server_node_config.globalPreview",
                              "Using global configuration"
                            )}
                          />
                        ) : (
                          <FormField
                            control={form.control}
                            name="dns"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t(
                                    "server_config.fields.dns_config",
                                    "DNS Configuration"
                                  )}
                                </FormLabel>
                                <FormControl>
                                  <ArrayInput
                                    className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                                    fields={[
                                      {
                                        name: "proto",
                                        type: "select",
                                        placeholder: t(
                                          "server_config.fields.dns_proto_placeholder",
                                          "Select type"
                                        ),
                                        options: [
                                          { label: "TCP", value: "tcp" },
                                          { label: "UDP", value: "udp" },
                                          { label: "TLS", value: "tls" },
                                          { label: "HTTPS", value: "https" },
                                          { label: "QUIC", value: "quic" },
                                        ],
                                      },
                                      {
                                        name: "address",
                                        type: "text",
                                        placeholder: "8.8.8.8:53",
                                      },
                                      {
                                        name: "server_name",
                                        type: "text",
                                        placeholder: t(
                                          "server_config.fields.dns_server_name_placeholder",
                                          "TLS server name (optional)"
                                        ),
                                      },
                                      {
                                        name: "domains",
                                        type: "textarea",
                                        className: "sm:col-span-2",
                                        placeholder: t(
                                          "server_config.fields.dns_domains_placeholder",
                                          "One domain rule per line"
                                        ),
                                      },
                                    ]}
                                    onChange={(values) => {
                                      const converted = values.map(
                                        (item: any) => ({
                                          proto: item.proto,
                                          address: item.address,
                                          server_name: item.server_name || "",
                                          domains:
                                            typeof item.domains === "string"
                                              ? splitLines(item.domains)
                                              : item.domains || [],
                                        })
                                      );
                                      field.onChange(converted);
                                    }}
                                    value={(field.value || []).map((item) => ({
                                      ...item,
                                      domains: Array.isArray(item.domains)
                                        ? item.domains.join("\n")
                                        : "",
                                    }))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </section>
                    </TabsContent>

                    <TabsContent className="space-y-4" value="outbound">
                      <section className="space-y-3">
                        <ToggleField
                          control={form.control}
                          customText={t(
                            "server_node_config.modeCustom",
                            "Custom"
                          )}
                          description={t(
                            "server_node_config.inherit_outbound_desc",
                            "Turn this off to define outbound routing only for this server."
                          )}
                          inheritedText={t(
                            "server_node_config.modeInherited",
                            "Inherited"
                          )}
                          label={t(
                            "server_node_config.inherit_outbound",
                            "Use global outbound rules"
                          )}
                          name="inherit_outbound"
                        />
                        {inheritOutbound ? (
                          <InheritedPreview
                            description={t(
                              "server_node_config.global_outbound_summary",
                              "{{count}} outbound rules are provided by the global configuration.",
                              { count: cfgResp.global.outbound?.length || 0 }
                            )}
                            title={t(
                              "server_node_config.globalPreview",
                              "Using global configuration"
                            )}
                          />
                        ) : (
                          <FormField
                            control={form.control}
                            name="outbound"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <OutboundConfigInput
                                    onChange={(values) => {
                                      field.onChange(
                                        values.map((item) =>
                                          normalizeOutboundConfig(item)
                                        )
                                      );
                                    }}
                                    value={field.value || []}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </section>
                    </TabsContent>

                    <TabsContent className="space-y-4" value="block">
                      <section className="space-y-3">
                        <ToggleField
                          control={form.control}
                          customText={t(
                            "server_node_config.modeCustom",
                            "Custom"
                          )}
                          description={t(
                            "server_node_config.inherit_block_desc",
                            "Turn this off to define a block list only for this server."
                          )}
                          inheritedText={t(
                            "server_node_config.modeInherited",
                            "Inherited"
                          )}
                          label={t(
                            "server_node_config.inherit_block",
                            "Use global block rules"
                          )}
                          name="inherit_block"
                        />
                        {inheritBlock ? (
                          <InheritedPreview
                            description={t(
                              "server_node_config.global_block_summary",
                              "{{count}} block rules are provided by the global configuration.",
                              { count: cfgResp.global.block?.length || 0 }
                            )}
                            title={t(
                              "server_node_config.globalPreview",
                              "Using global configuration"
                            )}
                          />
                        ) : (
                          <FormField
                            control={form.control}
                            name="block"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea
                                    onChange={(e) => {
                                      field.onChange(
                                        splitLines(e.target.value)
                                      );
                                    }}
                                    placeholder={t(
                                      "server_config.fields.block_rules_placeholder",
                                      "One domain rule per line"
                                    )}
                                    rows={12}
                                    value={(field.value || []).join("\n")}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </section>
                    </TabsContent>
                  </form>
                </Form>
              </Tabs>
            ) : null}
          </div>
        </ScrollArea>

        <SheetFooter className="flex-row items-center justify-between gap-3 border-t">
          <p className="text-muted-foreground text-xs">
            {isDirty
              ? t("server_node_config.unsavedChanges", "Unsaved changes")
              : t("server_node_config.noChanges", "No unsaved changes")}
          </p>
          <div className="flex gap-2">
            <Button
              disabled={saving}
              onClick={() => handleOpenChange(false)}
              variant="outline"
            >
              {t("actions.cancel", "Cancel")}
            </Button>
            <Button
              disabled={saving || isLoading || isError || !cfgResp || !isDirty}
              form="server-node-config-form"
              type="submit"
            >
              <Icon
                className={saving ? "animate-spin" : "hidden"}
                icon="mdi:loading"
              />
              {t("actions.save", "Save")}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
