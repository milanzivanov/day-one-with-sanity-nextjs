import { defineLive } from "next-sanity";
import { client } from "@/src/sanity/client";

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({ apiVersion: "vX" })
});
