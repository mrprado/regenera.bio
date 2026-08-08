"use client";

import { useMemo, useState } from "react";
import FieldNoteCard from "./FieldNoteCard";
import FeaturedFieldNote from "./FeaturedFieldNote";
import type { FieldNote } from "@/lib/fieldNotes";
import { archiveYear } from "@/lib/fieldNotes";
import { CATEGORIES, type CategoryName } from "@/lib/fieldNotesTaxonomy";

export default function FieldNotesArchive({ posts, featured }: { posts: FieldNote[]; featured: FieldNote }) {
  const [filter, setFilter] = useState<"ALL" | CategoryName>("ALL");

  const filtered = useMemo(() => {
    if (filter === "ALL") return posts;
    return posts.filter((p) => p.category === filter || p.secondaryCategory === filter);
  }, [posts, filter]);

  const groups = useMemo(() => {
    const map = new Map<string, FieldNote[]>();
    for (const p of filtered) {
      const y = archiveYear(p);
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(p);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <>
      <div className="fn-filters" role="group" aria-label="Filter by category">
        <button type="button" className={"fn-filter" + (filter === "ALL" ? " on" : "")} onClick={() => setFilter("ALL")}>
          All
        </button>
        {CATEGORIES.map((c) => (
          <button key={c} type="button" className={"fn-filter" + (filter === c ? " on" : "")} onClick={() => setFilter(c)}>
            {c}
          </button>
        ))}
      </div>

      {filter === "ALL" && <FeaturedFieldNote post={featured} />}

      <div className="jgrid r">
        {groups.map(([year, yearPosts]) => (
          <FieldNotesYearGroup key={year} year={year} posts={yearPosts} />
        ))}
      </div>
    </>
  );
}

function FieldNotesYearGroup({ year, posts }: { year: string; posts: FieldNote[] }) {
  return (
    <>
      <div className="fn-year" style={{ gridColumn: "1 / -1" }}>
        {year}
      </div>
      {posts.map((p) => (
        <FieldNoteCard key={p.slug} post={p} />
      ))}
    </>
  );
}
