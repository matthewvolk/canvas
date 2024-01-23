import { registerUrql } from "@urql/next/rsc";
import { initGraphQLTada } from "gql.tada";
import { cacheExchange, createClient, fetchExchange } from "urql";

import type { introspection } from "./graphql-env.d.ts";

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    BigDecimal: number;
  };
}>();

const makeClient = () => {
  return createClient({
    url: `https://store-${process.env.BIGCOMMERCE_STORE_HASH}.mybigcommerce.com/graphql`,
    fetchOptions: {
      headers: {
        authorization: `Bearer ${process.env.BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN}`,
        "content-type": "application/json",
      },
    },
    exchanges: [cacheExchange, fetchExchange],
  });
};

export const { query } = registerUrql(makeClient).getClient();

export type { FragmentOf, ResultOf, VariablesOf } from "gql.tada";
export { readFragment } from "gql.tada";
