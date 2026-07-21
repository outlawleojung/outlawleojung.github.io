import type { Metadata } from "next";
import { profile } from "@/lib/portfolio";
import { AboutToolbar } from "./AboutToolbar";

export const metadata: Metadata = {
  title: `자기소개서 · ${profile.name}`,
  description: `${profile.name} — ${profile.title} 자기소개서`,
};

const intro =
  "NestJS 백엔드 설계와 Azure 클라우드 인프라 구축을 주력으로 해온 13년 차 개발자입니다. " +
  "게임 서버 개발로 커리어를 시작해 실시간 통신·상태 동기화·MSA 전환을 축으로 백엔드 엔지니어링과 " +
  "클라우드 인프라 운영을 함께 다뤄왔으며, 현재는 팀 리드·단독 아키텍트 역할에서 레거시 리뉴얼과 " +
  "신규 서비스 설계를 병행하고 있습니다.";

const sections: Array<{ heading: string; body: string }> = [
  {
    heading: "1. 백엔드 설계 및 레거시 전환",
    body:
      "초기 커리어의 C++ 게임 서버 개발 경험은 이후 실시간 처리 시스템 설계의 밑바탕이 되었습니다. " +
      "한컴프론티스에서는 NestJS를 처음 도입해 메타버스 플랫폼 3종의 백엔드를 설계·구축했고, " +
      "MariaDB와 MongoDB를 조합한 하이브리드 DB 모델과 NATS 기반 웹소켓 분산 처리 구조를 정립했습니다. " +
      "이후 애니챗에서는 앱 서비스를 NestJS + PostgreSQL + Flutter로 단독 리뉴얼하여 런칭했으며, " +
      "서비스 간 gRPC 통신과 Gateway 패턴을 도입했습니다. 현재 힐링샘에서는 PHP·Spring Boot로 " +
      "운영되던 14년+ 레거시 3개 서비스를 NestJS + Next.js + gRPC MSA로 무중단 전환하는 프로젝트를 " +
      "단독으로 진행 중이며, Outbox · Saga · Idempotency Key 등 데이터 정합성 패턴을 실전에 " +
      "적용하고 있습니다.",
  },
  {
    heading: "2. 클라우드 및 DevOps",
    body:
      "MS 파트너사(티디지)에서 Azure 인프라 설계와 DevOps 기술지원을 담당하며 AZ-400 · AZ-204 자격을 " +
      "취득했습니다. 이 경험은 이후 한컴프론티스와 애니챗에서 AKS 기반 컨테이너 환경 운영과 " +
      "GitHub Actions CI/CD 파이프라인 직접 구성으로 이어졌고, 지금 힐링샘의 MSA 전환에서도 " +
      "AKS + Azure Managed DB + Blob Storage 조합으로 앱 계층과 데이터 계층을 완전히 분리하는 " +
      "아키텍처의 근간이 되고 있습니다. 클라우드를 컨설팅 관점에서 배우고 실서비스에 반복 적용해 온 " +
      "것이 저의 강점입니다.",
  },
  {
    heading: "3. 프로젝트 리딩",
    body:
      "한컴프론티스에서는 서버팀 팀장으로 기획·클라이언트 파트와의 기술 협의를 주도했고, " +
      "애니챗에서는 백엔드 팀장으로 팀원을 리딩하며 앱 리뉴얼을 완수했습니다. 현재 힐링샘에서는 " +
      "단독 개발자로 기술 선정부터 설계·구현·배포·운영까지 전 과정을 직접 실행하고 있으며, " +
      "레거시 전환이라는 특성상 사업 리스크를 최소화하는 단계적 무중단 이행 전략을 수립하고 " +
      "수행하고 있습니다.",
  },
  {
    heading: "4. 지향점",
    body:
      "\"백엔드를 잘 아는 리드\"가 아니라 \"리드 역할까지 소화하는 백엔드\"로 커리어를 만들어 왔습니다. " +
      "다음 조직에서도 실무 아키텍처와 팀 리딩을 함께 다룰 수 있는 자리에서, 대규모·고가용 실시간 " +
      "시스템 또는 도메인 복잡도가 높은 레거시 전환에 기여하고 싶습니다.",
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
