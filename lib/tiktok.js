// TikTok helpers: oEmbed fetch, video id extraction, and a music_id scraper
// used for anti-abuse (every tutorial for a given trend must share the same
// music_id, so you can't upload a cat video and have it count as "Renegade").

export function extractTikTokId(url) {
  if (!url) return null;
  const m = url.match(/\/(?:video|photo)\/(\d+)/);
  return m ? m[1] : null;
}

// Server-side: follow redirects + scrape HTML to find the numeric video id
// for URLs that don't contain /video/{id} directly (vm.tiktok.com/..., /t/...,
// or any other short form TikTok gives out).
export async function resolveTikTokVideoId(url) {
  const direct = extractTikTokId(url);
  if (direct) return direct;
  if (!url) return null;
  try {
    const res = await fetch(url, {
      headers: { "user-agent": UA, accept: "text/html" },
      redirect: "follow",
    });
    const fromFinalUrl = extractTikTokId(res.url);
    if (fromFinalUrl) return fromFinalUrl;
    if (!res.ok) return null;
    const html = await res.text();
    const m =
      html.match(/"itemId"\s*:\s*"(\d+)"/) ||
      html.match(/"aweme_id"\s*:\s*"(\d+)"/) ||
      html.match(/tiktok\.com\/[^"'\s]*\/video\/(\d+)/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

export function normalizeTikTokUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    if (!/(^|\.)tiktok\.com$/.test(u.hostname)) return null;
    // Drop tracking params for dedupe
    ["_t", "_r", "is_copy_url", "is_from_webapp", "lang"].forEach((p) =>
      u.searchParams.delete(p)
    );
    return u.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

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

const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 " +
  "(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

// Fetch the TikTok video page HTML and dig the music_id + music title out
// of the embedded JSON. TikTok changes markup periodically, so we try a
// few patterns and return null if none match (caller should surface a
// clear error to the uploader).
export async function scrapeTikTokMusic(url) {
  if (!url) return null;
  try {
    const res = await fetch(url, {
      headers: { "user-agent": UA, accept: "text/html" },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const html = await res.text();

    const patterns = [
      /"music"\s*:\s*\{[^}]*?"id"\s*:\s*"(\d+)"[^}]*?"title"\s*:\s*"([^"]+)"/,
      /"musicInfo"\s*:\s*\{[^}]*?"id"\s*:\s*"(\d+)"[^}]*?"title"\s*:\s*"([^"]+)"/,
      /"music"\s*:\s*\{[^}]*?"title"\s*:\s*"([^"]+)"[^}]*?"id"\s*:\s*"(\d+)"/,
    ];
    for (let i = 0; i < patterns.length; i++) {
      const m = html.match(patterns[i]);
      if (m) {
        const id = i === 2 ? m[2] : m[1];
        const title = i === 2 ? m[1] : m[2];
        return { music_id: id, music_title: decodeJson(title) };
      }
    }

    // Last-ditch: id alone without title
    const idOnly = html.match(/"music"\s*:\s*\{[^}]*?"id"\s*:\s*"(\d+)"/);
    if (idOnly) return { music_id: idOnly[1], music_title: null };

    return null;
  } catch {
    return null;
  }
}

function decodeJson(s) {
  try {
    return JSON.parse(`"${s}"`);
  } catch {
    return s;
  }
}
