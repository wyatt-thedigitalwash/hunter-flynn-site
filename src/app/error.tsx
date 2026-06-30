'use client';

import Link from 'next/link';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center bg-black">
      <h1 className="font-din uppercase tracking-widest text-white text-4xl">Something Went Wrong</h1>
      <p className="mt-4 font-adobe text-white/50 text-lg">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="bg-white text-black font-din uppercase tracking-widest py-[14px] px-[40px] text-sm hover:bg-white/90 transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="border border-white bg-transparent text-white font-din uppercase tracking-widest py-[14px] px-[40px] text-sm hover:bg-white/10 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
