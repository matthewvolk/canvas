import { strict } from "assert";

import { Makeswift } from "@makeswift/runtime/next";

import { runtime } from "./runtime";

strict(
  process.env.MAKESWIFT_SITE_API_KEY,
  "MAKESWIFT_SITE_API_KEY is required",
);

export const client = new Makeswift(process.env.MAKESWIFT_SITE_API_KEY, {
  runtime,
});
