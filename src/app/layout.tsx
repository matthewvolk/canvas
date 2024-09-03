import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";

import "./globals.css";

import { Navigation } from "@/components/navigation";
import { client, THREE_MINUTES } from "@/lib/bigcommerce/client";
import { graphql } from "@/lib/bigcommerce/graphql";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Canvas",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const RootLayoutQuery = graphql(`
    query RootLayoutQuery {
      site {
        settings {
          storeName
        }
      }
    }
  `);

  const { data } = await client.fetch({
    document: RootLayoutQuery,
    fetchOptions: { next: { tags: ["settings"], revalidate: THREE_MINUTES } },
  });

  if (!data.site.settings) {
    return notFound();
  }

  return (
    <html lang="en">
      <body
        className={`${inter.className} container mx-auto flex min-h-screen flex-col gap-16 px-4 py-10`}
      >
        <header className="flex items-center justify-between gap-8">
          <Link
            className="flex-shrink-0 rounded-lg border-2 border-dotted border-[#1e90ff] bg-[#e6f2ff] p-4 md:px-4 md:py-2"
            href="/"
          >
            {data.site.settings.storeName}
          </Link>
          <Navigation />
        </header>

        <main className="flex-1 space-y-16">{children}</main>

        <footer>
          <p className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()}</span>
            <span className="rounded-lg border-2 border-dotted border-[#1e90ff] bg-[#e6f2ff] px-4 py-2">
              {data.site.settings.storeName}
            </span>
          </p>
        </footer>
      </body>
    </html>
  );
}
