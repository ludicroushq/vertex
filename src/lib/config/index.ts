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

const isDevelopment = process.env.NODE_ENV !== "production"; // eslint-disable-line n/prefer-global/process
const isProduction = process.env.NODE_ENV === "production"; // eslint-disable-line n/prefer-global/process

const appName = "TODO";
const appUrl = isDevelopment ? "http://localhost:3000" : "https://www.TODO.com";

// eslint-disable-next-line new-cap
export class Config extends Define.Service("Config", () => ({
  appName,
  appUrl,
  env,
  isDevelopment,
  isProduction,
})) {}
