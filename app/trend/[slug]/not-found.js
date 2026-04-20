import Link from "next/link";

export default function NotFound() {
  return (
    <main className="py-24 text-center space-y-4">
      <div className="text-4xl">🕺</div>
      <h1 className="text-xl font-bold">Trend not found</h1>
      <Link href="/" className="btn-primary inline-flex">
        Back to trends
      </Link>
    </main>
  );
}
