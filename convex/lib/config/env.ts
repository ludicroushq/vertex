import { createEnv } from "@t3-oss/env-core";
import { OPTIONAL_STRING, REQUIRED_STRING } from "./utils";

export const convexEnv = createEnv({
  emptyStringAsUndefined: true,
  runtimeEnv: process.env, // eslint-disable-line n/prefer-global/process
  server: {
    GOOGLE_CLIENT_ID: OPTIONAL_STRING,
    GOOGLE_CLIENT_SECRET: OPTIONAL_STRING,
    SITE_URL: REQUIRED_STRING,
  },
});
