import posthog, { type LogAttributes, type Properties } from "posthog-js";
import type {
  AnalyticsEvent,
  FeatureFlagKey,
  FeatureFlagPayload,
  FeatureFlagValue,
} from "./schema";
import { clientEnv } from "@/lib/config/client";

type UntypedCaptureOptions = {
  event: string;
  properties?: Properties;
};

type IdentifyOptions = {
  distinctId: string;
  properties?: Properties;
  propertiesOnce?: Properties;
};

type FeatureFlagOptions = {
  fresh?: boolean;
  sendEvent?: boolean;
};

type ExceptionOptions = {
  error: unknown;
  properties?: Properties;
};

type LogOptions = {
  attributes?: LogAttributes;
  body: string;
};

export const isPostHogConfigured = Boolean(clientEnv.VITE_POSTHOG_KEY);

function capture<Event extends AnalyticsEvent>(args: Event): void;
function capture(args: UntypedCaptureOptions) {
  if (!isPostHogConfigured) {
    return;
  }

  const { event, properties } = args;

  posthog.capture(event, properties);
}

export const Analytics = {
  capture,

  identify(args: IdentifyOptions) {
    if (!isPostHogConfigured) {
      return;
    }

    const { distinctId, properties, propertiesOnce } = args;

    posthog.identify(distinctId, properties, propertiesOnce);
  },

  reset() {
    if (!isPostHogConfigured) {
      return;
    }

    posthog.reset();
  },
};

export const FeatureFlags = {
  get<Key extends FeatureFlagKey>(
    key: Key,
    options?: FeatureFlagOptions,
  ): FeatureFlagValue<Key> | undefined {
    if (!isPostHogConfigured) {
      return undefined;
    }

    return posthog.getFeatureFlag(key, {
      fresh: options?.fresh,
      send_event: options?.sendEvent,
    }) as FeatureFlagValue<Key> | undefined;
  },

  getPayload<Key extends FeatureFlagKey>(
    key: Key,
  ): FeatureFlagPayload<Key> | undefined {
    if (!isPostHogConfigured) {
      return undefined;
    }

    return posthog.getFeatureFlagResult(key)?.payload as
      | FeatureFlagPayload<Key>
      | undefined;
  },

  isEnabled<Key extends FeatureFlagKey>(
    key: Key,
    options?: FeatureFlagOptions,
  ): boolean | undefined {
    if (!isPostHogConfigured) {
      return undefined;
    }

    return posthog.isFeatureEnabled(key, {
      fresh: options?.fresh,
      send_event: options?.sendEvent,
    });
  },
};

export const Errors = {
  captureException(args: ExceptionOptions) {
    if (!isPostHogConfigured) {
      return;
    }

    const { error, properties } = args;

    posthog.captureException(error, properties);
  },
};

export const Logs = {
  debug(args: LogOptions) {
    if (isPostHogConfigured) {
      posthog.logger.debug(args.body, args.attributes);
    }
  },

  error(args: LogOptions) {
    if (isPostHogConfigured) {
      posthog.logger.error(args.body, args.attributes);
    }
  },

  fatal(args: LogOptions) {
    if (isPostHogConfigured) {
      posthog.logger.fatal(args.body, args.attributes);
    }
  },

  info(args: LogOptions) {
    if (isPostHogConfigured) {
      posthog.logger.info(args.body, args.attributes);
    }
  },

  trace(args: LogOptions) {
    if (isPostHogConfigured) {
      posthog.logger.trace(args.body, args.attributes);
    }
  },

  warn(args: LogOptions) {
    if (isPostHogConfigured) {
      posthog.logger.warn(args.body, args.attributes);
    }
  },
};
