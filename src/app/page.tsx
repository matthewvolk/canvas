import Image from "next/image";
import Link from "next/link";

import Clock from "@/components/clock";
import { client, ONE_MINUTE } from "@/lib/bigcommerce/client";
import { graphql } from "@/lib/bigcommerce/graphql";

export default async function HomePage() {
  const HomepageQuery = graphql(`
    query HomepageQuery {
      site {
        featuredProducts {
          edges {
            node {
              entityId
              name
              defaultImage {
                url(width: 400)
                altText
              }
            }
          }
        }
      }
    }
  `);

  const { data } = await client.fetch({
    document: HomepageQuery,
    fetchOptions: {
      next: { tags: ["featuredProducts"], revalidate: ONE_MINUTE },
    },
  });

  if (!data.site.featuredProducts.edges) {
    return <p>No featured products found.</p>;
  }

  return (
    <>
      <section className="w-full">
        <div className="grid gap-6 lg:grid-cols-[1fr] lg:gap-12 xl:grid-cols-[1fr]">
          <div className="flex flex-col justify-center space-y-8">
            <div className="flex flex-col justify-between space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
              <div className="shrink-0 space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Canvas
                </h1>
                <p className="max-w-[600px] text-neutral-800 md:text-xl">
                  Learn about caching best practices when working with
                  BigCommerce and Next.js 14+
                </p>
              </div>
              <Clock />
            </div>
            <div>
              <h2 className="mb-4 text-xl font-semibold md:text-2xl">
                Legend for Revalidate Times
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dotted border-[#1e90ff] bg-[#e6f2ff] px-2 py-4 md:p-4">
                  <span className="font-bold text-[#1e90ff] md:text-xl">
                    3 minutes
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dotted border-[#f1c40f] bg-[#fffaeb] px-2 py-4 md:p-4">
                  <span className="font-bold text-[#f1c40f] md:text-xl">
                    2 minutes
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dotted border-[#e74c3c] bg-[#ffeaea] px-2 py-4 md:p-4">
                  <span className="font-bold text-[#e74c3c] md:text-xl">
                    1 minute
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-2xl">
          Featured Products
        </h2>
        <ul className="grid grid-cols-1 gap-4 rounded-lg border-2 border-dotted border-[#e74c3c] bg-[#ffeaea] p-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.site.featuredProducts.edges.map(({ node }) => (
            <li key={node.entityId}>
              <Link
                className="group flex flex-col gap-2"
                href={`/product/${node.entityId}`}
              >
                {node.defaultImage ? (
                  <Image
                    alt={node.defaultImage.altText}
                    height={400}
                    src={node.defaultImage.url}
                    width={400}
                  />
                ) : null}
                <h3 className="group-hover:underline">{node.name}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
