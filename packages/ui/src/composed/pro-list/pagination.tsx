import type { Table } from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface PaginationProps<TData> {
  table: Table<TData>;
}

export function Pagination<TData>({ table }: PaginationProps<TData>) {
  const { t } = useTranslation("components");

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex-1 whitespace-nowrap text-center text-muted-foreground sm:text-left">
        {t("pagination.pageInfo", "Page {{page}} of {{total}}", {
          page: table.getState().pagination.pageIndex + 1,
          total: table.getPageCount(),
        })}
      </div>
      <div className="flex flex-grow items-center justify-center gap-2 sm:justify-end">
        <div className="flex items-center space-x-2">
          <p className="font-medium">
            {t("pagination.rowsPerPage", "Rows per page")}
          </p>
          <Select
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
            value={`${table.getState().pagination.pageSize}`}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 50, 100, 200].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          className="hidden lg:flex"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.setPageIndex(0)}
          size="icon"
          variant="outline"
        >
          <span className="sr-only">
            {t("pagination.firstPage", "Go to first page")}
          </span>
          <ChevronsLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          size="icon"
          variant="outline"
        >
          <span className="sr-only">
            {t("pagination.previousPage", "Go to previous page")}
          </span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Select
          onValueChange={(value) => table.setPageIndex(Number(value) - 1)}
          value={`${table.getState().pagination.pageIndex + 1}`}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue
              placeholder={t("pagination.selectPage", "Select page number")}
            />
          </SelectTrigger>
          <SelectContent className="w-12">
            {Array.from({ length: table.getPageCount() }, (_, i) => (
              <SelectItem key={i} value={`${i + 1}`}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          size="icon"
          variant="outline"
        >
          <span className="sr-only">
            {t("pagination.nextPage", "Go to next page")}
          </span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          className="hidden lg:flex"
          disabled={!table.getCanNextPage()}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          size="icon"
          variant="outline"
        >
          <span className="sr-only">
            {t("pagination.lastPage", "Go to last page")}
          </span>
          <ChevronsRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
