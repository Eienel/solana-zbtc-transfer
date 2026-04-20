"use client";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import Turnstile from "@/components/Turnstile";
import { previewAction, submitAction } from "./actions";

function Btn({ children, ...rest }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full"
      {...rest}
    >
      {pending ? "Working…" : children}
    </button>
  );
}

function blankStep() {
  return { title: "", description: "", count: "" };
}

export default function UploadForm() {
  const [preview, setPreview] = useState(null);
  const [steps, setSteps] = useState([blankStep(), blankStep(), blankStep(), blankStep()]);

  const [previewState, runPreview] = useFormState(async (_p, fd) => {
    const res = await previewAction(_p, fd);
    if (res.ok) setPreview(res.preview);
    return res;
  }, null);

  const [submitState, runSubmit] = useFormState(submitAction, null);

  const update = (i, key, value) =>
    setSteps((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s))
    );
  const addStep = () => setSteps((prev) => [...prev, blankStep()]);
  const removeStep = (i) =>
    setSteps((prev) => prev.filter((_, idx) => idx !== i));

  if (submitState?.ok) {
    return (
      <div className="card p-6 space-y-4 text-center">
        <div className="text-4xl">🎉</div>
        <h2 className="text-lg font-semibold">Tutorial uploaded</h2>
        <p className="text-sm text-mute">
          Thanks for teaching. People can now vote and learn from your take.
        </p>
        <div className="flex gap-2">
          <Link href={`/trend/${submitState.slug}`} className="btn-primary flex-1">
            View trend
          </Link>
          <Link href="/" className="btn-ghost flex-1">
            Home
          </Link>
        </div>
      </div>
    );
  }

  // Step 1: paste URL
  if (!preview) {
    return (
      <form action={runPreview} className="space-y-4">
        <div>
          <label className="block text-sm text-mute mb-1" htmlFor="tiktok_url">
            TikTok URL
          </label>
          <input
            id="tiktok_url"
            name="tiktok_url"
            type="url"
            required
            className="input"
            placeholder="https://www.tiktok.com/@user/video/123..."
          />
          <p className="text-xs text-mute mt-2">
            We read the sound from this video to match it to an existing trend.
          </p>
        </div>
        {previewState?.error && (
          <p className="text-hard text-sm">{previewState.error}</p>
        )}
        <Btn>Next →</Btn>
      </form>
    );
  }

  // Step 2: fill steps + (maybe) name a new trend
  const isNewTrend = !preview.existing;

  return (
    <form action={runSubmit} className="space-y-4">
      <input type="hidden" name="tiktok_url" value={preview.url} />

      <div className="card p-3">
        <div className="flex items-center gap-3">
          {preview.thumbnail_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview.thumbnail_url}
              alt=""
              className="w-14 h-14 rounded-lg object-cover"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="font-semibold truncate">
              {preview.author_name || preview.author_handle || "TikTok video"}
            </div>
            {preview.music_title && (
              <div className="text-xs text-mute truncate">
                ♪ {preview.music_title}
              </div>
            )}
          </div>
        </div>
        {isNewTrend ? (
          <div className="mt-3 text-xs text-accent">
            New sound — you'll also name this trend below.
          </div>
        ) : (
          <div className="mt-3 text-xs text-easy">
            ✓ Matches existing trend: <b>{preview.existing.name}</b>
          </div>
        )}
      </div>

      {isNewTrend && (
        <>
          <div>
            <label className="block text-sm text-mute mb-1" htmlFor="new_trend_name">
              Trend name
            </label>
            <input
              id="new_trend_name"
              name="new_trend_name"
              required
              className="input"
              placeholder="e.g. Renegade"
            />
          </div>
          <div>
            <label className="block text-sm text-mute mb-1" htmlFor="new_trend_difficulty">
              Difficulty
            </label>
            <select
              id="new_trend_difficulty"
              name="new_trend_difficulty"
              className="input"
              defaultValue="easy"
            >
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
          </div>
        </>
      )}

      <div>
        <label className="block text-sm text-mute mb-1" htmlFor="author_handle">
          Your @ (optional)
        </label>
        <input
          id="author_handle"
          name="author_handle"
          className="input"
          placeholder={preview.author_handle || "@yourhandle"}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Steps</h3>
          <button
            type="button"
            onClick={addStep}
            className="btn-ghost !py-2 !px-3 text-sm"
          >
            + Add step
          </button>
        </div>
        <div className="space-y-3">
          {steps.map((s, i) => (
            <div key={i} className="card p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm">Step {i + 1}</div>
                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    className="text-xs text-hard"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                name="step_title"
                value={s.title}
                onChange={(e) => update(i, "title", e.target.value)}
                required
                className="input"
                placeholder="Title (e.g. Clap and cross)"
              />
              <textarea
                name="step_description"
                value={s.description}
                onChange={(e) => update(i, "description", e.target.value)}
                rows={2}
                className="input resize-none"
                placeholder="Description (what does the body do?)"
              />
              <input
                name="step_count"
                value={s.count}
                onChange={(e) => update(i, "count", e.target.value)}
                className="input"
                placeholder="Count (e.g. 1-2-3-4)"
              />
            </div>
          ))}
        </div>
      </div>

      <Turnstile />

      {submitState?.error && (
        <p className="text-hard text-sm">{submitState.error}</p>
      )}

      <Btn>Upload tutorial</Btn>

      <button
        type="button"
        onClick={() => setPreview(null)}
        className="w-full text-center text-mute text-sm py-2"
      >
        ← Start over with a different URL
      </button>
    </form>
  );
}
