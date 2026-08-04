import Link from "next/link";
import type { PostMeta } from "@/lib/blog";

export function RecentWriting({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <section
      id="writing"
      className="border-b border-[var(--border)] bg-[var(--card)]/40 print:hidden"
    >
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-widest text-[var(--muted)]">
              WRITING
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              기술 노트
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              설계 결정과 학습을 문서로 정리합니다.
            </p>
          </div>
          <Link
            href="/blog/"
            className="group inline-flex items-baseline gap-1.5 font-mono text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)]"
          >
            모든 글
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>

        <ul className="space-y-1">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}/`}
                className="group relative block rounded-lg border-l-2 border-transparent py-5 pl-5 pr-4 transition hover:border-[var(--accent)] hover:bg-[var(--background)]"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <time className="font-mono text-xs text-[var(--muted)]">
                    {post.date}
                  </time>
                  <span
                    aria-hidden
                    className="text-[var(--muted)]"
                  >
                    ·
                  </span>
                  <span className="font-mono text-xs text-[var(--muted)]">
                    {post.readingMinutes}분 읽기
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-semibold leading-snug text-[var(--foreground)] transition group-hover:text-[var(--accent)] sm:text-xl">
                  {post.title}
                </h3>
                {post.description && (
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--muted)] sm:text-[15px]">
                    {post.description}
                  </p>
                )}
                {post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 5).map((t) => (
                      <span
                        key={t}
                        className="rounded border border-[var(--border)] bg-[var(--background)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--muted)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
