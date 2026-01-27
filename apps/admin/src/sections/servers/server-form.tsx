"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
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
import { EnhancedInput } from "@workspace/ui/composed/enhanced-input";
import { Icon } from "@workspace/ui/composed/icon";
import { cn } from "@workspace/ui/lib/utils";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useNode } from "@/stores/node";
import {
  type FieldConfig,
  formSchema,
  getLabel,
  getProtocolDefaultConfig,
  protocols as PROTOCOLS,
  useProtocolFields,
} from "./form-schema";

function DynamicField({
  field,
  control,
  form,
  protocolIndex,
  protocolData,
}: {
  field: FieldConfig;
  control: any;
  form: any;
  protocolIndex: number;
  protocolData: any;
}) {
  const fieldName = `protocols.${protocolIndex}.${field.name}` as const;

  if (field.condition && !field.condition(protocolData, {})) {
    return null;
  }

  const commonProps = {
    control,
    name: fieldName,
  };

  switch (field.type) {
    case "input":
      return (
        <FormField
          {...commonProps}
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <EnhancedInput
                  {...fieldProps}
                  onValueChange={(v) => fieldProps.onChange(v)}
                  placeholder={field.placeholder}
                  suffix={
                    field.generate ? (
                      field.generate.functions &&
                      field.generate.functions.length > 0 ? (
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" type="button" variant="ghost">
                              <Icon className="h-4 w-4" icon="mdi:key" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {field.generate.functions.map((genFunc, idx) => (
                              <DropdownMenuItem
                                key={idx}
                                onClick={async () => {
                                  const result = await genFunc.function();
                                  if (typeof result === "string") {
                                    fieldProps.onChange(result);
                                  } else if (field.generate!.updateFields) {
                                    Object.entries(
                                      field.generate!.updateFields
                                    ).forEach(([fieldName, resultKey]) => {
                                      const fullFieldName = `protocols.${protocolIndex}.${fieldName}`;
                                      form.setValue(
                                        fullFieldName,
                                        (result as any)[resultKey]
                                      );
                                    });
                                  } else if (result.privateKey) {
                                    fieldProps.onChange(result.privateKey);
                                  }
                                }}
                              >
                                {genFunc.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : field.generate.function ? (
                        <Button
                          onClick={async () => {
                            const result = await field.generate!.function!();
                            if (typeof result === "string") {
                              fieldProps.onChange(result);
                            } else if (field.generate!.updateFields) {
                              Object.entries(
                                field.generate!.updateFields
                              ).forEach(([fieldName, resultKey]) => {
                                const fullFieldName = `protocols.${protocolIndex}.${fieldName}`;
                                form.setValue(
                                  fullFieldName,
                                  (result as any)[resultKey]
                                );
                              });
                            } else if (result.privateKey) {
                              fieldProps.onChange(result.privateKey);
                            }
                          }}
                          size="sm"
                          type="button"
                          variant="ghost"
                        >
                          <Icon className="h-4 w-4" icon="mdi:key" />
                        </Button>
                      ) : null
                    ) : (
                      field.suffix
                    )
                  }
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "number":
      return (
        <FormField
          {...commonProps}
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <EnhancedInput
                  {...fieldProps}
                  max={field.max}
                  min={field.min}
                  onValueChange={(v) => fieldProps.onChange(v)}
                  placeholder={field.placeholder}
                  step={field.step || 1}
                  suffix={field.suffix}
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "select":
      if (!field.options || field.options.length <= 1) {
        return null;
      }

      return (
        <FormField
          {...commonProps}
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(v) => fieldProps.onChange(v)}
                  value={fieldProps.value ?? field.defaultValue}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {getLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "switch":
      return (
        <FormField
          {...commonProps}
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <div className="pt-2">
                  <Switch
                    checked={!!fieldProps.value}
                    onCheckedChange={(checked) => fieldProps.onChange(checked)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "textarea":
      return (
        <FormField
          {...commonProps}
          render={({ field: fieldProps }) => (
            <FormItem className="col-span-2">
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <textarea
                  {...fieldProps}
                  className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  onChange={(e) => fieldProps.onChange(e.target.value)}
                  placeholder={field.placeholder}
                  value={fieldProps.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    default:
      return null;
  }
}

function renderFieldsByGroup(
  fields: FieldConfig[],
  group: string,
  control: any,
  form: any,
  protocolIndex: number,
  protocolData: any
) {
  const groupFields = fields.filter((field) => field.group === group);
  if (groupFields.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {groupFields.map((field) => (
        <DynamicField
          control={control}
          field={field}
          form={form}
          key={field.name}
          protocolData={protocolData}
          protocolIndex={protocolIndex}
        />
      ))}
    </div>
  );
}

function renderGroupCard(
  title: string,
  fields: FieldConfig[],
  group: string,
  control: any,
  form: any,
  protocolIndex: number,
  protocolData: any
) {
  const groupFields = fields.filter((field) => field.group === group);
  if (groupFields.length === 0) return null;

  const visibleFields = groupFields.filter(
    (field) => !field.condition || field.condition(protocolData, {})
  );

  if (visibleFields.length === 0) return null;

  return (
    <div className="relative">
      <fieldset className="rounded-lg border border-border">
        <legend className="ml-3 bg-background px-1 py-1 font-medium text-foreground text-sm">
          {title}
        </legend>
        <div className="p-4 pt-2">
          {renderFieldsByGroup(
            fields,
            group,
            control,
            form,
            protocolIndex,
            protocolData
          )}
        </div>
      </fieldset>
    </div>
  );
}

export default function ServerForm(props: {
  trigger: string;
  title: string;
  loading?: boolean;
  initialValues?: Partial<API.Server>;
  onSubmit: (values: Partial<API.Server>) => Promise<boolean> | boolean;
}) {
  const { trigger, title, loading, initialValues, onSubmit } = props;
  const { t } = useTranslation("servers");
  const [open, setOpen] = useState(false);
  const [accordionValue, setAccordionValue] = useState<string>();

  const { isProtocolUsedInNodes } = useNode();
  const PROTOCOL_FIELDS = useProtocolFields();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      country: "",
      city: "",
      protocols: [] as any[],
      ...initialValues,
    },
  });
  const { control } = form;

  const protocolsValues = useWatch({ control, name: "protocols" });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        name: "",
        address: "",
        country: "",
        city: "",
        ...initialValues,
        protocols: PROTOCOLS.map((type) => {
          const existingProtocol = initialValues.protocols?.find(
            (p) => p.type === type
          );
          const defaultConfig = getProtocolDefaultConfig(type);
          return existingProtocol
            ? { ...defaultConfig, ...existingProtocol }
            : defaultConfig;
        }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  async function handleSubmit(values: Record<string, any>) {
    const filteredProtocols = (values?.protocols || []).filter(
      (protocol: any) => {
        const port = Number(protocol?.port);
        return protocol && Number.isFinite(port) && port > 0 && port <= 65_535;
      }
    );

    const result = {
      name: values.name,
      country: values.country,
      city: values.city,
      address: values.address,
      protocols: filteredProtocols,
    };

    const ok = await onSubmit(result);
    if (ok) {
      form.reset();
      setOpen(false);
    }
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button
          onClick={() => {
            if (!initialValues) {
              const full = PROTOCOLS.map((t) => getProtocolDefaultConfig(t));
              form.reset({
                name: "",
                address: "",
                country: "",
                city: "",
                protocols: full,
              });
            }
            setOpen(true);
          }}
        >
          {trigger}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[700px] max-w-full gap-0 md:max-w-3xl">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-48px-36px-36px-env(safe-area-inset-top))]">
          <Form {...form}>
            <form className="grid grid-cols-1 gap-2 px-6 pt-4">
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("name", "Name")}</FormLabel>
                      <FormControl>
                        <EnhancedInput
                          {...field}
                          onValueChange={(v) => field.onChange(v)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("address", "Address")}</FormLabel>
                      <FormControl>
                        <EnhancedInput
                          {...field}
                          onValueChange={(v) => field.onChange(v)}
                          placeholder={t(
                            "address_placeholder",
                            "Server address"
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("country", "Country")}</FormLabel>
                      <FormControl>
                        <EnhancedInput
                          {...field}
                          onValueChange={(v) => field.onChange(v)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("city", "City")}</FormLabel>
                      <FormControl>
                        <EnhancedInput
                          {...field}
                          onValueChange={(v) => field.onChange(v)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="my-3">
                <h3 className="font-semibold text-foreground text-sm">
                  {t("protocol_configurations", "Protocol Configurations")}
                </h3>
                <p className="mt-1 text-muted-foreground text-xs">
                  {t(
                    "protocol_configurations_desc",
                    "Enable and configure the required protocol types"
                  )}
                </p>
              </div>

              <Accordion
                className="w-full space-y-3"
                collapsible
                onValueChange={setAccordionValue}
                type="single"
                value={accordionValue}
              >
                {PROTOCOLS.map((type) => {
                  const i = Math.max(0, PROTOCOLS.indexOf(type));
                  const current = (protocolsValues[i] || {}) as Record<
                    string,
                    any
                  >;
                  const isEnabled = current?.enable;
                  const fields = PROTOCOL_FIELDS[type] || [];
                  return (
                    <AccordionItem
                      className="mb-2 rounded-lg border"
                      key={type}
                      value={type}
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex w-full items-center justify-between">
                          <div className="flex flex-col items-start gap-1">
                            <div className="flex items-center gap-1">
                              <span className="font-medium capitalize">
                                {type}
                              </span>
                              {current.transport && (
                                <Badge className="text-xs" variant="secondary">
                                  {current.transport.toUpperCase()}
                                </Badge>
                              )}
                              {current.security &&
                                current.security !== "none" && (
                                  <Badge className="text-xs" variant="outline">
                                    {current.security.toUpperCase()}
                                  </Badge>
                                )}
                              {current.port && (
                                <Badge className="text-xs">
                                  {current.port}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <span
                                className={cn(
                                  "text-xs",
                                  isEnabled
                                    ? "text-green-500"
                                    : "text-muted-foreground"
                                )}
                              >
                                {isEnabled
                                  ? t("enabled", "Enabled")
                                  : t("disabled", "Disabled")}
                              </span>
                            </div>
                          </div>
                          <Switch
                            checked={!!isEnabled}
                            className="mr-2"
                            disabled={Boolean(
                              initialValues?.id &&
                                isProtocolUsedInNodes(
                                  initialValues?.id || 0,
                                  type
                                ) &&
                                isEnabled
                            )}
                            onCheckedChange={(checked) => {
                              form.setValue(`protocols.${i}.enable`, checked);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-0 pb-4">
                        <div className="-mx-4 space-y-4 rounded-b-lg border-t px-4 pt-4">
                          {renderGroupCard(
                            t("basic", "Basic Configuration"),
                            fields,
                            "basic",
                            control,
                            form,
                            i,
                            current
                          )}
                          {renderGroupCard(
                            t("obfs", "Obfuscation"),
                            fields,
                            "obfs",
                            control,
                            form,
                            i,
                            current
                          )}
                          {renderGroupCard(
                            t("transport", "Transport"),
                            fields,
                            "transport",
                            control,
                            form,
                            i,
                            current
                          )}
                          {renderGroupCard(
                            t("security", "Security"),
                            fields,
                            "security",
                            control,
                            form,
                            i,
                            current
                          )}
                          {renderGroupCard(
                            t("reality", "Reality"),
                            fields,
                            "reality",
                            control,
                            form,
                            i,
                            current
                          )}
                          {renderGroupCard(
                            t("encryption", "Encryption"),
                            fields,
                            "encryption",
                            control,
                            form,
                            i,
                            current
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </form>
          </Form>
        </ScrollArea>
        <SheetFooter className="flex-row justify-end gap-2 pt-3">
          <Button
            disabled={loading}
            onClick={() => setOpen(false)}
            variant="outline"
          >
            {t("cancel", "Cancel")}
          </Button>
          <Button
            disabled={loading}
            onClick={form.handleSubmit(handleSubmit, (errors) => {
              const key = Object.keys(errors)[0] as keyof typeof errors;
              if (key) toast.error(String(errors[key]?.message));
              return false;
            })}
          >
            {loading && (
              <Icon className="mr-2 animate-spin" icon="mdi:loading" />
            )}
            {t("confirm", "Confirm")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
