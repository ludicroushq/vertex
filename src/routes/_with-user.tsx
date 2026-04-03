import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSignInUrl } from "@workos/authkit-tanstack-react-start";

export const Route = createFileRoute("/_with-user")({
  async beforeLoad({ context, location }) {
    const { isAuthenticated } = context;

    if (!isAuthenticated) {
      const signInUrl = await getSignInUrl({
        data: {
          returnPathname: location.pathname,
        },
      });

      throw redirect({ href: signInUrl });
    }

    return {
      isAuthenticated,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
