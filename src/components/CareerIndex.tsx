import Link from "next/link";
import { allProjectRefs, sortRefsNewestFirst } from "@/lib/portfolio-utils";

export function CareerIndex() {
  const refs = sortRefsNewestFirst(allProjectRefs());

  return (
    <section
      id="career"
      className="border-b border-[var(--border)] bg-[var(--card)]/40 print:hidden"
    >
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-widest text-[var(--muted)]">
              CAREER
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              커리어 인덱스
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              최신순 · 클릭하면 상세로 이동합니다. 총 {refs.length}개 프로젝트.
            </p>
          </div>
          <a
            href="#projects"
            className="group inline-flex items-baseline gap-1.5 font-mono text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)]"
          >
            전체 상세
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--background)]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
                <th className="whitespace-nowrap px-4 py-3 font-normal">기간</th>
                <th className="whitespace-nowrap px-4 py-3 font-normal">회사</th>
                <th className="px-4 py-3 font-normal">프로젝트</th>
                <th className="px-4 py-3 font-normal">주요 스택</th>
              </tr>
            </thead>
            <tbody>
              {refs.map((ref, i) => {
                const yearRange =
                  ref.startYear === null
                    ? "—"
                    : ref.ongoing
                      ? `${ref.startYear} →`
                      : ref.endYear && ref.endYear !== ref.startYear
                        ? `${ref.startYear}–${String(ref.endYear).slice(2)}`
                        : String(ref.startYear);
                return (
                  <tr
                    key={ref.anchorId}
                    className={`group border-b border-[var(--border)] last:border-b-0 transition hover:bg-[var(--card)]/60 ${
                      i % 2 === 1 ? "bg-[var(--card)]/25" : ""
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 align-top font-mono text-xs text-[var(--muted)]">
                      <span className="flex items-center gap-1.5">
                        {yearRange}
                        {ref.ongoing && (
                          <span
                            aria-label="ongoing"
                            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
                          />
                        )}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-top text-xs text-[var(--muted)] sm:text-sm">
                      {ref.company.name}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <Link
                        href={`#${ref.anchorId}`}
                        className="font-medium text-[var(--foreground)] transition group-hover:text-[var(--accent)]"
                      >
                        {ref.project.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-wrap gap-1">
                        {ref.project.stack.slice(0, 5).map((t) => (
                          <span
                            key={t}
                            className="rounded border border-[var(--border)] bg-[var(--card)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--muted)]"
                          >
                            {t}
                          </span>
                        ))}
                        {ref.project.stack.length > 5 && (
                          <span className="font-mono text-[11px] text-[var(--muted)]">
                            +{ref.project.stack.length - 5}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
