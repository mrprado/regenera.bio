import type { Metadata } from "next";
import ProjectTabs from "@/components/ProjectTabs";

export const metadata: Metadata = {
  title: "Selected Mandates",
  description:
    "Selected Regenera mandates, capital relationships, and partnership opportunities across energy, real estate, waste, and capital, presented on an anonymized basis."
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
            The projects below are engagements Regenera has actually worked, presented on an
            anonymized basis, further detail is shared following an introductory discussion and,
            where appropriate, under confidentiality arrangements. This is distinct from a Case
            Study (a fuller account of a completed engagement, published only with client
            permission) and a Reference Project (an external project Regenera has studied but
            was not engaged on, and would be labeled as such if published here). Neither of the
            latter two categories has published examples yet, we don&apos;t publish either until
            there is a real, permissioned example to show.
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
