export const fallbackLng = "en-US";
export const supportedLngs = ["en-US", "zh-CN"];

// CDN_URL: leave empty to fully disable CDN-backed features (sponsor card,
// remote tutorial). To self-host, set VITE_CDN_URL to your own mirror.
export const CDN_URL = import.meta.env.VITE_CDN_URL || "";
export const TUTORIAL_DOCUMENT =
  import.meta.env.VITE_TUTORIAL_DOCUMENT || "false";

export const USER_EMAIL = import.meta.env.VITE_USER_EMAIL;
export const USER_PASSWORD = import.meta.env.VITE_USER_PASSWORD;
