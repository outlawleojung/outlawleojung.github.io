"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PostMeta } from "@/lib/blog";

type Props = {
  posts: PostMeta[];
};

export function BlogList({ posts }: Props) {
  const allTags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  const [activeTag, setActiveTag] = useState<string | null>(null);

  const visible = useMemo(
    () => (activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts),
    [posts, activeTag]
  );

  if (posts.length === 0) {
    return <p className="text-[var(--muted)]">아직 발행된 글이 없습니다.</p>;
  }

  return (
    <>
      {allTags.length > 0 && (
        <div className="mb-10 flex flex-wrap items-center gap-2 border-b border-[var(--border)] pb-6">
          <span className="mr-1 font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
            Tags
          </span>
          <TagChip
            active={activeTag === null}
            onClick={() => setActiveTag(null)}
            label={`전체 (${posts.length})`}
          />
          {allTags.map((tag) => {
            const count = posts.filter((p) => p.tags.includes(tag)).length;
            return (
              <TagChip
                key={tag}
                active={activeTag === tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                label={`${tag} · ${count}`}
              />
            );
          })}
        </div>
      )}

      <ul className="space-y-1">
        {visible.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}/`}
              className="group block rounded-lg border-l-2 border-transparent py-5 pl-5 pr-4 transition hover:border-[var(--accent)] hover:bg-[var(--card)]/60"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <time className="font-mono text-xs text-[var(--muted)]">
                  {post.date}
                </time>
                <span aria-hidden className="text-[var(--muted)]">·</span>
                <span className="font-mono text-xs text-[var(--muted)]">
                  {post.readingMinutes}분 읽기
                </span>
              </div>
              <h2 className="mt-2 text-lg font-semibold leading-snug text-[var(--foreground)] transition group-hover:text-[var(--accent)] sm:text-xl">
                {post.title}
              </h2>
              {post.description && (
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--muted)] sm:text-[15px]">
                  {post.description}
                </p>
              )}
              {post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {post.tags.map((t) => (
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

      {visible.length === 0 && (
        <p className="mt-8 text-sm text-[var(--muted)]">
          해당 태그의 글이 없습니다.
        </p>
      )}
    </>
  );
}

function TagChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 font-mono text-xs transition ${
        active
          ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
          : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-[var(--accent)]/50 hover:text-[var(--foreground)]"
      }`}
    >
      {label}
    </button>
  );
}
