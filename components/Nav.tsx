"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/how-we-work", label: "How We Work" },
  { href: "/services", label: "Services" },
  { href: "/philosophy", label: "Philosophy" },
  { href: "/projects", label: "Projects" },
  { href: "/field-notes", label: "Field Notes" }
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav aria-label="Primary">
        <Link href="/" className="logo" aria-label="Regenera Advisory home">
          REGENERA
        </Link>
        <div className="nav-links" role="navigation" aria-label="Site sections">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={pathname === l.href ? "on" : ""}>
              {l.label}
            </Link>
          ))}
          <Link href="/contact?path=general" className="nav-cta">
            Get in Touch
          </Link>
        </div>
        <button
          className="hbg"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
      <div id="mnav" className={open ? "open" : ""}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link href="/contact?path=general" onClick={() => setOpen(false)}>
          Get in Touch
        </Link>
      </div>
    </>
  );
}
