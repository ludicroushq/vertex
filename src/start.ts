import { createStart } from "@tanstack/react-start";
import { authkitMiddleware } from "@workos/authkit-tanstack-react-start";
import { appUrl } from "./lib/config";

export const startInstance = createStart(() => ({
  requestMiddleware: [
    authkitMiddleware({
      redirectUri: new URL("/api/auth/callback", appUrl).toString(),
    }),
  ],
}));
