import { createStart } from "@tanstack/react-start";
import { configure } from "@workos/authkit-session";
import { authkitMiddleware } from "@workos/authkit-tanstack-react-start";
import { clientEnv } from "./lib/config/client";

configure({
  redirectUri: clientEnv.VITE_WORKOS_REDIRECT_URI,
});

export const startInstance = createStart(() => ({
  requestMiddleware: [
    authkitMiddleware({
      redirectUri: clientEnv.VITE_WORKOS_REDIRECT_URI,
    }),
  ],
}));
