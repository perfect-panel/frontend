import { Button } from "@workspace/ui/components/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Icon } from "@workspace/ui/composed/icon";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface TimezoneOption {
  value: string;
  label: string;
  timezone: string;
}

function getCurrentTime(timezone: string): string {
  try {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "--:--";
  }
}

function getAllTimezones(locale = "en-US"): TimezoneOption[] {
  try {
    const timeZones = Intl.supportedValuesOf("timeZone");

    const processed = timeZones
      .map((tz) => {
        try {
          return {
            value: tz,
            label: tz,
            timezone: getTimezoneOffset(tz),
          };
        } catch {
          return {
            value: tz,
            label: tz,
            timezone: "UTC+00:00",
          };
        }
      })
      .filter(Boolean)
      .sort((a, b) => a.label.localeCompare(b.label, locale));

    const hasUTC = processed.some((tz) => tz.value === "UTC");
    if (!hasUTC) {
      processed.unshift({
        value: "UTC",
        label: "UTC",
        timezone: "UTC+00:00",
      });
    }

    return processed;
  } catch {
    return [
      {
        value: "UTC",
        label: "UTC",
        timezone: "UTC+00:00",
      },
    ];
  }
}

function getServerTimezones(): string[] {
  return ["UTC"];
}

function getRecommendedTimezones(): string[] {
  try {
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (browserTimezone.startsWith("Asia/")) {
      return [
        "Asia/Shanghai",
        "Asia/Tokyo",
        "Asia/Kolkata",
        "Asia/Singapore",
        "Asia/Seoul",
      ];
    }
    if (browserTimezone.startsWith("Europe/")) {
      return [
        "Europe/London",
        "Europe/Paris",
        "Europe/Berlin",
        "Europe/Rome",
        "Europe/Madrid",
      ];
    }
    if (browserTimezone.startsWith("America/")) {
      return [
        "America/New_York",
        "America/Los_Angeles",
        "America/Chicago",
        "America/Denver",
        "America/Toronto",
      ];
    }
    if (browserTimezone.startsWith("Australia/")) {
      return [
        "Australia/Sydney",
        "Australia/Melbourne",
        "Australia/Perth",
        "Australia/Brisbane",
      ];
    }
    return [
      "America/New_York",
      "Europe/London",
      "Asia/Shanghai",
      "Asia/Tokyo",
      "Australia/Sydney",
    ];
  } catch {
    return [
      "America/New_York",
      "Europe/London",
      "Asia/Shanghai",
      "Asia/Tokyo",
      "Australia/Sydney",
    ];
  }
}

export function getTimezoneOffset(timezone: string, date = new Date()): string {
  try {
    const offsetName = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "longOffset",
    })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value;

    if (!offsetName || offsetName === "GMT" || offsetName === "UTC") {
      return "UTC+00:00";
    }

    const match = /^(?:GMT|UTC)([+-])(\d{1,2})(?::?(\d{2}))?$/.exec(offsetName);
    if (!match) return "UTC+00:00";

    const [, sign, hour = "0", minute = "0"] = match;
    const hours = Number(hour);
    const minutes = Number(minute);
    if (hours > 23 || minutes > 59) return "UTC+00:00";
    if (hours === 0 && minutes === 0) return "UTC+00:00";

    return `UTC${sign}${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
  } catch {
    return "UTC+00:00";
  }
}

export default function TimezoneSwitch() {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const [timezone, setTimezone] = useState<string>("UTC");
  const [open, setOpen] = useState(false);

  const timezoneOptions = useMemo(() => getAllTimezones(locale), [locale]);

  useEffect(() => {
    const savedTimezone = localStorage.getItem("timezone");
    if (savedTimezone) {
      setTimezone(savedTimezone);
    } else {
      try {
        const browserTimezone =
          Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(browserTimezone);
        localStorage.setItem("timezone", browserTimezone);
      } catch {
        setTimezone("UTC");
      }
    }
  }, []);

  const handleTimezoneChange = (newTimezone: string) => {
    setTimezone(newTimezone);
    localStorage.setItem("timezone", newTimezone);
    setOpen(false);

    window.dispatchEvent(
      new CustomEvent("timezoneChanged", {
        detail: { timezone: newTimezone },
      })
    );
  };
  const serverTimezones = timezoneOptions.filter(
    (option) =>
      getServerTimezones().includes(option.value) && option.value !== timezone
  );

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button className="p-0" size="icon" variant="ghost">
          <Icon className="!size-6" icon="flat-color-icons:overtime" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandGroup heading="Current">
              {timezoneOptions
                .filter((option) => option.value === timezone)
                .map((option) => (
                  <CommandItem
                    className="bg-primary/10"
                    key={option.value}
                    onSelect={() => handleTimezoneChange(option.value)}
                    value={`${option.label} ${option.value}`}
                  >
                    <div className="flex w-full items-center gap-3">
                      <div className="flex flex-1 flex-col">
                        <span className="font-medium">{option.value}</span>
                        <span className="text-muted-foreground text-xs">
                          {option.timezone} • {getCurrentTime(option.value)}
                        </span>
                      </div>
                      <Icon className="h-4 w-4 opacity-100" icon="uil:check" />
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
            {serverTimezones.length > 0 && (
              <CommandGroup heading="Server">
                {serverTimezones.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleTimezoneChange(option.value)}
                    value={`${option.label} ${option.value}`}
                  >
                    <div className="flex w-full items-center gap-3">
                      <div className="flex flex-1 flex-col">
                        <span className="font-medium">{option.value}</span>
                        <span className="text-muted-foreground text-xs">
                          {option.timezone} • {getCurrentTime(option.value)}
                        </span>
                      </div>
                      <Icon className="h-4 w-4 opacity-0" icon="uil:check" />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            <CommandGroup heading="Recommended">
              {timezoneOptions
                .filter(
                  (option) =>
                    getRecommendedTimezones().includes(option.value) &&
                    option.value !== timezone
                )
                .map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleTimezoneChange(option.value)}
                    value={`${option.label} ${option.value}`}
                  >
                    <div className="flex w-full items-center gap-3">
                      <div className="flex flex-1 flex-col">
                        <span className="font-medium">{option.value}</span>
                        <span className="text-muted-foreground text-xs">
                          {option.timezone} • {getCurrentTime(option.value)}
                        </span>
                      </div>
                      <Icon className="h-4 w-4 opacity-0" icon="uil:check" />
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>

            <CommandGroup heading="All">
              {timezoneOptions
                .filter(
                  (option) =>
                    !(
                      getServerTimezones().includes(option.value) ||
                      getRecommendedTimezones().includes(option.value)
                    ) && option.value !== timezone
                )
                .map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleTimezoneChange(option.value)}
                    value={`${option.label} ${option.value}`}
                  >
                    <div className="flex w-full items-center gap-3">
                      <div className="flex flex-1 flex-col">
                        <span className="font-medium">{option.value}</span>
                        <span className="text-muted-foreground text-xs">
                          {option.timezone} • {getCurrentTime(option.value)}
                        </span>
                      </div>
                      <Icon className="h-4 w-4 opacity-0" icon="uil:check" />
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
