import { createFileRoute } from "@tanstack/react-router";
import { handleCallbackRoute } from "@workos/authkit-tanstack-react-start";
import { appUrl } from "@/lib/config";
import { posthog } from "@/lib/posthog/server";

const handleAuthCallback = handleCallbackRoute();

export const Route = createFileRoute("/api/auth/callback")({
  server: {
    handlers: {
      async GET(args) {
        try {
          const response = await handleAuthCallback(args);

          return redirectToAppBase(response);
        } catch (error) {
          posthog.captureException(error, undefined, {
            route: "/api/auth/callback",
          });

          return Response.json(
            {
              error: {
                description:
                  "Couldn't sign in. Please contact your organization admin if the issue persists.",
                details: error instanceof Error ? error.message : String(error),
                message: "Authentication failed",
              },
            },
            { status: 500 },
          );
        }
      },
    },
  },
});

function redirectToAppBase(response: Response) {
  if (response.status < 300 || response.status >= 400) {
    return response;
  }

  const location = response.headers.get("Location");

  if (!location) {
    return response;
  }

  const currentUrl = new URL(location, appUrl);
  const redirectUrl = new URL(
    `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`,
    appUrl,
  );
  const headers = new Headers(response.headers);
  headers.set("Location", redirectUrl.toString());

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}
