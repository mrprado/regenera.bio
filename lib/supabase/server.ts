import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// No auth is used in this app (public forms only), so this client never
// needs to read or refresh a session. It still goes through cookies() per
// the standard @supabase/ssr Next.js pattern, in case auth is added later.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a context where cookies can't be set (e.g. during
            // static rendering). Safe to ignore since this app has no auth
            // session to persist.
          }
        }
      }
    }
  );
}
