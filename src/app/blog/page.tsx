import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog · 정민영",
  description: "시니어 백엔드 엔지니어 정민영의 기술 블로그.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12 border-b border-[var(--border)] pb-8">
        <p className="font-mono text-xs tracking-widest text-[var(--muted)]">
          BLOG
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">기술 블로그</h1>
        <p className="mt-3 text-[var(--muted)]">
          분산 시스템, 백엔드 아키텍처, 레거시 현대화에 대한 실무 노트.
        </p>
        <div className="mt-6 flex gap-4 text-sm">
          <Link href="/" className="text-[var(--accent)] hover:underline">
            ← 포트폴리오로
          </Link>
        </div>
      </header>

      {posts.length === 0 ? (
        <p className="text-[var(--muted)]">아직 발행된 글이 없습니다.</p>
      ) : (
        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}/`}
                className="group block rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:border-[var(--accent)]"
              >
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--muted)]">
                  <time>{post.date}</time>
                  <span>·</span>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded border border-[var(--border)] bg-[var(--background)] px-1.5 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <h2 className="mt-3 text-xl font-semibold group-hover:text-[var(--accent)] sm:text-2xl">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="mt-2 leading-relaxed text-[var(--muted)]">
                    {post.description}
                  </p>
                )}
                <div className="mt-4 font-mono text-xs font-semibold text-[var(--accent)]">
                  READ →
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
