"use client";

import { useRouter, useSearch } from "@tanstack/react-router";
import { postAuthOauthLoginToken as oAuthLoginGetToken } from "@workspace/ui/services/common/common";
import { useEffect } from "react";
import { getRedirectUrl, setAuthorization } from "@/utils/common";

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
    const inviteCode = localStorage.getItem("invite") || "";
    oAuthLoginGetToken({
      method: platform,
      callback: searchParams as Record<string, string>,
      ...(inviteCode && { invite: inviteCode }),
    } as API.OAuthLoginGetTokenRequest)
      .then((res) => {
        const token = res?.data?.data?.token;
        if (!token) {
          throw new Error("Invalid token");
        }
        setAuthorization(token);
        router.navigate({ to: getRedirectUrl() });
      })
      .catch(() => {
        router.navigate({ to: "/auth" });
      });
  }, [platform, router, searchParams]);

  return children;
}
