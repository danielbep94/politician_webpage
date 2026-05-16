type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, payload?: AnalyticsPayload) {
  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics:event]", name, payload);
  }
}
