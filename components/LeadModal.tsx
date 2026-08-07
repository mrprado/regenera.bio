"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { track } from "@/lib/analytics";
import { LEAD_INTERESTS } from "@/lib/leadOptions";

const STORAGE_SUPPRESS_KEY = "rg_lead_modal_until";
const STORAGE_SESSION_KEY = "rg_lead_modal_shown";
const STORAGE_LAST_SUBMISSION_KEY = "rg_lead_last_submission";
const STORAGE_HANDOFF_KEY = "rg_lead_handoff";

const SUPPRESS_MS = 15 * 24 * 60 * 60 * 1000;
const TIMER_MS = 20000;
const SCROLL_THRESHOLD = 0.5;
const RETRY_MS = 800;

// Allowlist, not a blocklist: only pages named as eligible ever qualify.
// This automatically excludes /contact, any legal/compliance page, and
// error pages without needing to enumerate them.
const ELIGIBLE_PREFIXES = ["/how-we-work", "/services", "/philosophy", "/projects", "/field-notes"];

const CLIENT_TYPES = [
  { value: "investor_family_office", label: "Investor / Family Office" },
  { value: "developer_sponsor", label: "Developer / Project Sponsor" },
  { value: "landowner", label: "Landowner" },
  { value: "strategic_partner", label: "Strategic Partner" },
  { value: "public_sector", label: "Public Sector" },
  { value: "other", label: "Other" }
];

const CLIENT_TYPE_TO_CONTACT_PATH: Record<string, string> = {
  investor_family_office: "investor",
  developer_sponsor: "developer",
  landowner: "realestate",
  strategic_partner: "partner",
  public_sector: "operator",
  other: "general"
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isEligiblePath(pathname: string) {
  if (pathname === "/") return true;
  return ELIGIBLE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function prefersReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function isSuppressed() {
  try {
    const until = localStorage.getItem(STORAGE_SUPPRESS_KEY);
    return !!until && Date.now() < Number(until);
  } catch {
    return false;
  }
}

function suppressFor15Days() {
  try {
    localStorage.setItem(STORAGE_SUPPRESS_KEY, String(Date.now() + SUPPRESS_MS));
  } catch {}
}

function shownThisSession() {
  try {
    return sessionStorage.getItem(STORAGE_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markShownThisSession() {
  try {
    sessionStorage.setItem(STORAGE_SESSION_KEY, "1");
  } catch {}
}

function isOtherOverlayOpen() {
  const legalModal = document.getElementById("modal");
  const mobileNav = document.getElementById("mnav");
  return !!(legalModal?.classList.contains("open") || mobileNav?.classList.contains("open"));
}

export default function LeadModal() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [clientType, setClientType] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; clientType?: string }>({});

  const pathnameRef = useRef(pathname);
  const timerFired = useRef(false);
  const scrollFired = useRef(false);
  const triggerReason = useRef<"timer" | "scroll" | null>(null);
  const retryTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openedOnce = useRef(false);
  const startedTracked = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const attemptShow = useCallback(() => {
    if (openedOnce.current) return;
    if (shownThisSession()) return;
    if (isSuppressed()) return;
    if (!isEligiblePath(pathnameRef.current)) return;
    if (!(timerFired.current || scrollFired.current)) return;

    if (isOtherOverlayOpen()) {
      if (retryTimeout.current) return;
      retryTimeout.current = setTimeout(() => {
        retryTimeout.current = null;
        attemptShow();
      }, RETRY_MS);
      return;
    }

    openedOnce.current = true;
    markShownThisSession();
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    setOpen(true);
    track("lead_modal_viewed", { page_path: pathnameRef.current, trigger: triggerReason.current ?? "timer" });
  }, []);

  // Timer + scroll listeners, mounted once. Since this component lives at
  // the layout level it is never remounted by client-side navigation, so a
  // single 20s timeout naturally preserves elapsed time across pages rather
  // than restarting per route.
  useEffect(() => {
    const timer = setTimeout(() => {
      timerFired.current = true;
      if (!triggerReason.current) triggerReason.current = "timer";
      attemptShow();
    }, TIMER_MS);

    function handleScroll() {
      if (scrollFired.current) return;
      if (!isEligiblePath(pathnameRef.current)) return;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;
      if (window.scrollY / scrollableHeight >= SCROLL_THRESHOLD) {
        scrollFired.current = true;
        if (!triggerReason.current) triggerReason.current = "scroll";
        attemptShow();
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-check eligibility whenever the route changes, in case a trigger
  // condition was already met on an ineligible page (e.g. scrolled 50% of
  // an eligible page, then navigated) or the visitor just landed on an
  // eligible page after the timer already elapsed elsewhere.
  useEffect(() => {
    pathnameRef.current = pathname;
    attemptShow();
  }, [pathname, attemptShow]);

  const closeModal = useCallback((reason: "dismissed" | "submitted") => {
    setVisible(false);
    const delay = prefersReducedMotion() ? 0 : 220;
    closeTimeout.current = setTimeout(() => {
      setOpen(false);
      previouslyFocused.current?.focus?.();
    }, delay);

    if (reason === "dismissed") {
      suppressFor15Days();
      track("lead_modal_dismissed", { page_path: pathnameRef.current });
    }
  }, []);

  // Entrance animation, initial focus, focus trap, escape-to-close, and
  // background scroll lock while the dialog is open.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // A timeout rather than requestAnimationFrame: rAF only fires while the
    // tab is actively compositing, so a backgrounded tab would never flip
    // to visible. A timeout still reliably lands after the initial
    // opacity:0 paint, which is all this needs.
    const enterTimer = prefersReducedMotion() ? null : setTimeout(() => setVisible(true), 20);
    if (prefersReducedMotion()) setVisible(true);

    const focusTimer = setTimeout(() => emailInputRef.current?.focus(), 0);

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeModal("dismissed");
        return;
      }
      if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const list = Array.from(focusables);
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      if (enterTimer) clearTimeout(enterTimer);
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, closeModal]);

  function markStarted() {
    if (startedTracked.current) return;
    startedTracked.current = true;
    track("lead_modal_started", { page_path: pathnameRef.current });
  }

  function toggleInterest(value: string) {
    markStarted();
    setInterests((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;

    const trimmedEmail = email.trim();
    const errs: { email?: string; clientType?: string } = {};
    if (!trimmedEmail || !EMAIL_RE.test(trimmedEmail)) {
      errs.email = "Please enter a complete email address.";
    }
    if (!clientType) {
      errs.clientType = "Please select the option that best describes you.";
    }
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setFieldErrors({});
    setError(null);
    setPending(true);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          client_type: clientType,
          interests,
          page_path: pathnameRef.current,
          referrer: typeof document !== "undefined" ? document.referrer || null : null
        })
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setError(data?.error || "We couldn't save your details. Please try again or contact info@regenera.bio.");
        setPending(false);
        track("lead_modal_error", { page_path: pathnameRef.current });
        return;
      }

      try {
        localStorage.setItem(
          STORAGE_LAST_SUBMISSION_KEY,
          JSON.stringify({ email: trimmedEmail, client_type: clientType, interests, submitted_at: Date.now() })
        );
      } catch {}
      suppressFor15Days();

      try {
        sessionStorage.setItem(STORAGE_HANDOFF_KEY, JSON.stringify({ email: trimmedEmail, interests }));
      } catch {}

      track("lead_modal_submitted", { page_path: pathnameRef.current, client_type: clientType });

      setVisible(false);
      setOpen(false);
      const contactPath = CLIENT_TYPE_TO_CONTACT_PATH[clientType] ?? "general";
      router.push(`/contact?path=${contactPath}`);
    } catch {
      setError("We couldn't save your details. Please try again or contact info@regenera.bio.");
      setPending(false);
      track("lead_modal_error", { page_path: pathnameRef.current });
    }
  }

  if (!open) return null;

  return (
    <div
      className={"lm-backdrop" + (visible ? " lm-open" : "")}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal("dismissed");
      }}
    >
      <div className="lm-box" role="dialog" aria-modal="true" aria-labelledby="lm-heading" ref={dialogRef}>
        <button type="button" className="lm-close" aria-label="Close" onClick={() => closeModal("dismissed")}>
          &times;
        </button>
        <div className="lm-image">
          <Image
            src="/images/coastal-development-master-plan.jpg"
            alt="Aerial view of a regenerative coastal development integrated within surrounding forest"
            fill
            sizes="(max-width: 760px) 100vw, 460px"
            loading="eager"
            style={{ objectFit: "cover", objectPosition: "34% 45%" }}
          />
          <div className="lm-image-overlay" aria-hidden="true" />
        </div>
        <div className="lm-form-col">
          <h2 id="lm-heading" className="lm-heading">
            Exploring an opportunity?
          </h2>
          <p className="lm-body">Tell us how we can help. We&apos;ll review your inquiry and be in touch.</p>
          <form onSubmit={handleSubmit} noValidate>
            <div className="fg">
              <label htmlFor="lm-email">Email address</label>
              <input
                ref={emailInputRef}
                id="lm-email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  markStarted();
                }}
                disabled={pending}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "lm-email-err" : undefined}
              />
              {fieldErrors.email && (
                <p id="lm-email-err" className="lm-field-err" role="alert">
                  {fieldErrors.email}
                </p>
              )}
            </div>
            <div className="fg">
              <label htmlFor="lm-type">I am a...</label>
              <select
                id="lm-type"
                required
                value={clientType}
                onChange={(e) => {
                  setClientType(e.target.value);
                  markStarted();
                }}
                disabled={pending}
                aria-invalid={!!fieldErrors.clientType}
                aria-describedby={fieldErrors.clientType ? "lm-type-err" : undefined}
              >
                <option value="">Select one</option>
                {CLIENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              {fieldErrors.clientType && (
                <p id="lm-type-err" className="lm-field-err" role="alert">
                  {fieldErrors.clientType}
                </p>
              )}
            </div>
            <div className="lm-interests">
              <span className="lm-interests-label" id="lm-interests-label">
                I&apos;m interested in...
              </span>
              <div className="lm-check-grid" role="group" aria-labelledby="lm-interests-label">
                {LEAD_INTERESTS.map((i) => (
                  <label key={i.value} className="lm-check">
                    <input type="checkbox" checked={interests.includes(i.value)} onChange={() => toggleInterest(i.value)} disabled={pending} />
                    <span>{i.label}</span>
                  </label>
                ))}
              </div>
            </div>
            {error && (
              <p role="alert" className="lm-error">
                {error}
              </p>
            )}
            <div className="lm-actions">
              <button type="submit" className="btn btn-gold" disabled={pending} style={{ width: "100%", justifyContent: "center" }}>
                {pending ? "Submitting" : "Continue"}
              </button>
              <button type="button" className="lm-not-now" onClick={() => closeModal("dismissed")}>
                Not now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
