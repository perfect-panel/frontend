"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart";
import { Separator } from "@workspace/ui/components/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import Empty from "@workspace/ui/composed/empty";
import { getConsoleRevenue as queryRevenueStatistics } from "@workspace/ui/services/admin/admin";
import { unitConversion } from "@workspace/ui/utils/unit-conversions";
import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  XAxis,
} from "recharts";
import { Display } from "@/components/display";

export function RevenueStatisticsCard() {
  const { t, i18n } = useTranslation("dashboard");
  const locale = i18n.language;

  const IncomeStatisticsConfig = {
    new_purchase: {
      label: t("newPurchase", "New Purchase"),
      color: "var(--color-chart-1)",
    },
    repurchase: {
      label: t("repurchase", "Repurchase"),
      color: "var(--color-chart-2)",
    },
    total: {
      label: t("totalIncome", "Total Income"),
      color: "var(--color-chart-3)",
    },
  };

  const { data: RevenueStatistics } = useQuery({
    queryKey: ["queryRevenueStatistics"],
    queryFn: async () => {
      const { data } = await queryRevenueStatistics();
      return data.data;
    },
  });

  return (
    <Tabs defaultValue="today">
      <Card className="h-full pb-0">
        <CardHeader className="!flex-row flex items-center justify-between">
          <CardTitle>{t("revenueTitle", "Revenue Statistics")}</CardTitle>
          <TabsList>
            <TabsTrigger value="today">{t("today", "Today")}</TabsTrigger>
            <TabsTrigger value="month">{t("month", "Month")}</TabsTrigger>
            <TabsTrigger value="total">{t("total", "Total")}</TabsTrigger>
          </TabsList>
        </CardHeader>
        <TabsContent className="h-full" value="today">
          <CardContent className="h-80">
            {RevenueStatistics?.today.new_order_amount ||
            RevenueStatistics?.today.renewal_order_amount ? (
              <ChartContainer
                className="mx-auto max-h-80"
                config={IncomeStatisticsConfig}
              >
                <PieChart>
                  <ChartLegend content={<ChartLegendContent />} />
                  <ChartTooltip
                    content={<ChartTooltipContent hideLabel />}
                    cursor={false}
                  />
                  <Pie
                    data={[
                      {
                        type: "new_purchase",
                        value: unitConversion(
                          "centsToDollars",
                          RevenueStatistics?.today.new_order_amount
                        ),
                        fill: "var(--color-new_purchase)",
                      },
                      {
                        type: "repurchase",
                        value: unitConversion(
                          "centsToDollars",
                          RevenueStatistics?.today.renewal_order_amount
                        ),
                        fill: "var(--color-repurchase)",
                      },
                    ]}
                    dataKey="value"
                    innerRadius={50}
                    nameKey="type"
                    strokeWidth={5}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              dominantBaseline="middle"
                              textAnchor="middle"
                              x={viewBox.cx}
                              y={viewBox.cy}
                            >
                              <tspan
                                className="fill-foreground font-bold text-2xl"
                                x={viewBox.cx}
                                y={viewBox.cy}
                              >
                                {unitConversion(
                                  "centsToDollars",
                                  RevenueStatistics?.today.amount_total
                                )}
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Empty />
              </div>
            )}
          </CardContent>
          <CardFooter className="!py-5 flex h-20 flex-row border-t">
            <div className="flex w-full items-center gap-2">
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-muted-foreground text-xs">
                  {t("totalIncome", "Total Income")}
                </div>
                <div className="font-bold text-xl tabular-nums leading-none">
                  <Display
                    type="currency"
                    value={RevenueStatistics?.today.amount_total}
                  />
                </div>
              </div>
              <Separator className="!h-10 mx-2 w-px" orientation="vertical" />
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-muted-foreground text-xs">
                  {IncomeStatisticsConfig.new_purchase.label}
                </div>
                <div className="font-bold text-xl tabular-nums leading-none">
                  <Display
                    type="currency"
                    value={RevenueStatistics?.today.new_order_amount}
                  />
                </div>
              </div>
              <Separator className="!h-10 mx-2 w-px" orientation="vertical" />
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-muted-foreground text-xs">
                  {IncomeStatisticsConfig.repurchase.label}
                </div>
                <div className="font-bold text-xl tabular-nums leading-none">
                  <Display
                    type="currency"
                    value={RevenueStatistics?.today.renewal_order_amount}
                  />
                </div>
              </div>
            </div>
          </CardFooter>
        </TabsContent>

        <TabsContent className="h-full" value="month">
          <CardContent className="h-80">
            {RevenueStatistics?.monthly.list &&
            RevenueStatistics?.monthly.list.length > 0 ? (
              <ChartContainer
                className="max-h-80 w-full"
                config={IncomeStatisticsConfig}
              >
                <BarChart
                  accessibilityLayer
                  data={
                    RevenueStatistics?.monthly.list?.map((item) => ({
                      date: item.date,
                      new_purchase: unitConversion(
                        "centsToDollars",
                        item.new_order_amount
                      ),
                      repurchase: unitConversion(
                        "centsToDollars",
                        item.renewal_order_amount
                      ),
                      total: unitConversion(
                        "centsToDollars",
                        item.new_order_amount + item.renewal_order_amount
                      ),
                    })) || []
                  }
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    axisLine={false}
                    dataKey="date"
                    tickFormatter={(value) => {
                      const [year, month, day] = value.split("-");
                      return new Date(year, month - 1, day).toLocaleDateString(
                        locale,
                        {
                          month: "short",
                          day: "numeric",
                        }
                      );
                    }}
                    tickLine={false}
                    tickMargin={10}
                  />
                  <Bar
                    dataKey="new_purchase"
                    fill="var(--color-new_purchase)"
                    radius={[0, 0, 4, 4]}
                    stackId="a"
                  />
                  <Bar
                    dataKey="repurchase"
                    fill="var(--color-repurchase)"
                    radius={[4, 4, 0, 0]}
                    stackId="a"
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name, item, index) => (
                          <>
                            <div
                              className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                              style={
                                {
                                  "--color-bg": `var(--color-${name})`,
                                } as React.CSSProperties
                              }
                            />
                            {IncomeStatisticsConfig[
                              name as keyof typeof IncomeStatisticsConfig
                            ]?.label || name}
                            <div className="ml-auto flex items-baseline gap-0.5 font-medium font-mono text-foreground tabular-nums">
                              {value}
                            </div>
                            {index === 1 && (
                              <div className="flex basis-full items-center border-t pt-1.5 font-medium text-foreground text-xs">
                                {t("totalIncome", "Total Income")}
                                <div className="ml-auto flex items-baseline gap-0.5 font-medium font-mono text-foreground tabular-nums">
                                  {item.payload.total}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      />
                    }
                    cursor={false}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Empty />
              </div>
            )}
          </CardContent>
          <CardFooter className="!py-5 flex h-20 flex-row border-t">
            <div className="flex w-full items-center gap-2">
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-muted-foreground text-xs">
                  {t("totalIncome", "Total Income")}
                </div>
                <div className="font-bold text-xl tabular-nums leading-none">
                  <Display
                    type="currency"
                    value={RevenueStatistics?.monthly.amount_total}
                  />
                </div>
              </div>
              <Separator className="!h-10 mx-2 w-px" orientation="vertical" />
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-muted-foreground text-xs">
                  {IncomeStatisticsConfig.new_purchase.label}
                </div>
                <div className="font-bold text-xl tabular-nums leading-none">
                  <Display
                    type="currency"
                    value={RevenueStatistics?.monthly.new_order_amount}
                  />
                </div>
              </div>
              <Separator className="!h-10 mx-2 w-px" orientation="vertical" />
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-muted-foreground text-xs">
                  {IncomeStatisticsConfig.repurchase.label}
                </div>
                <div className="font-bold text-xl tabular-nums leading-none">
                  <Display
                    type="currency"
                    value={RevenueStatistics?.monthly.renewal_order_amount}
                  />
                </div>
              </div>
            </div>
          </CardFooter>
        </TabsContent>

        <TabsContent className="h-full" value="total">
          <CardContent className="h-80">
            {RevenueStatistics?.all.list &&
            RevenueStatistics?.all.list.length > 0 ? (
              <ChartContainer
                className="max-h-80 w-full"
                config={IncomeStatisticsConfig}
              >
                <AreaChart
                  accessibilityLayer
                  data={
                    RevenueStatistics?.all.list?.map((item) => ({
                      date: item.date,
                      new_purchase: unitConversion(
                        "centsToDollars",
                        item.new_order_amount
                      ),
                      repurchase: unitConversion(
                        "centsToDollars",
                        item.renewal_order_amount
                      ),
                      total: unitConversion(
                        "centsToDollars",
                        item.new_order_amount + item.renewal_order_amount
                      ),
                    })) || []
                  }
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    axisLine={false}
                    dataKey="date"
                    tickFormatter={(value) => {
                      const [year, month] = value.split("-");
                      return new Date(year, month - 1).toLocaleDateString(
                        locale,
                        {
                          month: "short",
                        }
                      );
                    }}
                    tickLine={false}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name, item, index) => (
                          <>
                            <div
                              className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                              style={
                                {
                                  "--color-bg": `var(--color-${name})`,
                                } as React.CSSProperties
                              }
                            />
                            {IncomeStatisticsConfig[
                              name as keyof typeof IncomeStatisticsConfig
                            ]?.label || name}
                            <div className="ml-auto flex items-baseline gap-0.5 font-medium font-mono text-foreground tabular-nums">
                              {value}
                            </div>
                            {index === 1 && (
                              <div className="flex basis-full items-center border-t pt-1.5 font-medium text-foreground text-xs">
                                {t("totalIncome", "Total Income")}
                                <div className="ml-auto flex items-baseline gap-0.5 font-medium font-mono text-foreground tabular-nums">
                                  {item.payload.total}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      />
                    }
                    cursor={false}
                  />
                  <Area
                    dataKey="new_purchase"
                    fill="var(--color-new_purchase)"
                    fillOpacity={0.4}
                    stackId="a"
                    stroke="var(--color-new_purchase)"
                    type="natural"
                  />
                  <Area
                    dataKey="repurchase"
                    fill="var(--color-repurchase)"
                    fillOpacity={0.4}
                    stackId="a"
                    stroke="var(--color-repurchase)"
                    type="natural"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Empty />
              </div>
            )}
          </CardContent>
          <CardFooter className="!py-5 flex h-20 flex-row border-t">
            <div className="flex w-full items-center gap-2">
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-muted-foreground text-xs">
                  {t("totalIncome", "Total Income")}
                </div>
                <div className="font-bold text-xl tabular-nums leading-none">
                  <Display
                    type="currency"
                    value={RevenueStatistics?.all.amount_total}
                  />
                </div>
              </div>
            </div>
          </CardFooter>
        </TabsContent>
      </Card>
    </Tabs>
  );
}
