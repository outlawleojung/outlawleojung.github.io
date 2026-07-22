export type Project = {
  name: string;
  tagline: string;
  period: string;
  serviceLink?: { label: string; href?: string };
  github?: { label: string; href: string; note?: string };
  description?: string;
  heroImage?: string;
  gallery?: string[];
  youtube?: string;
  responsibilities: string[];
  planned?: string[];
  archImage?: { label: string; src: string };
  archImages?: Array<{ label: string; src: string }>;
  stack: string[];
};

export type Company = {
  name: string;
  logo?: string;
  projects: Project[];
};

export const profile = {
  name: "정민영",
  title: "시니어 백엔드 엔지니어 / 테크 리드",
  years: 13,
  summary:
    "레거시 시스템을 분석하고 백엔드 아키텍처, 클라우드 인프라, 배포 환경까지 재설계해 왔습니다. 실시간 채팅·상태 동기화 시스템, MSA 아키텍처 설계, 레거시 현대화를 축으로 NestJS · gRPC · Socket.IO · NATS · Redis · Kubernetes 환경에서 서비스를 만들어왔습니다.",
  email: "outlawleojung@gmail.com",
  github: "https://github.com/outlawleojung",
};

export const skills = {
  strong: ["TypeScript", "NestJS", "gRPC", "Socket.IO", "MySQL", "Redis", "NATS"],
  knowledgeable: [
    "C++",
    "C#",
    "Dart",
    "Next.js",
    "Flutter",
    "MongoDB",
    "PostgreSQL",
    "MSSQL",
    "Kubernetes",
    "Docker",
  ],
};

export const companies: Company[] = [
  {
    name: "(주)힐링샘",
    logo: "/logos/healingsam.png",
    projects: [
      {
        name: "레거시 3종 → NestJS + Next.js + gRPC MSA 전환",
        tagline:
          "쇼핑몰(천사몰) · 커뮤니티(천사방) · 보건일지 3개 레거시 서비스를 NestJS + Next.js + gRPC MSA 단일 구조로 전환 (레거시 전환 목적 계약, 진행 중)",
        period: "2026.05 ~ 재직 중 · 개발팀 / 차장",
        heroImage: "/images/healingsam/01_main.png",
        responsibilities: [
          "자사 서비스 3종(쇼핑몰 · 커뮤니티 · 보건일지) 풀스택 개발·운영 총괄",
          "PHP(그누보드/영카트) 기반 쇼핑몰(천사몰) · 커뮤니티(천사방) 서비스 유지보수 및 신규 기능 개발",
          "Java Spring Boot + React + MySQL 기반 보건일지 서비스 DB 재설계 진행 중 — 스키마 정규화, 테이블 구조 재설계, 인덱스/쿼리 개선",
          "단일 물리 서버 환경 → 클라우드 마이그레이션 및 서비스 분리 계획 수립",
          "상기 3개 서비스의 NestJS + Next.js + gRPC MSA 기반 전환 아키텍처 설계",
        ],
        planned: [
          "STEP 0 → 1 → 2 로드맵: Legacy 단일 서버 → 인프라 분리(Azure VM/DB/Blob) → MSA 리뉴얼(AKS + Managed) 단계적 무중단 전환",
          "통합 인증 서버 신설로 3개 서비스 로그인·세션 통합",
          "쇼핑몰(상품·주문·결제·배송) · 커뮤니티(게시글·댓글·알림) · 보건일지 도메인 세분화, 서비스별 Gateway + 내부 gRPC MSA 구조",
          "DB per Service — 각 마이크로서비스마다 독립 Azure DB for MySQL 인스턴스, 서비스별 Blob Storage 분리",
          "MSA 데이터 정합성 확보 방안 검토: Outbox Pattern · Saga · Idempotency Key · Reconciliation Batch · Contract Test",
          "장애 안전망 검토: Soft Delete + Tombstone · Dead Letter Queue · Reconciliation Job · Redis Idempotency Store",
        ],
        archImages: [
          {
            label: "MSA 아키텍처 설계안 · 완전 독립 2개 서비스 + 통합 인증",
            src: "/images/healingsam/02_architecture.png",
          },
          {
            label: "데이터 정합성 전략 (설계 · 검토) · Outbox · Saga · Idempotency · Reconciliation",
            src: "/images/healingsam/03_data_strategy.png",
          },
        ],
        stack: [
          "NestJS",
          "Next.js",
          "gRPC",
          "TypeORM",
          "Monorepo",
          "Azure AKS",
          "Azure DB for MySQL",
          "Azure Blob Storage",
          "NATS",
          "Redis",
          "GitHub Actions",
          "Java Spring Boot (legacy)",
          "PHP (legacy)",
        ],
      },
    ],
  },
  {
    name: "(주)애니챗",
    logo: "/logos/anychat.png",
    projects: [
      {
        name: "애니챗 · 실시간 AI 번역 채팅",
        tagline: "실시간 AI 번역 채팅 어플리케이션",
        period: "2024.06 ~ 2025.07",
        serviceLink: { label: "안드로이드" },
        github: {
          label: "NestJS-gRPC-Chat",
          href: "https://github.com/outlawleojung/NestJS-gRPC-Chat",
          note: "아키텍처 참고용 보일러플레이트",
        },
        heroImage: "/images/anichat/arch.png",
        gallery: ["/images/anichat/hero.png"],
        responsibilities: [
          "기존 개발자 전원 퇴사 후 외주 개발된 3개 프로젝트 인수 — 기능 안정화, DB 구조 개선 및 아키텍처 재설계가 필요한 상태",
          "NFC/QR 채팅의 Express 백엔드를 NestJS로 전환, 애니챗 앱은 MSA 패턴을 적용하여 백엔드 전면 재설계",
          "기존 DB를 사용하지 않고 전체 스키마를 새로 설계 — 서비스 도메인별 스키마 분리 적용",
          "TypeORM QueryRunner를 요청 단위로 주입하는 커스텀 데코레이터를 구현하여, 복수의 데이터 변경이 발생하는 API를 단일 트랜잭션으로 처리하는 공통 구조 적용",
          "NestJS 백엔드 서버를 monorepo 구조로 리팩토링 — 서비스 간 코드 공유 및 독립 배포 구조 확보, AKS에 각 서비스 독립 배포",
          "React Native → Flutter 클라이언트 전환, 단독 개발하여 스토어 런칭 완료",
          "Socket.IO + Redis + NATS 기반 실시간 채팅 시스템 구현",
          "Azure CosmosDB(SQL API)에 채팅 메시지 저장, PostgreSQL로 사용자 데이터 처리",
          "GitHub Actions CI/CD 파이프라인 도입",
        ],
        stack: [
          "NestJS",
          "TypeORM",
          "gRPC",
          "Socket.IO",
          "NATS",
          "Redis",
          "PostgreSQL",
          "Azure CosmosDB",
          "Flutter",
          "Azure AKS",
          "Docker",
          "GitHub Actions",
        ],
      },
      {
        name: "AceBiz · B2B 실시간 번역 채팅 웹서비스 (유지보수)",
        tagline: "B2B 실시간 번역 채팅 웹서비스 마이그레이션 및 유지보수",
        period: "2024.06 ~",
        heroImage: "/images/acebiz/hero.png",
        responsibilities: [
          "Express 서버 → NestJS monorepo(관리자 페이지 포함) 전환",
          "전체 테이블 재설계 (정규화)",
          "Socket.IO + Redis + NATS 기반 채팅 웹소켓 서버 마이그레이션",
          "프론트엔드 React → Next.js 마이그레이션",
        ],
        stack: [
          "NestJS",
          "Next.js",
          "TypeORM",
          "MySQL",
          "MongoDB",
          "PostgreSQL",
          "Redis",
          "NATS",
          "Azure",
          "Kubernetes",
          "Azure DevOps",
        ],
      },
    ],
  },
  {
    name: "(주)한컴프론티스",
    logo: "/logos/hancom.png",
    projects: [
      {
        name: "아즈메타 · 메타버스 플랫폼",
        tagline:
          "생활 밀착형 버츄얼 커넥트 월드 서비스 — 온라인 화상 회의·강의·의료 상담·게임·앱 내 상품 판매를 아우르는 통합 메타버스 플랫폼",
        period: "2022.11 ~ 2023.12 (1년 1개월 / 30명) · 서비스 종료",
        heroImage: "/images/metaverse/hero.png",
        youtube: "_HToOiWvjTk",
        responsibilities: [
          "백엔드 서버가 없는 상태에서 Express로 인증·콘텐츠 서버를 구축하고, 서비스 확장에 따라 NestJS + MSA 구조로 전환",
          "NATS 기반 웹소켓 분산 처리 구조 구현 — 3종 플랫폼에 공통 적용",
          "MariaDB + MongoDB 하이브리드 DB 설계 — 정형 데이터와 비정형 데이터 분리 저장",
          "Google · Apple · Naver 소셜 로그인 통합",
          "Azure Kubernetes Service(AKS) 기반 컨테이너 인프라 구축",
          "GitHub Actions 기반 CI/CD 자동화 구축",
          "서버팀 팀장(최대 5명)으로 기획·클라이언트 파트 기술 협의 주도 및 플랫폼 런칭까지 리딩",
        ],
        archImage: {
          label: "분산 Socket 아키텍처",
          src: "/images/metaverse/socket_arch.png",
        },
        stack: [
          "NestJS",
          "TypeORM",
          "Socket.IO",
          "NATS",
          "Redis",
          "MariaDB",
          "MongoDB",
          "PostgreSQL",
          "Azure AKS",
          "Kubernetes",
          "Docker",
          "GitHub Actions",
          "Azure DevOps",
          "Swagger UI",
        ],
      },
      {
        name: "코드게이트 · 해킹방어대회 메타버스",
        tagline:
          "코드게이트 해킹방어대회를 메타버스 앱과 오프라인에서 동시에 진행하기 위한 서비스",
        period: "2022.03 ~ 2022.10 (7개월 / 30명) · 서비스 종료",
        heroImage: "/images/codegate/hero.png",
        responsibilities: [
          "MSA 백엔드 서버 아키텍처 설계",
          "데이터베이스 모델링",
          "전체 RESTful API 설계",
          "관리자페이지 API 설계",
          "Azure CI/CD 구축, Azure Web App을 통한 배포",
        ],
        stack: ["NestJS", "Express", "TypeORM", "Azure", "Swagger UI"],
      },
    ],
  },
  {
    name: "더에이아이랩(주)",
    logo: "/logos/ailab.png",
    projects: [
      {
        name: "코딩엑스 · 코딩교육 플랫폼 백오피스",
        tagline: "코딩교육 플랫폼 백오피스 프론트/백엔드 단독 개발 (프리랜서)",
        period: "2025.11 ~ 2026.01",
        github: {
          label: "NestCore · ReactCore",
          href: "https://github.com/outlawleojung/NestCore",
        },
        responsibilities: [
          "NestJS 기반 백오피스 백엔드 API 설계 및 개발 — JWT 인증, 관리자별 권한 분리",
          "React 기반 백오피스 프론트엔드 개발",
          "회원 관리, 수강/결제 관리, 강의 관리(영상·자료 업로드) 등 백오피스 전체 기능 단독 구현",
          "2개월 계약 프로젝트를 3주 만에 개발·테스트·납품 완료",
        ],
        stack: ["NestJS", "React"],
      },
    ],
  },
  {
    name: "(주)문블락",
    logo: "/logos/moonblock.png",
    projects: [
      {
        name: "진연희몽상",
        tagline:
          "일본 미연시 IP 연희몽상을 활용한 DMM 성인 RPG 게임. 국내 연희삼국 for Kakao를 기반으로 일본어·성인 컨텐츠 추가",
        period: "2014.10 ~ 2016.11 (2년 / 30명)",
        heroImage: "/images/moonblock/jinyeonhee_ssr.png",
        gallery: ["/images/moonblock/jinyeonhee_gacha.png"],
        responsibilities: [
          "cocos2d-x 클라이언트 개발 (전투를 제외한 전반적인 기능)",
          "MSSQL 데이터베이스 모델링",
          "MSSQL 스토어드 프로시저 기반 서버 기능 로직 개발",
          "C++ ACE 라이브러리 TCP/IP 서버 개발",
        ],
        stack: [
          "cocos2d-x",
          "C++",
          "C#",
          "ACE lib",
          "TCP/IP",
          "MSSQL",
          "Stored Procedure",
        ],
      },
      {
        name: "연희삼국 for Kakao",
        tagline: "일본 미연시 IP 연희몽상을 활용한 RPG 게임. Kakao 게임 런칭",
        period: "2014.01 ~ 2015.10 (1년 9개월 / 개발 5 · 기획 3 · 그래픽 4)",
        heroImage: "/images/moonblock/yeonheesamguk_grandopen.png",
        youtube: "szv3M_E_YQ4",
        responsibilities: [
          "cocos2d-x 클라이언트 개발 (전투를 제외한 전반적인 기능)",
          "MSSQL 데이터베이스 모델링",
          "MSSQL 스토어드 프로시저 기반 서버 기능 로직 개발",
          "C++ ACE 라이브러리 TCP/IP 서버 개발",
        ],
        stack: [
          "cocos2d-x",
          "C++",
          "C#",
          "ACE lib",
          "TCP/IP",
          "MSSQL",
          "Stored Procedure",
        ],
      },
      {
        name: "연희몽상",
        tagline: "일본 미연시 IP 연희몽상을 활용한 TCG 게임. Kakao 게임 런칭",
        period: "2013.02 ~ 2014.01 (1년 / 개발 3 · 기획 2 · 그래픽 2)",
        heroImage: "/images/moonblock/yeonheemongsang.png",
        youtube: "fFv6FAir0XE",
        responsibilities: [
          "컨텐츠 기반 기능 개발 (전체 아키텍처 구조 준수)",
          "cocos2d-x 클라이언트 개발",
          "데이터베이스 모델링",
          "C++ ACE 라이브러리 TCP/IP 서버 패킷 설계 및 개발",
        ],
        stack: ["cocos2d-x", "C++", "C#", "ACE lib", "TCP/IP", "MSSQL"],
      },
    ],
  },
];
