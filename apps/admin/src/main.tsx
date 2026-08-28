import {
  createHashHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import {
  TanStackQueryContext,
  TanStackQueryProvider,
} from "@workspace/ui/integrations/tanstack-query";
import { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
// Styles
import "@workspace/ui/globals.css";
import { DirectionProvider } from "@workspace/ui/integrations/direction";
import { LanguageProvider } from "@workspace/ui/integrations/language";
import { ThemeProvider } from "@workspace/ui/integrations/theme";
import { initializeI18n } from "@workspace/ui/lib/i18n";
import {
  fallbackLng,
  getInitialI18nNamespaces,
  supportedLngs,
} from "./config/index.ts";
// Report web vitals
import reportWebVitals from "./reportWebVitals.ts";
import { fetchInitialConfig } from "./utils/bootstrap.ts";
// Common utilities
import { Logout } from "./utils/common.ts";

initializeI18n({
  supportedLngs,
  fallbackLng,
  ns: getInitialI18nNamespaces(
    window.location.hash.slice(1).split("?")[0] || "/"
  ),
});

// Start the global-config request now so it runs in parallel with translation
// loading; the root route awaits the same promise.
fetchInitialConfig();

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
      {/* i18n suspends until translations load; a null fallback keeps #app
          empty so the index.html splash stays visible until first commit */}
      <Suspense fallback={null}>
        <TanStackQueryProvider {...TanStackQueryProviderContext}>
          <LanguageProvider supportedLanguages={supportedLngs}>
            <ThemeProvider>
              <DirectionProvider>
                <RouterProvider router={router} />
              </DirectionProvider>
            </ThemeProvider>
          </LanguageProvider>
        </TanStackQueryProvider>
      </Suspense>
    </StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
