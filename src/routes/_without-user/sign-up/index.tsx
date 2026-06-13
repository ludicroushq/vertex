import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_without-user/sign-up/")({
  loader() {
    throw redirect({
      href: "/api/auth/sign-up?returnPathname=%2Fapp",
    });
  },
});
