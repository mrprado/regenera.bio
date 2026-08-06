"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type ModalKind = "notice" | "privacy" | "cookies";

const LegalModalContext = createContext<((kind: ModalKind) => void) | null>(null);

export function useLegalModal() {
  const ctx = useContext(LegalModalContext);
  if (!ctx) throw new Error("useLegalModal must be used within LegalModalProvider");
  return ctx;
}

export default function LegalModalProvider({ children }: { children: ReactNode }) {
  const [kind, setKind] = useState<ModalKind | null>(null);

  useEffect(() => {
    if (!kind) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setKind(null);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [kind]);

  return (
    <LegalModalContext.Provider value={setKind}>
      {children}
      <div
        id="modal"
        className={kind ? "open" : ""}
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) setKind(null);
        }}
      >
        <div className="mbox">
          {kind === "notice" && (
            <div>
              <h4>Important Notice</h4>
              <p>
                Regenera Advisory provides project development, strategic consulting, capital
                alignment, and introductory services. Regenera is not registered as a broker
                dealer, investment adviser, underwriter, or placement agent and does not hold or
                manage client or investor funds.
              </p>
              <p>
                For general informational purposes only and does not constitute investment,
                legal, or tax advice, an offer to sell, or a solicitation to purchase any
                security. Any investment opportunity referenced is offered solely by the
                relevant issuer or registered intermediary and remains subject to applicable
                law, independent due diligence, and definitive documentation. Project
                descriptions and figures do not represent investment performance, committed
                capital, or guaranteed results.
              </p>
              <p style={{ fontSize: 13 }}>
                See also our{" "}
                <button
                  className="btn"
                  style={{ padding: 0, border: "none", color: "var(--sage)", textDecoration: "underline", fontWeight: 300 }}
                  onClick={() => setKind("privacy")}
                >
                  Privacy
                </button>{" "}
                and{" "}
                <button
                  className="btn"
                  style={{ padding: 0, border: "none", color: "var(--sage)", textDecoration: "underline", fontWeight: 300 }}
                  onClick={() => setKind("cookies")}
                >
                  Cookie
                </button>{" "}
                statements.
              </p>
            </div>
          )}
          {kind === "privacy" && (
            <div>
              <h4>Privacy</h4>
              <p>
                We collect information you choose to provide through our contact and
                subscription forms and use it to respond to enquiries, manage communications,
                and deliver requested updates.
              </p>
              <p>
                Our website and service providers may process limited technical information
                required to operate, secure, and understand use of the site. We do not sell
                personal information or share it with third parties for their own marketing
                purposes.
              </p>
              <p>
                You may request access to, correction of, or deletion of your information, or
                unsubscribe from communications, by contacting{" "}
                <a href="mailto:info@regenera.bio" style={{ color: "var(--sage)" }}>
                  info@regenera.bio
                </a>
                . Personal information is handled in accordance with applicable data protection
                laws.
              </p>
            </div>
          )}
          {kind === "cookies" && (
            <div>
              <h4>Cookies</h4>
              <p>
                This website uses essential cookies only: a single preference that remembers you
                have seen the cookie notice. We do not use advertising, tracking, or analytics
                cookies that identify you personally.
              </p>
            </div>
          )}
          <div style={{ marginTop: "1.4rem" }}>
            <button className="btn btn-dark" onClick={() => setKind(null)}>
              Close
            </button>
          </div>
        </div>
      </div>
    </LegalModalContext.Provider>
  );
}
