"use client";

import { useEffect, useState } from "react";

/**
 * Welcome splash that shows on first visit, fades out after ~2 seconds.
 * Uses sessionStorage so it doesn't show on every page navigation.
 * SSR-safe — only renders client-side.
 */
export function SplashScreen() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Show once per browser session
    const seen = sessionStorage.getItem("fluent-hub-splash-seen");
    if (!seen) {
      setShow(true);
      sessionStorage.setItem("fluent-hub-splash-seen", "1");
      // Remove from DOM after animation completes
      const timer = setTimeout(() => setShow(false), 2400);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!mounted || !show) return null;

  return (
    <div
      aria-hidden="true"
      className="splash-fade fixed inset-0 z-[100] flex items-center justify-center bg-background"
    >
      <div className="absolute inset-0 rialo-grid opacity-50" />
      <div className="relative flex flex-col items-center gap-4 px-6 text-center">
        <Logomark size={36} />
        <h1 className="splash-text-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          Welcome to <span className="text-accent">Fluent Hub</span>
        </h1>
        <p className="splash-text-2 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          Everything Fluent in one page.
        </p>
      </div>
    </div>
  );
}

function Logomark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="rgb(var(--accent))" strokeWidth="1.5" />
      <path d="M8 7H16V9H10V11H15V13H10V17H8V7Z" fill="rgb(var(--accent))" />
    </svg>
  );
}
