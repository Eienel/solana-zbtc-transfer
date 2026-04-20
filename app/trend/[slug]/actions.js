"use server";

import { revalidatePath } from "next/cache";
import { getServiceClient } from "@/lib/supabase";
import { getFingerprint } from "@/lib/fingerprint";

// Toggle an upvote. Returns the new state for optimistic UI.
export async function voteAction(tutorialId) {
  if (!tutorialId) return { ok: false, error: "Missing tutorial." };
  const sb = getServiceClient();
  if (!sb) return { ok: false, error: "Database not configured." };

  const fingerprint = getFingerprint();

  // Is there already a vote from this fingerprint?
  const { data: existing } = await sb
    .from("votes")
    .select("tutorial_id")
    .eq("tutorial_id", tutorialId)
    .eq("fingerprint", fingerprint)
    .maybeSingle();

  if (existing) {
    await sb
      .from("votes")
      .delete()
      .eq("tutorial_id", tutorialId)
      .eq("fingerprint", fingerprint);
  } else {
    await sb.from("votes").insert({ tutorial_id: tutorialId, fingerprint });
  }

  const { data: tut } = await sb
    .from("tutorials")
    .select("vote_count")
    .eq("id", tutorialId)
    .maybeSingle();

  revalidatePath("/", "layout");
  return {
    ok: true,
    voted: !existing,
    count: tut?.vote_count ?? 0,
  };
}

// Report a tutorial. Trigger auto-hides at 5 unique reports.
export async function reportAction(tutorialId, reason) {
  if (!tutorialId) return { ok: false, error: "Missing tutorial." };
  const sb = getServiceClient();
  if (!sb) return { ok: false, error: "Database not configured." };

  const fingerprint = getFingerprint();

  // Idempotent per fingerprint
  const { data: existing } = await sb
    .from("reports")
    .select("tutorial_id")
    .eq("tutorial_id", tutorialId)
    .eq("fingerprint", fingerprint)
    .maybeSingle();

  if (existing) return { ok: true, already: true };

  const { error } = await sb.from("reports").insert({
    tutorial_id: tutorialId,
    fingerprint,
    reason: (reason || "").slice(0, 280) || null,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  return { ok: true };
}
