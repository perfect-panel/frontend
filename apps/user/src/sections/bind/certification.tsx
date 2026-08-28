"use client";

import { useRouter, useSearch } from "@tanstack/react-router";
import { postV1PublicUserBindOauthCallback as bindOAuthCallback } from "@workspace/ui/services/user/user";
import { useEffect } from "react";

type BindOAuthMethod = API.BindOAuthCallbackRequest["method"];

function isBindOAuthMethod(platform: string): platform is BindOAuthMethod {
  return ["google", "apple", "telegram", "github"].includes(platform);
}

interface CertificationProps {
  platform: string;
  children: React.ReactNode;
}

export default function Certification({
  platform,
  children,
}: CertificationProps) {
  const router = useRouter();
  const searchParams = useSearch({ strict: false });

  useEffect(() => {
    if (!isBindOAuthMethod(platform)) {
      router.navigate({ to: "/profile" });
      return;
    }

    bindOAuthCallback({
      method: platform,
      callback: searchParams as Record<string, string>,
    })
      .then(() => {
        router.navigate({ to: "/profile" });
      })
      .catch(() => {
        router.navigate({ to: "/auth" });
      });
  }, [platform, router, searchParams]);

  return children;
}
