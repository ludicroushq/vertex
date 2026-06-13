import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_without-user/sign-in/")({
  loader() {
    throw redirect({
      href: "/api/auth/sign-in?returnPathname=%2Fapp",
    });
  },
});
