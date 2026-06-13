import { createEnv } from "@t3-oss/env-core";
import { REQUIRED_URL } from "./utils";

export const clientEnv = createEnv({
  client: {
    VITE_CONVEX_SITE_URL: REQUIRED_URL,
    VITE_CONVEX_URL: REQUIRED_URL,
    VITE_WORKOS_REDIRECT_URI: REQUIRED_URL,
  },
  clientPrefix: "VITE_",
  emptyStringAsUndefined: true,
  runtimeEnv: import.meta.env,
});
