import { Link } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Icon } from "@workspace/ui/composed/icon";
import { cn } from "@workspace/ui/lib/utils";
import { motion } from "framer-motion";
import type { Key, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Display } from "@/components/display";
import { SubscribeDetail } from "@/sections/subscribe/detail";
import { useGlobalStore } from "@/stores/global";

interface ProductShowcaseProps {
  subscriptionData: API.Subscribe[];
}

export function Content({ subscriptionData }: ProductShowcaseProps) {
  const { t } = useTranslation("main");
  const { user } = useGlobalStore();

  const unitTimeMap: Record<string, string> = {
    Day: t("Day", "Day"),
    Hour: t("Hour", "Hour"),
    Minute: t("Minute", "Minute"),
    Month: t("Month", "Month"),
    NoLimit: t("NoLimit", "No Limit"),
    Year: t("Year", "Year"),
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1 }}
    >
      <motion.h2
        className="mb-2 text-center font-bold text-3xl"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {t("product_showcase_title", "Choose Your Package")}
      </motion.h2>
      <motion.p
        className="mb-8 text-center text-lg text-muted-foreground"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {t(
          "product_showcase_description",
          "Let us help you select the package that best suits you and enjoy exploring it."
        )}
      </motion.p>
      <div className="mx-auto flex flex-wrap justify-center gap-8 overflow-x-auto overflow-y-hidden *:max-w-80 *:flex-auto">
        {subscriptionData?.map((item, index) => (
          <motion.div
            className="w-1/2 lg:w-1/4"
            initial={{ opacity: 0, y: 50 }}
            key={item.id}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Card className="flex flex-col gap-0 overflow-hidden rounded-lg py-0 shadow-lg transition-shadow duration-300 hover:shadow-2xl">
              <CardHeader className="bg-muted/50 p-4 font-medium text-xl">
                {item.name}
              </CardHeader>
              <CardContent className="flex flex-grow flex-col gap-4 p-6 text-sm">
                <ul className="flex flex-grow flex-col gap-3">
                  {(() => {
                    let parsedDescription: {
                      description: string;
                      features: Array<{
                        icon: string;
                        label: ReactNode;
                        type: "default" | "success" | "destructive";
                      }>;
                    };
                    try {
                      parsedDescription = JSON.parse(item.description);
                    } catch {
                      parsedDescription = { description: "", features: [] };
                    }

                    const { description, features } = parsedDescription;
                    return (
                      <>
                        {description && (
                          <li className="text-muted-foreground">
                            {description}
                          </li>
                        )}
                        {features?.map(
                          (
                            feature: {
                              type: string;
                              icon: string;
                              label: ReactNode;
                            },
                            index: Key
                          ) => (
                            <li
                              className={cn("flex items-center gap-2", {
                                "text-muted-foreground line-through":
                                  feature.type === "destructive",
                              })}
                              key={index}
                            >
                              {feature.icon && (
                                <Icon
                                  className={cn("size-5 text-primary", {
                                    "text-green-500":
                                      feature.type === "success",
                                    "text-destructive":
                                      feature.type === "destructive",
                                  })}
                                  icon={feature.icon}
                                />
                              )}
                              {feature.label}
                            </li>
                          )
                        )}
                      </>
                    );
                  })()}
                </ul>
                <SubscribeDetail
                  subscribe={{
                    ...item,
                    name: undefined,
                  }}
                />
              </CardContent>
              <Separator />
              <CardFooter className="relative flex flex-col gap-4 p-4">
                {(() => {
                  const hasDiscount = item.discount && item.discount.length > 0;
                  const shouldShowOriginal = item.show_original_price !== false;

                  const displayPrice =
                    shouldShowOriginal || !hasDiscount
                      ? item.unit_price
                      : Math.round(
                          item.unit_price *
                            (item.discount?.[0]?.quantity ?? 1) *
                            ((item.discount?.[0]?.discount ?? 100) / 100)
                        );

                  const displayQuantity =
                    shouldShowOriginal || !hasDiscount
                      ? 1
                      : (item.discount?.[0]?.quantity ?? 1);

                  const unitTime =
                    unitTimeMap[item.unit_time!] ||
                    t(item.unit_time || "Month", item.unit_time || "Month");

                  return (
                    <motion.h2
                      animate={{ opacity: 1 }}
                      className="pb-4 font-semibold text-2xl sm:text-3xl"
                      initial={{ opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Display type="currency" value={displayPrice} />
                      <span className="font-medium text-base">
                        {displayQuantity === 1
                          ? `/${unitTime}`
                          : `/${displayQuantity} ${unitTime}`}
                      </span>
                    </motion.h2>
                  );
                })()}
                <motion.div>
                  <Button
                    asChild
                    className="absolute bottom-0 left-0 w-full rounded-t-none rounded-b-xl"
                  >
                    <Link
                      search={user ? undefined : { id: item.id }}
                      to={user ? "/subscribe" : "/purchasing"}
                    >
                      {t("subscribe", "Subscribe")}
                    </Link>
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
