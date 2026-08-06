"use client";

import { useEffect, useState } from "react";
import { useLegalModal } from "@/components/LegalModalProvider";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const openModal = useLegalModal();

  useEffect(() => {
    try {
      if (!localStorage.getItem("rg_ck")) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    setVisible(false);
    try {
      localStorage.setItem("rg_ck", "1");
    } catch {}
  }

  if (!visible) return null;

  return (
    <div id="ck" role="region" aria-label="Cookie notice">
      <p>
        This website uses essential cookies only. By continuing you acknowledge our{" "}
        <strong>Important Notice</strong> regarding the nature of Regenera Advisory&apos;s
        services.
      </p>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button
          className="btn btn-line"
          style={{ padding: "9px 18px", fontSize: 10 }}
          onClick={() => openModal("notice")}
        >
          Read Notice
        </button>
        <button className="btn btn-gold" style={{ padding: "9px 18px", fontSize: 10 }} onClick={accept}>
          Accept
        </button>
      </div>
    </div>
  );
}
