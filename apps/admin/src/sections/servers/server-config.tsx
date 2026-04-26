"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormDescription,
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Textarea } from "@workspace/ui/components/textarea";
import { ArrayInput } from "@workspace/ui/composed/dynamic-Inputs";
import { EnhancedInput } from "@workspace/ui/composed/enhanced-input";
import { Icon } from "@workspace/ui/composed/icon";
import {
  getNodeConfig,
  updateNodeConfig,
} from "@workspace/ui/services/admin/system";
import { unitConversion } from "@workspace/ui/utils/unit-conversions";
import { DicesIcon } from "lucide-react";
import { uid } from "radash";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { SS_CIPHERS } from "./form-schema";

const dnsConfigSchema = z.object({
  proto: z.string(), // z.enum(['tcp', 'udp', 'tls', 'https', 'quic']),
  address: z.string(),
  domains: z.array(z.string()),
});

const outboundConfigSchema = z.object({
  name: z.string(),
  protocol: z.string(),
  address: z.string(),
  port: z.number(),
  cipher: z.string().optional(),
  password: z.string().optional(),
  rules: z.array(z.string()).optional(),
});

const nodeConfigSchema = z.object({
  node_secret: z.string().optional(),
  node_pull_interval: z.number().optional(),
  node_push_interval: z.number().optional(),
  traffic_report_threshold: z.number().optional(),
  ip_strategy: z.enum(["prefer_ipv4", "prefer_ipv6"]).optional(),
  dns: z.array(dnsConfigSchema).optional(),
  block: z.array(z.string()).optional(),
  outbound: z.array(outboundConfigSchema).optional(),
});
type NodeConfigFormData = z.infer<typeof nodeConfigSchema>;

export default function ServerConfig() {
  const { t } = useTranslation("servers");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: cfgResp, refetch: refetchCfg } = useQuery({
    queryKey: ["getNodeConfig"],
    queryFn: async () => {
      const { data } = await getNodeConfig();
      return data.data as API.NodeConfig | undefined;
    },
    enabled: open,
  });

  const form = useForm<NodeConfigFormData>({
    resolver: zodResolver(nodeConfigSchema),
    defaultValues: {
      node_secret: "",
      node_pull_interval: undefined,
      node_push_interval: undefined,
      traffic_report_threshold: undefined,
      ip_strategy: "prefer_ipv4",
      dns: [],
      block: [],
      outbound: [],
    },
  });

  useEffect(() => {
    if (cfgResp) {
      form.reset({
        node_secret: cfgResp.node_secret ?? "",
        node_pull_interval: cfgResp.node_pull_interval as number | undefined,
        node_push_interval: cfgResp.node_push_interval as number | undefined,
        traffic_report_threshold: cfgResp.traffic_report_threshold as
          | number
          | undefined,
        ip_strategy:
          (cfgResp.ip_strategy as "prefer_ipv4" | "prefer_ipv6" | undefined) ||
          "prefer_ipv4",
        dns: cfgResp.dns || [],
        block: cfgResp.block || [],
        outbound: cfgResp.outbound || [],
      });
    }
  }, [cfgResp, form]);

  async function onSubmit(values: NodeConfigFormData) {
    setSaving(true);
    try {
      await updateNodeConfig(values as API.NodeConfig);
      toast.success(t("server_config.saveSuccess", "Saved successfully"));
      await refetchCfg();
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Card>
          <CardContent>
            <div className="flex cursor-pointer items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon
                    className="h-5 w-5 text-primary"
                    icon="mdi:resistor-nodes"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {t("server_config.title", "Node configuration")}
                  </p>
                  <p className="truncate text-muted-foreground text-sm">
                    {t(
                      "server_config.description",
                      "Manage node communication keys, pull/push intervals."
                    )}
                  </p>
                </div>
              </div>
              <Icon className="size-6" icon="mdi:chevron-right" />
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>

      <SheetContent className="w-[720px] max-w-full md:max-w-3xl">
        <SheetHeader>
          <SheetTitle>
            {t("server_config.title", "Node configuration")}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100dvh-48px-36px-36px-env(safe-area-inset-top))] px-6">
          <Tabs className="pt-4" defaultValue="basic">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">
                {t("server_config.tabs.basic", "Basic Configuration")}
              </TabsTrigger>
              <TabsTrigger value="dns">
                {t("server_config.tabs.dns", "DNS Configuration")}
              </TabsTrigger>
              <TabsTrigger value="outbound">
                {t("server_config.tabs.outbound", "Outbound Rules")}
              </TabsTrigger>
              <TabsTrigger value="block">
                {t("server_config.tabs.block", "Block Rules")}
              </TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form
                className="mt-4"
                id="server-config-form"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <TabsContent className="space-y-4" value="basic">
                  <FormField
                    control={form.control}
                    name="node_secret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "server_config.fields.communication_key",
                            "Communication key"
                          )}
                        </FormLabel>
                        <FormControl>
                          <EnhancedInput
                            onValueChange={field.onChange}
                            placeholder={t(
                              "server_config.fields.communication_key_placeholder",
                              "Please enter"
                            )}
                            suffix={
                              <div className="flex h-9 items-center bg-muted px-3">
                                <DicesIcon
                                  className="cursor-pointer"
                                  onClick={() => {
                                    const id = uid(32).toLowerCase();
                                    const formatted = `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
                                    form.setValue("node_secret", formatted);
                                  }}
                                />
                              </div>
                            }
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          {t(
                            "server_config.fields.communication_key_desc",
                            "Used for node authentication."
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="node_pull_interval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "server_config.fields.node_pull_interval",
                            "Node pull interval"
                          )}
                        </FormLabel>
                        <FormControl>
                          <EnhancedInput
                            min={0}
                            onValueChange={field.onChange}
                            placeholder={t(
                              "server_config.fields.communication_key_placeholder",
                              "Please enter"
                            )}
                            suffix="S"
                            type="number"
                            value={field.value as number | undefined}
                          />
                        </FormControl>
                        <FormDescription>
                          {t(
                            "server_config.fields.node_pull_interval_desc",
                            "How often the node pulls configuration (seconds)."
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="node_push_interval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "server_config.fields.node_push_interval",
                            "Node push interval"
                          )}
                        </FormLabel>
                        <FormControl>
                          <EnhancedInput
                            min={0}
                            onValueChange={field.onChange}
                            placeholder={t(
                              "server_config.fields.communication_key_placeholder",
                              "Please enter"
                            )}
                            step={0.1}
                            suffix="S"
                            type="number"
                            value={field.value as number | undefined}
                          />
                        </FormControl>
                        <FormDescription>
                          {t(
                            "server_config.fields.node_push_interval_desc",
                            "How often the node pushes stats (seconds)."
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="traffic_report_threshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "server_config.fields.traffic_report_threshold",
                            "Traffic Report Threshold"
                          )}
                        </FormLabel>
                        <FormControl>
                          <EnhancedInput
                            min={0}
                            onValueChange={(value) => {
                              field.onChange(unitConversion("mbToBits", value));
                            }}
                            placeholder="1"
                            suffix="MB"
                            type="number"
                            value={unitConversion(
                              "bitsToMb",
                              field.value as number | undefined
                            )}
                          />
                        </FormControl>
                        <FormDescription>
                          {t(
                            "server_config.fields.traffic_report_threshold_desc",
                            "Set the minimum threshold for traffic reporting."
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent className="space-y-4" value="dns">
                  <FormField
                    control={form.control}
                    name="ip_strategy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("server_config.fields.ip_strategy", "IP Strategy")}
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
                        <FormDescription>
                          {t(
                            "server_config.fields.ip_strategy_desc",
                            "Choose IP version preference for network connections"
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            className="grid grid-cols-2 gap-2"
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
                                name: "domains",
                                type: "textarea",
                                className: "col-span-2",
                                placeholder: t(
                                  "server_config.fields.dns_domains_placeholder",
                                  "One domain rule per line"
                                ),
                              },
                            ]}
                            onChange={(values) => {
                              const converted = values.map((item: any) => ({
                                proto: item.proto,
                                address: item.address,
                                domains:
                                  typeof item.domains === "string"
                                    ? item.domains
                                        .split("\n")
                                        .map((d: string) => d.trim())
                                    : item.domains || [],
                              }));
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
                </TabsContent>

                <TabsContent className="space-y-4" value="outbound">
                  <FormField
                    control={form.control}
                    name="outbound"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ArrayInput
                            className="grid grid-cols-2 gap-2"
                            fields={[
                              {
                                name: "name",
                                type: "text",
                                className: "col-span-2",
                                placeholder: t(
                                  "server_config.fields.outbound_name_placeholder",
                                  "Configuration name"
                                ),
                              },
                              {
                                name: "protocol",
                                type: "select",
                                placeholder: t(
                                  "server_config.fields.outbound_protocol_placeholder",
                                  "Select protocol"
                                ),
                                options: [
                                  { label: "HTTP", value: "http" },
                                  { label: "SOCKS", value: "socks" },
                                  {
                                    label: "Shadowsocks",
                                    value: "shadowsocks",
                                  },
                                  { label: "Brook", value: "brook" },
                                  { label: "Snell", value: "snell" },
                                  { label: "VMess", value: "vmess" },
                                  { label: "VLESS", value: "vless" },
                                  { label: "Trojan", value: "trojan" },
                                  { label: "WireGuard", value: "wireguard" },
                                  { label: "Hysteria 2", value: "hysteria" },
                                  { label: "TUIC", value: "tuic" },
                                  { label: "AnyTLS", value: "anytls" },
                                  { label: "Naive", value: "naive" },
                                  { label: "Direct", value: "direct" },
                                  { label: "Reject", value: "reject" },
                                ],
                              },
                              {
                                name: "cipher",
                                type: "select",
                                options: SS_CIPHERS.map((cipher) => ({
                                  label: cipher,
                                  value: cipher,
                                })),
                                visible: (item: Record<string, unknown>) =>
                                  item.protocol === "shadowsocks",
                              },
                              {
                                name: "address",
                                type: "text",
                                placeholder: t(
                                  "server_config.fields.outbound_address_placeholder",
                                  "Server address"
                                ),
                              },
                              {
                                name: "port",
                                type: "number",
                                placeholder: t(
                                  "server_config.fields.outbound_port_placeholder",
                                  "Port number"
                                ),
                              },
                              {
                                name: "password",
                                type: "text",
                                placeholder: t(
                                  "server_config.fields.outbound_password_placeholder",
                                  "Password (optional)"
                                ),
                              },
                              {
                                name: "rules",
                                type: "textarea",
                                className: "col-span-2",
                                placeholder: t(
                                  "server_config.fields.outbound_rules_placeholder",
                                  "One rule per line"
                                ),
                              },
                            ]}
                            onChange={(values) => {
                              const converted = values.map((item: any) => ({
                                name: item.name,
                                protocol: item.protocol,
                                address: item.address,
                                port: item.port,
                                cipher: item.cipher,
                                password: item.password,
                                rules:
                                  typeof item.rules === "string"
                                    ? item.rules
                                        .split("\n")
                                        .map((r: string) => r.trim())
                                    : item.rules || [],
                              }));
                              field.onChange(converted);
                            }}
                            value={(field.value || []).map((item) => ({
                              ...item,
                              rules: Array.isArray(item.rules)
                                ? item.rules.join("\n")
                                : "",
                            }))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent className="space-y-4" value="block">
                  <FormField
                    control={form.control}
                    name="block"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            onChange={(e) => {
                              const lines = e.target.value
                                .split("\n")
                                .map((line) => line.trim());
                              field.onChange(lines);
                            }}
                            placeholder={t(
                              "server_config.fields.block_rules_placeholder",
                              "One domain rule per line"
                            )}
                            rows={10}
                            value={(field.value || []).join("\n")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </ScrollArea>

        <SheetFooter className="flex-row justify-end gap-2 pt-3">
          <Button
            disabled={saving}
            onClick={() => setOpen(false)}
            variant="outline"
          >
            {t("actions.cancel", "Cancel")}
          </Button>
          <Button disabled={saving} form="server-config-form" type="submit">
            <Icon
              className={saving ? "mr-2 animate-spin" : "hidden"}
              icon="mdi:loading"
            />
            {t("actions.save", "Save")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
