import { PostHog } from "@posthog/convex";
import type {
  AnalyticsEvent,
  FeatureFlagKey,
  FeatureFlagPayload,
  FeatureFlagValue,
} from "../src/lib/posthog/schema";
import { components } from "./_generated/api";
import type { ActionCtx, MutationCtx } from "./_generated/server";

type PostHogComponent = ConstructorParameters<typeof PostHog>[0];

type IdentityContext = {
  auth: {
    getUserIdentity: () => Promise<unknown>;
  };
};

type CaptureOptions<Event extends AnalyticsEvent> = Event & {
  distinctId?: string;
  groups?: Record<string, string | number>;
  sendFeatureFlags?: boolean;
};

type FeatureFlagOptions<Key extends FeatureFlagKey> = {
  distinctId?: string;
  groups?: Record<string, string>;
  key: Key;
  personProperties?: Record<string, string>;
  sendFeatureFlagEvents?: boolean;
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

const posthog = new PostHog(posthogComponent, {
  identify: identifyFromConvexAuth,
});

export const Analytics = {
  async capture<Event extends AnalyticsEvent>(
    ctx: ActionCtx | MutationCtx,
    args: CaptureOptions<Event>,
  ) {
    const { distinctId, event, groups, properties, sendFeatureFlags } = args;

    await posthog.capture(ctx, {
      distinctId,
      event,
      groups,
      properties,
      sendFeatureFlags,
    });
  },

  async identify(
    ctx: ActionCtx | MutationCtx,
    args: {
      distinctId?: string;
      properties?: Record<string, unknown>;
    },
  ) {
    const { distinctId, properties } = args;

    await posthog.identify(ctx, {
      distinctId,
      properties,
    });
  },
};

export const FeatureFlags = {
  async get<Key extends FeatureFlagKey>(
    ctx: ActionCtx,
    args: FeatureFlagOptions<Key>,
  ): Promise<FeatureFlagValue<Key> | undefined> {
    const { distinctId, groups, key, personProperties, sendFeatureFlagEvents } =
      args;

    return ((await posthog.getFeatureFlag(ctx, {
      distinctId,
      groups,
      key,
      personProperties,
      sendFeatureFlagEvents,
    })) ?? undefined) as FeatureFlagValue<Key> | undefined;
  },

  async getPayload<Key extends FeatureFlagKey>(
    ctx: ActionCtx,
    args: FeatureFlagOptions<Key> & {
      matchValue?: boolean | string;
    },
  ): Promise<FeatureFlagPayload<Key> | undefined> {
    const {
      distinctId,
      groups,
      key,
      matchValue,
      personProperties,
      sendFeatureFlagEvents,
    } = args;

    return ((await posthog.getFeatureFlagPayload(ctx, {
      distinctId,
      groups,
      key,
      matchValue,
      personProperties,
      sendFeatureFlagEvents,
    })) ?? undefined) as FeatureFlagPayload<Key> | undefined;
  },

  async isEnabled<Key extends FeatureFlagKey>(
    ctx: ActionCtx,
    args: FeatureFlagOptions<Key>,
  ) {
    const { distinctId, groups, key, personProperties, sendFeatureFlagEvents } =
      args;

    return posthog.isFeatureEnabled(ctx, {
      distinctId,
      groups,
      key,
      personProperties,
      sendFeatureFlagEvents,
    });
  },
};
