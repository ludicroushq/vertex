import { createFileRoute } from "@tanstack/react-router";
import { getSignUpUrl } from "@workos/authkit-tanstack-react-start";
import { getSafeReturnPathname, redirectResponse } from "./-utils";

export const Route = createFileRoute("/api/auth/sign-up")({
  server: {
    handlers: {
      async GET({ request }) {
        const returnPathname = getSafeReturnPathname(request);
        const signUpUrl = await getSignUpUrl(
          returnPathname === undefined
            ? undefined
            : { data: { returnPathname } },
        );

        return redirectResponse(signUpUrl);
      },
    },
  },
});
