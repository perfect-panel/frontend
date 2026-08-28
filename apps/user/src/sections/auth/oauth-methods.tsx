"use client";

import { useSearch } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { Icon } from "@workspace/ui/composed/icon";
import { postAuthOauthLogin as oAuthLogin } from "@workspace/ui/services/common/common";
import { useRef, useState } from "react";
import { useGlobalStore } from "@/stores/global";
import { getRedirectUrl, setRedirectUrl } from "@/utils/common";
import { storeOAuthCfToken, storeOAuthInvite } from "@/utils/oauth";
import CloudFlareTurnstile, { type TurnstileRef } from "./turnstile";

const icons = {
  apple: "uil:apple",
  google: "logos:google-icon",
  facebook: "logos:facebook",
  github: "uil:github",
  telegram: "logos:telegram",
} as const;

type OAuthMethod = keyof typeof icons;

function isOAuthMethod(method: string): method is OAuthMethod {
  return Object.hasOwn(icons, method);
}

export function OAuthMethods() {
  const searchParams = useSearch({ strict: false }) as { invite?: string };
  const { common } = useGlobalStore();
  const { oauth_methods, verify } = common;
  const OAUTH_METHODS = oauth_methods?.filter(
    (method: string): method is OAuthMethod => isOAuthMethod(method)
  );
  const [cfToken, setCfToken] = useState("");
  const [loadingMethod, setLoadingMethod] = useState<OAuthMethod>();
  const turnstile = useRef<TurnstileRef>(null);
  const requiresRegistrationVerification = Boolean(
    verify.enable_register_verify && verify.turnstile_site_key
  );

  const handleOAuthLogin = async (method: OAuthMethod) => {
    setLoadingMethod(method);
    try {
      const { data } = await oAuthLogin({
        method,
        // OAuth providers disallow URL fragments (#) in redirect URIs.
        // Use a real path (with trailing slash so static hosting can serve /oauth/<provider>/index.html)
        // which then bridges into our hash-router at /#/oauth/<provider>.
        redirect: `${window.location.origin}/oauth/${method}/`,
      });
      const redirect = data.data?.redirect;
      if (!redirect) return;

      // Both values must survive the full-page round trip through the provider.
      setRedirectUrl(getRedirectUrl({ consumeStored: false }));
      storeOAuthCfToken(cfToken);
      storeOAuthInvite(searchParams.invite);
      window.location.assign(redirect);
    } catch {
      // The request layer displays the API error. Reset one-time challenges so
      // the next attempt cannot accidentally reuse an expired token.
      storeOAuthCfToken();
      storeOAuthInvite();
      setCfToken("");
      turnstile.current?.reset();
    } finally {
      setLoadingMethod(undefined);
    }
  };

  return (
    OAUTH_METHODS?.length > 0 && (
      <>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <div className="mt-6 flex justify-center gap-4 *:size-12 *:p-2">
          {OAUTH_METHODS.map((method) => (
            <Button
              aria-label={`Continue with ${method}`}
              disabled={
                Boolean(loadingMethod) ||
                (requiresRegistrationVerification && !cfToken)
              }
              key={method}
              onClick={() => handleOAuthLogin(method)}
              size="icon"
              title={`Continue with ${method}`}
              type="button"
              variant="ghost"
            >
              <Icon
                className={loadingMethod === method ? "animate-pulse" : ""}
                icon={icons[method]}
              />
            </Button>
          ))}
        </div>
        {requiresRegistrationVerification && (
          <div className="mt-4 flex justify-center">
            <CloudFlareTurnstile
              id="oauth-turnstile"
              onChange={(token) => setCfToken(token || "")}
              ref={turnstile}
              value={cfToken}
            />
          </div>
        )}
      </>
    )
  );
}
