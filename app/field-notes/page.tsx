import type { Metadata } from "next";
import { orderedPosts, getFeaturedPost } from "@/lib/fieldNotes";
import FieldNotesArchive from "@/components/FieldNotesArchive";
import SubscribeForm from "@/components/SubscribeForm";

export const metadata: Metadata = {
  title: "Field Notes",
  description:
    "Research and observations across land, water, energy, food systems, infrastructure, real assets, and environmental intelligence."
};

export default function FieldNotesPage() {
  const posts = orderedPosts();
  const featured = getFeaturedPost();

  return (
    <div className="tabpg">
      <div className="th">
        <div className="w">
          <div className="ey lt">
            <div className="ey-b"></div>
            <span>Field Notes</span>
          </div>
          <h1>
            Where systems, capital, and <em>place converge.</em>
          </h1>
          <p className="lede">
            Research and observations across land, water, energy, food systems, infrastructure,
            real assets, and environmental intelligence.
          </p>
        </div>
      </div>
      <section className="sec">
        <div className="w">
          <FieldNotesArchive posts={posts} featured={featured} />
          <div className="sub-bar r d1" style={{ marginTop: "3rem" }}>
            <div>
              <div style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", color: "var(--cream)" }}>
                The Regenera Letter
              </div>
              <div style={{ fontSize: 13, fontWeight: 300, color: "rgba(214,231,203,0.45)", marginTop: 4 }}>
                Field Notes and systems intelligence, delivered monthly. Unsubscribe anytime.
              </div>
            </div>
            <SubscribeForm />
          </div>
        </div>
      </section>
    </div>
  );
}
