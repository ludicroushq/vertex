import { createFileRoute } from "@tanstack/react-router";
import { signOut } from "@workos/authkit-tanstack-react-start";

export const Route = createFileRoute("/_with-user/sign-out/")({
  async beforeLoad() {
    await signOut({
      data: { returnTo: "/" },
    });
  },
});
