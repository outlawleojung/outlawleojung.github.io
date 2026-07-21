import { profile } from "@/lib/portfolio";

export function Hero() {
  return (
    <section className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-4xl px-6 py-24 print:py-6 sm:py-32">
        <p className="font-mono text-xs tracking-widest text-[var(--muted)]">
          PORTFOLIO · {new Date().getFullYear()}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          {profile.title}
          <br />
          <span className="text-[var(--accent)]">{profile.name}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          <strong className="text-[var(--foreground)]">
            {profile.years}년차 백엔드 엔지니어 · 팀 리드.
          </strong>{" "}
          {profile.summary}
        </p>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 text-[var(--foreground)] hover:text-[var(--accent)]"
          >
            <span className="font-mono text-[var(--muted)]">email</span>
            {profile.email}
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[var(--foreground)] hover:text-[var(--accent)]"
          >
            <span className="font-mono text-[var(--muted)]">github</span>
            outlawleojung
          </a>
          <span className="hidden items-center gap-2 print:inline-flex">
            <span className="font-mono text-[var(--muted)]">web</span>
            outlawleojung.github.io
          </span>
        </div>
      </div>
    </section>
  );
}
