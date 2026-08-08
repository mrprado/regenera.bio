"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/crm/login");
    router.refresh();
  }

  return (
    <button onClick={handleSignOut} className="btn btn-line" style={{ fontSize: 13 }}>
      Sign out
    </button>
  );
}
