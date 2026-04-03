import { createFileRoute } from "@tanstack/react-router";
import { getAuth, getAuthkit } from "@workos/authkit-tanstack-react-start";

export const Route = createFileRoute("/api/auth/sign-out")({
  server: {
    handlers: {
      async GET({ request }) {
        const requestUrl = new URL(request.url);
        const returnTo = requestUrl.searchParams.get("returnTo") ?? "/";
        const auth = await getAuth();

        if (!auth.user || !auth.sessionId) {
          return Response.redirect(new URL(returnTo, request.url), 307);
        }

        const authkit = await getAuthkit();
        const { headers, logoutUrl } = await authkit.signOut(auth.sessionId, {
          returnTo,
        });

        const responseHeaders = new Headers({
          Location: logoutUrl,
        });

        if (headers) {
          for (const [key, value] of Object.entries(headers)) {
            if (Array.isArray(value)) {
              for (const headerValue of value) {
                responseHeaders.append(key, headerValue);
              }
            } else {
              responseHeaders.set(key, value);
            }
          }
        }

        return new Response(null, {
          headers: responseHeaders,
          status: 307,
        });
      },
    },
  },
});
