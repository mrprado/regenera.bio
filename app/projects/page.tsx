import type { Metadata } from "next";
import Link from "next/link";
import ProjectTabs from "@/components/ProjectTabs";

export const metadata: Metadata = {
  title: "Selected Mandates",
  description:
    "Current and recent engagements across energy, real estate and land, and waste infrastructure."
};

export default function ProjectsPage() {
  return (
    <div className="tabpg">
      <div className="th">
        <div className="w">
          <div className="ey lt">
            <div className="ey-b"></div>
            <span>Selected Mandates</span>
          </div>
          <h1>
            Active work, shared <em>selectively.</em>
          </h1>
          <p className="lede">
            Current and recent engagements across real assets, infrastructure, and
            development. Further detail is shared following an introductory discussion.
          </p>
        </div>
      </div>
      <section className="sec">
        <div className="w">
          <ProjectTabs />
        </div>
      </section>
      <section className="sec sec-d">
        <div className="w">
          <div className="ey lt r">
            <div className="ey-b"></div>
            <span>Get Started</span>
          </div>
          <h2 className="h2 r d1" style={{ color: "var(--cream)", marginBottom: "1.6rem" }}>
            Have a relevant <em style={{ color: "var(--mist)" }}>project or mandate?</em>
          </h2>
          <Link href="/contact?path=general&service=advisory" className="btn btn-gold">
            Discuss an Opportunity <span className="arr">&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
