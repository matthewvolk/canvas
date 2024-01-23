import Image from "next/image";
import Link from "next/link";

import { graphql } from "@/graphql";
import { query } from "@/graphql";

export default async function Home() {
  const ProductsQuery = graphql(`
    query Products {
      site {
        products {
          edges {
            node {
              entityId
              name
              defaultImage {
                url(width: 500)
                altText
              }
              prices {
                price {
                  value
                }
              }
            }
          }
        }
      }
    }
  `);

  const res = await query(ProductsQuery, {});

  return (
    <section className="flex flex-col gap-8">
      <h1 className="text-3xl font-semibold">Homepage</h1>

      <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {res.data?.site.products.edges?.map((product: any) => (
          <li key={product.node.entityId}>
            <Link
              className="group flex flex-col"
              href={`/products/${product.node.entityId}`}
            >
              <Image
                alt={product.node.defaultImage.altText}
                height={300}
                src={product.node.defaultImage.url}
                width={300}
              />

              <h2 className="mt-4 font-bold group-hover:underline">
                {product.node.name}
              </h2>

              <p className="group-hover:underline">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(product.node.prices.price.value)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
