/* eslint-disable @typescript-eslint/naming-convention */
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { Define } from "within-ts";

const env = createEnv({
  client: {
    VITE_CONVEX_SITE_URL: z.url(),
    VITE_CONVEX_URL: z.url(),
  },
  clientPrefix: "VITE_",
  emptyStringAsUndefined: true,
  runtimeEnv: process.env, // eslint-disable-line n/prefer-global/process
  server: {
    CONVEX_DEPLOYMENT: z.string(),
  },
});

export class Env extends Define.Service("Env", () => env) {
  get isDevelopment() {
    return process.env.NODE_ENV !== "production"; // eslint-disable-line n/prefer-global/process
  }

  get isProduction() {
    return process.env.NODE_ENV === "production"; // eslint-disable-line n/prefer-global/process
  }
}
