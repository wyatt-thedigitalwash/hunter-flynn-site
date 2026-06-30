import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center bg-black">
      <h1 className="font-din uppercase tracking-widest text-white text-4xl">Page Not Found</h1>
      <p className="mt-4 font-adobe text-white/50 text-lg">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 bg-white text-black font-din uppercase tracking-widest py-[14px] px-[40px] text-sm hover:bg-white/90 transition-colors"
      >
        Go Home
      </Link>
    </main>
  );
}
