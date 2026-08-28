import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { getV1PublicPortalSubscribe as getSubscription } from "@workspace/ui/services/user/user";
import { useTranslation } from "react-i18next";
import Content from "./content";

export default function Purchasing() {
  const { id } = useSearch({ from: "/(main)/purchasing/" }) as { id: string };
  const { i18n } = useTranslation();
  const { data } = useQuery({
    queryKey: ["subscription", i18n.language],
    queryFn: async () => {
      const { data } = await getSubscription(
        {
          language: i18n.language,
        },
        {
          skipErrorHandler: true,
        }
      );
      return data.data?.list || [];
    },
  });

  const subscription = data?.find(
    (item: API.Subscribe) => item.id === Number(id)
  );

  return (
    <main className="container space-y-16">
      <Content subscription={subscription} />
    </main>
  );
}
