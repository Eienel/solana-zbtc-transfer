"use client";
import { useEffect, useRef, useState } from "react";
import TikTokEmbed from "./TikTokEmbed";
import VoteButton from "./VoteButton";
import ReportButton from "./ReportButton";
import { mirrorText } from "@/lib/mirror";

const SPEEDS = [
  { label: "1x", ms: 1500 },
  { label: "0.75x", ms: 2000 },
  { label: "0.5x", ms: 3000 },
];

// Full tutorial card: embed + author + steps + mirror/slow + vote/report.
// Used for the "featured" tutorial at the top of a trend page.
export default function TutorialView({ tutorial }) {
  const [mirror, setMirror] = useState(false);
  const [slowOn, setSlowOn] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [speedIdx, setSpeedIdx] = useState(1);
  const timerRef = useRef(null);

  const steps = tutorial.steps || [];

  useEffect(() => {
    if (!slowOn || steps.length === 0) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    timerRef.current = setInterval(() => {
      setActiveIdx((i) => (i + 1) % steps.length);
    }, SPEEDS[speedIdx].ms);
    return () => clearInterval(timerRef.current);
  }, [slowOn, speedIdx, steps.length]);

  const render = (s) => (mirror ? mirrorText(s) : s);

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

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMirror((v) => !v)}
          aria-pressed={mirror}
          className={`btn flex-1 ${
            mirror
              ? "bg-accent text-white"
              : "bg-card border border-line text-ink"
          }`}
        >
          🪞 Mirror {mirror ? "on" : "off"}
        </button>
        <button
          type="button"
          onClick={() => {
            setSlowOn((v) => !v);
            setActiveIdx(0);
          }}
          aria-pressed={slowOn}
          className={`btn flex-1 ${
            slowOn
              ? "bg-accent text-white"
              : "bg-card border border-line text-ink"
          }`}
        >
          🐢 Slow {slowOn ? "on" : "off"}
        </button>
      </div>

      {slowOn && (
        <div className="card p-3 flex items-center justify-between">
          <div className="text-sm text-mute">
            Step {activeIdx + 1} / {steps.length}
          </div>
          <div className="flex gap-1">
            {SPEEDS.map((sp, i) => (
              <button
                key={sp.label}
                onClick={() => setSpeedIdx(i)}
                className={`tap rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  speedIdx === i ? "bg-accent text-white" : "bg-line text-ink"
                }`}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {steps.length === 0 ? (
        <div className="card p-4 text-mute text-sm">No steps yet.</div>
      ) : (
        <ol className="space-y-3">
          {steps.map((step, i) => {
            const active = slowOn && i === activeIdx;
            return (
              <li
                key={step.order ?? i}
                className={`card p-4 transition-colors ${
                  active ? "border-accent bg-accent/10" : ""
                }`}
                onClick={() => slowOn && setActiveIdx(i)}
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
                      <div className="font-semibold">{render(step.title)}</div>
                      {step.count && (
                        <div className="text-xs font-mono text-mute">
                          {step.count}
                        </div>
                      )}
                    </div>
                    {step.description && (
                      <p className="text-sm text-mute mt-1">
                        {render(step.description)}
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
