import Link from "next/link";
import UploadForm from "./UploadForm";

export const metadata = { title: "Upload a tutorial — TrendStep" };
export const dynamic = "force-dynamic";

export default function UploadPage() {
  return (
    <main className="space-y-5">
      <div className="flex items-center justify-between pt-2">
        <Link href="/" className="btn-ghost !py-2 !px-3 text-sm">
          ← Back
        </Link>
        <h1 className="text-xl font-bold">Upload</h1>
        <span className="w-[60px]" />
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Teach a TikTok dance</h2>
        <p className="text-mute text-sm">
          Paste a public TikTok, then break down the moves. No account needed.
        </p>
      </div>

      <UploadForm />
    </main>
  );
}
