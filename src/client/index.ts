import { strict } from "assert";

import { createClient } from "@bigcommerce/catalyst-client";

const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
const channelId = process.env.BIGCOMMERCE_CHANNEL_ID;
const cit = process.env.BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN;

strict(storeHash, "BIGCOMMERCE_STORE_HASH is required");
strict(channelId, "BIGCOMMERCE_CHANNEL_ID is required");
strict(cit, "BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN is required");

export const client = createClient({
  xAuthToken: "",
  customerImpersonationToken: cit,
  storeHash,
  channelId,
  logger:
    (process.env.NODE_ENV !== "production" &&
      process.env.CLIENT_LOGGER !== "false") ||
    process.env.CLIENT_LOGGER === "true",
});
