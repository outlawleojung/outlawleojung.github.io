"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Portfolio", match: (p: string) => p === "/" },
  { href: "/blog/", label: "Blog", match: (p: string) => p.startsWith("/blog") },
  { href: "/about/", label: "About", match: (p: string) => p.startsWith("/about") },
];

export function SiteNav() {
  const pathname = usePathname() ?? "/";

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="text-lg font-bold tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent)] sm:text-xl">
            정민영
          </span>
          <span className="hidden font-mono text-xs text-[var(--muted)] sm:inline">
            Jung Min-Young
          </span>
        </Link>
        <ul className="flex items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => {
            const active = item.match(pathname);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative inline-flex items-center px-3 py-2 text-[15px] transition sm:px-4 ${
                    active
                      ? "font-semibold text-[var(--accent)]"
                      : "font-medium text-[var(--foreground)]/75 hover:text-[var(--foreground)]"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-x-3 -bottom-[13px] h-[2px] rounded-full bg-[var(--accent)]"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
