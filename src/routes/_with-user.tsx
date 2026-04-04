import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSignInUrl } from "@workos/authkit-tanstack-react-start";

export const Route = createFileRoute("/_with-user")({
  async beforeLoad({ context, location }) {
    if (!context.auth.user) {
      const signInUrl = await getSignInUrl({
        data: {
          returnPathname: location.pathname,
        },
      });

      throw redirect({ href: signInUrl });
    }

    return {
      auth: context.auth,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
