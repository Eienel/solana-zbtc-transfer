import { notFound } from "next/navigation";
import TutorialView from "@/components/TutorialView";
import { getTrendBySlug } from "@/lib/data";
import { fetchTikTokOEmbed } from "@/lib/tiktok";

export const revalidate = 60;

export default async function TrendPage({ params }) {
  const trend = await getTrendBySlug(params.slug);
  if (!trend) notFound();

  const oembed = await fetchTikTokOEmbed(trend.tiktok_url);
  return <TutorialView trend={trend} oembedHtml={oembed?.html || null} />;
}

export async function generateMetadata({ params }) {
  const trend = await getTrendBySlug(params.slug);
  return {
    title: trend ? `${trend.name} — TrendStep` : "TrendStep",
  };
}
