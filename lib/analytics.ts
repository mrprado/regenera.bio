// No analytics provider is wired into this site yet. This stays a safe no-op
// until one is: it calls window.gtag / window.plausible if either happens to
// be present, and does nothing otherwise. Never pass emails or free-text
// user input here, only non-sensitive metadata (page path, trigger type,
// selected category).
export function track(event: string, meta?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  try {
    const w = window as unknown as {
      gtag?: (...args: unknown[]) => void;
      plausible?: (event: string, opts?: { props?: Record<string, unknown> }) => void;
    };
    if (typeof w.gtag === "function") {
      w.gtag("event", event, meta ?? {});
    }
    if (typeof w.plausible === "function") {
      w.plausible(event, meta ? { props: meta } : undefined);
    }
  } catch {
    // Analytics must never break the feature it's observing.
  }
}
