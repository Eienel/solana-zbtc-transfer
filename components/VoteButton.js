"use client";
import { useState, useTransition } from "react";
import { voteAction } from "@/app/trend/[slug]/actions";

export default function VoteButton({ tutorialId, initialCount, size = "md" }) {
  const [count, setCount] = useState(initialCount || 0);
  const [voted, setVoted] = useState(false);
  const [pending, start] = useTransition();

  const onClick = () => {
    // Optimistic
    const next = voted ? count - 1 : count + 1;
    setVoted((v) => !v);
    setCount(next);
    start(async () => {
      const res = await voteAction(tutorialId);
      if (res?.ok) {
        setVoted(res.voted);
        setCount(res.count);
      } else {
        // Revert
        setVoted((v) => !v);
        setCount(count);
      }
    });
  };

  const big = size === "lg";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={voted}
      className={`tap rounded-full border inline-flex items-center gap-2
        ${big ? "px-4 py-2 text-base" : "px-3 py-1.5 text-sm"}
        ${
          voted
            ? "bg-accent/15 border-accent text-accent"
            : "bg-card border-line text-ink"
        }`}
    >
      <span>{voted ? "▲" : "△"}</span>
      <span className="font-semibold tabular-nums">{count}</span>
    </button>
  );
}
