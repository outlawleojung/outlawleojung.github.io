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
    "NestJS 기반 백엔드 설계와 Azure 클라우드 인프라 구축을 주력으로 해왔습니다. 실시간 채팅·상태 동기화 시스템, MSA 아키텍처 설계, 레거시 리뉴얼을 축으로 NestJS · gRPC · Socket.IO · NATS · Redis · Kubernetes 환경에서 서비스를 만들어왔습니다.",
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
        name: "PHP 레거시 → NestJS MSA 마이그레이션",
        tagline:
          "14년+ 그누보드·영카트 기반 쇼핑·커뮤니티 통합 서비스를 NestJS + Next.js + gRPC MSA로 무중단 단계 전환 (진행 중) — 통합 인증 서버 신설, 서비스별 Gateway, DB per Service 구조 설계",
        period: "2026.05 ~ 재직 중",
        heroImage: "/images/healingsam/01_main.png",
        responsibilities: [
          "자사 서비스 3개(쇼핑몰·커뮤니티·관리자) 풀스택 개발 총괄",
          "PHP(그누보드/영카트) 기반 쇼핑·커뮤니티 서비스 유지보수 및 신규 기능 개발",
          "Java Spring Boot + React 기반 관리자 페이지 유지보수 및 신규 기능 개발",
          "3개 서비스 전체를 NestJS + Next.js 기반 MSA로 마이그레이션 (단독 진행)",
          "TypeORM 기반 데이터 모델링 및 DB 재설계 (레거시 → 정규화 + 도메인 분리)",
          "NestJS Monorepo로 apps/libs 통합 관리 구조 도입",
        ],
        planned: [
          "STEP 0 → 1 → 2 로드맵 수립: Legacy 단일 서버 → 인프라 분리(Azure VM/DB/Blob) → MSA 리뉴얼(AKS + Managed) 단계적 무중단 전환",
          "통합 인증 서버 신설로 두 서비스 로그인·세션 통합 (설계)",
          "쇼핑몰(상품·주문·결제·배송) · 커뮤니티(게시글·댓글·알림) 도메인 세분화, 서비스별 Gateway + 내부 gRPC MSA 구조 설계",
          "DB per Service — 각 마이크로서비스마다 독립 Azure DB for MySQL 인스턴스, 서비스별 Blob Storage 분리 (설계)",
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
          "NestJS 백엔드 서버 리팩토링, monorepo 적용으로 프로젝트와 lib 분리",
          "데이터베이스 정규화 — 단일 테이블 구조를 정규화하여 데이터 무결성·확장성 개선",
          "microservice 적용 및 Gateway 패턴 도입",
          "서비스 간 gRPC 통신",
          "Redis로 소켓 데이터 및 채팅 데이터 캐싱",
          "NATS로 채팅 메시지 처리",
          "Azure CosmosDB(SQL API)에 채팅 메시지 저장",
          "PostgreSQL로 사용자 데이터 처리",
          "GitHub Actions로 Azure Kubernetes 배포",
          "React Native → Flutter 클라이언트 마이그레이션 및 앱 런칭",
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
          "MSA 백엔드 서버 아키텍처 설계",
          "데이터베이스 모델링 (MariaDB + MongoDB 하이브리드)",
          "전체 RESTful API 설계",
          "NATS 기반 웹소켓 분산 처리",
          "Google · Apple · Naver 소셜 로그인 통합",
          "관리자페이지 API 설계",
          "GitHub Actions CI/CD 구축",
          "Azure Kubernetes Service(AKS)를 통한 배포 및 확장",
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
          "React 기반 백오피스 프론트엔드 개발",
          "NestJS 기반 백오피스 백엔드 API 개발",
          "프론트/백엔드 전 영역 단독 개발",
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
