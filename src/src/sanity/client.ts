import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "txpkguha",
  dataset: "production",
  apiVersion: "2024-11-01",
  useCdn: false
});
