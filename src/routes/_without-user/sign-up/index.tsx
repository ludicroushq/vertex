import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSignUpUrl } from "@workos/authkit-tanstack-react-start";

export const Route = createFileRoute("/_without-user/sign-up/")({
  async loader() {
    const signUpUrl = await getSignUpUrl({
      data: "/app",
    });

    throw redirect({ href: signUpUrl });
  },
});
