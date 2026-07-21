import type { Project } from "@/lib/portfolio";
import { ArchToggle } from "./ArchToggle";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
      <header className="mb-4">
        <h3 className="text-xl font-semibold sm:text-2xl">{project.name}</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">{project.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-[var(--muted)]">
          <span>기간 · {project.period}</span>
          {project.serviceLink && <span>링크 · {project.serviceLink.label}</span>}
          {project.github && (
            <a
              href={project.github.href}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--accent)] hover:underline"
            >
              GitHub · {project.github.label}
              {project.github.note ? ` (${project.github.note})` : ""}
            </a>
          )}
        </div>
      </header>

      {project.heroImage && (
        <div className="my-6 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.heroImage}
            alt={project.name}
            className="w-full"
          />
        </div>
      )}

      <div className="mt-6">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          담당
        </p>
        <ul className="space-y-1.5 text-sm leading-relaxed sm:text-[15px]">
          {project.responsibilities.map((r) => (
            <li key={r} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      {project.archImage && (
        <ArchToggle
          label={project.archImage.label}
          src={project.archImage.src}
        />
      )}

      <div className="mt-6">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          사용 기술
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((t) => (
            <span
              key={t}
              className="rounded border border-[var(--border)] bg-[var(--background)] px-2 py-0.5 font-mono text-xs text-[var(--foreground)]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
