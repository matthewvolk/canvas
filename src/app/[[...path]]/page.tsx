import { Page as MakeswiftPage } from "@makeswift/runtime/next";
import { getSiteVersion } from "@makeswift/runtime/next/server";
import { notFound } from "next/navigation";

import { client } from "@/lib/makeswift/client";
import "@/lib/makeswift/components";

type ParsedUrlQuery = { path?: string[] };

export async function generateStaticParams() {
  const pages = await client.getPages().toArray();

  return pages.map((page) => ({
    path: page.path.split("/").filter((segment) => segment !== ""),
  }));
}

export default async function Page({ params }: { params: ParsedUrlQuery }) {
  const path = "/" + (params?.path ?? []).join("/");
  const snapshot = await client.getPageSnapshot(path, {
    siteVersion: getSiteVersion(),
  });

  if (snapshot == null) return notFound();

  return <MakeswiftPage snapshot={snapshot} />;
}
