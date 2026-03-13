import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Teheran AI Studio | 테헤란로 AI 스튜디오",
  description: "Not to be busy, but to do the right things. 바쁘게 일하지 않고, 본질적인 일에 집중하도록.",
  keywords: ["AI", "스튜디오", "테헤란로", "인공지능", "자동화", "혁신"],
  authors: [{ name: "Teheran AI Studio" }],
  openGraph: {
    title: "Teheran AI Studio",
    description: "Not to be busy, but to do the right things. 기술과 법의 교차점에서 일상과 비즈니스의 효율을 찾아봅니다.",
    type: "website",
    locale: "ko_KR",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
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
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
