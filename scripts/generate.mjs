// @ts-check

import { strict } from "node:assert";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { generateSchema, generateOutput } from "@gql.tada/cli-utils";
import { config } from "dotenv";

const ROOT_DIR = join(fileURLToPath(import.meta.url), "..", "..");
const ENV_PATH = join(ROOT_DIR, ".env.local");

config({ path: ENV_PATH });

const BIGCOMMERCE_STORE_HASH = process.env.BIGCOMMERCE_STORE_HASH;
const BIGCOMMERCE_CHANNEL_ID = process.env.BIGCOMMERCE_CHANNEL_ID;
const BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN =
  process.env.BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN;

strict(BIGCOMMERCE_STORE_HASH, "BIGCOMMERCE_STORE_HASH is required");
strict(
  BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN,
  "BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN is required",
);

const endpoint = `https://store-${BIGCOMMERCE_STORE_HASH}-${BIGCOMMERCE_CHANNEL_ID}.mybigcommerce.com/graphql`;

await generateSchema({
  input: endpoint,
  headers: {
    Authorization: `Bearer ${BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN}`,
  },
  output: join(ROOT_DIR, "src/lib/bigcommerce/bigcommerce.graphql"),
  tsconfig: undefined,
});

await generateOutput({
  output: undefined,
  tsconfig: undefined,
});
