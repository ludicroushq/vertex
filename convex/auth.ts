import { betterAuth } from "better-auth/minimal";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import authConfig from "./auth.config";
import { components } from "./_generated/api";
import { query } from "./_generated/server";
import type { DataModel } from "./_generated/dataModel";
import { serverEnv } from "./lib/config/env";

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth({
    baseURL: serverEnv.SITE_URL,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [convex({ authConfig })],
  });

export const getCurrentUser = query({
  args: {},
  async handler(ctx) {
    return authComponent.getAuthUser(ctx);
  },
});
