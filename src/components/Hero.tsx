import { profile } from "@/lib/portfolio";

export function Hero() {
  return (
    <section className="relative border-b border-[var(--border)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] print:hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 45%), radial-gradient(circle at 90% 30%, color-mix(in oklab, var(--accent) 10%, transparent), transparent 40%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 py-20 print:py-6 sm:py-28">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-3 py-1 text-xs font-medium text-[var(--accent)]">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          </span>
          <span>{profile.status}</span>
        </div>

        <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
          {profile.name}
        </h1>
        <p className="mt-3 text-lg text-[var(--muted)] sm:text-xl">
          {profile.title} · {profile.since}–{new Date().getFullYear()}
        </p>

        <p className="mt-6 max-w-2xl text-xl font-medium leading-[1.5] text-[var(--foreground)] sm:text-2xl">
          {profile.headline}
        </p>
        <p className="mt-3 max-w-2xl text-base leading-[1.6] text-[var(--muted)] sm:text-lg">
          {profile.subheadline}
        </p>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {profile.keywords.map((k) => (
            <span
              key={k}
              className="rounded-md border border-[var(--border)] bg-[var(--card)] px-2 py-1 font-mono text-xs text-[var(--foreground)]/80"
            >
              {k}
            </span>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3 text-sm">
          <a
            href="#career"
            className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2.5 font-semibold text-white transition hover:brightness-110"
          >
            커리어 보기
            <span aria-hidden>↓</span>
          </a>
          <a
            href="/about/"
            className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
          >
            자기소개서
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
          >
            이메일 보내기
          </a>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--border)] pt-6 text-sm">
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
            {profile.githubHandle}
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
