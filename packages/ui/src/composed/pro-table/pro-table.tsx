"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import Empty from "@workspace/ui/composed/empty";
import {
  ColumnFilter,
  type IParams,
} from "@workspace/ui/composed/pro-table/column-filter";
import { ColumnHeader } from "@workspace/ui/composed/pro-table/column-header";
import { ColumnToggle } from "@workspace/ui/composed/pro-table/column-toggle";
import { Pagination } from "@workspace/ui/composed/pro-table/pagination";
import { SortableRow } from "@workspace/ui/composed/pro-table/sortable-row";
import { ProTableWrapper } from "@workspace/ui/composed/pro-table/wrapper";
import { cn } from "@workspace/ui/lib/utils";
import { useSize } from "ahooks";
import { GripVertical, ListRestart, Loader, RefreshCcw } from "lucide-react";
import type React from "react";
import {
  Fragment,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

export interface ProTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  request: (
    pagination: {
      page: number;
      size: number;
    },
    filter: TValue
  ) => Promise<{ list: TData[]; total: number }>;
  params?: IParams[];
  header?: {
    title?: React.ReactNode;
    toolbar?: React.ReactNode | React.ReactNode[];
    hidden?: boolean;
  };
  actions?: {
    render?: (row: TData) => React.ReactNode[];
    batchRender?: (rows: TData[]) => React.ReactNode[];
  };
  action?: React.Ref<ProTableActions | undefined>;
  texts?: Partial<{
    actions: string;
    asc: string;
    desc: string;
    hide: string;
    textRowsPerPage: string;
    textPageOf: (current: number, total: number) => string;
    selectedRowsText: (total: number) => string;
    refresh: string;
    reset: string;
    retry: string;
    loadError: string;
  }>;
  empty?: React.ReactNode;
  onSort?: (
    sourceId: string | number,
    targetId: string | number | null,
    items: TData[]
  ) => Promise<TData[]>;
  onFiltersChange?: (filters: Record<string, unknown>) => void;
  initialFilters?: Record<string, unknown>;
}

export interface ProTableActions {
  refresh: () => void;
  reset: () => void;
}

export function ProTable<
  TData extends Record<string, unknown> & { id?: string | number },
  TValue extends Record<string, unknown>,
>({
  columns,
  request,
  params,
  header,
  actions,
  action,
  texts,
  empty,
  onSort,
  onFiltersChange,
  initialFilters,
}: ProTableProps<TData, TValue>) {
  const { t } = useTranslation("components");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    if (initialFilters) {
      return toColumnFilters(initialFilters);
    }
    return [];
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<TData[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string>();
  const initialFiltersSnapshot = serializeColumnFilters(
    toColumnFilters(initialFilters || {})
  );
  const previousInitialFilters = useRef(initialFiltersSnapshot);
  const initialFiltersRef = useRef(initialFilters);
  const requestRef = useRef(request);
  const requestSequence = useRef(0);
  const mounted = useRef(true);
  const onFiltersChangeRef = useRef(onFiltersChange);
  requestRef.current = request;
  onFiltersChangeRef.current = onFiltersChange;
  initialFiltersRef.current = initialFilters;

  const table = useReactTable({
    data,
    columns: [
      ...(onSort
        ? [
            {
              id: "sortable",
              header: (
                <GripVertical className="h-4 w-4 cursor-move text-gray-500 hover:text-gray-700" />
              ),
              enableSorting: false,
              enableHiding: false,
            },
          ]
        : []),
      ...(actions?.batchRender ? [createSelectColumn<TData, TValue>()] : []),
      ...columns.map(
        (column) =>
          ({
            enableSorting: false,
            ...column,
          }) as ColumnDef<TData, TValue>
      ),
      ...(actions?.render
        ? ([
            {
              id: "actions",
              header: texts?.actions,
              cell: ({ row }) => (
                <div className="flex items-center justify-end gap-2">
                  {actions?.render?.(row.original).map((item, index) => (
                    <Fragment key={index}>{item}</Fragment>
                  ))}
                </div>
              ),
              enableSorting: false,
              enableHiding: false,
            },
          ] as ColumnDef<TData, TValue>[])
        : []),
    ] as ColumnDef<TData, TValue>[],
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    manualPagination: true,
    manualFiltering: true,
    rowCount,
    manualSorting: true,
  });

  const filtersSnapshot = serializeColumnFilters(columnFilters);
  const fetchData = useCallback(async () => {
    const currentRequest = ++requestSequence.current;
    setIsLoading(true);
    setLoadError(undefined);
    try {
      const response = await requestRef.current(
        {
          page: pagination.pageIndex + 1,
          size: pagination.pageSize,
        },
        Object.fromEntries(
          columnFilters.map((item) => [item.id, item.value])
        ) as TValue
      );
      if (!(mounted.current && currentRequest === requestSequence.current)) {
        return;
      }
      setData(response.list);
      setRowCount(response.total);
    } catch (error) {
      if (mounted.current && currentRequest === requestSequence.current) {
        setLoadError(
          error instanceof Error
            ? error.message
            : t("table.loadError", "Unable to load data")
        );
      }
    } finally {
      if (mounted.current && currentRequest === requestSequence.current) {
        setIsLoading(false);
      }
    }
  }, [filtersSnapshot, pagination.pageIndex, pagination.pageSize, t]);

  const reset = useCallback(() => {
    setSorting([]);
    setColumnFilters([]);
    setColumnVisibility({});
    setRowSelection({});
    setPagination((previous) => ({ ...previous, pageIndex: 0 }));
  }, []);
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  useImperativeHandle(action, () => ({
    refresh: fetchData,
    reset,
  }));

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (previousInitialFilters.current === initialFiltersSnapshot) return;
    previousInitialFilters.current = initialFiltersSnapshot;
    const nextFilters = toColumnFilters(initialFiltersRef.current || {});
    setColumnFilters((currentFilters) =>
      serializeColumnFilters(currentFilters) === initialFiltersSnapshot
        ? currentFilters
        : nextFilters
    );
    setPagination((previous) => ({ ...previous, pageIndex: 0 }));
  }, [initialFiltersSnapshot]);

  useEffect(() => {
    onFiltersChangeRef.current?.(
      Object.fromEntries(
        columnFilters.map((filter) => [filter.id, filter.value])
      )
    );
  }, [filtersSnapshot]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      requestSequence.current += 1;
    };
  }, []);

  const selectedRows = table
    .getSelectedRowModel()
    .flatRows.map((row) => row.original);
  const selectedCount = selectedRows.length;

  return (
    <div className="flex flex-col gap-4" ref={ref}>
      {!header?.hidden && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="font-semibold text-lg">{header?.title}</div>
            <div className="flex flex-1 items-center justify-end gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-label={texts?.refresh || t("table.refresh", "Refresh")}
                    disabled={isLoading}
                    onClick={fetchData}
                    size="icon"
                    variant="outline"
                  >
                    <RefreshCcw className={cn(isLoading && "animate-spin")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {texts?.refresh || t("table.refresh", "Refresh")}
                </TooltipContent>
              </Tooltip>
              <ColumnToggle table={table} />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-label={texts?.reset || t("table.reset", "Reset table")}
                    onClick={reset}
                    size="icon"
                    variant="outline"
                  >
                    <ListRestart />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {texts?.reset || t("table.reset", "Reset table")}
                </TooltipContent>
              </Tooltip>
              {header?.toolbar}
            </div>
          </div>
          {params && (
            <ColumnFilter
              filters={Object.fromEntries(
                columnFilters.map((item) => [item.id, item.value])
              )}
              params={params}
              table={table}
            />
          )}
        </div>
      )}

      {loadError && (
        <Alert variant="destructive">
          <AlertTitle>
            {texts?.loadError || t("table.loadError", "Unable to load data")}
          </AlertTitle>
          <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
            <span>{loadError}</span>
            <Button onClick={fetchData} size="sm" variant="outline">
              {texts?.retry || t("table.retry", "Retry")}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {selectedCount > 0 && actions?.batchRender && (
        <Alert className="flex items-center justify-between">
          <AlertTitle className="m-0">
            {texts?.selectedRowsText?.(selectedCount) ||
              `Selected ${selectedCount} rows`}
          </AlertTitle>
          <AlertDescription className="flex gap-2">
            {actions.batchRender(selectedRows)}
          </AlertDescription>
        </Alert>
      )}

      <div
        className="relative w-auto overflow-x-auto rounded-md border"
        style={{
          width: size?.width,
        }}
      >
        <ProTableWrapper data={data} onSort={onSort} setData={setData}>
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      className={cn(
                        "!z-auto",
                        getTableHeaderClass(header.column.id)
                      )}
                      key={header.id}
                    >
                      <ColumnHeader
                        header={header}
                        text={{
                          asc: texts?.asc,
                          desc: texts?.desc,
                          hide: texts?.hide,
                        }}
                      />
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel()?.rows?.length ? (
                onSort ? (
                  table.getRowModel().rows.map((row) => (
                    <SortableRow
                      data-state={row.getIsSelected() && "selected"}
                      id={
                        row.original.id
                          ? String(row.original.id)
                          : String(row.index)
                      }
                      isSortable
                      key={
                        row.original.id
                          ? String(row.original.id)
                          : String(row.index)
                      }
                    >
                      {row
                        .getVisibleCells()
                        .filter((cell) => cell.column.id !== "sortable")
                        .map((cell) => (
                          <TableCell
                            className={getTableCellClass(cell.column.id)}
                            key={cell.id}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                    </SortableRow>
                  ))
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      key={row.id}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          className={getTableCellClass(cell.column.id)}
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )
              ) : (
                <TableRow>
                  <TableCell className="py-24" colSpan={columns.length + 2}>
                    {empty || <Empty />}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ProTableWrapper>

        {isLoading && (
          <div className="absolute top-0 z-20 flex h-full w-full items-center justify-center bg-muted/80">
            <Loader
              aria-label={t("table.loading", "Loading")}
              className="h-5 w-5 animate-spin"
            />
          </div>
        )}
      </div>
      {rowCount > 0 && <Pagination table={table} />}
    </div>
  );
}

function toColumnFilters(filters: Record<string, unknown>) {
  return Object.entries(filters)
    .filter(([, value]) => {
      if (value === null || value === undefined) return false;
      return typeof value !== "string" || value.trim().length > 0;
    })
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([id, value]) => ({ id, value })) as ColumnFiltersState;
}

function serializeColumnFilters(filters: ColumnFiltersState) {
  return JSON.stringify(
    filters
      .map((filter) => ({ id: filter.id, value: String(filter.value) }))
      .sort((left, right) => left.id.localeCompare(right.id))
  );
}

function createSelectColumn<TData, TValue>(): ColumnDef<TData, TValue> {
  return {
    id: "selected",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

function getTableHeaderClass(columnId: string) {
  if (["sortable", "selected"].includes(columnId)) {
    return "sticky left-0 z-10 bg-background shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] [&:has([role=checkbox])]:pr-2";
  }
  if (columnId === "actions") {
    return "sticky right-0 z-10 text-right bg-background shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]";
  }
  return "truncate";
}

function getTableCellClass(columnId: string) {
  if (["sortable", "selected"].includes(columnId)) {
    return "sticky left-0 bg-background shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]";
  }
  if (columnId === "actions") {
    return "sticky right-0 bg-background shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]";
  }
  return "truncate";
}
