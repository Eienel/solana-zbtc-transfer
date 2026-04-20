"use server";

import { revalidatePath } from "next/cache";
import { getServiceClient } from "@/lib/supabase";
import {
  extractTikTokId,
  fetchTikTokOEmbed,
  normalizeTikTokUrl,
  resolveTikTokVideoId,
  scrapeTikTokMusic,
} from "@/lib/tiktok";
import { verifyTurnstile } from "@/lib/turnstile";
import { headers } from "next/headers";

function slugify(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function getIp() {
  const h = headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    null
  );
}

// Step 1: paste URL → we fetch music_id + oembed + see if a trend exists.
export async function previewAction(_prev, formData) {
  const raw = String(formData.get("tiktok_url") || "");
  const url = normalizeTikTokUrl(raw);
  if (!url) {
    return { ok: false, error: "That doesn't look like a TikTok URL." };
  }

  const [oembed, music] = await Promise.all([
    fetchTikTokOEmbed(url),
    scrapeTikTokMusic(url),
  ]);

  if (!music?.music_id) {
    return {
      ok: false,
      error:
        "Couldn't read the sound from that TikTok. Make sure the video is public, then try again.",
    };
  }

  const sb = getServiceClient();
  let existing = null;
  if (sb) {
    const { data } = await sb
      .from("trends")
      .select("id, slug, name, music_title, difficulty")
      .eq("music_id", music.music_id)
      .maybeSingle();
    existing = data || null;

    // Reject duplicate tutorials (same TikTok URL already uploaded)
    const { data: dup } = await sb
      .from("tutorials")
      .select("id, trend_id")
      .eq("tiktok_url", url)
      .maybeSingle();
    if (dup) {
      const { data: trend } = await sb
        .from("trends")
        .select("slug")
        .eq("id", dup.trend_id)
        .maybeSingle();
      return {
        ok: false,
        error: `That tutorial is already posted${
          trend ? ` (/trend/${trend.slug})` : ""
        }.`,
      };
    }
  }

  return {
    ok: true,
    preview: {
      url,
      music_id: music.music_id,
      music_title: music.music_title,
      oembed_html: oembed?.html || null,
      author_handle: oembed?.author_unique_id
        ? `@${oembed.author_unique_id}`
        : oembed?.author_url
        ? "@" + oembed.author_url.split("@")[1]?.split("?")[0]
        : null,
      author_name: oembed?.author_name || null,
      thumbnail_url: oembed?.thumbnail_url || null,
      existing,
    },
  };
}

// Step 2: full submit. Re-scrapes the music_id server-side so the client
// can't forge it.
export async function submitAction(_prev, formData) {
  const sb = getServiceClient();
  if (!sb) {
    return {
      ok: false,
      error:
        "Database is not configured. Ask the admin to set the Supabase env vars.",
    };
  }

  const turnstileToken = String(formData.get("cf-turnstile-response") || "");
  const ts = await verifyTurnstile(turnstileToken, getIp());
  if (!ts.ok) return { ok: false, error: "Captcha failed. Try again." };

  const url = normalizeTikTokUrl(String(formData.get("tiktok_url") || ""));
  if (!url) return { ok: false, error: "Invalid TikTok URL." };

  const [oembed, music] = await Promise.all([
    fetchTikTokOEmbed(url),
    scrapeTikTokMusic(url),
  ]);
  if (!music?.music_id) {
    return {
      ok: false,
      error:
        "Couldn't read the sound from that TikTok. Make sure the video is public.",
    };
  }

  // Dedupe: same video can't be posted twice
  {
    const { data: dup } = await sb
      .from("tutorials")
      .select("id")
      .eq("tiktok_url", url)
      .maybeSingle();
    if (dup) return { ok: false, error: "That tutorial is already posted." };
  }

  // Resolve or create the trend
  let { data: trend } = await sb
    .from("trends")
    .select("id, slug")
    .eq("music_id", music.music_id)
    .maybeSingle();

  if (!trend) {
    const newName = String(formData.get("new_trend_name") || "").trim();
    const newDifficulty = String(formData.get("new_trend_difficulty") || "easy");
    if (!newName) {
      return {
        ok: false,
        error: "This sound is new - please name the trend.",
      };
    }
    if (!["easy", "medium", "hard"].includes(newDifficulty)) {
      return { ok: false, error: "Pick a difficulty." };
    }

    // Ensure slug uniqueness by appending a suffix if needed
    let base = slugify(newName);
    if (!base) base = "trend";
    let slug = base;
    for (let i = 2; i < 50; i++) {
      const { data: clash } = await sb
        .from("trends")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (!clash) break;
      slug = `${base}-${i}`;
    }

    const { data: created, error: tErr } = await sb
      .from("trends")
      .insert({
        slug,
        name: newName,
        music_id: music.music_id,
        music_title: music.music_title,
        difficulty: newDifficulty,
      })
      .select("id, slug")
      .single();
    if (tErr) return { ok: false, error: `Could not create trend: ${tErr.message}` };
    trend = created;
  }

  // Build steps from repeatable fields
  const titles = formData.getAll("step_title");
  const descs = formData.getAll("step_description");
  const counts = formData.getAll("step_count");
  const steps = [];
  for (let i = 0; i < titles.length; i++) {
    const title = String(titles[i] || "").trim();
    if (!title) continue;
    steps.push({
      order: i + 1,
      title,
      description: String(descs[i] || "").trim(),
      count: String(counts[i] || "").trim(),
    });
  }
  if (steps.length === 0) {
    return { ok: false, error: "Add at least one step." };
  }

  const rawHandle = String(formData.get("author_handle") || "").trim();
  const handle =
    rawHandle ||
    (oembed?.author_unique_id ? `@${oembed.author_unique_id}` : null);

  // Ensure we store a URL that contains /video/{id} so the embed works.
  let canonical = url;
  if (!extractTikTokId(canonical)) {
    const vid = await resolveTikTokVideoId(canonical);
    if (vid) canonical = `https://www.tiktok.com/@placeholder/video/${vid}`;
  }

  const { data: tutorial, error: tutErr } = await sb
    .from("tutorials")
    .insert({
      trend_id: trend.id,
      tiktok_url: canonical,
      music_id: music.music_id,
      author_handle: handle,
      author_name: oembed?.author_name || null,
      thumbnail_url: oembed?.thumbnail_url || null,
      oembed_html: oembed?.html || null,
    })
    .select("id")
    .single();
  if (tutErr) return { ok: false, error: `Upload failed: ${tutErr.message}` };

  const { error: stepsErr } = await sb
    .from("steps")
    .insert(steps.map((s) => ({ ...s, tutorial_id: tutorial.id })));
  if (stepsErr) {
    await sb.from("tutorials").delete().eq("id", tutorial.id);
    return { ok: false, error: `Steps failed: ${stepsErr.message}` };
  }

  revalidatePath("/");
  revalidatePath(`/trend/${trend.slug}`);
  return { ok: true, slug: trend.slug };
}
