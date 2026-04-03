import { createStart } from "@tanstack/react-start";
import { authkitMiddleware } from "@workos/authkit-tanstack-react-start";
import { serverEnv } from "./lib/config/server";

void [
  serverEnv.WORKOS_CLIENT_ID,
  serverEnv.WORKOS_API_KEY,
  serverEnv.WORKOS_COOKIE_PASSWORD,
];

export const startInstance = createStart(() => ({
  requestMiddleware: [
    authkitMiddleware({
      redirectUri: serverEnv.WORKOS_REDIRECT_URI,
    }),
  ],
}));
