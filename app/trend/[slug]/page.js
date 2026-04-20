import Link from "next/link";
import { notFound } from "next/navigation";
import DifficultyBadge from "@/components/DifficultyBadge";
import TutorialView from "@/components/TutorialView";
import AltTutorialCard from "@/components/AltTutorialCard";
import { getTrendBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function TrendPage({ params, searchParams }) {
  const trend = await getTrendBySlug(params.slug);
  if (!trend) notFound();

  const tutorials = trend.tutorials || [];
  const featuredId = searchParams?.t?.toString();
  const featured =
    tutorials.find((t) => t.id === featuredId) || tutorials[0] || null;
  const alternatives = tutorials.filter((t) => featured && t.id !== featured.id);

  return (
    <main className="space-y-5">
      <div className="flex items-center justify-between">
        <Link href="/" className="btn-ghost !py-2 !px-3 text-sm">
          ← Back
        </Link>
        <DifficultyBadge level={trend.difficulty} />
      </div>

      <div>
        <h1 className="text-2xl font-bold leading-tight">{trend.name}</h1>
        {trend.music_title && (
          <p className="text-mute text-sm mt-1">♪ {trend.music_title}</p>
        )}
      </div>

      {featured ? (
        <TutorialView tutorial={featured} />
      ) : (
        <div className="card p-6 text-center text-mute space-y-3">
          <p>No tutorials for this trend yet.</p>
          <Link
            href={`/upload?url=${encodeURIComponent("")}`}
            className="btn-primary inline-flex"
          >
            Be the first
          </Link>
        </div>
      )}

      {alternatives.length > 0 && (
        <section className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Other takes</h2>
            <span className="text-xs text-mute">{alternatives.length}</span>
          </div>
          <div className="space-y-2">
            {alternatives.map((t) => (
              <AltTutorialCard
                key={t.id}
                trendSlug={trend.slug}
                tutorial={t}
              />
            ))}
          </div>
        </section>
      )}

      <div className="pt-4">
        <Link href="/upload" className="btn-ghost w-full block text-center">
          + Upload your version
        </Link>
      </div>
    </main>
  );
}

export async function generateMetadata({ params }) {
  const trend = await getTrendBySlug(params.slug);
  return { title: trend ? `${trend.name} — TrendStep` : "TrendStep" };
}
