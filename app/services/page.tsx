import type { Metadata } from "next";
import ServiceTabs from "@/components/ServiceTabs";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Regenerative Consulting, full stack: energy and infrastructure, real estate and land, project readiness, and capital introduction."
};

const VALID_TABS = ["energy", "realestate", "readiness", "capital"] as const;
type TabId = (typeof VALID_TABS)[number];

export default function ServicesPage({
  searchParams
}: {
  searchParams: { tab?: string };
}) {
  const tab = VALID_TABS.includes(searchParams.tab as TabId) ? (searchParams.tab as TabId) : "energy";

  return (
    <div className="tabpg">
      <div className="th">
        <div className="w">
          <div className="ey lt">
            <div className="ey-b"></div>
            <span>Services</span>
          </div>
          <h1>
            Regenerative Consulting, <em>full stack.</em>
          </h1>
          <p className="lede">
            Energy and infrastructure, real estate and land, project readiness, and capital
            introduction. One discipline applied across four service lines, in the order a
            project usually needs them.
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
