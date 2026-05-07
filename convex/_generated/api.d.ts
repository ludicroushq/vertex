/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as lib_config_env from "../lib/config/env.js";
import type * as posthog from "../posthog.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "lib/config/env": typeof lib_config_env;
  posthog: typeof posthog;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  posthog: {
    lib: {
      alias: FunctionReference<
        "action",
        "internal",
        {
          alias: string;
          apiKey: string;
          disableGeoip?: boolean;
          distinctId: string;
          host: string;
        },
        any
      >;
      capture: FunctionReference<
        "action",
        "internal",
        {
          apiKey: string;
          disableGeoip?: boolean;
          distinctId: string;
          event: string;
          groups?: string;
          host: string;
          properties?: string;
          sendFeatureFlags?: boolean;
          timestamp?: number;
          uuid?: string;
        },
        any
      >;
      captureException: FunctionReference<
        "action",
        "internal",
        {
          additionalProperties?: string;
          apiKey: string;
          distinctId?: string;
          errorMessage: string;
          errorName?: string;
          errorStack?: string;
          host: string;
        },
        any
      >;
      getAllFlags: FunctionReference<
        "action",
        "internal",
        {
          apiKey: string;
          disableGeoip?: boolean;
          distinctId: string;
          flagKeys?: Array<string>;
          groupProperties?: any;
          groups?: any;
          host: string;
          personProperties?: any;
        },
        any
      >;
      getAllFlagsAndPayloads: FunctionReference<
        "action",
        "internal",
        {
          apiKey: string;
          disableGeoip?: boolean;
          distinctId: string;
          flagKeys?: Array<string>;
          groupProperties?: any;
          groups?: any;
          host: string;
          personProperties?: any;
        },
        any
      >;
      getFeatureFlag: FunctionReference<
        "action",
        "internal",
        {
          apiKey: string;
          disableGeoip?: boolean;
          distinctId: string;
          groupProperties?: any;
          groups?: any;
          host: string;
          key: string;
          personProperties?: any;
          sendFeatureFlagEvents?: boolean;
        },
        any
      >;
      getFeatureFlagPayload: FunctionReference<
        "action",
        "internal",
        {
          apiKey: string;
          disableGeoip?: boolean;
          distinctId: string;
          groupProperties?: any;
          groups?: any;
          host: string;
          key: string;
          matchValue?: string | boolean;
          personProperties?: any;
          sendFeatureFlagEvents?: boolean;
        },
        any
      >;
      getFeatureFlagResult: FunctionReference<
        "action",
        "internal",
        {
          apiKey: string;
          disableGeoip?: boolean;
          distinctId: string;
          groupProperties?: any;
          groups?: any;
          host: string;
          key: string;
          personProperties?: any;
          sendFeatureFlagEvents?: boolean;
        },
        any
      >;
      groupIdentify: FunctionReference<
        "action",
        "internal",
        {
          apiKey: string;
          disableGeoip?: boolean;
          distinctId?: string;
          groupKey: string;
          groupType: string;
          host: string;
          properties?: string;
        },
        any
      >;
      identify: FunctionReference<
        "action",
        "internal",
        {
          apiKey: string;
          disableGeoip?: boolean;
          distinctId: string;
          host: string;
          properties?: string;
        },
        any
      >;
      isFeatureEnabled: FunctionReference<
        "action",
        "internal",
        {
          apiKey: string;
          disableGeoip?: boolean;
          distinctId: string;
          groupProperties?: any;
          groups?: any;
          host: string;
          key: string;
          personProperties?: any;
          sendFeatureFlagEvents?: boolean;
        },
        any
      >;
    };
  };
};
