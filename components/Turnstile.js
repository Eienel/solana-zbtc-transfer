"use client";
import { useEffect, useRef } from "react";

// Renders the Cloudflare Turnstile widget if a site key is configured.
// On success, the widget injects a hidden input named cf-turnstile-response
// into the surrounding form. No-op when site key is missing (local dev).
export default function Turnstile() {
  const ref = useRef(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) return;
    const existing = document.querySelector(
      'script[src*="challenges.cloudflare.com/turnstile"]'
    );
    if (!existing) {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.async = true;
      s.defer = true;
      document.body.appendChild(s);
    }
  }, [siteKey]);

  if (!siteKey) return null;
  return (
    <div
      ref={ref}
      className="cf-turnstile"
      data-sitekey={siteKey}
      data-theme="dark"
    />
  );
}
