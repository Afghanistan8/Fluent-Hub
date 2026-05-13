"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";

export function PrintsLookup({ initialValue = "" }: { initialValue?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = value.trim();
    if (!cleaned) return;
    router.push(`/prints?id=${encodeURIComponent(cleaned)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="X handle, wallet address, or Privy DID"
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-md border border-border-strong bg-background-elevated py-3 pl-10 pr-4 text-[14px] text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>
      <button
        type="submit"
        disabled={!value.trim()}
        className="btn-primary inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-[14px] font-medium disabled:cursor-not-allowed disabled:opacity-50"
      >
        Look up Prints
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}
