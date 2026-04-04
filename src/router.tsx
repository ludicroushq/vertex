import { ConvexQueryClient } from "@convex-dev/react-query";
import { ConvexProviderWithAuth } from "convex/react";
import {
  AuthKitProvider,
  useAccessToken,
  useAuth,
} from "@workos/authkit-tanstack-react-start/client";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { useCallback, useMemo } from "react";
import { routeTree } from "./routeTree.gen";
import { clientEnv } from "./lib/config/client";
import { PendingComponent } from "./routes/-components/pending-component";

function useAuthFromAuthKit() {
  const { loading, user } = useAuth();
  const { getAccessToken, refresh } = useAccessToken();

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      if (!user) {
        return null;
      }

      if (forceRefreshToken) {
        return (await refresh()) ?? null;
      }

      return (await getAccessToken()) ?? null;
    },
    [user, refresh, getAccessToken],
  );

  return useMemo(
    () => ({
      fetchAccessToken,
      isAuthenticated: Boolean(user),
      isLoading: loading,
    }),
    [loading, user, fetchAccessToken],
  );
}

export function getRouter() {
  const convexQueryClient = new ConvexQueryClient(clientEnv.VITE_CONVEX_URL, {
    expectAuth: true,
  });

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: convexQueryClient.queryFn(),
        queryKeyHashFn: convexQueryClient.hashFn(),
      },
    },
  });
  convexQueryClient.connect(queryClient);

  const router = createRouter({
    Wrap: ({ children }) => (
      <AuthKitProvider>
        <ConvexProviderWithAuth
          client={convexQueryClient.convexClient}
          useAuth={useAuthFromAuthKit}
        >
          {children}
        </ConvexProviderWithAuth>
      </AuthKitProvider>
    ),
    context: { convexQueryClient, queryClient },
    defaultPendingComponent: PendingComponent,
    defaultPendingMs: 0,
    defaultPreload: "intent",
    routeTree,
    scrollRestoration: true,
  });

  setupRouterSsrQueryIntegration({
    queryClient,
    router,
  });

  return router;
}

declare module "@tanstack/react-router" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
