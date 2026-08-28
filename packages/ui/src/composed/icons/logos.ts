import type { IconifyIcon } from "@iconify/react";
import Apple from "@iconify-icons/logos/apple";
import Facebook from "@iconify-icons/logos/facebook";
import Github from "@iconify-icons/logos/github";
import Google from "@iconify-icons/logos/google";
import GoogleIcon from "@iconify-icons/logos/google-icon";
import MailgunIcon from "@iconify-icons/logos/mailgun-icon";
import Telegram from "@iconify-icons/logos/telegram";

export const icons: Readonly<Record<string, IconifyIcon>> = {
  apple: Apple,
  facebook: Facebook,
  github: Github,
  google: Google,
  "google-icon": GoogleIcon,
  "mailgun-icon": MailgunIcon,
  telegram: Telegram,
};
