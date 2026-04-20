import Link from "next/link";
import LoginForm from "./LoginForm";
import TrendForm from "./TrendForm";
import { isAdmin } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAdmin();
  return (
    <main className="space-y-5">
      <div className="flex items-center justify-between pt-2">
        <Link href="/" className="btn-ghost !py-2 !px-3 text-sm">
          ← Back
        </Link>
        <h1 className="text-xl font-bold">Admin</h1>
        <span className="w-[60px]" />
      </div>

      {authed ? <TrendForm /> : <LoginForm />}
    </main>
  );
}
