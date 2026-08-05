import type { Metadata } from "next";
import ProjectTabs from "@/components/ProjectTabs";

export const metadata: Metadata = {
  title: "Projects & Partnerships",
  description:
    "Selected projects, capital relationships, and partnership opportunities across energy, real estate, waste, and capital, presented on an anonymized basis."
};

export default function ProjectsPage() {
  return (
    <div className="tabpg">
      <div className="th">
        <div className="w">
          <div className="ey lt">
            <div className="ey-b"></div>
            <span>Projects &amp; Partnerships</span>
          </div>
          <h1>
            Active work, shared <em>selectively.</em>
          </h1>
          <p className="lede">
            Selected projects, capital relationships, and partnership opportunities are
            presented on an anonymized basis. Further details are shared following an
            introductory discussion and, where appropriate, under confidentiality arrangements.
          </p>
        </div>
      </div>
      <section className="sec">
        <div className="w">
          <ProjectTabs />
        </div>
      </section>
    </div>
  );
}
