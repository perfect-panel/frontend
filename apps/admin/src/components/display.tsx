import { formatBytes } from "@workspace/ui/utils/formatting";
import { unitConversion } from "@workspace/ui/utils/unit-conversions";
import { useTranslation } from "react-i18next";
import { useGlobalStore } from "@/stores/global";

type DisplayType = "currency" | "traffic" | "number" | "trafficSpeed";

interface DisplayProps<T> {
  value?: T;
  unlimited?: boolean;
  type?: DisplayType;
}

export function Display<T extends number | undefined | null>({
  value = 0,
  unlimited = false,
  type = "number",
}: DisplayProps<T>): string {
  const { t } = useTranslation("components");
  const { common } = useGlobalStore();
  const { currency } = common;

  if (type === "currency") {
    const formattedValue = `${currency?.currency_symbol ?? ""}${unitConversion("centsToDollars", value as number)?.toFixed(2) ?? "0.00"}`;
    return formattedValue;
  }

  if (
    ["traffic", "trafficSpeed", "number"].includes(type) &&
    unlimited &&
    (value === 0 || value === null || value === undefined)
  ) {
    return t("unlimited");
  }

  if (type === "traffic") {
    return value ? formatBytes(value) : "0";
  }

  if (type === "trafficSpeed") {
    return value ? `${formatBytes(value).replace("B", "b")}ps` : "0";
  }

  if (type === "number") {
    return value !== null && value !== undefined ? value.toString() : "0";
  }

  return "0";
}
