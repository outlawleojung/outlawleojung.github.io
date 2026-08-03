"use client";

import { useState } from "react";

export function ArchToggle({
  label,
  src,
  defaultOpen = false,
}: {
  label: string;
  src: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] print:break-inside-avoid">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium hover:bg-black/[.03] print:hidden dark:hover:bg-white/[.03]"
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

      <div className="hidden border-b border-[var(--border)] px-4 py-3 text-sm font-medium print:block">
        {label}
      </div>

      <div
        className={`${
          open ? "block" : "hidden"
        } border-t border-[var(--border)] bg-[var(--background)] p-4 print:!block print:border-t-0 print:p-2`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={label}
          className="mx-auto w-full max-w-full print:max-h-none"
        />
      </div>
    </div>
  );
}
