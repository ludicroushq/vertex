import { createFileRoute } from "@tanstack/react-router";
import { H1 } from "@/components/ui/typography";

export const Route = createFileRoute("/_with-user/app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    auth: { user },
  } = Route.useRouteContext();
  const name = user.firstName ?? user.email;

  return (
    <div className="container mx-auto my-8">
      <H1>Hello {name}!</H1>
    </div>
  );
}
