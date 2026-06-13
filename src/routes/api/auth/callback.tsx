import { createFileRoute } from "@tanstack/react-router";
import { handleCallbackRoute } from "@workos/authkit-tanstack-react-start";
import { clientEnv } from "@/lib/config/client";

const handleAuthCallback = handleCallbackRoute();

export const Route = createFileRoute("/api/auth/callback")({
  server: {
    handlers: {
      async GET(args) {
        const response = await handleAuthCallback(args);

        return redirectToAppBase(response);
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

  const currentUrl = new URL(location, clientEnv.VITE_APP_URL);
  const redirectUrl = new URL(
    `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`,
    clientEnv.VITE_APP_URL,
  );
  const headers = new Headers(response.headers);
  headers.set("Location", redirectUrl.toString());

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}
