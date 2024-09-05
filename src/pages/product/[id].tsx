import { GetStaticPaths, GetStaticProps } from "next";

import { client } from "@/lib/bigcommerce/client";
import { graphql, ResultOf } from "@/lib/bigcommerce/graphql";

export const getStaticPaths: GetStaticPaths = async () => {
  /**
   * Determine a handful of products that you want to pre-render. In this
   * example, we're pre-rendering a list of featured products.
   */
  const FeaturedProductsQuery = graphql(`
    query FeaturedProductsQuery {
      site {
        featuredProducts {
          edges {
            node {
              entityId
            }
          }
        }
      }
    }
  `);

  const { data } = await client.fetch({
    document: FeaturedProductsQuery,
  });

  if (!data.site.featuredProducts.edges) {
    return {
      /**
       * If the store has no featured products, we won't pre-render
       * any product pages during build time. However, with `fallback`
       * set to `"blocking"`, we can still pre-render pages on-demand.
       */
      paths: [],
      /**
       * @see https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking
       */
      fallback: "blocking",
    };
  }

  const paths = data.site.featuredProducts.edges.map(({ node }) => ({
    params: {
      id: node.entityId.toString(),
    },
  }));

  return {
    /**
     * If the store has featured products, we'll pre-render each product
     * page. The `fallback` key is set to `"blocking"` to pre-render pages
     * on-demand. This also means that if new products are added to the
     * store, they will be pre-rendered on-demand without needing to re-
     * build the entire site.
     */
    paths,
    /**
     * @see https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking
     */
    fallback: "blocking",
  };
};

const ProductPageQuery = graphql(`
  query ProductPageQuery($entityId: Int) {
    site {
      product(entityId: $entityId) {
        entityId
        name
      }
    }
  }
`);

interface Props {
  product: ResultOf<typeof ProductPageQuery>["site"]["product"];
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  if (!params?.id || Array.isArray(params.id)) {
    return {
      notFound: true,
    };
  }

  const { data } = await client.fetch({
    document: ProductPageQuery,
    variables: {
      entityId: parseInt(params.id),
    },
  });

  return {
    props: {
      product: data.site.product,
    },
    /**
     * Next.js will invalidate the cache when a request comes in,
     * at most every 24 hours. This means that if a product is updated
     * (e.g., the price changes) the old price will be shown for up to
     * 24 hours. This is a good balance between performance and freshness.
     *
     * If you require on-demand revalidation, e.g., to show the most accurate
     * price at all times, you can explore on-demand revalidation:
     * @see https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration#on-demand-validation-with-resrevalidate
     *
     * @see https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration
     */
    revalidate: 60 * 60 * 24, // 24 hours
  };
};

export default function Page({ product }: Props) {
  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <main>
      <h1>{product.name}</h1>
    </main>
  );
}
