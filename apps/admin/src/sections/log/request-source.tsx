"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import {
  Globe2,
  MapPin,
  MonitorSmartphone,
  Network,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { IpLink } from "@/components/ip-link";
import { UserDetail } from "@/sections/user/user-detail";

export interface RequestRiskMetadata {
  actor_id?: number;
  client_ip?: string;
  ip_as_organization?: string;
  ip_asn?: number;
  ip_city?: string;
  ip_country?: string;
  ip_country_code?: string;
  ip_region?: string;
  user_agent?: string;
}

function clean(value?: string) {
  return value?.trim() || "";
}

export function formatRequestLocation(metadata: RequestRiskMetadata) {
  const seen = new Set<string>();

  return [metadata.ip_city, metadata.ip_region, metadata.ip_country]
    .map(clean)
    .filter((value) => {
      const key = value.toLocaleLowerCase();
      if (!value || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join(" · ");
}

function MetadataSection({
  children,
  icon,
  title,
}: {
  children: ReactNode;
  icon: ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-lg border bg-muted/15 p-4">
      <h3 className="mb-3 flex items-center gap-2 font-medium text-sm">
        <span className="text-muted-foreground">{icon}</span>
        {title}
      </h3>
      <dl className="grid gap-3 text-sm">{children}</dl>
    </section>
  );
}

function MetadataRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-[7rem_minmax(0,1fr)] items-start gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="wrap-break-word min-w-0 text-right">{value || "--"}</dd>
    </div>
  );
}

export function RequestSource({
  ip,
  metadata,
}: {
  ip?: string;
  metadata: RequestRiskMetadata;
}) {
  const { t } = useTranslation("log");
  const clientIp = clean(ip) || clean(metadata.client_ip);
  const countryCode = clean(metadata.ip_country_code).toUpperCase();
  const country = clean(metadata.ip_country);
  const region = clean(metadata.ip_region);
  const city = clean(metadata.ip_city);
  const location = formatRequestLocation(metadata);
  const userAgent = clean(metadata.user_agent);
  const organization = clean(metadata.ip_as_organization);
  const actorId = Number(metadata.actor_id) || 0;
  const asn = Number(metadata.ip_asn) || 0;
  const hasMetadata = Boolean(
    clientIp ||
      countryCode ||
      location ||
      userAgent ||
      organization ||
      actorId ||
      asn
  );

  if (!hasMetadata) {
    return <span className="text-muted-foreground">--</span>;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label={t(
            "requestSource.viewDetails",
            "View request source details"
          )}
          className="h-auto min-w-0 max-w-64 justify-start whitespace-normal px-2 py-1.5 text-left font-normal"
          variant="ghost"
        >
          <span className="grid min-w-0 gap-1">
            <span className="flex min-w-0 items-center gap-1.5">
              <MapPin className="size-3.5 text-muted-foreground" />
              <span className="truncate font-mono text-xs">
                {clientIp || t("requestSource.unknownIp", "IP unavailable")}
              </span>
              {countryCode ? (
                <Badge className="px-1.5 py-0 text-[10px]" variant="outline">
                  {countryCode}
                </Badge>
              ) : null}
            </span>
            {location ? (
              <span className="truncate text-muted-foreground text-xs">
                {location}
              </span>
            ) : null}
            {userAgent ? (
              <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground text-xs">
                <MonitorSmartphone className="size-3" />
                <span className="truncate">{userAgent}</span>
              </span>
            ) : null}
          </span>
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {t("requestSource.title", "Request source details")}
          </SheetTitle>
          <SheetDescription>
            {t(
              "requestSource.description",
              "Request identity, location and network risk metadata."
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-3 px-4 pb-6">
          <MetadataSection
            icon={<Globe2 className="size-4" />}
            title={t("requestSource.request", "Request")}
          >
            <MetadataRow
              label={t("requestSource.ip", "IP")}
              value={clientIp ? <IpLink ip={clientIp} /> : "--"}
            />
            <MetadataRow label="User-Agent" value={userAgent || "--"} />
          </MetadataSection>

          <MetadataSection
            icon={<MapPin className="size-4" />}
            title={t("requestSource.location", "Location")}
          >
            <MetadataRow
              label={t("requestSource.country", "Country")}
              value={
                country || countryCode ? (
                  <span className="inline-flex flex-wrap items-center justify-end gap-2">
                    {countryCode ? (
                      <Badge variant="outline">{countryCode}</Badge>
                    ) : null}
                    {country || null}
                  </span>
                ) : (
                  "--"
                )
              }
            />
            <MetadataRow
              label={t("requestSource.region", "Region")}
              value={region || "--"}
            />
            <MetadataRow
              label={t("requestSource.city", "City")}
              value={city || "--"}
            />
          </MetadataSection>

          <MetadataSection
            icon={<Network className="size-4" />}
            title={t("requestSource.network", "Network")}
          >
            <MetadataRow label="ASN" value={asn > 0 ? `AS${asn}` : "--"} />
            <MetadataRow
              label={t("requestSource.organization", "Organization")}
              value={organization || "--"}
            />
          </MetadataSection>

          <MetadataSection
            icon={<UserRound className="size-4" />}
            title={t("requestSource.actor", "Actor")}
          >
            <MetadataRow
              label={t("requestSource.account", "Account")}
              value={
                actorId > 0 ? (
                  <UserDetail id={actorId} />
                ) : (
                  t("requestSource.anonymous", "Anonymous or system")
                )
              }
            />
          </MetadataSection>
        </div>
      </SheetContent>
    </Sheet>
  );
}
