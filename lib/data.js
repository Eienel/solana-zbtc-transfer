import { getPublicClient, getServiceClient, hasSupabaseConfig } from "./supabase";
import { extractTikTokId, resolveTikTokVideoId } from "./tiktok";
import {
  MOCK_TRENDS,
  searchMockTrends,
  getMockTrendBySlug,
} from "./mockData";

// Home list: trends with a thumbnail + tutorial count + total_votes. Supports
// optional search across trend name and music title. Sorted by popularity.
export async function searchTrends(q) {
  q = (q || "").trim();

  if (!hasSupabaseConfig()) {
    return searchMockTrends(q)
      .map((t) => shapeTrendSummary(t, t.tutorials))
      .sort(byPopularity);
  }

  const sb = getPublicClient();
  let query = sb
    .from("trends")
    .select(
      "id, slug, name, music_title, difficulty, created_at, tutorials(thumbnail_url, vote_count, hidden)"
    )
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

  return (data || [])
    .map((t) => shapeTrendSummary(t, t.tutorials || []))
    .sort(byPopularity);
}

function shapeTrendSummary(trend, tutorials) {
  const visible = (tutorials || []).filter((x) => !x.hidden);
  const top = [...visible].sort((a, b) => b.vote_count - a.vote_count)[0];
  const total_votes = visible.reduce((sum, t) => sum + (t.vote_count || 0), 0);
  return {
    id: trend.id,
    slug: trend.slug,
    name: trend.name,
    music_title: trend.music_title,
    difficulty: trend.difficulty,
    thumbnail_url: top?.thumbnail_url || null,
    tutorial_count: visible.length,
    total_votes,
    created_at: trend.created_at,
  };
}

function byPopularity(a, b) {
  if (b.total_votes !== a.total_votes) return b.total_votes - a.total_votes;
  if (b.tutorial_count !== a.tutorial_count)
    return b.tutorial_count - a.tutorial_count;
  return new Date(b.created_at) - new Date(a.created_at);
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
      "id, tiktok_url, author_handle, author_name, thumbnail_url, vote_count, created_at, steps(order, title, description, count)"
    )
    .eq("trend_id", trend.id)
    .eq("hidden", false)
    .order("vote_count", { ascending: false });

  const withIds = await Promise.all(
    (tuts || []).map(async (t) => {
      let video_id = extractTikTokId(t.tiktok_url);
      if (!video_id) {
        video_id = await resolveTikTokVideoId(t.tiktok_url);
      }
      return {
        ...t,
        video_id,
        steps: (t.steps || []).sort((a, b) => a.order - b.order),
      };
    })
  );

  return { ...trend, tutorials: withIds };
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
