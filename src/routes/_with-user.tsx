import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_with-user")({
  beforeLoad({ context, location }) {
    if (!context.auth.user) {
      const returnPathname = encodeURIComponent(location.pathname);

      throw redirect({
        href: `/api/auth/sign-in?returnPathname=${returnPathname}`,
      });
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
