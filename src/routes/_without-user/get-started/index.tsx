import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSignInUrl } from "@workos/authkit-tanstack-react-start";

export const Route = createFileRoute("/_without-user/get-started/")({
  async loader() {
    const signInUrl = await getSignInUrl({
      data: "/app",
    });

    throw redirect({ href: signInUrl });
  },
});
