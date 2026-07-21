import { skills } from "@/lib/portfolio";

function Chip({ label, strong }: { label: string; strong?: boolean }) {
  return (
    <span
      className={
        strong
          ? "rounded-md border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-2.5 py-1 text-sm text-[var(--accent)]"
          : "rounded-md border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-sm text-[var(--foreground)]"
      }
    >
      {label}
    </span>
  );
}

export function Skills() {
  return (
    <section id="skills" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="font-mono text-xs tracking-widest text-[var(--muted)]">
          SKILLS
        </h2>
        <div className="mt-6 space-y-6">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
              Strong
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.strong.map((s) => (
                <Chip key={s} label={s} strong />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
              Knowledgeable
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.knowledgeable.map((s) => (
                <Chip key={s} label={s} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
