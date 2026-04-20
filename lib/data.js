import { getPublicClient, hasSupabaseConfig } from "./supabase";
import {
  MOCK_TRENDS,
  searchMockTrends,
  getMockTrendBySlug,
} from "./mockData";

// Home list: trends with a thumbnail + tutorial count. Supports optional
// search across trend name and music title.
export async function searchTrends(q) {
  q = (q || "").trim();

  if (!hasSupabaseConfig()) {
    return searchMockTrends(q).map((t) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      music_title: t.music_title,
      difficulty: t.difficulty,
      thumbnail_url: t.tutorials[0]?.thumbnail_url || null,
      tutorial_count: t.tutorials.length,
    }));
  }

  const sb = getPublicClient();
  let query = sb
    .from("trends")
    .select(
      "id, slug, name, music_title, difficulty, created_at, tutorials(thumbnail_url, vote_count, hidden)"
    )
    .order("created_at", { ascending: false })
    .limit(60);

  if (q) {
    const like = `%${q}%`;
    query = query.or(`name.ilike.${like},music_title.ilike.${like}`);
  }

  const { data, error } = await query;
  if (error) {
    console.error("searchTrends:", error.message);
    return [];
  }

  return (data || []).map((t) => {
    const visible = (t.tutorials || []).filter((x) => !x.hidden);
    const top = visible.sort((a, b) => b.vote_count - a.vote_count)[0];
    return {
      id: t.id,
      slug: t.slug,
      name: t.name,
      music_title: t.music_title,
      difficulty: t.difficulty,
      thumbnail_url: top?.thumbnail_url || null,
      tutorial_count: visible.length,
    };
  });
}

// Trend page: all non-hidden tutorials for a trend, each with steps.
export async function getTrendBySlug(slug) {
  if (!hasSupabaseConfig()) {
    const t = getMockTrendBySlug(slug);
    if (!t) return null;
    const sorted = [...t.tutorials].sort((a, b) => b.vote_count - a.vote_count);
    return { ...t, tutorials: sorted };
  }

  const sb = getPublicClient();
  const { data: trend, error } = await sb
    .from("trends")
    .select("id, slug, name, music_id, music_title, difficulty, created_at")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !trend) return null;

  const { data: tuts } = await sb
    .from("tutorials")
    .select(
      "id, tiktok_url, author_handle, author_name, thumbnail_url, oembed_html, vote_count, created_at, steps(order, title, description, count)"
    )
    .eq("trend_id", trend.id)
    .eq("hidden", false)
    .order("vote_count", { ascending: false });

  return {
    ...trend,
    tutorials: (tuts || []).map((t) => ({
      ...t,
      steps: (t.steps || []).sort((a, b) => a.order - b.order),
    })),
  };
}

export async function findTrendByMusicId(musicId) {
  if (!hasSupabaseConfig()) {
    return MOCK_TRENDS.find((t) => t.music_id === musicId) || null;
  }
  const sb = getPublicClient();
  const { data } = await sb
    .from("trends")
    .select("id, slug, name, music_id, music_title, difficulty")
    .eq("music_id", musicId)
    .maybeSingle();
  return data || null;
}
