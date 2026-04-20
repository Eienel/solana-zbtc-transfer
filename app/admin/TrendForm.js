"use client";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { createTrendAction, logoutAction } from "./actions";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full">
      {pending ? "Saving…" : "Save trend"}
    </button>
  );
}

function blankStep(order) {
  return { order, title: "", description: "", count: "" };
}

export default function TrendForm() {
  const [state, action] = useFormState(createTrendAction, null);
  const [steps, setSteps] = useState([blankStep(1), blankStep(2)]);

  const updateStep = (i, key, value) => {
    setSteps((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s))
    );
  };

  const addStep = () =>
    setSteps((prev) => [...prev, blankStep(prev.length + 1)]);

  const removeStep = (i) =>
    setSteps((prev) =>
      prev
        .filter((_, idx) => idx !== i)
        .map((s, idx) => ({ ...s, order: idx + 1 }))
    );

  if (state?.ok) {
    return (
      <div className="card p-6 space-y-4 text-center">
        <div className="text-4xl">✅</div>
        <h2 className="text-lg font-semibold">Trend saved</h2>
        <div className="flex gap-2">
          <Link href={`/trend/${state.slug}`} className="btn-primary flex-1">
            View trend
          </Link>
          <a href="/admin" className="btn-ghost flex-1">
            Add another
          </a>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-sm text-mute mb-1" htmlFor="name">
          Name
        </label>
        <input id="name" name="name" required className="input" placeholder="Renegade" />
      </div>

      <div>
        <label className="block text-sm text-mute mb-1" htmlFor="slug">
          Slug (optional)
        </label>
        <input id="slug" name="slug" className="input" placeholder="auto from name" />
      </div>

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
      </div>

      <div>
        <label className="block text-sm text-mute mb-1" htmlFor="thumbnail_url">
          Thumbnail URL
        </label>
        <input
          id="thumbnail_url"
          name="thumbnail_url"
          type="url"
          className="input"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm text-mute mb-1" htmlFor="difficulty">
          Difficulty
        </label>
        <select id="difficulty" name="difficulty" className="input" defaultValue="easy">
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Steps</h3>
          <button type="button" onClick={addStep} className="btn-ghost !py-2 !px-3 text-sm">
            + Add step
          </button>
        </div>

        <div className="space-y-3">
          {steps.map((s, i) => (
            <div key={i} className="card p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm">Step {s.order}</div>
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
              <input type="hidden" name="step_order" value={s.order} />
              <input
                name="step_title"
                value={s.title}
                onChange={(e) => updateStep(i, "title", e.target.value)}
                required
                className="input"
                placeholder="Title (e.g. Clap and cross)"
              />
              <textarea
                name="step_description"
                value={s.description}
                onChange={(e) => updateStep(i, "description", e.target.value)}
                rows={2}
                className="input resize-none"
                placeholder="Description (uses left/right - mirror mode will swap)"
              />
              <input
                name="step_count"
                value={s.count}
                onChange={(e) => updateStep(i, "count", e.target.value)}
                className="input"
                placeholder="Count (e.g. 1-2-3-4)"
              />
            </div>
          ))}
        </div>
      </div>

      {state?.error && <p className="text-hard text-sm">{state.error}</p>}

      <SubmitBtn />

      <form action={logoutAction}>
        <button type="submit" className="w-full text-center text-mute text-sm py-2">
          Sign out
        </button>
      </form>
    </form>
  );
}
