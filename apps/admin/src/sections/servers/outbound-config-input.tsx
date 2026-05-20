"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Switch } from "@workspace/ui/components/switch";
import { Textarea } from "@workspace/ui/components/textarea";
import { EnhancedInput } from "@workspace/ui/composed/enhanced-input";
import { cn } from "@workspace/ui/lib/utils";
import { CirclePlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createOutboundConfig,
  getOutboundFields,
  getOutboundProtocolLabel,
  getOutboundSecurityOptions,
  normalizeOutboundConfig,
  type OutboundConfigFormData,
  type OutboundFieldConfig,
  type OutboundFieldGroup,
} from "./outbound-config";

const FIELD_GROUPS: {
  group: OutboundFieldGroup;
  labelKey: string;
  fallback: string;
}[] = [
  {
    group: "basic",
    labelKey: "basic",
    fallback: "Basic Configuration",
  },
  {
    group: "auth",
    labelKey: "auth",
    fallback: "Authentication",
  },
  {
    group: "transport",
    labelKey: "transport",
    fallback: "Transport",
  },
  {
    group: "security",
    labelKey: "security",
    fallback: "Security",
  },
  {
    group: "reality",
    labelKey: "reality",
    fallback: "Reality",
  },
  {
    group: "protocol",
    labelKey: "protocol_options",
    fallback: "Protocol Options",
  },
  {
    group: "routing",
    labelKey: "routing",
    fallback: "Routing",
  },
];

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getFieldValue(
  item: OutboundConfigFormData,
  field: OutboundFieldConfig
) {
  if (field.name === "rules") {
    return Array.isArray(item.rules) ? item.rules.join("\n") : "";
  }
  return item[field.name] ?? "";
}

function getSelectOptions(
  item: OutboundConfigFormData,
  field: OutboundFieldConfig
) {
  if (field.name === "security") {
    return getOutboundSecurityOptions(item.protocol);
  }
  return field.options || [];
}

function getItemTitle(item: OutboundConfigFormData, index: number) {
  return (
    item.name || `${getOutboundProtocolLabel(item.protocol)} #${index + 1}`
  );
}

function getItemBadges(item: OutboundConfigFormData) {
  return [
    getOutboundProtocolLabel(item.protocol),
    item.transport && !["tuic", "hysteria"].includes(item.transport)
      ? item.transport.toUpperCase()
      : "",
    item.security && item.security !== "none"
      ? item.security.toUpperCase()
      : "",
    item.port ? String(item.port) : "",
  ].filter(Boolean);
}

function normalizeItems(values: OutboundConfigFormData[] = []) {
  return values.map((item) => normalizeOutboundConfig(item));
}

export function OutboundConfigInput({
  value = [],
  onChange,
}: {
  value?: OutboundConfigFormData[];
  onChange: (value: OutboundConfigFormData[]) => void;
}) {
  const { t } = useTranslation("servers");
  const [accordionValue, setAccordionValue] = useState<string>();
  const fields = getOutboundFields(t);
  const items = normalizeItems(value);

  function emit(nextItems: OutboundConfigFormData[]) {
    onChange(normalizeItems(nextItems));
  }

  function addItem() {
    const nextItems = [...items, createOutboundConfig()];
    emit(nextItems);
    setAccordionValue(String(nextItems.length - 1));
  }

  function deleteItem(index: number) {
    emit(items.filter((_, i) => i !== index));
    if (accordionValue === String(index)) {
      setAccordionValue(undefined);
    }
  }

  function updateItem(
    index: number,
    field: OutboundFieldConfig,
    fieldValue: string | number | boolean
  ) {
    const current = items[index] || createOutboundConfig();
    let next: Record<string, unknown>;

    if (field.name === "protocol") {
      next = {
        ...createOutboundConfig(String(fieldValue)),
        name: current.name,
        address: current.address,
        port: current.port,
        rules: current.rules,
      };
    } else {
      next = {
        ...current,
        [field.name]:
          field.name === "rules" ? splitLines(String(fieldValue)) : fieldValue,
      };
    }

    emit(
      items.map((item, i) =>
        i === index ? normalizeOutboundConfig(next) : item
      )
    );
  }

  function renderField(
    item: OutboundConfigFormData,
    index: number,
    field: OutboundFieldConfig
  ) {
    if (field.visible && !field.visible(item)) {
      return null;
    }

    const value = getFieldValue(item, field);
    const label = (
      <>
        {field.label}
        {field.required ? (
          <span aria-hidden="true" className="ml-1 text-destructive">
            *
          </span>
        ) : null}
      </>
    );

    switch (field.type) {
      case "select": {
        const options = getSelectOptions(item, field);
        if (options.length <= 1) {
          return null;
        }
        return (
          <div className={cn("space-y-2", field.className)} key={field.name}>
            <Label>{label}</Label>
            <Select
              onValueChange={(nextValue) => updateItem(index, field, nextValue)}
              value={String(value || "")}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      }

      case "boolean":
        return (
          <div
            className={cn("flex items-center gap-2 pt-7", field.className)}
            key={field.name}
          >
            <Switch
              checked={Boolean(value)}
              onCheckedChange={(checked) => updateItem(index, field, checked)}
            />
            <Label>{field.label}</Label>
          </div>
        );

      case "textarea":
        return (
          <div className={cn("space-y-2", field.className)} key={field.name}>
            <Label>{label}</Label>
            <Textarea
              className="min-h-24"
              onChange={(event) => updateItem(index, field, event.target.value)}
              placeholder={field.placeholder}
              value={String(value || "")}
            />
          </div>
        );

      default:
        return (
          <div className={cn("space-y-2", field.className)} key={field.name}>
            <Label>{label}</Label>
            <EnhancedInput
              max={field.max}
              min={field.min}
              onValueChange={(nextValue) => updateItem(index, field, nextValue)}
              placeholder={field.placeholder}
              step={field.step}
              suffix={field.suffix}
              type={field.type === "number" ? "number" : "text"}
              value={value}
            />
          </div>
        );
    }
  }

  function renderGroup(
    item: OutboundConfigFormData,
    index: number,
    group: (typeof FIELD_GROUPS)[number]
  ) {
    const groupFields = fields.filter((field) => field.group === group.group);
    const visibleFields = groupFields.filter(
      (field) => !field.visible || field.visible(item)
    );
    if (visibleFields.length === 0) {
      return null;
    }

    return (
      <fieldset className="rounded-lg border border-border" key={group.group}>
        <legend className="ml-3 bg-background px-1 py-1 font-medium text-foreground text-sm">
          {t(group.labelKey, group.fallback)}
        </legend>
        <div className="grid grid-cols-2 gap-4 p-4 pt-2">
          {visibleFields.map((field) => renderField(item, index, field))}
        </div>
      </fieldset>
    );
  }

  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <Accordion
          className="space-y-3"
          collapsible
          onValueChange={setAccordionValue}
          type="single"
          value={accordionValue}
        >
          {items.map((item, index) => (
            <div className="flex items-start gap-2" key={index}>
              <AccordionItem
                className="flex-1 rounded-lg border"
                value={String(index)}
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex w-full min-w-0 flex-col items-start gap-2">
                    <span className="max-w-full truncate font-medium text-sm">
                      {getItemTitle(item, index)}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {getItemBadges(item).map((badge) => (
                        <Badge
                          className="text-xs"
                          key={badge}
                          variant="outline"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-0 pb-4">
                  <div className="-mx-4 space-y-4 rounded-b-lg border-t px-4 pt-4">
                    {FIELD_GROUPS.map((group) =>
                      renderGroup(item, index, group)
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <Button
                className="mt-2 shrink-0"
                onClick={() => deleteItem(index)}
                size="icon"
                type="button"
                variant="ghost"
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </Accordion>
      )}
      <Button onClick={addItem} type="button" variant="outline">
        <CirclePlusIcon className="mr-2 h-4 w-4" />
        {t("server_config.fields.add_outbound", "Add outbound")}
      </Button>
    </div>
  );
}
