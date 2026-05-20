"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
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
import {
  getServerNodeConfig,
  updateServerNodeConfig,
} from "@workspace/ui/services/admin/server";
import { useEffect, useState } from "react";
import { type Control, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { SS_CIPHERS } from "./form-schema";

const dnsConfigSchema = z.object({
  proto: z.string(),
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
}: {
  control: Control<ServerNodeConfigFormData>;
  name:
    | "inherit_ip_strategy"
    | "inherit_dns"
    | "inherit_block"
    | "inherit_outbound";
  label: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex items-center justify-between rounded-md border px-3 py-2">
          <span className="font-medium text-sm">{label}</span>
          <Switch checked={field.value} onCheckedChange={field.onChange} />
        </div>
      )}
    />
  );
}

export default function ServerNodeConfig({ server }: { server: API.Server }) {
  const { t } = useTranslation("servers");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: cfgResp, refetch } = useQuery({
    queryKey: ["getServerNodeConfig", server.id],
    queryFn: async () => {
      const { data } = await getServerNodeConfig({ server_id: server.id });
      return data.data;
    },
    enabled: open,
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

    const override = cfgResp.override;
    const effective = cfgResp.effective;
    form.reset({
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
    });
  }, [cfgResp, form]);

  const inheritIPStrategy = form.watch("inherit_ip_strategy");
  const inheritDNS = form.watch("inherit_dns");
  const inheritOutbound = form.watch("inherit_outbound");
  const inheritBlock = form.watch("inherit_block");

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
        outbound: values.outbound.map((item) => ({
          name: item.name,
          protocol: item.protocol,
          address: item.address,
          port: item.port,
          password: item.password || "",
          rules: item.rules || [],
        })),
      });
      toast.success(t("server_node_config.saveSuccess", "Saved successfully"));
      await refetch();
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Icon className="mr-2 h-4 w-4" icon="mdi:tune-variant" />
          {t("server_node_config.trigger", "Node Config")}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[700px] max-w-full gap-0 md:max-w-3xl">
        <SheetHeader>
          <SheetTitle>
            {t("server_node_config.title", "Node Config")} - {server.name}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] pr-3">
          <Tabs className="mt-4" defaultValue="dns">
            <TabsList className="grid w-full grid-cols-3">
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
                className="space-y-4 pt-4"
                id="server-node-config-form"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <TabsContent className="space-y-4" value="dns">
                  <ToggleField
                    control={form.control}
                    label={t(
                      "server_node_config.inherit_ip_strategy",
                      "Inherit global IP strategy"
                    )}
                    name="inherit_ip_strategy"
                  />
                  <div
                    className={
                      inheritIPStrategy ? "pointer-events-none opacity-50" : ""
                    }
                  >
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
                  </div>

                  <ToggleField
                    control={form.control}
                    label={t(
                      "server_node_config.inherit_dns",
                      "Inherit global DNS"
                    )}
                    name="inherit_dns"
                  />
                  <div
                    className={
                      inheritDNS ? "pointer-events-none opacity-50" : ""
                    }
                  >
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
                                      ? splitLines(item.domains)
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
                  </div>
                </TabsContent>

                <TabsContent className="space-y-4" value="outbound">
                  <ToggleField
                    control={form.control}
                    label={t(
                      "server_node_config.inherit_outbound",
                      "Inherit global outbound"
                    )}
                    name="inherit_outbound"
                  />
                  <div
                    className={
                      inheritOutbound ? "pointer-events-none opacity-50" : ""
                    }
                  >
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
                                    { label: "Hysteria", value: "hysteria" },
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
                                      ? splitLines(item.rules)
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
                  </div>
                </TabsContent>

                <TabsContent className="space-y-4" value="block">
                  <ToggleField
                    control={form.control}
                    label={t(
                      "server_node_config.inherit_block",
                      "Inherit global block rules"
                    )}
                    name="inherit_block"
                  />
                  <div
                    className={
                      inheritBlock ? "pointer-events-none opacity-50" : ""
                    }
                  >
                    <FormField
                      control={form.control}
                      name="block"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              onChange={(e) => {
                                field.onChange(splitLines(e.target.value));
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
                  </div>
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
          <Button
            disabled={saving}
            form="server-node-config-form"
            type="submit"
          >
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
