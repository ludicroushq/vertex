import { createStart } from "@tanstack/react-start";
import { authkitMiddleware } from "@workos/authkit-tanstack-react-start";
import { clientEnv } from "./lib/config/client";

export const startInstance = createStart(() => ({
  requestMiddleware: [
    authkitMiddleware({
      redirectUri: clientEnv.VITE_WORKOS_REDIRECT_URI,
    }),
  ],
}));
