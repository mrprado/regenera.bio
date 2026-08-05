"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    // Defer a frame so React finishes hydrating any Suspense-deferred client
    // components (e.g. the contact form) before this scans and mutates the
    // DOM. Scanning immediately can race hydration and trigger a mismatch
    // that reverts the reveal.
    const raf = requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const els = document.querySelectorAll<HTMLElement>(".r:not(.vis)");

      if (reduceMotion || !("IntersectionObserver" in window)) {
        els.forEach((el) => el.classList.add("vis"));
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("vis");
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      els.forEach((el) => {
        observer?.observe(el);
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) el.classList.add("vis");
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
