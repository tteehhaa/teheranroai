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
  title: "Teheranro AI Studio | 테헤란로 AI 스튜디오",
  description: "Not to be busy, but to do the right things. 불필요한 분주함 너머, 비즈니스의 본질에 집중합니다.",
  keywords: ["AI", "스튜디오", "테헤란로", "인공지능", "자동화", "혁신"],
  authors: [{ name: "Teheranro AI Studio" }],
  openGraph: {
    title: "Teheranro AI Studio",
    description: "Not to be busy, but to do the right things. 기술적 논리와 법률적 치밀함으로 설계한 AI 솔루션.",
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
