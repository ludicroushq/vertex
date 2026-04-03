import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouteContext,
} from "@tanstack/react-router";
import { type QueryClient } from "@tanstack/react-query";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { useCallback, useMemo } from "react";
import type { ConvexQueryClient } from "@convex-dev/react-query";
import { ConvexProviderWithAuth } from "convex/react";
import { getAuth } from "@workos/authkit-tanstack-react-start";
import {
  AuthKitProvider,
  useAccessToken,
  useAuth,
} from "@workos/authkit-tanstack-react-start/client";
import appCss from "../styles.css?url";
import { Navbar } from "./-components/navbar";
import { NotFound } from "./-components/not-found";
import { Footer } from "./-components/footer";
import { appName } from "@/lib/config";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  convexQueryClient: ConvexQueryClient;
}>()({
  async beforeLoad(ctx) {
    const auth = await getAuth();

    if (auth.user) {
      ctx.context.convexQueryClient.serverHttpClient?.setAuth(auth.accessToken);

      const { accessToken: _accessToken, ...initialAuth } = auth;

      return {
        initialAuth,
        isAuthenticated: true,
      };
    }

    return {
      initialAuth: auth,
      isAuthenticated: false,
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
        {children}
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
    <AuthKitProvider initialAuth={context.initialAuth}>
      <ConvexProviderWithAuth
        client={context.convexQueryClient.convexClient}
        useAuth={useAuthFromWorkOS}
      >
        <Navbar isAuthenticated={context.isAuthenticated} />
        <main className="grow">
          <Outlet />
        </main>
        <Footer />
      </ConvexProviderWithAuth>
    </AuthKitProvider>
  );
}

function useAuthFromWorkOS() {
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
