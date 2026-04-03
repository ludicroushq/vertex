import { query } from "../_generated/server";

export const safeGetCurrentUser = query({
  args: {},
  async handler(ctx) {
    return ctx.auth.getUserIdentity();
  },
});

export const getCurrentUser = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Not authenticated");
    }

    return identity;
  },
});
