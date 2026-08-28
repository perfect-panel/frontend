"use client";

import { useRouter, useSearch } from "@tanstack/react-router";
import { postAuthOauthLoginToken as oAuthLoginGetToken } from "@workspace/ui/services/common/common";
import { useEffect, useRef } from "react";
import { useGlobalStore } from "@/stores/global";
import { getRedirectUrl, setAuthorization } from "@/utils/common";
import { takeOAuthCfToken, takeOAuthInvite } from "@/utils/oauth";

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
  const getUserInfo = useGlobalStore((state) => state.getUserInfo);
  const submitted = useRef(false);

  useEffect(() => {
    if (submitted.current) return;
    submitted.current = true;

    const completeLogin = async () => {
      try {
        const cfToken = takeOAuthCfToken();
        const invite = takeOAuthInvite();
        const res = await oAuthLoginGetToken({
          method: platform,
          callback: searchParams as Record<string, string>,
          ...(cfToken && { cf_token: cfToken }),
          ...(invite && { invite }),
        });
        const token = res?.data?.data?.token;
        if (!token) {
          throw new Error("Invalid token");
        }
        setAuthorization(token);
        await getUserInfo();
        await router.navigate({ to: getRedirectUrl() });
      } catch {
        await router.navigate({ to: "/auth" });
      }
    };

    completeLogin();
  }, [getUserInfo, platform, router, searchParams]);

  return children;
}
