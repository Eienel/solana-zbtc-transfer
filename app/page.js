import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import TrendCard from "@/components/TrendCard";
import { searchTrends } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }) {
  const q = (searchParams?.q || "").toString();
  const trends = await searchTrends(q);

  // Trending = trends that have at least one upvote. Top 4.
  const trending = !q ? trends.filter((t) => t.total_votes > 0).slice(0, 4) : [];
  const trendingIds = new Set(trending.map((t) => t.id));
  const rest = trends.filter((t) => !trendingIds.has(t.id));

  return (
    <main className="space-y-5">
      <header className="pt-2 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Trend<span className="text-accent">Step</span>
          </h1>
          <p className="text-mute text-sm mt-1">
            Community tutorials for TikTok dances.
          </p>
        </div>
        <Link href="/upload" className="btn-primary !py-2 !px-3 text-sm">
          + Upload
        </Link>
      </header>

      <SearchBar />

      {trends.length === 0 ? (
        <div className="card p-6 text-center text-mute space-y-3">
          {q ? (
            <p>No trends match "{q}".</p>
          ) : (
            <p>No trends yet. Be the first to upload one.</p>
          )}
          <Link href="/upload" className="btn-primary inline-flex">
            Upload a tutorial
          </Link>
        </div>
      ) : (
        <>
          {trending.length > 0 && (
            <section className="space-y-2">
              <h2 className="font-semibold flex items-center gap-2">
                <span>🔥 Trending</span>
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {trending.map((t) => (
                  <TrendCard key={t.id} trend={t} />
                ))}
              </div>
            </section>
          )}

          {rest.length > 0 && (
            <section className="space-y-2">
              {trending.length > 0 && (
                <h2 className="font-semibold text-mute">
                  {q ? "Results" : "All trends"}
                </h2>
              )}
              <div className="grid grid-cols-2 gap-3">
                {rest.map((t) => (
                  <TrendCard key={t.id} trend={t} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
