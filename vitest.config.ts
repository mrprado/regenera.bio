import { defineConfig } from "vitest/config";

// Only the deterministic, DB-free logic in lib/intelligence/investors is
// covered here (see docs/intelligence-system/INVESTOR_INTELLIGENCE.md
// "Testing"). Server actions, Supabase queries, and React components are
// not unit-tested -- they need a live Supabase project and are exercised
// manually per the acceptance-criteria walkthrough instead.
export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/__tests__/**/*.test.ts"],
    // Generous relative to normal (sub-millisecond) unit tests: the
    // provider-health tests genuinely shell out to look for an optional
    // "agent-reach" binary and must wait for that lookup to fail cleanly.
    testTimeout: 8_000
  }
});
