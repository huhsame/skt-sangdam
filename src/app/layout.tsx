import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "통신사 상담 매뉴얼 검색",
  description: "통신사 고객센터 상담 매뉴얼 시맨틱 검색 시스템",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="antialiased bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
