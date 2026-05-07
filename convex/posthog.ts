import { PostHog } from "@posthog/convex";
import type { Auth } from "convex/server";
import { components } from "./_generated/api";

type PostHogComponent = ConstructorParameters<typeof PostHog>[0];

type IdentifyContext = {
  auth: Auth;
};

const posthogComponent = (
  components as unknown as { posthog: PostHogComponent }
).posthog;

async function identifyFromConvexAuth(ctx: IdentifyContext) {
  const { auth } = ctx;
  const identity = await auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  return {
    distinctId: identity.tokenIdentifier,
  };
}

export const posthog = new PostHog(posthogComponent, {
  identify: identifyFromConvexAuth,
});
