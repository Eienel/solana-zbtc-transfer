import crypto from "node:crypto";
import { headers } from "next/headers";

// Hash IP + UA with a server-side secret so votes/reports are idempotent
// without requiring an account. Not reversible, not reliable as identity -
// just a simple per-person rate key.
export function getFingerprint() {
  const h = headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "0.0.0.0";
  const ua = h.get("user-agent") || "";
  const secret = process.env.FINGERPRINT_SECRET || "dev-secret";
  return crypto.createHash("sha256").update(`${ip}|${ua}|${secret}`).digest("hex");
}
