
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "화투점 | 오늘의 운세",
  description:
    "48장의 화투 카드로 알아보는 오늘의 운세. 카드를 섞고 다섯 장을 뽑아 나만의 운세를 확인해 보세요.",
  keywords: [
    "화투점",
    "화투",
    "오늘의 운세",
    "운세 보기",
    "화투 운세",
  ],
  applicationName: "화투점",
  openGraph: {
    title: "화투점 | 오늘의 운세",
    description:
      "마음을 가라앉히고 운명의 다섯 장을 만나보세요.",
    type: "website",
    locale: "ko_KR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#100d16",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
