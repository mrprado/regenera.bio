import Link from "next/link";
import { getLatestBySystem } from "@/lib/fieldNotes";
import type { SystemName } from "@/lib/fieldNotesTaxonomy";

/** Small, restrained teaser for the latest Field Note in a given system.
 *  Renders nothing if there isn't one yet, so it's safe to drop into any
 *  page without a fallback check at the call site. */
export default function FromFieldNotes({ system }: { system: SystemName }) {
  const post = getLatestBySystem(system);
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
