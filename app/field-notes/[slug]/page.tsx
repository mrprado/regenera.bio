import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { POSTS } from "@/lib/fieldNotes";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = POSTS.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.teaser,
    openGraph: {
      title: post.title,
      description: post.teaser,
      images: [post.img]
    }
  };
}

export default function FieldNotePage({ params }: { params: { slug: string } }) {
  const post = POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const datePublished = new Date(`${post.date} 1`).toISOString();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished,
    dateModified: datePublished,
    image: [post.img],
    description: post.teaser,
    publisher: {
      "@type": "Organization",
      name: "Regenera Advisory",
      url: "https://regenera.bio"
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://regenera.bio/field-notes/${post.slug}`
    }
  };

  return (
    <div className="tabpg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="th" style={{ paddingBottom: 0 }}>
        <div className="w">
          <div className="ey lt">
            <div className="ey-b"></div>
            <span>
              {post.date} &middot; {post.theme}
            </span>
          </div>
          <h1>{post.title}</h1>
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
            <p key={i} style={{ fontSize: 15.5, fontWeight: 300, color: "var(--t-mid)", lineHeight: 1.85, marginBottom: "1.2rem" }}>
              {para}
            </p>
          ))}
          
          <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--line)" }}>
            <Link href="/field-notes" className="btn btn-dark">
              &larr; Back to Field Notes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
