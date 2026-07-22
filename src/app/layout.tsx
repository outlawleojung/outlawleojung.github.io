import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "정민영 · 시니어 백엔드 엔지니어 / 테크 리드",
  description:
    "13년차 백엔드 엔지니어 · 팀 리드. 레거시 현대화 · MSA 설계 · NestJS · gRPC · Socket.IO · NATS · Redis · Kubernetes.",
  openGraph: {
    title: "정민영 · 시니어 백엔드 엔지니어 / 테크 리드",
    description:
      "레거시 현대화, 백엔드 아키텍처 재설계, 클라우드 인프라, 실시간 채팅·MSA 아키텍처.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
