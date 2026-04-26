import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { useTranslation } from "react-i18next";
import { CDN_URL } from "@/config";

interface BillingProps {
  type: "dashboard" | "payment";
}

interface ItemType {
  logo: string;
  title: string;
  description: string;
  expiryDate: string;
  href: string;
}

// Sponsor card data lives in perfect-panel/ppanel-assets. To enable, set
// VITE_CDN_URL to a mirror of jsDelivr (e.g. https://cdn.jsdmirror.com or
// your own CDN). When VITE_CDN_URL is empty the card is hidden and no
// network call is made.
async function getBillingURL(cdnBase: string) {
  const fallback = `${cdnBase}/gh/perfect-panel/ppanel-assets/billing/index.json`;
  try {
    const response = await fetch(
      "https://api.github.com/repos/perfect-panel/ppanel-assets/commits"
    );
    const json = await response.json();
    const version = json[0]?.sha || "latest";
    const url = new URL(`${cdnBase}/gh/perfect-panel/ppanel-assets`);
    url.pathname += `@${version}/billing/index.json`;
    return url.toString();
  } catch (_error) {
    return fallback;
  }
}

export default function Billing({ type }: BillingProps) {
  const { t } = useTranslation("dashboard");
  const cdnEnabled = Boolean(CDN_URL);

  const { data: list } = useQuery({
    queryKey: ["billing", type, CDN_URL],
    queryFn: async () => {
      const url = await getBillingURL(CDN_URL);
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json();
      const now = Date.now();

      return Array.isArray(data[type])
        ? data[type].filter((item: { expiryDate: string }) => {
            const expiryDate = Date.parse(item.expiryDate);
            return !Number.isNaN(expiryDate) && expiryDate > now;
          })
        : [];
    },
    initialData: [],
    enabled: cdnEnabled,
  });

  if (!list?.length) return null;

  return (
    <>
      <h1 className="text mt-2 font-bold">
        <span>{t("billing.title", "Sponsor")}</span>
        <span className="ml-2 text-muted-foreground text-xs">
          {t(
            "billing.description",
            "Sponsoring helps PPanel to continue releasing updates!"
          )}
        </span>
      </h1>
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        {list.map((item: ItemType, index: number) => (
          <a
            href={item.href}
            key={index}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Card className="h-full cursor-pointer">
              <CardHeader className="flex flex-row gap-2 p-3">
                <Avatar>
                  <AvatarImage src={item.logo} />
                  <AvatarFallback>{item.title}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {item.description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </a>
        ))}
      </div>
    </>
  );
}
