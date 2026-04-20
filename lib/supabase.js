import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function hasSupabaseConfig() {
  return Boolean(URL && ANON);
}

// Read-only client for Server Components. Uses the anon key; RLS should
// allow SELECT on trends/steps for anon (see supabase/schema.sql).
export function getPublicClient() {
  if (!hasSupabaseConfig()) return null;
  return createClient(URL, ANON, {
    auth: { persistSession: false },
  });
}

// Service-role client for server-only writes (admin form). Bypasses RLS.
export function getServiceClient() {
  if (!URL || !SERVICE) return null;
  return createClient(URL, SERVICE, {
    auth: { persistSession: false },
  });
}
