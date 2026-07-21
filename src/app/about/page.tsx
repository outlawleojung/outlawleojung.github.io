import type { Metadata } from "next";
import { profile } from "@/lib/portfolio";
import { AboutToolbar } from "./AboutToolbar";

export const metadata: Metadata = {
  title: `자기소개서 · ${profile.name}`,
  description: `${profile.name} — ${profile.title} 자기소개서`,
};

const intro =
  "NestJS 백엔드 설계와 Azure 클라우드 인프라 구축을 주력으로 해온 13년 차 개발자입니다.";

const sections: Array<{ heading: string; body: string }> = [
  {
    heading: "1. 백엔드 설계 및 레거시 전환",
    body:
      "한컴프론티스에서 NestJS를 처음 도입해 메타버스 플랫폼 3종의 백엔드를 설계·구축했습니다. " +
      "이후 애니챗에서는 앱 서비스를 NestJS + PostgreSQL + Flutter로 단독 리뉴얼하여 런칭했고, " +
      "현재 힐링샘에서는 PHP, Spring Boot 레거시 3개 서비스를 NestJS + Next.js + gRPC MSA로 전환 중입니다.",
  },
  {
    heading: "2. 클라우드 및 DevOps",
    body:
      "MS 파트너사(티디지)에서 Azure 인프라 설계와 DevOps 기술지원을 담당하며 AZ-400, AZ-204 자격을 " +
      "취득했습니다. 이후 한컴프론티스와 애니챗에서 AKS 컨테이너 환경과 GitHub Actions CI/CD 파이프라인을 " +
      "직접 구성해 운영했습니다.",
  },
  {
    heading: "3. 프로젝트 리딩",
    body:
      "한컴프론티스에서 서버팀 팀장으로 기술 협의를 주도했고, 애니챗에서는 팀원을 리딩하며 앱 리뉴얼을 " +
      "수행했습니다. 현재 힐링샘에서는 단독 개발자로 기술 선정부터 운영까지 전 과정을 직접 실행하고 있습니다.",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 print:px-6 print:py-4">
      <AboutToolbar />

      <header className="mb-10 border-b border-[var(--border)] pb-6 print:mb-4 print:pb-3">
        <p className="font-mono text-xs tracking-widest text-[var(--muted)] print:text-[9px]">
          COVER LETTER · 자기소개서
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl print:text-xl">
          {profile.name}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)] print:text-[11px]">
          {profile.title} · {profile.years}년차
        </p>
        <div className="mt-3 flex flex-wrap gap-x-4 text-xs text-[var(--muted)] print:text-[10px]">
          <span>{profile.email}</span>
          <span>{profile.github}</span>
        </div>
      </header>

      <section className="mb-8 print:mb-4">
        <p className="text-base leading-relaxed print:text-[11px] print:leading-snug">
          {intro}
        </p>
      </section>

      <div className="space-y-8 print:space-y-4">
        {sections.map((s) => (
          <section key={s.heading} className="break-inside-avoid">
            <h2 className="mb-2 text-lg font-semibold print:text-[13px]">
              {s.heading}
            </h2>
            <p className="text-[15px] leading-relaxed text-[var(--foreground)] print:text-[11px] print:leading-snug">
              {s.body}
            </p>
          </section>
        ))}
      </div>

      <footer className="mt-12 border-t border-[var(--border)] pt-6 text-xs text-[var(--muted)] print:mt-6 print:pt-3 print:text-[9px]">
        <p>
          웹 버전: <span className="font-mono">outlawleojung.github.io/about</span>
          <span className="mx-2">·</span>
          포트폴리오: <span className="font-mono">outlawleojung.github.io</span>
        </p>
      </footer>
    </main>
  );
}
