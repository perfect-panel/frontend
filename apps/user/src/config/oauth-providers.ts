export const OAUTH_PROVIDER_META: Record<
  string,
  {
    icon: string;
    label: string;
  }
> = {
  apple: {
    icon: "uil:apple",
    label: "Apple",
  },
  facebook: {
    icon: "logos:facebook",
    label: "Facebook",
  },
  github: {
    icon: "uil:github",
    label: "GitHub",
  },
  google: {
    icon: "logos:google-icon",
    label: "Google",
  },
  telegram: {
    icon: "logos:telegram",
    label: "Telegram",
  },
};

export function getOAuthProviderMeta(provider: string) {
  return (
    OAUTH_PROVIDER_META[provider] || {
      icon: "mdi:account-circle-outline",
      label: provider,
    }
  );
}
