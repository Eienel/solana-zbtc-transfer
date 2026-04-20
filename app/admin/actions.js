"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServiceClient } from "@/lib/supabase";

const COOKIE = "trendstep_admin";

function slugify(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export async function isAdmin() {
  return cookies().get(COOKIE)?.value === "ok";
}

export async function loginAction(_prev, formData) {
  const password = String(formData.get("password") || "");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return { ok: false, error: "ADMIN_PASSWORD env var is not set." };
  }
  if (password !== expected) {
    return { ok: false, error: "Wrong password." };
  }
  cookies().set(COOKIE, "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect("/admin");
}

export async function logoutAction() {
  cookies().delete(COOKIE);
  redirect("/admin");
}

export async function createTrendAction(_prev, formData) {
  if (!(await isAdmin())) return { ok: false, error: "Not authorized." };

  const sb = getServiceClient();
  if (!sb) {
    return {
      ok: false,
      error: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const name = String(formData.get("name") || "").trim();
  const tiktok_url = String(formData.get("tiktok_url") || "").trim();
  const difficulty = String(formData.get("difficulty") || "easy");
  const thumbnail_url = String(formData.get("thumbnail_url") || "").trim() || null;
  const customSlug = String(formData.get("slug") || "").trim();

  if (!name) return { ok: false, error: "Name is required." };
  if (!/^https?:\/\//i.test(tiktok_url)) {
    return { ok: false, error: "TikTok URL must start with http(s)://" };
  }
  if (!["easy", "medium", "hard"].includes(difficulty)) {
    return { ok: false, error: "Difficulty must be easy, medium, or hard." };
  }

  const slug = slugify(customSlug || name);
  if (!slug) return { ok: false, error: "Could not derive a slug." };

  const orders = formData.getAll("step_order");
  const titles = formData.getAll("step_title");
  const descs = formData.getAll("step_description");
  const counts = formData.getAll("step_count");

  const steps = [];
  for (let i = 0; i < titles.length; i++) {
    const title = String(titles[i] || "").trim();
    if (!title) continue;
    steps.push({
      order: Number(orders[i]) || i + 1,
      title,
      description: String(descs[i] || "").trim(),
      count: String(counts[i] || "").trim(),
    });
  }
  if (steps.length === 0) {
    return { ok: false, error: "Add at least one step." };
  }

  const { data: trend, error: trendErr } = await sb
    .from("trends")
    .insert({ slug, name, tiktok_url, difficulty, thumbnail_url })
    .select("id, slug")
    .single();

  if (trendErr) {
    return { ok: false, error: `Insert trend failed: ${trendErr.message}` };
  }

  const { error: stepsErr } = await sb
    .from("steps")
    .insert(steps.map((s) => ({ ...s, trend_id: trend.id })));

  if (stepsErr) {
    await sb.from("trends").delete().eq("id", trend.id);
    return { ok: false, error: `Insert steps failed: ${stepsErr.message}` };
  }

  revalidatePath("/");
  revalidatePath(`/trend/${trend.slug}`);
  return { ok: true, slug: trend.slug };
}
