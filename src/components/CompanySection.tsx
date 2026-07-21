import type { Company } from "@/lib/portfolio";
import { ProjectCard } from "./ProjectCard";

export function CompanySection({ company }: { company: Company }) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-6 flex items-center gap-4 border-b border-[var(--border)] pb-4">
        {company.logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={company.logo}
            alt={company.name}
            className="h-10 w-auto max-w-[150px] object-contain"
          />
        )}
        <div className="flex items-baseline gap-3">
          <h2 className="text-2xl font-semibold sm:text-3xl">{company.name}</h2>
          <span className="font-mono text-xs text-[var(--muted)]">
            · {company.projects.length} project
            {company.projects.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>
      <div className="space-y-6">
        {company.projects.map((p) => (
          <ProjectCard key={p.name} project={p} />
        ))}
      </div>
    </section>
  );
}
