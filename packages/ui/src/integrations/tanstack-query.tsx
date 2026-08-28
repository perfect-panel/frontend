import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const DEFAULT_STALE_TIME = 30_000;

export function TanStackQueryContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Avoid refetching the same data during quick route transitions or
        // focus changes. Live views can still opt into a shorter interval.
        staleTime: DEFAULT_STALE_TIME,
      },
    },
  });
  return {
    queryClient,
  };
}

export function TanStackQueryProvider({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
