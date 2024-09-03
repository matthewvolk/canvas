import { DraftModeScript } from "@makeswift/runtime/next/server";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { MakeswiftProvider } from "@/lib/makeswift/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Canvas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <DraftModeScript />
      </head>
      <body className={inter.className}>
        <MakeswiftProvider>{children}</MakeswiftProvider>
      </body>
    </html>
  );
}
