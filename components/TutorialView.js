"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TikTokEmbed from "./TikTokEmbed";
import DifficultyBadge from "./DifficultyBadge";
import { mirrorText } from "@/lib/mirror";

const SPEEDS = [
  { label: "1x", ms: 1500 },
  { label: "0.75x", ms: 2000 },
  { label: "0.5x", ms: 3000 },
];

export default function TutorialView({ trend, oembedHtml }) {
  const [mirror, setMirror] = useState(false);
  const [slowOn, setSlowOn] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [speedIdx, setSpeedIdx] = useState(1);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!slowOn) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    timerRef.current = setInterval(() => {
      setActiveIdx((i) => (i + 1) % trend.steps.length);
    }, SPEEDS[speedIdx].ms);
    return () => clearInterval(timerRef.current);
  }, [slowOn, speedIdx, trend.steps.length]);

  const render = (s) => (mirror ? mirrorText(s) : s);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Link href="/" className="btn-ghost !py-2 !px-3 text-sm">
          ← Back
        </Link>
        <DifficultyBadge level={trend.difficulty} />
      </div>

      <div>
        <h1 className="text-2xl font-bold leading-tight">{trend.name}</h1>
        <p className="text-mute text-sm mt-1">
          Follow along with the video, then drill the steps.
        </p>
      </div>

      <TikTokEmbed url={trend.tiktok_url} oembedHtml={oembedHtml} />

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
          <span className="mr-2">🪞</span>Mirror {mirror ? "on" : "off"}
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
          <span className="mr-2">🐢</span>Slow {slowOn ? "on" : "off"}
        </button>
      </div>

      {slowOn && (
        <div className="card p-3 flex items-center justify-between">
          <div className="text-sm text-mute">
            Step {activeIdx + 1} / {trend.steps.length}
          </div>
          <div className="flex gap-1">
            {SPEEDS.map((sp, i) => (
              <button
                key={sp.label}
                onClick={() => setSpeedIdx(i)}
                className={`tap rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  speedIdx === i
                    ? "bg-accent text-white"
                    : "bg-line text-ink"
                }`}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <ol className="space-y-3">
        {trend.steps.map((step, i) => {
          const active = slowOn && i === activeIdx;
          return (
            <li
              key={step.order ?? i}
              className={`card p-4 transition-colors ${
                active ? "border-accent bg-accent/10" : ""
              }`}
              onClick={() => {
                if (slowOn) setActiveIdx(i);
              }}
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
                    <div className="text-xs font-mono text-mute">
                      {step.count}
                    </div>
                  </div>
                  <p className="text-sm text-mute mt-1">
                    {render(step.description)}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
