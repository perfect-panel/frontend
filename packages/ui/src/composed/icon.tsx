"use client";

import {
  Icon as Iconify,
  type IconifyIcon,
  type IconProps,
} from "@iconify/react";
import { useEffect, useState } from "react";
import { isBundledIcon, loadBundledIcon } from "./icons";

const EMPTY_ICON: IconifyIcon = {
  body: "",
  height: 24,
  width: 24,
};

interface LoadedIcon {
  data: IconifyIcon;
  name: string;
}

export function Icon(props: IconProps) {
  const [loadedIcon, setLoadedIcon] = useState<LoadedIcon>();
  const iconName = typeof props.icon === "string" ? props.icon : undefined;
  const usesBundledIcon = Boolean(iconName && isBundledIcon(iconName));

  useEffect(() => {
    if (!(iconName && isBundledIcon(iconName))) {
      return;
    }

    let active = true;
    loadBundledIcon(iconName).then((data) => {
      if (active && data) {
        setLoadedIcon({ data, name: iconName });
      }
    });

    return () => {
      active = false;
    };
  }, [iconName]);

  const icon = usesBundledIcon
    ? loadedIcon && loadedIcon.name === iconName
      ? loadedIcon.data
      : EMPTY_ICON
    : props.icon;

  return <Iconify {...props} icon={icon} />;
}
