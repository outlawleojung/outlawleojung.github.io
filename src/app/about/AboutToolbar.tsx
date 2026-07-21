"use client";

import Link from "next/link";

export function AboutToolbar() {
  return (
    <nav className="mb-8 flex items-center justify-between font-mono text-xs text-[var(--muted)] print:hidden">
      <Link href="/" className="hover:text-[var(--accent)]">
        ← 포트폴리오로
      </Link>
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded border border-[var(--border)] px-3 py-1 hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        PDF로 저장 · 인쇄
      </button>
    </nav>
  );
}
