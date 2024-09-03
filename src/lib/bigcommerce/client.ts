import { strict } from "node:assert";

import { createClient } from "@bigcommerce/catalyst-client";

const BIGCOMMERCE_STORE_HASH = process.env.BIGCOMMERCE_STORE_HASH;
const BIGCOMMERCE_CHANNEL_ID = process.env.BIGCOMMERCE_CHANNEL_ID;
const BIGCOMMERCE_ACCESS_TOKEN = process.env.BIGCOMMERCE_ACCESS_TOKEN;
const BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN =
  process.env.BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN;

strict(BIGCOMMERCE_STORE_HASH, "BIGCOMMERCE_STORE_HASH is required");
strict(BIGCOMMERCE_ACCESS_TOKEN, "BIGCOMMERCE_ACCESS_TOKEN is required");
strict(
  BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN,
  "BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN is required",
);

export const client = createClient({
  xAuthToken: BIGCOMMERCE_ACCESS_TOKEN,
  storeHash: BIGCOMMERCE_STORE_HASH,
  channelId: BIGCOMMERCE_CHANNEL_ID,
  customerImpersonationToken: BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN,
  logger: true,
  getChannelId: async (defaultChannelId: string) => defaultChannelId,
});
