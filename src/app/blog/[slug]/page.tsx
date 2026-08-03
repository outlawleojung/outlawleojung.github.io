import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import "@/app/blog/prose.css";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} · Blog`,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <div className="mb-6 text-sm">
        <Link
          href="/blog/"
          className="font-mono text-[var(--muted)] hover:text-[var(--accent)]"
        >
          ← Blog
        </Link>
      </div>

      <header className="mb-12 border-b border-[var(--border)] pb-10">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--muted)]">
          <time>{post.date}</time>
          {post.tags.length > 0 && <span>·</span>}
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span
                key={t}
                className="rounded border border-[var(--border)] bg-[var(--card)] px-1.5 py-0.5"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <h1 className="mt-5 text-4xl font-bold leading-[1.2] tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        {post.description && (
          <p className="mt-5 text-lg leading-[1.7] text-[var(--muted)] sm:text-xl">
            {post.description}
          </p>
        )}
      </header>

      <article className="prose-blog">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug, rehypeHighlight]}
        >
          {post.content}
        </ReactMarkdown>
      </article>

      <footer className="mt-16 border-t border-[var(--border)] pt-8">
        <Link
          href="/blog/"
          className="font-mono text-sm text-[var(--accent)] hover:underline"
        >
          ← 다른 글 보기
        </Link>
      </footer>
    </main>
  );
}
