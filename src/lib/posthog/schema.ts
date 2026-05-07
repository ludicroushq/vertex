export type AnalyticsEventProperties = Record<never, never>;

export type AnalyticsEventName = keyof AnalyticsEventProperties & string;

export type AnalyticsEvent = {
  [EventName in AnalyticsEventName]: keyof AnalyticsEventProperties[EventName] extends never
    ? {
        event: EventName;
        properties?: never;
      }
    : {
        event: EventName;
        properties: AnalyticsEventProperties[EventName];
      };
}[AnalyticsEventName];

export type FeatureFlagDefinitions = Record<
  never,
  {
    payload: unknown;
    value: boolean | string;
  }
>;

export type FeatureFlagKey = keyof FeatureFlagDefinitions & string;

export type FeatureFlagPayload<Key extends FeatureFlagKey> =
  FeatureFlagDefinitions[Key]["payload"];

export type FeatureFlagValue<Key extends FeatureFlagKey> =
  FeatureFlagDefinitions[Key]["value"];
