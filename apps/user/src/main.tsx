import {
  createHashHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import {
  TanStackQueryContext,
  TanStackQueryProvider,
} from "@workspace/ui/integrations/tanstack-query";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
// Styles
import "@workspace/ui/globals.css";
import "./liquid-glass.css";
import { DirectionProvider } from "@workspace/ui/integrations/direction";
import { LanguageProvider } from "@workspace/ui/integrations/language";
import { ThemeProvider } from "@workspace/ui/integrations/theme";
import { initializeI18n } from "@workspace/ui/lib/i18n";
import { fallbackLng, supportedLngs } from "./config/index.ts";
// Report web vitals
import reportWebVitals from "./reportWebVitals.ts";
// Common utilities
import { Logout } from "./utils/common.ts";

initializeI18n({
  supportedLngs,
  fallbackLng,
  ns: [
    "affiliate",
    "auth",
    "components",
    "dashboard",
    "document",
    "layout",
    "main",
    "order",
    "payment",
    "profile",
    "subscribe",
    "ticket",
    "wallet",
  ],
});

window.logout = Logout;

// Create a new router instance
const TanStackQueryProviderContext = TanStackQueryContext();
const hashHistory = createHashHistory();
const router = createRouter({
  routeTree,
  history: hashHistory,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <TanStackQueryProvider {...TanStackQueryProviderContext}>
        <LanguageProvider supportedLanguages={supportedLngs}>
          <ThemeProvider>
            <DirectionProvider>
              <RouterProvider router={router} />
            </DirectionProvider>
          </ThemeProvider>
        </LanguageProvider>
      </TanStackQueryProvider>
    </StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
