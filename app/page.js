import TrendCard from "@/components/TrendCard";
import { getAllTrends } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const trends = await getAllTrends();
  return (
    <main className="space-y-6">
      <header className="pt-2">
        <h1 className="text-3xl font-black tracking-tight">
          Trend<span className="text-accent">Step</span>
        </h1>
        <p className="text-mute text-sm mt-1">
          Learn TikTok dances one count at a time.
        </p>
      </header>

      {trends.length === 0 ? (
        <div className="card p-6 text-center text-mute">
          No trends yet. Add one in{" "}
          <a href="/admin" className="text-accent underline">
            /admin
          </a>
          .
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {trends.map((t) => (
            <TrendCard key={t.id} trend={t} />
          ))}
        </div>
      )}
    </main>
  );
}
