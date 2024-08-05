// @ts-check

import { strict } from "assert";
import { join } from "path";

import { generateSchema, generateOutput } from "@gql.tada/cli-utils";

const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
const channelId = process.env.BIGCOMMERCE_CHANNEL_ID;
const cit = process.env.BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN;

strict(storeHash, "BIGCOMMERCE_STORE_HASH is required");
strict(channelId, "BIGCOMMERCE_CHANNEL_ID is required");
strict(cit, "BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN is required");

const gqlEndpoint = `https://store-${storeHash}-${channelId}.mybigcommerce.com/graphql`;

await generateSchema({
  input: gqlEndpoint,
  headers: { Authorization: `Bearer ${cit}` },
  output: join(import.meta.dirname, "../bigcommerce.graphql"),
  tsconfig: undefined,
});

await generateOutput({
  disablePreprocessing: false,
  output: undefined,
  tsconfig: undefined,
});
