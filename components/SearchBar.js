"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");

  useEffect(() => {
    const id = setTimeout(() => {
      const next = new URLSearchParams(Array.from(params.entries()));
      if (q) next.set("q", q);
      else next.delete("q");
      router.replace(`/?${next.toString()}`, { scroll: false });
    }, 200);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="relative">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search trends or song..."
        className="input pl-10"
        aria-label="Search trends"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mute">
        🔎
      </span>
      {q && (
        <button
          onClick={() => setQ("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-mute px-2 py-1"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
