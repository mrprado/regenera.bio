import type { Metadata } from "next";
import Link from "next/link";
import ServiceTabs from "@/components/ServiceTabs";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Four practices, one method: Systems & Place Advisory, Development & Project Readiness, Real Assets & Infrastructure Advisory, and Capital Strategy & Alignment."
};

const VALID_TABS = ["systems", "readiness", "assets", "capital"] as const;
type TabId = (typeof VALID_TABS)[number];

export default function ServicesPage({
  searchParams
}: {
  searchParams: { tab?: string };
}) {
  const tab = VALID_TABS.includes(searchParams.tab as TabId) ? (searchParams.tab as TabId) : "systems";

  return (
    <div className="tabpg">
      <div className="th">
        <div className="w">
          <div className="ey lt">
            <div className="ey-b"></div>
            <span>Services</span>
          </div>
          <h1>
            Four practices, <em>one method.</em>
          </h1>
          <p className="lede">
            Systems &amp; Place Advisory, Development &amp; Project Readiness, Real Assets &amp;
            Infrastructure Advisory, and Capital Strategy &amp; Alignment, applied in the order a
            project usually needs them. Applied across twelve sectors, see{" "}
            <Link href="/sectors">Sectors</Link>.
          </p>
        </div>
      </div>
      <section className="sec">
        <div className="w">
          <ServiceTabs initial={tab} />
        </div>
      </section>
    </div>
  );
}
