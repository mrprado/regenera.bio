import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { POSTS, getRelatedPosts, displayDate, isRetrospective } from "@/lib/fieldNotes";
import { SYSTEM_COLOR_VAR } from "@/lib/fieldNotesTaxonomy";
import FieldNoteCard from "@/components/FieldNoteCard";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = POSTS.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.deck,
    alternates: { canonical: `https://regenera.bio/field-notes/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.deck,
      images: [post.img],
      type: "article"
    }
  };
}

const bodyP = { fontSize: 15.5, fontWeight: 300, color: "var(--t-mid)", lineHeight: 1.85, marginBottom: "1.2rem" } as const;

export default function FieldNotePage({ params }: { params: { slug: string } }) {
  const post = POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const datePublished = new Date(`${post.date} 1`).toISOString();
  const dateModified = post.updatedDate ? new Date(`${post.updatedDate} 1`).toISOString() : datePublished;
  const related = getRelatedPosts(post, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.deck,
    datePublished,
    dateModified,
    image: [post.img],
    author: { "@type": "Organization", name: "Regenera" },
    publisher: {
      "@type": "Organization",
      name: "Regenera Advisory",
      url: "https://regenera.bio"
    },
    about: post.system,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://regenera.bio/field-notes/${post.slug}`
    }
  };

  return (
    <div className="tabpg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="th" style={{ paddingBottom: 0 }}>
        <div className="w">
          <div className="ey lt">
            <div className="ey-b"></div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span
                aria-hidden="true"
                style={{ width: 6, height: 6, borderRadius: "50%", background: `var(${SYSTEM_COLOR_VAR[post.system]})`, display: "inline-block" }}
              />
              {post.system} &middot; {post.lens}
            </span>
          </div>
          <h1>{post.title}</h1>
          <p className="lede">{post.deck}</p>
          <p style={{ marginTop: "1rem", fontSize: 11.5, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(214,231,203,0.4)" }}>
            {displayDate(post)}
            {post.updatedDate && <> &middot; Updated {post.updatedDate}</>}
            {post.region && <> &middot; {post.region}</>}
          </p>
          {isRetrospective(post) && (
            <p style={{ marginTop: "0.5rem", fontSize: 11, fontWeight: 300, color: "rgba(214,231,203,0.35)" }}>
              Retrospective analysis of {displayDate(post)}. Published {post.date}.
            </p>
          )}
        </div>
      </div>
      <section className="sec">
        <div className="w" style={{ maxWidth: 760 }}>
          <Image
            src={post.img}
            alt={post.imgAlt}
            width={760}
            height={340}
            style={{ width: "100%", height: 340, objectFit: "cover", borderRadius: 2, marginBottom: "1.6rem" }}
          />

          {post.body.map((para, i) => (
            <p key={i} style={bodyP}>
              {para}
            </p>
          ))}

          {post.keySignal && (
            <FieldNoteSection heading="The Signal">
              <p style={bodyP}>{post.keySignal}</p>
            </FieldNoteSection>
          )}
          {post.whyItMatters && (
            <FieldNoteSection heading="Why It Matters">
              <p style={bodyP}>{post.whyItMatters}</p>
            </FieldNoteSection>
          )}
          {post.systemConnection && (
            <FieldNoteSection heading="The System Connection">
              <p style={bodyP}>{post.systemConnection}</p>
            </FieldNoteSection>
          )}
          {post.capitalImplication && (
            <FieldNoteSection heading="Capital Implication">
              <p style={bodyP}>{post.capitalImplication}</p>
            </FieldNoteSection>
          )}
          {post.developmentImplication && (
            <FieldNoteSection heading="Development Implication">
              <p style={bodyP}>{post.developmentImplication}</p>
            </FieldNoteSection>
          )}
          {post.whatWeAreWatching && post.whatWeAreWatching.length > 0 && (
            <FieldNoteSection heading="What We Are Watching">
              <ul style={{ paddingLeft: "1.2rem" }}>
                {post.whatWeAreWatching.map((item, i) => (
                  <li key={i} style={{ ...bodyP, marginBottom: "0.5rem" }}>
                    {item}
                  </li>
                ))}
              </ul>
            </FieldNoteSection>
          )}
          {post.sources && post.sources.length > 0 && (
            <div style={{ marginTop: "2.4rem", paddingTop: "1.6rem", borderTop: "1px solid var(--line)" }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--t-soft)", marginBottom: "0.8rem" }}>
                Sources reviewed
              </div>
              <ul style={{ paddingLeft: "1.1rem" }}>
                {post.sources.map((s, i) => (
                  <li key={i} style={{ fontSize: 13, fontWeight: 300, color: "var(--t-mid)", lineHeight: 1.7, marginBottom: "0.3rem" }}>
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--sage)" }}>
                        {s.label}
                      </a>
                    ) : (
                      s.label
                    )}
                  </li>
                ))}
              </ul>
              <div style={{ fontSize: 11, fontWeight: 300, color: "var(--t-soft)", marginTop: "0.9rem" }}>
                Last checked {post.updatedDate ?? post.date}
              </div>
            </div>
          )}

          <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--line)" }}>
            <Link href="/field-notes" className="btn btn-dark">
              &larr; Back to Field Notes
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="sec" style={{ background: "var(--cream)", paddingTop: "3.2rem", paddingBottom: "4rem" }}>
          <div className="w">
            <div className="ey">
              <div className="ey-b"></div>
              <span>Related Field Notes</span>
            </div>
            <div className="jgrid" style={{ marginTop: "1.6rem" }}>
              {related.map((r) => (
                <FieldNoteCard key={r.slug} post={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function FieldNoteSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: "2.2rem" }}>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", fontWeight: 500, color: "var(--ink)", marginBottom: "0.7rem" }}>{heading}</h2>
      {children}
    </div>
  );
}
