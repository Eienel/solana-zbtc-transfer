// Verify a Cloudflare Turnstile token server-side. If TURNSTILE_SECRET is
// not set, verification is skipped (useful for local dev).
export async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) return { ok: true, skipped: true };
  if (!token) return { ok: false, reason: "missing-token" };

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body }
    );
    const json = await res.json();
    return { ok: Boolean(json.success), reason: json["error-codes"]?.[0] };
  } catch (e) {
    return { ok: false, reason: "verify-failed" };
  }
}
