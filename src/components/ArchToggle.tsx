"use client";

import { useState } from "react";

export function ArchToggle({ label, src }: { label: string; src: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium hover:bg-black/[.03] dark:hover:bg-white/[.03]"
      >
        <span className="flex items-center gap-2">
          <span className="font-mono text-[var(--muted)]">
            {open ? "▼" : "▶"}
          </span>
          {label}
        </span>
        <span className="font-mono text-xs text-[var(--muted)]">
          {open ? "hide" : "view"}
        </span>
      </button>
      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--background)] p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={label}
            className="mx-auto max-h-[600px] w-auto max-w-full"
          />
        </div>
      )}
    </div>
  );
}
