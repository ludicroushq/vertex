import type { ConvexQueryClient } from "@convex-dev/react-query";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { type QueryClient } from "@tanstack/react-query";
import { ConvexProviderWithAuth } from "convex/react";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouteContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { getAuth } from "@workos/authkit-tanstack-react-start";
import {
  AuthKitProvider,
  useAccessToken,
  useAuth,
} from "@workos/authkit-tanstack-react-start/client";
import { useCallback, useMemo } from "react";
import appCss from "../styles.css?url";
import { Footer } from "./-components/footer";
import { Navbar } from "./-components/navbar";
import { NotFound } from "./-components/not-found";
import { appName } from "@/lib/config";
import { PostHogIdentity } from "@/lib/posthog/identity";
import { PostHogAppProvider } from "@/lib/posthog/provider";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  convexQueryClient: ConvexQueryClient;
}>()({
  async beforeLoad(ctx) {
    const auth = await getAuth();
    if (!auth.user) {
      return {
        auth,
      };
    }

    ctx.context.convexQueryClient.serverHttpClient?.setAuth(auth.accessToken);

    return {
      auth,
    };
  },
  component: RootComponent,
  head: () => ({
    links: [
      {
        href: appCss,
        rel: "stylesheet",
      },
    ],
    meta: [
      {
        charSet: "utf8",
      },
      {
        content: "width=device-width, initial-scale=1",
        name: "viewport",
      },
      {
        title: appName,
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <HeadContent />
      </head>
      <body className="flex h-full flex-col antialiased">
        <PostHogAppProvider>{children}</PostHogAppProvider>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const context = useRouteContext({ from: Route.id });

  return (
    <AuthKitProvider initialAuth={context.auth}>
      <ConvexProviderWithAuth
        client={context.convexQueryClient.convexClient}
        useAuth={useAuthFromAuthKit}
      >
        <PostHogIdentity />
        <Navbar isAuthenticated={context.auth.user !== null} />
        <main className="grow">
          <Outlet />
        </main>
        <Footer />
      </ConvexProviderWithAuth>
    </AuthKitProvider>
  );
}

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
    [getAccessToken, refresh, user],
  );

  return useMemo(
    () => ({
      fetchAccessToken,
      isAuthenticated: Boolean(user),
      isLoading: loading,
    }),
    [fetchAccessToken, loading, user],
  );
}
