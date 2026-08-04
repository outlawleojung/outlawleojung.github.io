import { getAllPosts } from "@/lib/blog";
import { BlogList } from "./BlogList";

export const metadata = {
  title: "Blog · 정민영",
  description: "시니어 백엔드 엔지니어 정민영의 기술 블로그.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts().map(({ content: _content, ...meta }) => meta);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-10 border-b border-[var(--border)] pb-8">
        <p className="font-mono text-xs tracking-widest text-[var(--muted)]">
          BLOG
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">기술 노트</h1>
        <p className="mt-3 leading-relaxed text-[var(--muted)]">
          분산 시스템, 백엔드 아키텍처, 레거시 현대화 — 설계 결정과 학습을 정리합니다.
        </p>
      </header>

      <BlogList posts={posts} />
    </main>
  );
}
