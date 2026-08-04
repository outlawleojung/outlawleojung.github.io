import { skillDomains } from "@/lib/portfolio";
import { skillUsageMap, skillMeta } from "@/lib/portfolio-utils";

export function Skills() {
  const usage = skillUsageMap();

  return (
    <section id="skills" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="mb-10">
          <p className="font-mono text-xs tracking-widest text-[var(--muted)]">
            SKILLS
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            사용 기술
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
            각 스택 옆의 연차는 실제 프로젝트에서 사용한 기간(중복 제외 연도 범위)이며,
            숫자는 도입한 프로젝트 수입니다.
          </p>
        </div>

        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {skillDomains.map((d) => (
            <div key={d.label}>
              <div className="mb-4 border-b border-[var(--border)] pb-3">
                <h3 className="text-base font-semibold tracking-tight">
                  {d.label}
                </h3>
                {d.description && (
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {d.description}
                  </p>
                )}
              </div>
              <ul className="space-y-2">
                {d.items.map((item) => {
                  const meta = skillMeta(item, usage);
                  return (
                    <li
                      key={item}
                      className="flex items-baseline justify-between gap-3 text-sm"
                    >
                      <span className="font-medium text-[var(--foreground)]">
                        {item}
                      </span>
                      <span className="flex items-baseline gap-2 font-mono text-[11px] text-[var(--muted)]">
                        {meta.years !== null && (
                          <span>
                            {meta.years}년{meta.ongoing ? "+" : ""}
                          </span>
                        )}
                        {meta.projectCount > 0 && (
                          <span>· {meta.projectCount} project{meta.projectCount > 1 ? "s" : ""}</span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
