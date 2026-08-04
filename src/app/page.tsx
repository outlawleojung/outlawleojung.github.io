import { Hero } from "@/components/Hero";
import { CareerIndex } from "@/components/CareerIndex";
import { Skills } from "@/components/Skills";
import { CompanySection } from "@/components/CompanySection";
import { RecentWriting } from "@/components/RecentWriting";
import { companies, profile } from "@/lib/portfolio";
import { getAllPosts } from "@/lib/blog";

export default function Home() {
  const recentPosts = getAllPosts()
    .slice(0, 3)
    .map(({ content: _content, ...meta }) => meta);

  return (
    <main>
      <Hero />
      <CareerIndex />
      <Skills />
      <div id="projects" className="border-b border-[var(--border)] pb-8 print:pb-2">
        <div className="mx-auto max-w-5xl px-6 pt-16 print:pt-6">
          <p className="font-mono text-xs tracking-widest text-[var(--muted)]">
            PROJECTS
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            프로젝트 상세
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
            회사 · 시간 순. 위 커리어 인덱스에서 항목을 클릭하면 해당 프로젝트로 이동합니다.
          </p>
        </div>
        {companies.map((c) => (
          <CompanySection key={c.name} company={c} />
        ))}
      </div>
      <RecentWriting posts={recentPosts} />
      <footer className="mx-auto max-w-5xl px-6 py-12 text-sm text-[var(--muted)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} {profile.name}. Built with Next.js on
            GitHub Pages.
          </p>
          <div className="flex gap-4">
            <a href="/blog/" className="hover:text-[var(--accent)]">
              Blog
            </a>
            <a href="/about/" className="hover:text-[var(--accent)]">
              자기소개서
            </a>
            <a
              href="https://github.com/outlawleojung/outlawleojung.github.io"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--accent)]"
            >
              source
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
