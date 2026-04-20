import Link from "next/link";
import DifficultyBadge from "./DifficultyBadge";

export default function TrendCard({ trend }) {
  return (
    <Link
      href={`/trend/${trend.slug}`}
      className="card tap block overflow-hidden active:border-accent/60"
    >
      <div className="aspect-[4/5] w-full bg-line overflow-hidden relative">
        {trend.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={trend.thumbnail_url}
            alt={trend.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-mute text-sm">
            no tutorials
          </div>
        )}
        {trend.tutorial_count > 0 && (
          <div className="absolute top-2 right-2 pill bg-black/60 text-ink">
            {trend.tutorial_count} {trend.tutorial_count === 1 ? "take" : "takes"}
          </div>
        )}
      </div>
      <div className="p-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold truncate">{trend.name}</div>
          {trend.music_title && (
            <div className="text-xs text-mute truncate">♪ {trend.music_title}</div>
          )}
        </div>
        <DifficultyBadge level={trend.difficulty} />
      </div>
    </Link>
  );
}
