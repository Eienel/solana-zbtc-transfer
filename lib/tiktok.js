// Pull a TikTok video id from any common URL shape.
export function extractTikTokId(url) {
  if (!url) return null;
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : null;
}

// Server-side fetch of TikTok's oEmbed payload (includes html + thumbnail).
// Docs: https://developers.tiktok.com/doc/embed-videos/
export async function fetchTikTokOEmbed(url) {
  if (!url) return null;
  try {
    const res = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
