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
        <div className="my-6 flex justify-center overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.heroImage}
            alt={project.name}
            className="max-h-[720px] w-auto max-w-full object-contain"
          />
        </div>
      )}

      {project.youtube && (
        <div className="my-6">
          <div className="aspect-video w-full overflow-hidden rounded-lg border border-[var(--border)] bg-black print:hidden">
            <iframe
              src={`https://www.youtube.com/embed/${project.youtube}`}
              title={project.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
          <div className="hidden print:block">
            <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.youtube.com/vi/${project.youtube}/hqdefault.jpg`}
                alt={`${project.name} 영상 썸네일`}
                className="w-full"
              />
            </div>
            <p className="mt-2 text-center font-mono text-xs text-[var(--muted)]">
              ▶ 영상: youtu.be/{project.youtube}
            </p>
          </div>
        </div>
      )}

      {project.gallery && project.gallery.length > 0 && (
        <div className="my-6 grid gap-3 sm:grid-cols-2">
          {project.gallery.map((src) => (
            <div
              key={src}
              className="flex justify-center overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={project.name}
                className="max-h-[520px] w-auto max-w-full object-contain"
              />
            </div>
          ))}
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

      {project.planned && project.planned.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
            설계 · 검토 중
          </p>
          <ul className="space-y-1.5 text-sm leading-relaxed sm:text-[15px]">
            {project.planned.map((r) => (
              <li key={r} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full border border-[var(--muted)] bg-transparent" />
                <span className="text-[var(--muted)]">{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {project.archImage && (
        <ArchToggle
          label={project.archImage.label}
          src={project.archImage.src}
        />
      )}

      {project.archImages?.map((a) => (
        <ArchToggle key={a.src} label={a.label} src={a.src} />
      ))}

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
