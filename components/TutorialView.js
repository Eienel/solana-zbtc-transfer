"use client";
import { useState } from "react";
import TikTokEmbed from "./TikTokEmbed";
import VoteButton from "./VoteButton";
import ReportButton from "./ReportButton";

// Full tutorial card: embed + author + steps + step-through + vote/report.
// Used for the "featured" tutorial at the top of a trend page.
export default function TutorialView({ tutorial }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const steps = tutorial.steps || [];
  const hasSteps = steps.length > 0;

  const goNext = () => {
    if (!hasSteps) return;
    setActiveIdx((i) => (i + 1) % steps.length);
  };

  return (
    <div className="space-y-4">
      <TikTokEmbed url={tutorial.tiktok_url} videoId={tutorial.video_id} />

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold truncate">
            {tutorial.author_name || tutorial.author_handle || "Anonymous"}
          </div>
          {tutorial.author_handle && (
            <a
              href={tutorial.tiktok_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-mute truncate block"
            >
              {tutorial.author_handle} · view on TikTok ↗
            </a>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <VoteButton
            tutorialId={tutorial.id}
            initialCount={tutorial.vote_count || 0}
            size="lg"
          />
          <ReportButton tutorialId={tutorial.id} />
        </div>
      </div>

      {hasSteps && (
        <div className="card p-3 flex items-center justify-between gap-3">
          <div className="text-sm text-mute">
            Step {activeIdx + 1} / {steps.length}
          </div>
          <button
            type="button"
            onClick={goNext}
            className="btn-primary !py-2 !px-4 text-sm"
          >
            {activeIdx === steps.length - 1 ? "Restart ↻" : "Next step →"}
          </button>
        </div>
      )}

      {!hasSteps ? (
        <div className="card p-4 text-mute text-sm">No steps yet.</div>
      ) : (
        <ol className="space-y-3">
          {steps.map((step, i) => {
            const active = i === activeIdx;
            return (
              <li
                key={step.order ?? i}
                onClick={() => setActiveIdx(i)}
                className={`card p-4 transition-colors tap ${
                  active ? "border-accent bg-accent/10" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`shrink-0 w-9 h-9 rounded-full flex items-center
                                justify-center font-bold ${
                                  active
                                    ? "bg-accent text-white"
                                    : "bg-line text-ink"
                                }`}
                  >
                    {step.order ?? i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold">{step.title}</div>
                      {step.count && (
                        <div className="text-xs font-mono text-mute">
                          {step.count}
                        </div>
                      )}
                    </div>
                    {step.description && (
                      <p className="text-sm text-mute mt-1">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
