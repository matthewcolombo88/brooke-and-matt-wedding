import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory-100 px-6 text-center">
      <div>
        <p className="eyebrow">Page Not Found</p>
        <h1 className="mt-4 font-serif text-4xl text-ink-900">We couldn&rsquo;t find that page</h1>
        <p className="mt-4 text-ink-500">Let&rsquo;s get you back to the wedding.</p>
        <Link href="/" className="btn-primary mt-8 inline-flex">
          Return Home
        </Link>
      </div>
    </div>
  );
}
