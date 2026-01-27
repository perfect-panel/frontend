"use client";

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { EnhancedInput } from "@workspace/ui/composed/enhanced-input";
import { Icon } from "@workspace/ui/composed/icon";
import { cn } from "@workspace/ui/lib/utils";
import { prePurchaseOrder, purchase } from "@workspace/ui/services/user/portal";
import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { SubscribeBilling } from "@/sections/subscribe/billing";
import CouponInput from "@/sections/subscribe/coupon-input";
import { SubscribeDetail } from "@/sections/subscribe/detail";
import DurationSelector from "@/sections/subscribe/duration-selector";
import PaymentMethods from "@/sections/subscribe/payment-methods";
import { useGlobalStore } from "@/stores/global";

export default function Content({
  subscription,
}: {
  subscription?: API.Subscribe;
}) {
  const { t } = useTranslation("subscribe");
  const unitTimeMap: Record<string, string> = {
    Day: t("Day", "Day"),
    Hour: t("Hour", "Hour"),
    Minute: t("Minute", "Minute"),
    Month: t("Month", "Month"),
    NoLimit: t("NoLimit", "No Limit"),
    Year: t("Year", "Year"),
  };
  const { common } = useGlobalStore();
  const navigate = useNavigate();
  const [params, setParams] = useState<API.PortalPurchaseRequest>({
    quantity: 1,
    subscribe_id: 0,
    payment: -1,
    coupon: "",
    auth_type: "email",
    identifier: "",
    password: "",
  });
  const [loading, startTransition] = useTransition();
  const [isEmailValid, setIsEmailValid] = useState({
    valid: false,
    message: "",
  });

  const { data: order } = useQuery({
    enabled: !!subscription?.id && !!params.payment,
    queryKey: [
      "preCreateOrder",
      params.coupon,
      params.quantity,
      params.payment,
    ],
    queryFn: async () => {
      const { data } = await prePurchaseOrder({
        ...params,
        subscribe_id: subscription?.id as number,
      } as API.PrePurchaseOrderRequest);
      return data.data;
    },
  });

  useEffect(() => {
    if (subscription) {
      setParams((prev) => ({
        ...prev,
        quantity: 1,
        subscribe_id: subscription?.id,
      }));
    }
  }, [subscription]);

  const handleChange = useCallback(
    (field: keyof typeof params, value: string | number) => {
      setParams((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    startTransition(async () => {
      try {
        const { data } = await purchase(params);
        const { order_no } = data.data!;
        if (order_no) {
          localStorage.setItem(
            order_no,
            JSON.stringify({
              auth_type: params.auth_type,
              identifier: params.identifier,
            })
          );
          navigate({ to: "/purchasing/order", search: { order_no } });
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, [params, navigate]);

  if (!subscription) {
    return (
      <div className="p-6 text-center">
        {t("subscriptionNotFound", "Subscription not found")}
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 flex max-w-4xl flex-col gap-8 md:grid md:grid-cols-2 md:flex-row">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            {t(
              "emailInputTitle",
              "Enter the email address for your {{siteName}} account",
              {
                siteName: common.site.site_name,
              }
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <EnhancedInput
                className={cn({
                  "border-destructive":
                    !isEmailValid.valid && params.identifier !== "",
                })}
                onValueChange={(value: string) => {
                  const email = value as string;
                  setParams((prev) => ({
                    ...prev,
                    identifier: email,
                  }));
                  const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!reg.test(email)) {
                    setIsEmailValid({
                      valid: false,
                      message: t(
                        "invalidEmail",
                        "Please enter a valid email address"
                      ),
                    });
                  } else if (common.auth.email.enable_domain_suffix) {
                    const domain = email.split("@")[1];
                    const isValid = common.auth.email?.domain_suffix_list
                      .split("\n")
                      .includes(domain || "");
                    if (!isValid) {
                      setIsEmailValid({
                        valid: false,
                        message: t(
                          "emailDomainNotAllowed",
                          "Email domain is not in the whitelist"
                        ),
                      });
                      return;
                    }
                  } else {
                    setIsEmailValid({
                      valid: true,
                      message: "",
                    });
                  }
                }}
                placeholder="Email"
                required
                type="email"
                value={params.identifier || ""}
              />
              <p
                className={cn("text-muted-foreground text-xs", {
                  "text-destructive":
                    !isEmailValid.valid && params.identifier !== "",
                })}
              >
                {isEmailValid.message ||
                  t("emailRequired", "Please enter your email address.")}
              </p>
            </div>
            {params.identifier && isEmailValid.valid && (
              <div className="flex flex-col gap-2">
                <EnhancedInput
                  onValueChange={(value: string) =>
                    handleChange("password", value)
                  }
                  placeholder="Password"
                  type="password"
                  value={params.password || ""}
                />
                <p className="text-muted-foreground text-xs">
                  {t(
                    "passwordHint",
                    "If you do not enter a password, we will automatically generate one and send it to your email."
                  )}
                </p>
              </div>
            )}
            {/* <div>
              <OAuthMethods />
            </div> */}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="grid gap-3 text-sm">
            <h2 className="font-semibold text-xl">{subscription.name}</h2>
            <ul className="flex flex-grow flex-col gap-3">
              {(() => {
                let parsedDescription: {
                  description: string;
                  features: Array<{
                    icon: string;
                    label: string;
                    type: "default" | "success" | "destructive";
                  }>;
                };
                try {
                  parsedDescription = JSON.parse(subscription.description);
                } catch {
                  parsedDescription = { description: "", features: [] };
                }

                const { description, features } = parsedDescription;
                return (
                  <>
                    {description && (
                      <li className="text-muted-foreground">{description}</li>
                    )}
                    {features?.map(
                      (
                        feature: {
                          icon: string;
                          label: string;
                          type: "default" | "success" | "destructive";
                        },
                        index: number
                      ) => (
                        <li
                          className={cn("flex items-center gap-1", {
                            "text-muted-foreground line-through":
                              feature.type === "destructive",
                          })}
                          key={index}
                        >
                          {feature.icon && (
                            <Icon
                              className={cn("size-5 text-primary", {
                                "text-green-500": feature.type === "success",
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
                ...subscription,
                quantity: params.quantity,
              }}
            />
            <Separator />
            <SubscribeBilling
              order={{
                ...order,
                quantity: params.quantity,
                unit_price: subscription?.unit_price,
                show_original_price: subscription?.show_original_price,
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-6">
              <DurationSelector
                discounts={subscription?.discount}
                onChange={(value: number) => handleChange("quantity", value)}
                quantity={params.quantity!}
                unitTime={
                  unitTimeMap[subscription.unit_time!] || subscription.unit_time
                }
              />
              <CouponInput
                coupon={params.coupon}
                onChange={(value: string) => handleChange("coupon", value)}
              />
              <PaymentMethods
                balance={false}
                onChange={(value: number) => handleChange("payment", value)}
                value={params.payment!}
              />
            </div>
          </CardContent>
        </Card>

        <Button
          className="w-full"
          disabled={!isEmailValid.valid || loading}
          onClick={handleSubmit}
          size="lg"
        >
          {loading && <LoaderCircle className="mr-2 animate-spin" />}
          {t("buyNow", "Buy Now")}
        </Button>
      </div>
    </div>
  );
}
