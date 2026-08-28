"use client";

import type { Table } from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { ListTodoIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface ColumnToggleProps<TData> {
  table: Table<TData>;
}

export function ColumnToggle<TData>({ table }: ColumnToggleProps<TData>) {
  const { t } = useTranslation("components");
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label={t("table.columns", "Choose columns")}
              size="icon"
              variant="outline"
            >
              <ListTodoIcon />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{t("table.columns", "Choose columns")}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-[150px]">
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            const columns = table
              .getAllColumns()
              .filter((item) => item.getIsVisible());
            return (
              <DropdownMenuCheckboxItem
                checked={column.getIsVisible()}
                className="capitalize"
                disabled={
                  columns.length === 1 && columns?.[0]?.id === column.id
                }
                key={column.id}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.columnDef.header as ReactNode}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
