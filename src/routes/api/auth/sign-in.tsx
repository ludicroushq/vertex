import { createFileRoute } from "@tanstack/react-router";
import { getSignInUrl } from "@workos/authkit-tanstack-react-start";
import { getSafeReturnPathname, redirectResponse } from "./-utils";

export const Route = createFileRoute("/api/auth/sign-in")({
  server: {
    handlers: {
      async GET({ request }) {
        const returnPathname = getSafeReturnPathname(request);
        const signInUrl = await getSignInUrl(
          returnPathname === undefined
            ? undefined
            : { data: { returnPathname } },
        );

        return redirectResponse(signInUrl);
      },
    },
  },
});
