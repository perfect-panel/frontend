import { getV1PublicPortalSubscribe as getSubscription } from "@workspace/ui/services/user/user";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Content } from "./content";

export function ProductShowcase() {
  const { i18n } = useTranslation();
  const [subscriptionList, setSubscriptionList] = useState<API.Subscribe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const { data } = await getSubscription(
          {
            language: i18n.language,
          },
          {
            skipErrorHandler: true,
          }
        );
        setSubscriptionList(data.data?.list || []);
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, [i18n.language]);

  if (isLoading || subscriptionList.length === 0) return null;

  return <Content subscriptionData={subscriptionList} />;
}
