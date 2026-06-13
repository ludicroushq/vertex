import { createFileRoute } from "@tanstack/react-router";
import { getSignUpUrl } from "@workos/authkit-tanstack-react-start";

export const Route = createFileRoute("/api/auth/sign-up")({
  server: {
    handlers: {
      async GET() {
        const signUpUrl = await getSignUpUrl();

        return new Response(null, {
          headers: {
            Location: signUpUrl,
          },
          status: 307,
        });
      },
    },
  },
});
