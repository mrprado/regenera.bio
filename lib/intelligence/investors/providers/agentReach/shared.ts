import { execFile } from "child_process";
import { promisify } from "util";
import type { ProviderHealth } from "../types";

const execFileAsync = promisify(execFile);

// Agent Reach (https://github.com/Panniantong/agent-reach) is an optional
// external CLI this application never installs on its own behalf. Per the
// module's own boundary rules: no silent system-level install, ever, and
// `--system` never runs without explicit user authorization outside this
// app. This helper only ever *asks* an already-installed binary for its
// own status (`agent-reach doctor --json`) -- if the binary is missing,
// that is treated as an ordinary "not configured" state, not an error to
// surface to the user as a bug.
//
// This is intentionally the only place that shells out to `agent-reach`.
// Adapters call runDoctor() and interpret its result; they never construct
// their own child_process calls, so the "detect the real installed
// interface, don't hardcode undocumented method names" rule has exactly
// one implementation to keep honest.
export interface AgentReachDoctorReport {
  installed: boolean;
  raw?: Record<string, unknown>;
  channels?: Record<string, { available: boolean; reason?: string }>;
}

let cachedReport: { report: AgentReachDoctorReport; expiresAt: number } | null = null;
const CACHE_TTL_MS = 60_000;

export async function runAgentReachDoctor(): Promise<AgentReachDoctorReport> {
  if (cachedReport && cachedReport.expiresAt > Date.now()) {
    return cachedReport.report;
  }

  let report: AgentReachDoctorReport;
  try {
    // Short timeout deliberately: this runs on every connector-health page
    // load, and "not installed" should resolve fast, not make a settings
    // page hang for seconds waiting on a binary that was never going to
    // answer.
    const { stdout } = await execFileAsync("agent-reach", ["doctor", "--json"], { timeout: 3_000 });
    const parsed = JSON.parse(stdout) as Record<string, unknown>;
    report = { installed: true, raw: parsed, channels: parsed.channels as AgentReachDoctorReport["channels"] };
  } catch {
    // ENOENT (not installed), a non-zero exit, a timeout, or malformed
    // JSON all collapse to the same "not installed/not usable" state --
    // none of them are this application's problem to diagnose further.
    report = { installed: false };
  }

  cachedReport = { report, expiresAt: Date.now() + CACHE_TTL_MS };
  return report;
}

export function notConfiguredHealth(providerId: string, channel: string): ProviderHealth {
  return {
    providerId,
    available: false,
    status: "not_configured",
    message: `Agent Reach is not installed, or its "${channel}" channel is not configured.`,
    checkedAt: new Date().toISOString(),
    setupInstructions:
      "1) Review https://raw.githubusercontent.com/Panniantong/agent-reach/main/docs/install.md. " +
      "2) Run `agent-reach install --env=auto --dry-run` yourself to preview what it would do -- this application never runs it for you. " +
      `3) Once installed, run \`agent-reach doctor --json\` and confirm the "${channel}" channel reports available. ` +
      "Never run `agent-reach install --system` without deciding that yourself; this app will not request or perform it."
  };
}
