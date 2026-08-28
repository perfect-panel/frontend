import { getCommonSiteConfig as getGlobalConfig } from "@workspace/ui/services/common/common";
import { loadRequiredData } from "./global-config";

let initialConfigPromise: Promise<API.GetGlobalConfigResponse> | undefined;

// Called from main.tsx at module scope so the config request runs in parallel
// with translation loading instead of waiting for the first React commit.
// The root route awaits the same promise.
export function fetchInitialConfig(): Promise<API.GetGlobalConfigResponse> {
  if (!initialConfigPromise) {
    initialConfigPromise = loadRequiredData<API.GetGlobalConfigResponse>(
      getGlobalConfig,
      { attempts: 3, delayMs: 1000 }
    );
    // The root route attaches its own handlers later; swallow the rejection
    // here to avoid an unhandled-rejection warning in the meantime.
    initialConfigPromise.catch(() => {
      /* handled by the root route */
    });
  }
  return initialConfigPromise;
}
