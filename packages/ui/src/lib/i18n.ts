/// <reference path="../typings.d.ts" />
import type { InitOptions } from "i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

export function initializeI18n(i18nConfig?: InitOptions) {
  i18n
    // Load translation using http backend
    // Learn more: https://github.com/i18next/i18next-http-backend
    .use(Backend)
    // Detect user language
    // Learn more: https://github.com/i18next/i18next-browser-languagedetector
    .use(LanguageDetector)
    // Pass the i18n instance to react-i18next
    .use(initReactI18next)
    // Initialize i18next
    // For all options read: https://www.i18next.com/overview/configuration-options
    .init({
      // Language configuration
      fallbackLng: "en-US", // Default language when detection fails
      supportedLngs: ["en-US", "zh-CN"], // Available locales
      // Note: lng is not set to allow LanguageDetector to handle detection

      // Interpolation configuration
      interpolation: {
        escapeValue: false, // Disable escaping since React handles XSS protection
      },

      // HTTP backend configuration
      backend: {
        loadPath: "./assets/locales/{{lng}}/{{ns}}.json", // Translation files path template
        crossDomain: false, // Disable cross-domain requests
        withCredentials: false, // Don't send credentials with requests
        allowMultiLoading: true, // Load namespaces individually
      },

      // Language detection configuration
      detection: {
        order: ["localStorage", "navigator", "htmlTag"], // Detection priority order
        lookupLocalStorage: "language", // localStorage key for saved language
        caches: ["localStorage"], // Cache detected language in localStorage
      },
      // Namespace configuration
      defaultNS: "components", // Default namespace for translations
      ns: [],

      // React integration options
      react: {
        useSuspense: true, // Enable React Suspense for async translation loading
      },
      ...i18nConfig,
    });
  window.i18n = i18n;
  return i18n;
}
