"use client";
import { extractTikTokId } from "@/lib/tiktok";

// Use TikTok's official player iframe so the video actually plays inline.
// Falls back to a "Watch on TikTok" link if we can't derive the video id.
export default function TikTokEmbed({ url }) {
  const id = extractTikTokId(url);

  if (!id) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="card p-4 block text-mute text-sm"
      >
        Watch on TikTok ↗
      </a>
    );
  }

  const src = `https://www.tiktok.com/player/v1/${id}?music_info=0&description=0`;
  return (
    <div className="relative w-full aspect-[9/16] bg-black rounded-2xl overflow-hidden">
      <iframe
        src={src}
        className="absolute inset-0 w-full h-full"
        allow="fullscreen; picture-in-picture; encrypted-media; autoplay"
        allowFullScreen
        title="TikTok video"
      />
    </div>
  );
}
