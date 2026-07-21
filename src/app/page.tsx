import { Hero } from "@/components/Hero";
import { Skills } from "@/components/Skills";
import { CompanySection } from "@/components/CompanySection";
import { companies, profile } from "@/lib/portfolio";

export default function Home() {
  return (
    <main>
      <Hero />
      <Skills />
      <div id="projects" className="border-b border-[var(--border)] pb-8">
        <div className="mx-auto max-w-4xl px-6 pt-16">
          <h2 className="font-mono text-xs tracking-widest text-[var(--muted)]">
            PROJECTS
          </h2>
        </div>
        {companies.map((c) => (
          <CompanySection key={c.name} company={c} />
        ))}
      </div>
      <footer className="mx-auto max-w-4xl px-6 py-12 text-sm text-[var(--muted)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} {profile.name}. Built with Next.js ·
            Deployed on GitHub Pages via Actions.
          </p>
          <div className="flex gap-4">
            <a
              href="/about/"
              className="hover:text-[var(--accent)]"
            >
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
