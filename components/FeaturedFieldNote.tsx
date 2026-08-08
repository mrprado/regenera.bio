import Link from "next/link";
import Image from "next/image";
import type { FieldNote } from "@/lib/fieldNotes";
import { displayDate } from "@/lib/fieldNotes";
import { CATEGORY_COLOR_VAR } from "@/lib/fieldNotesTaxonomy";

export default function FeaturedFieldNote({ post }: { post: FieldNote }) {
  return (
    <Link href={`/field-notes/${post.slug}`} className="fn-featured r">
      <div className="fn-featured-img">
        <Image src={post.img} alt={post.imgAlt} fill sizes="(max-width: 960px) 100vw, 1180px" style={{ objectFit: "cover" }} />
      </div>
      <div className="fn-featured-body">
        <div className="fn-featured-tag">Featured {post.entryType}</div>
        <div className="jmeta" style={{ marginBottom: "0.9rem" }}>
          <span>{displayDate(post)}</span>
          <span className="jtheme" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span
              aria-hidden="true"
              style={{ width: 6, height: 6, borderRadius: "50%", background: `var(${CATEGORY_COLOR_VAR[post.category]})`, display: "inline-block", flexShrink: 0 }}
            />
            {post.category}
          </span>
        </div>
        <div className="fn-featured-title">{post.title}</div>
        <div className="fn-featured-deck">{post.deck}</div>
        <span className="jread">
          Read <span className="arr">&rarr;</span>
        </span>
      </div>
    </Link>
  );
}
