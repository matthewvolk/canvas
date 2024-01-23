import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { query, graphql } from "@/graphql";

export default async function Product({ params }: { params: { id: string } }) {
  const CategoryProductsQuery = graphql(`
    query CategoryProducts($categoryId: Int!) {
      site {
        category(entityId: $categoryId) {
          name
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
    }
  `);

  const { data } = await query(CategoryProductsQuery, {
    categoryId: parseInt(params.id, 10),
  });

  if (!data) {
    throw new Error(`No data in GQL response for Product ID ${params.id}`);
  }

  if (!data.site.category) {
    notFound();
  }

  const { category } = data.site;

  if (!category.products) {
    return (
      <section className="flex flex-col gap-8">
        <h1 className="text-3xl font-semibold">{category.name}</h1>
        <p>No products found</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-8">
      <h1 className="text-3xl font-semibold">{category.name}</h1>

      <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {category.products.edges?.map((product: any) => (
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
