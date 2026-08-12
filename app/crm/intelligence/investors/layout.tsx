import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { checkIntelAccess } from "@/lib/crm/staff";

export const metadata: Metadata = {
  title: "Investor Intelligence — Regenera",
  robots: { index: false, follow: false }
};

const NAV_ITEMS = [
  { href: "/crm/intelligence/investors", label: "Overview" },
  { href: "/crm/intelligence/investors/mandates", label: "Mandates" },
  { href: "/crm/intelligence/investors/organizations", label: "Organizations" },
  { href: "/crm/intelligence/investors/review", label: "Review" },
  { href: "/crm/intelligence/investors/settings", label: "Connectors" }
];

// Gates the whole /crm/intelligence/investors subtree on has_intel_access,
// separate from and stricter than plain CRM staff access (see
// lib/crm/staff.ts checkIntelAccess). A CRM staff member who has not been
// separately granted intel access gets a clear reason, not a silent 404.
export default async function InvestorIntelligenceLayout({ children }: { children: React.ReactNode }) {
  const access = await checkIntelAccess();

  if (access.state === "no_session") redirect("/crm/login");
  if (access.state === "not_authorized") redirect("/crm/login?error=not_authorized");
  if (access.state === "no_intel_access") {
    return (
      <div style={{ maxWidth: 640, margin: "120px auto", padding: "0 24px" }}>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 24, marginBottom: 12 }}>Investor Intelligence</h1>
        <p style={{ fontSize: 14, color: "var(--t-mid)" }}>
          Signed in as {access.staff.email ?? access.staff.id}, but this account does not have Investor Intelligence
          access. It is granted separately from general CRM access (staff.has_intel_access) -- ask an admin to enable
          it for this account.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      <nav style={{ display: "flex", gap: 20, marginBottom: 32, borderBottom: "1px solid var(--line)", paddingBottom: 12 }}>
        {NAV_ITEMS.map((item) => (
          <a key={item.href} href={item.href} style={{ fontSize: 13, color: "var(--t-mid)", textDecoration: "none" }}>
            {item.label}
          </a>
        ))}
      </nav>
      {children}
    </div>
  );
}
