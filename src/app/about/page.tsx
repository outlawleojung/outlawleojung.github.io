import type { Metadata } from "next";
import { profile } from "@/lib/portfolio";
import { AboutToolbar } from "./AboutToolbar";

export const metadata: Metadata = {
  title: `자기소개서 · ${profile.name}`,
  description: `${profile.name} — ${profile.title} 자기소개서`,
};

const sections: Array<{ heading: string; body: string }> = [
  {
    heading: "1. 백엔드 설계 및 레거시 전환",
    body:
      "한컴프론티스에서 NestJS를 처음 도입한 메타버스 플랫폼 3개의 백엔드를 단독으로 설계하고 개발했습니다. " +
      "NATS 기반 웹소켓 분산 처리, MariaDB와 MongoDB를 결합하는 DB 설계도 이때 정립했습니다. " +
      "이후 애니챗에서는 전체 서비스를 NestJS + PostgreSQL + Flutter 스택으로 단독 재설계하여 마이그레이션했고, " +
      "현재 힐링샘에서는 PHP · Java Spring Boot로 된 레거시 3개 서비스를 NestJS + Next.js + gRPC MSA 구조로 " +
      "전환하는 작업을 단독으로 진행하고 있습니다. 한컴프론티스 포함 4개 회사에서 총괄로서 NestJS 기반 " +
      "아키텍처를 설계하고 리드해 왔습니다.",
  },
  {
    heading: "2. 클라우드 및 DevOps",
    body:
      "MS 파트너사(티맥스)에서 Azure 기반 컨설팅 실무와 DevOps 컨설턴트로 활동하면서 AZ-400, AZ-204 자격증을 " +
      "취득했습니다. 이 경험을 바탕으로 이후 한컴프론티스·애니챗에서 AKS 기반 컨테이너 환경 운영과 " +
      "GitHub Actions CI/CD 파이프라인을 직접 구축해 왔습니다.",
  },
  {
    heading: "3. 프로젝트 리드",
    body:
      "한컴프론티스에서는 백엔드 리드로서 기획·클라이언트 파트와의 협업을 주도했고, 애니챗에서는 백엔드 팀장으로 " +
      "릴리즈를 리드하면서 팀 내 코드 리뷰 문화를 정착시켰습니다. 현재 힐링샘에서는 단독 개발자로 모든 프로젝트의 " +
      "설계·구현·배포와 팀 방향 수립을 담당하고 있습니다.",
  },
  {
    heading: "4. 참고 사항",
    body:
      "일본 게임사 경영악화로 인한 이직문의 사례가 있었으나, 이 부분은 면접에서 말씀드리겠습니다.",
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
          <strong>
            NestJS 백엔드 개발과 Azure 클라우드 인프라 구축을 주력으로 해온{" "}
            {profile.years}년차 백엔드 엔지니어이자 팀 리드입니다.
          </strong>{" "}
          실시간 채팅·상태 동기화 시스템, MSA 아키텍처 설계, 레거시 리뉴얼을 축으로
          NestJS · gRPC · Socket.IO · NATS · Redis · Kubernetes 환경에서
          서비스를 만들어왔습니다.
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
