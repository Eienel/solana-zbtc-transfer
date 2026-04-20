import { getPublicClient, hasSupabaseConfig } from "./supabase";
import { MOCK_TRENDS, getMockTrendBySlug } from "./mockData";

// Lightweight data layer. Falls back to local mock data when Supabase env
// vars are missing, so you can test the UI on your phone before DB setup.

export async function getAllTrends() {
  if (!hasSupabaseConfig()) return MOCK_TRENDS;
  const sb = getPublicClient();
  const { data, error } = await sb
    .from("trends")
    .select("id, slug, name, difficulty, thumbnail_url, tiktok_url, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getAllTrends:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getTrendBySlug(slug) {
  if (!hasSupabaseConfig()) return getMockTrendBySlug(slug);
  const sb = getPublicClient();
  const { data: trend, error } = await sb
    .from("trends")
    .select("id, slug, name, difficulty, thumbnail_url, tiktok_url, created_at")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !trend) return null;

  const { data: steps } = await sb
    .from("steps")
    .select("id, order, title, description, count")
    .eq("trend_id", trend.id)
    .order("order", { ascending: true });

  return { ...trend, steps: steps ?? [] };
}
