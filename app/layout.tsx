import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OSI Protocol Guide",
  description: "個人用 OSI 参照モデル・プロトコル図鑑",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
