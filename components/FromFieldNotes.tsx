import Link from "next/link";
import { getLatestByCategory } from "@/lib/fieldNotes";
import type { CategoryName } from "@/lib/fieldNotesTaxonomy";

/** Small, restrained teaser for the latest Field Note in a given category.
 *  Renders nothing if there isn't one yet, so it's safe to drop into any
 *  page without a fallback check at the call site. */
export default function FromFieldNotes({ category }: { category: CategoryName }) {
  const post = getLatestByCategory(category);
  if (!post) return null;

  return (
    <Link href={`/field-notes/${post.slug}`} className="fn-cross">
      <div>
        <div className="fn-cross-label">From Field Notes</div>
        <div className="fn-cross-title">{post.title}</div>
      </div>
      <span className="fn-cross-arr">
        Read <span className="arr">&rarr;</span>
      </span>
    </Link>
  );
}
