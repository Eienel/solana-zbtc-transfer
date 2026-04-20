import Link from "next/link";
import VoteButton from "./VoteButton";

// Compact card for an alternative tutorial. Tapping navigates to
// /trend/[slug]?t=<id> which swaps it into the featured slot.
export default function AltTutorialCard({ trendSlug, tutorial }) {
  return (
    <div className="card p-3 flex items-center gap-3">
      <Link
        href={`/trend/${trendSlug}?t=${tutorial.id}`}
        className="flex items-center gap-3 flex-1 min-w-0 tap"
      >
        {tutorial.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tutorial.thumbnail_url}
            alt=""
            className="w-14 h-14 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-line shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <div className="font-semibold truncate">
            {tutorial.author_name || tutorial.author_handle || "Anonymous"}
          </div>
          <div className="text-xs text-mute truncate">
            {tutorial.steps?.length || 0} steps
          </div>
        </div>
      </Link>
      <VoteButton
        tutorialId={tutorial.id}
        initialCount={tutorial.vote_count || 0}
      />
    </div>
  );
}
