import { createEnv } from "@t3-oss/env-core";
import { OPTIONAL_STRING, REQUIRED_STRING } from "./utils";

export const convexEnv = createEnv({
  emptyStringAsUndefined: true,
  runtimeEnv: process.env, // eslint-disable-line n/prefer-global/process
  server: {
    APP_URL: REQUIRED_STRING,
    BETTER_AUTH_SECRET: REQUIRED_STRING,
    GOOGLE_CLIENT_ID: OPTIONAL_STRING,
    GOOGLE_CLIENT_SECRET: OPTIONAL_STRING,
  },
});
