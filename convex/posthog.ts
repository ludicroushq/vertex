import { PostHog } from "@posthog/convex";
import { components } from "./_generated/api";

type PostHogComponent = ConstructorParameters<typeof PostHog>[0];

type IdentityContext = {
  auth: {
    getUserIdentity: () => Promise<unknown>;
  };
};

const posthogComponent = (
  components as unknown as { posthog: PostHogComponent }
).posthog;

async function identifyFromConvexAuth(ctx: unknown) {
  const { auth } = ctx as IdentityContext;
  const identity = await auth.getUserIdentity();

  if (
    typeof identity !== "object" ||
    identity === null ||
    !("tokenIdentifier" in identity) ||
    typeof identity.tokenIdentifier !== "string"
  ) {
    return null;
  }

  return {
    distinctId: identity.tokenIdentifier,
  };
}

export const posthog = new PostHog(posthogComponent, {
  identify: identifyFromConvexAuth,
});
