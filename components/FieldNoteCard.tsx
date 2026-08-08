import Link from "next/link";
import Image from "next/image";
import type { FieldNote } from "@/lib/fieldNotes";
import { displayDate } from "@/lib/fieldNotes";
import { SYSTEM_COLOR_VAR } from "@/lib/fieldNotesTaxonomy";

export default function FieldNoteCard({ post }: { post: FieldNote }) {
  return (
    <Link href={`/field-notes/${post.slug}`} className="jcard">
      <Image src={post.img} alt={post.imgAlt} width={400} height={160} style={{ width: "100%", height: 160, objectFit: "cover" }} />
      <div className="jbody">
        <div className="jmeta">
          <span>{displayDate(post)}</span>
          <span className="jtheme" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: `var(${SYSTEM_COLOR_VAR[post.system]})`,
                display: "inline-block",
                flexShrink: 0
              }}
            />
            {post.system}
          </span>
        </div>
        <div className="jt">{post.title}</div>
        <div className="jd">{post.deck}</div>
        <span className="jread">
          Read <span className="arr">&rarr;</span>
        </span>
      </div>
    </Link>
  );
}
