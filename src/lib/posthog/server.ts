import { logs, SeverityNumber } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { PostHog } from "posthog-node";
import type { Properties } from "posthog-js";
import type {
  AnalyticsEvent,
  FeatureFlagKey,
  FeatureFlagPayload,
  FeatureFlagValue,
} from "./schema";
import { appName, isProduction } from "@/lib/config";
import { serverEnv } from "@/lib/config/server";

type CaptureOptions<Event extends AnalyticsEvent> = Event & {
  distinctId: string;
  groups?: Record<string, string | number>;
  sendFeatureFlags?: boolean;
};

type IdentifyOptions = {
  distinctId: string;
  properties?: Properties;
};

type FeatureFlagOptions = {
  distinctId: string;
  groups?: Record<string, string>;
  personProperties?: Record<string, string>;
  sendFeatureFlagEvents?: boolean;
};

type ExceptionOptions = {
  distinctId?: string;
  error: unknown;
  properties?: Record<string | number, unknown>;
};

type LogAttributes = Record<string, boolean | number | string | undefined>;

type LogOptions = {
  attributes?: LogAttributes;
  body: string;
};

type LogLevel = "debug" | "error" | "fatal" | "info" | "trace" | "warn";

let logsSdk: NodeSDK | undefined;
let logsSdkStarted = false;
let postHogClient: PostHog | undefined;

const severityByLevel = {
  debug: SeverityNumber.DEBUG,
  error: SeverityNumber.ERROR,
  fatal: SeverityNumber.FATAL,
  info: SeverityNumber.INFO,
  trace: SeverityNumber.TRACE,
  warn: SeverityNumber.WARN,
} satisfies Record<LogLevel, SeverityNumber>;

const serviceName = `${appName}-web`;

function getPostHogClient() {
  if (!serverEnv.POSTHOG_API_KEY) {
    return null;
  }

  postHogClient ??= new PostHog(serverEnv.POSTHOG_API_KEY, {
    flushAt: 1,
    flushInterval: 0,
  });

  return postHogClient;
}

function getLogsLogger() {
  if (!serverEnv.POSTHOG_API_KEY || !serverEnv.POSTHOG_LOGS_ENABLED) {
    return null;
  }

  logsSdk ??= new NodeSDK({
    logRecordProcessors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          headers: {
            Authorization: `Bearer ${serverEnv.POSTHOG_API_KEY}`,
          },
          url: "https://us.i.posthog.com/i/v1/logs",
        }),
      ),
    ],
    resource: resourceFromAttributes({
      "deployment.environment": isProduction ? "production" : "development",
      "service.name": serviceName,
    }),
  });

  if (!logsSdkStarted) {
    logsSdk.start();
    logsSdkStarted = true;
  }

  return logs.getLogger(serviceName);
}

function emitLog(level: LogLevel, options: LogOptions) {
  const logger = getLogsLogger();

  if (!logger) {
    return;
  }

  logger.emit({
    attributes: options.attributes,
    body: options.body,
    severityNumber: severityByLevel[level],
    severityText: level.toUpperCase(),
  });
}

export const Analytics = {
  capture<Event extends AnalyticsEvent>(args: CaptureOptions<Event>) {
    const client = getPostHogClient();

    if (!client) {
      return;
    }

    const { distinctId, event, groups, properties, sendFeatureFlags } = args;

    client.capture({
      distinctId,
      event,
      groups,
      properties,
      sendFeatureFlags,
    });
  },

  identify(args: IdentifyOptions) {
    const client = getPostHogClient();

    if (!client) {
      return;
    }

    const { distinctId, properties } = args;

    client.identify({
      distinctId,
      properties,
    });
  },
};

export const FeatureFlags = {
  async get<Key extends FeatureFlagKey>(
    key: Key,
    options: FeatureFlagOptions,
  ): Promise<FeatureFlagValue<Key> | undefined> {
    const client = getPostHogClient();

    if (!client) {
      return undefined;
    }

    const { distinctId, groups, personProperties, sendFeatureFlagEvents } =
      options;
    const result = await client.getFeatureFlagResult(key, distinctId, {
      groups,
      personProperties,
      sendFeatureFlagEvents,
    });
    const value = result?.variant ?? result?.enabled;

    return value as FeatureFlagValue<Key> | undefined;
  },

  async getPayload<Key extends FeatureFlagKey>(
    key: Key,
    options: FeatureFlagOptions & {
      matchValue?: boolean | string;
    },
  ): Promise<FeatureFlagPayload<Key> | undefined> {
    const client = getPostHogClient();

    if (!client) {
      return undefined;
    }

    const {
      distinctId,
      groups,
      matchValue,
      personProperties,
      sendFeatureFlagEvents,
    } = options;
    const result = await client.getFeatureFlagResult(key, distinctId, {
      groups,
      personProperties,
      sendFeatureFlagEvents,
    });

    if (matchValue !== undefined && result?.variant !== matchValue) {
      return undefined;
    }

    return result?.payload as FeatureFlagPayload<Key> | undefined;
  },

  async isEnabled<Key extends FeatureFlagKey>(
    key: Key,
    options: FeatureFlagOptions,
  ): Promise<boolean | undefined> {
    const client = getPostHogClient();

    if (!client) {
      return undefined;
    }

    const { distinctId, groups, personProperties, sendFeatureFlagEvents } =
      options;
    const result = await client.getFeatureFlagResult(key, distinctId, {
      groups,
      personProperties,
      sendFeatureFlagEvents,
    });

    return result?.enabled;
  },
};

export const Errors = {
  captureException(args: ExceptionOptions) {
    const client = getPostHogClient();

    if (!client) {
      return;
    }

    const { distinctId, error, properties } = args;

    client.captureException(error, distinctId, properties);
  },
};

export const Logs = {
  debug(args: LogOptions) {
    emitLog("debug", args);
  },

  error(args: LogOptions) {
    emitLog("error", args);
  },

  fatal(args: LogOptions) {
    emitLog("fatal", args);
  },

  info(args: LogOptions) {
    emitLog("info", args);
  },

  trace(args: LogOptions) {
    emitLog("trace", args);
  },

  warn(args: LogOptions) {
    emitLog("warn", args);
  },
};
