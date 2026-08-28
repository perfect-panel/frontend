"use client";

import { useRouter, useSearch } from "@tanstack/react-router";
import { postV1PublicUserBindOauthCallback as bindOAuthCallback } from "@workspace/ui/services/user/user";
import { useEffect, useRef } from "react";
import { useGlobalStore } from "@/stores/global";

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
  const getUserInfo = useGlobalStore((state) => state.getUserInfo);
  const submitted = useRef(false);

  useEffect(() => {
    if (submitted.current) return;
    submitted.current = true;

    if (!isBindOAuthMethod(platform)) {
      router.navigate({ to: "/profile" });
      return;
    }

    const completeBinding = async () => {
      try {
        await bindOAuthCallback({
          method: platform,
          callback: searchParams as Record<string, string>,
        });
        await getUserInfo();
      } catch {
        // The request layer displays the failure. It does not invalidate the
        // existing login session, so return to the profile in either case.
      }
      await router.navigate({ to: "/profile" });
    };

    completeBinding();
  }, [getUserInfo, platform, router, searchParams]);

  return children;
}
