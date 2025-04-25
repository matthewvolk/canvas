import { removeEdgesAndNodes } from "@bigcommerce/catalyst-client";

import { client } from "@/lib/bigcommerce/client";
import { graphql } from "@/lib/bigcommerce/graphql";

const PricingFragment = graphql(`
  fragment PricingFragment on Product {
    prices(currencyCode: $currencyCode) {
      price {
        value
        currencyCode
      }
      basePrice {
        value
        currencyCode
      }
      retailPrice {
        value
        currencyCode
      }
      salePrice {
        value
        currencyCode
      }
      priceRange {
        min {
          value
          currencyCode
        }
        max {
          value
          currencyCode
        }
      }
    }
  }
`);

const ProductCardFragment = graphql(
  `
    fragment ProductCardFragment on Product {
      entityId
      name
      defaultImage {
        altText
        url: urlTemplate(lossy: true)
      }
      path
      brand {
        name
        path
      }
      reviewSummary {
        numberOfReviews
      }
      ...PricingFragment
    }
  `,
  [PricingFragment],
);

const FeaturedProductsListFragment = graphql(
  `
    fragment FeaturedProductsListFragment on Product {
      ...ProductCardFragment
    }
  `,
  [ProductCardFragment],
);

const HomePageQuery = graphql(
  `
    query HomePageQuery($currencyCode: currencyCode) {
      site {
        featuredProducts(first: 12) {
          edges {
            node {
              ...FeaturedProductsListFragment
            }
          }
        }
      }
    }
  `,
  [FeaturedProductsListFragment],
);

export default async function Home() {
  const { data } = await client.fetch({
    document: HomePageQuery,
    variables: { currencyCode: "USD" },
    fetchOptions: { next: { revalidate: 60 } },
  });

  const featuredProducts = removeEdgesAndNodes(data.site.featuredProducts);

  return (
    <main>
      <h1>Home</h1>
      <pre>{JSON.stringify(featuredProducts, null, 2)}</pre>
    </main>
  );
}
