"use client";
import { useEffect, useRef } from "react";
import { extractTikTokId } from "@/lib/tiktok";

// Renders TikTok's blockquote embed + loads their embed script.
// oembed.html is ideal when available (server-fetched); otherwise fall back
// to a reconstructed blockquote using the video id.
export default function TikTokEmbed({ url, oembedHtml }) {
  const ref = useRef(null);

  useEffect(() => {
    const existing = document.querySelector('script[src*="tiktok.com/embed.js"]');
    if (!existing) {
      const s = document.createElement("script");
      s.src = "https://www.tiktok.com/embed.js";
      s.async = true;
      document.body.appendChild(s);
    } else if (window.tiktokEmbed) {
      window.tiktokEmbed.lib.render(ref.current ? [ref.current] : undefined);
    }
  }, [url, oembedHtml]);

  if (oembedHtml) {
    return (
      <div
        ref={ref}
        className="tiktok-embed overflow-hidden rounded-2xl"
        dangerouslySetInnerHTML={{ __html: oembedHtml }}
      />
    );
  }

  const id = extractTikTokId(url);
  if (!id) {
    return (
      <div className="card p-4 text-mute text-sm">
        Invalid TikTok URL.
      </div>
    );
  }

  return (
    <div ref={ref} className="tiktok-embed overflow-hidden rounded-2xl">
      <blockquote
        className="tiktok-embed"
        cite={url}
        data-video-id={id}
        style={{ maxWidth: "605px", minWidth: "100%" }}
      >
        <section>
          <a href={url} target="_blank" rel="noreferrer">
            Watch on TikTok
          </a>
        </section>
      </blockquote>
    </div>
  );
}
