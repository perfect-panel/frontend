"use client";

import { Button } from "@workspace/ui/components/button";
import { Icon } from "@workspace/ui/composed/icon";
import { oAuthLogin } from "@workspace/ui/services/common/oauth";
import { useGlobalStore } from "@/stores/global";

const icons = {
  apple: "uil:apple",
  google: "logos:google-icon",
  facebook: "logos:facebook",
  github: "uil:github",
  telegram: "logos:telegram",
};

export function OAuthMethods() {
  const { common } = useGlobalStore();
  const { oauth_methods } = common;
  const OAUTH_METHODS = oauth_methods?.filter(
    (method: string) => !["mobile", "email", "device"].includes(method)
  );
  return (
    OAUTH_METHODS?.length > 0 && (
      <>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <div className="mt-6 flex justify-center gap-4 *:size-12 *:p-2">
          {OAUTH_METHODS?.map((method: string) => (
            <Button
              asChild
              key={method}
              onClick={async () => {
                const { data } = await oAuthLogin({
                  method,
                  // OAuth providers disallow URL fragments (#) in redirect URIs.
                  // Use a real path (with trailing slash so static hosting can serve /oauth/<provider>/index.html)
                  // which then bridges into our hash-router at /#/oauth/<provider>.
                  redirect: `${window.location.origin}/oauth/${method}/`,
                });
                if (data.data?.redirect) {
                  window.location.href = data.data?.redirect;
                }
              }}
              size="icon"
              variant="ghost"
            >
              <Icon icon={icons[method as keyof typeof icons]} />
            </Button>
          ))}
        </div>
      </>
    )
  );
}
