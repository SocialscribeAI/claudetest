"use client";

/**
 * REACT QUERY PROVIDER - components/providers/QueryProvider.tsx
 *
 * Purpose: Wrap app with React Query provider
 *
 * Features:
 * - Query caching
 * - Automatic refetching
 * - Error handling
 * - DevTools (in development)
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
