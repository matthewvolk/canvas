import { strict } from "node:assert";

import { createClient } from "@bigcommerce/catalyst-client";

const BIGCOMMERCE_STORE_HASH = process.env.BIGCOMMERCE_STORE_HASH;
const BIGCOMMERCE_CHANNEL_ID = process.env.BIGCOMMERCE_CHANNEL_ID;
const BIGCOMMERCE_STOREFRONT_TOKEN = process.env.BIGCOMMERCE_STOREFRONT_TOKEN;

strict(BIGCOMMERCE_STORE_HASH, "BIGCOMMERCE_STORE_HASH is required");
strict(
  BIGCOMMERCE_STOREFRONT_TOKEN,
  "BIGCOMMERCE_STOREFRONT_TOKEN is required",
);

export const client = createClient({
  xAuthToken: process.env.BIGCOMMERCE_ACCESS_TOKEN ?? "",
  storeHash: BIGCOMMERCE_STORE_HASH,
  channelId: BIGCOMMERCE_CHANNEL_ID,
  storefrontToken: BIGCOMMERCE_STOREFRONT_TOKEN,
  logger: true,
  getChannelId: async (defaultChannelId: string) => defaultChannelId,
});

export const ONE_MINUTE = 60;
export const TWO_MINUTES = 120;
export const THREE_MINUTES = 180;
