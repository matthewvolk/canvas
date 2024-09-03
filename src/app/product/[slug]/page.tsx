import { client } from "@/lib/bigcommerce/client";
import { graphql } from "@/lib/bigcommerce/graphql";

export const dynamicParams = true;

export async function generateStaticParams() {
  const FeaturedProductsQuery = graphql(`
    query FeaturedProductsQuery {
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
    document: FeaturedProductsQuery,
    fetchOptions: {
      next: { tags: ["featuredProducts"] },
    },
  });

  if (!data.site.featuredProducts.edges) {
    return [];
  }

  return data.site.featuredProducts.edges.map(({ node }) => ({
    slug: node.entityId.toString(),
  }));
}

export interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({
  params: { slug },
}: ProductPageProps) {
  const ProductPageQuery = graphql(`
    query ProductPageQuery($entityId: Int) {
      site {
        product(entityId: $entityId) {
          entityId
          name
          description
        }
      }
    }
  `);

  const { data } = await client.fetch({
    document: ProductPageQuery,
    variables: { entityId: parseInt(slug) },
    fetchOptions: {
      cache: "no-store",
      next: { tags: ["product"] },
    },
  });

  if (!data.site.product) {
    return <p>No product found.</p>;
  }

  return (
    <section>
      <h1>{data.site.product.name}</h1>
      <p>{data.site.product.description}</p>
    </section>
  );
}
