"use client";

import type { Table } from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Combobox } from "@workspace/ui/composed/combobox";
import { Filter, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export interface IParams {
  key: string;
  label?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  type?: "text" | "select" | "date";
}

interface ColumnFilterProps<TData> {
  table: Table<TData>;
  params: IParams[];
  filters?: Record<string, unknown>;
}

export function ColumnFilter<TData>({
  table,
  params,
  filters = {},
}: ColumnFilterProps<TData>) {
  const { t } = useTranslation("components");
  const committedSnapshot = JSON.stringify(normalizeFilters(filters));
  const [draftFilters, setDraftFilters] = useState<Record<string, unknown>>(
    () => normalizeFilters(filters)
  );

  useEffect(() => {
    setDraftFilters(normalizeFilters(filters));
    // `filters` is recreated by the table. The serialized value only changes
    // when the committed filters actually change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [committedSnapshot]);

  const updateDraftFilter = (key: string, value: unknown) => {
    setDraftFilters((previous) => ({ ...previous, [key]: value }));
  };

  const applyFilters = () => {
    const nextFilters = normalizeFilters(draftFilters);
    table.setColumnFilters(
      Object.entries(nextFilters).map(([id, value]) => ({ id, value }))
    );
    table.setPageIndex(0);
  };

  const clearFilters = () => {
    setDraftFilters({});
    table.setColumnFilters([]);
    table.setPageIndex(0);
  };

  const activeFilterCount = Object.keys(normalizeFilters(filters)).length;
  const isDirty =
    JSON.stringify(normalizeFilters(draftFilters)) !== committedSnapshot;

  return (
    <form
      className="flex flex-col gap-3 rounded-lg border bg-muted/20 p-3"
      onSubmit={(event) => {
        event.preventDefault();
        applyFilters();
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-medium text-sm">
          <Filter className="size-4 text-muted-foreground" />
          <span>{t("table.filters", "Filters")}</span>
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-primary-foreground text-xs">
              {activeFilterCount}
            </span>
          )}
        </div>
        {isDirty && (
          <span className="text-muted-foreground text-xs">
            {t("table.unappliedChanges", "Unapplied changes")}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-2">
        {params.map((param) => {
          const label =
            param.label ||
            param.placeholder ||
            t(`table.fields.${param.key}`, humanizeKey(param.key));
          const value = draftFilters[param.key];

          if (param.options || param.type === "select") {
            return (
              <div className="min-w-40 flex-1 space-y-1" key={param.key}>
                <Label className="text-muted-foreground text-xs">{label}</Label>
                <Combobox
                  className="w-full"
                  onChange={(nextValue) => {
                    updateDraftFilter(param.key, nextValue);
                  }}
                  options={param.options}
                  placeholder={
                    param.placeholder || t("table.choose", "Choose...")
                  }
                  value={
                    typeof value === "string" ? value : String(value ?? "")
                  }
                />
              </div>
            );
          }

          if (param.type === "date") {
            const inputValue =
              typeof value === "number"
                ? toDateInput(new Date(value))
                : typeof value === "string"
                  ? value
                  : "";
            return (
              <div className="min-w-40 flex-1 space-y-1" key={param.key}>
                <Label className="text-muted-foreground text-xs">{label}</Label>
                <Input
                  aria-label={label}
                  className="w-full"
                  onChange={(event) => {
                    updateDraftFilter(param.key, event.target.value);
                  }}
                  type="date"
                  value={inputValue}
                />
              </div>
            );
          }

          return (
            <div className="min-w-40 flex-1 space-y-1" key={param.key}>
              <Label className="text-muted-foreground text-xs">{label}</Label>
              <Input
                aria-label={label}
                className="w-full"
                onChange={(event) =>
                  updateDraftFilter(param.key, event.target.value)
                }
                placeholder={param.placeholder || label}
                value={typeof value === "string" ? value : String(value ?? "")}
              />
            </div>
          );
        })}

        <Button className="shrink-0" type="submit">
          <Search className="size-4" />
          {t("table.applyFilters", "Apply filters")}
        </Button>
        <Button
          className="shrink-0"
          disabled={activeFilterCount === 0 && !isDirty}
          onClick={clearFilters}
          type="button"
          variant="ghost"
        >
          <X className="size-4" />
          {t("table.clearFilters", "Clear")}
        </Button>
      </div>
    </form>
  );
}

function normalizeFilters(filters: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(filters)
      .filter(([, value]) => hasFilterValue(value))
      .sort(([left], [right]) => left.localeCompare(right))
  );
}

function hasFilterValue(value: unknown) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

function humanizeKey(key: string) {
  return key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function toDateInput(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
