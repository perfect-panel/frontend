"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Command,
  CommandEmpty,
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
import { cn } from "@workspace/ui/lib/utils";
import { countries, type ICountry } from "@workspace/ui/utils/countries";
import { BoxIcon, Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface AreaCodeSelectProps {
  value?: string;
  onChange?: (value: ICountry) => void;
  className?: string;
  placeholder?: string;
  simple?: boolean;
  whitelist?: string[];
}

const filterItems = (whitelist?: string[]) => {
  const baseItems = countries
    .filter((item) => !!item.phone)
    .flatMap((item) => {
      const phones = item.phone!.split(",");
      if (phones.length > 1) {
        return [...phones].map((phone) => ({
          ...item,
          phone,
        }));
      }
      return item;
    });

  if (!whitelist?.length) return baseItems;
  return baseItems.filter((item) => whitelist.includes(item.phone!));
};

export const AreaCodeSelect = ({
  value,
  onChange,
  className,
  placeholder,
  simple = false,
  whitelist,
}: AreaCodeSelectProps) => {
  const { t } = useTranslation("components");
  const resolvedPlaceholder =
    placeholder ?? t("areaCode.select", "Select Area Code");
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ICountry | undefined>();
  const items = filterItems(whitelist);

  useEffect(() => {
    if (value !== selectedItem?.phone) {
      const found = items.find((item) => item.phone === value);
      setSelectedItem(found);
    }
  }, [selectedItem?.phone, value, items]);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={cn("justify-between", className)}
          role="combobox"
          variant="outline"
        >
          {selectedItem ? (
            <div className="flex items-center gap-2">
              <Icon
                className="!size-5"
                icon={`flagpack:${selectedItem.alpha2.toLowerCase()}`}
              />
              +{selectedItem.phone}
              {!simple && `(${selectedItem.name})`}
            </div>
          ) : (
            resolvedPlaceholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0">
        <Command>
          <CommandInput
            placeholder={t("areaCode.search", "Search area code...")}
          />
          <CommandList>
            <CommandEmpty>
              <BoxIcon className="inline-block text-slate-500" />
            </CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={`${item.alpha2}-${item.phone}`}
                  onSelect={() => {
                    setSelectedItem(item);
                    onChange?.(item);
                    setOpen(false);
                  }}
                  value={`${item.phone}-${item.name}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      className="!size-5"
                      icon={`flagpack:${item.alpha2.toLowerCase()}`}
                    />
                    +{item.phone} ({item.name})
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedItem?.phone === item.phone
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
