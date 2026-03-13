import type { Metadata, Viewport } from "next";
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
  title: "테헤란로 AI 스튜디오 | Teheran-ro AI Studio",
  description: "엔지니어의 논리와 변호사의 치밀함으로, 일상과 비즈니스의 비효율을 혁신합니다.",
  keywords: ["AI", "스튜디오", "테헤란로", "인공지능", "자동화", "혁신"],
  authors: [{ name: "Teheran-ro AI Studio" }],
  openGraph: {
    title: "테헤란로 AI 스튜디오",
    description: "엔지니어의 논리와 변호사의 치밀함으로, 일상과 비즈니스의 비효율을 혁신합니다.",
    type: "website",
    locale: "ko_KR",
  },
};

export const viewport: Viewport = {
  themeColor: "#0066FF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
