import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_with-user")({
  beforeLoad({ context }) {
    if (!context.auth.user) {
      throw redirect({
        href: "/api/auth/sign-in",
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
