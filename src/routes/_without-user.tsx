import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_without-user")({
  beforeLoad({ context }) {
    if (context.auth.user) {
      throw redirect({ to: "/app" });
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
